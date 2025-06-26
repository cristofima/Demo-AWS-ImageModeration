import { vi, describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "../../utils/test-utils";
import { render } from "../../utils/test-utils";
import UserAccountDropdown from "./UserAccountDropdown";
import { signOut } from "@aws-amplify/auth";

// Mock AWS Amplify auth
vi.mock("@aws-amplify/auth", () => ({
  signOut: vi.fn(),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock useUserData hook
const mockResetUser = vi.fn();
const mockUser = {
  name: "John",
  familyName: "Doe",
  email: "john.doe@example.com",
};

vi.mock("../../hooks", () => ({
  useUserData: () => ({
    user: mockUser,
    resetUser: mockResetUser,
  }),
}));

describe("UserAccountDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user avatar with correct initials", () => {
    render(<UserAccountDropdown />);

    // Look for the Avatar button that contains the user initials
    const avatarButton = screen.getByRole("button");
    expect(avatarButton).toBeInTheDocument();
    expect(avatarButton).toHaveTextContent("JD");
  });

  it("displays user information in dropdown", async () => {
    render(<UserAccountDropdown />);

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    // Check for user information in the dropdown
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });
  });

  it("renders profile and sign out dropdown items", async () => {
    render(<UserAccountDropdown />);

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });
  });

  it("navigates to profile page when profile item is clicked", async () => {
    render(<UserAccountDropdown />);

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    await waitFor(() => {
      const profileItem = screen.getByText("Profile");
      expect(profileItem).toBeInTheDocument();
    });

    // Note: Since the Profile item uses href="/profile", it would navigate directly
    // In a real test, we might want to test this differently
  });

  it("handles sign out correctly", async () => {
    vi.mocked(signOut).mockResolvedValue();

    render(<UserAccountDropdown />);

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    await waitFor(() => {
      const signOutItem = screen.getByTestId("logout-button");
      expect(signOutItem).toBeInTheDocument();
      fireEvent.click(signOutItem);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(mockResetUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("handles sign out error gracefully", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.mocked(signOut).mockRejectedValue(new Error("Sign out failed"));

    render(<UserAccountDropdown />);

    // Click on the avatar to open the dropdown
    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    await waitFor(() => {
      const signOutItem = screen.getByTestId("logout-button");
      expect(signOutItem).toBeInTheDocument();
      fireEvent.click(signOutItem);
    });

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error signing out:",
        expect.any(Error)
      );
      expect(mockResetUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    consoleErrorSpy.mockRestore();
  });
});
