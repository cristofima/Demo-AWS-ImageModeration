import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { toast } from "react-toastify";
import ProfilePage from "./ProfilePage";
import { useUserData } from "../../hooks";
import { updateUserAttributes } from "@aws-amplify/auth";

vi.mock("@aws-amplify/auth", () => ({
  updateUserAttributes: vi.fn(),
}));

vi.mock("../../hooks", () => ({
  useUserData: vi.fn(),
}));

describe("ProfilePage", () => {
  const mockUser = {
    email: "test@example.com",
    name: "John",
    familyName: "Doe",
    nickname: "johndoe",
  };

  beforeEach(() => {
    vi.mocked(useUserData).mockReturnValue({
      user: mockUser,
      updateUser: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the profile page", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("updates user profile successfully", () => {
    const mockUpdateUser = vi.fn();
    vi.mocked(useUserData).mockReturnValue({
      user: { email: "test@example.com", name: "John", familyName: "Doe" },
      updateUser: mockUpdateUser,
    });

    vi.mocked(updateUserAttributes).mockResolvedValueOnce({} as any);
    render(<ProfilePage />);

    fireEvent.change(screen.getByTestId("name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByTestId("familyName"), {
      target: { value: "Smith" },
    });
    fireEvent.click(screen.getByTestId("update-button"));

    waitFor(() => {
      expect(updateUserAttributes).toHaveBeenCalledWith({
        userAttributes: {
          name: "Jane",
          family_name: "Smith",
          updated_at: expect.any(String),
        },
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Profile updated successfully"
      );
      expect(mockUpdateUser).toHaveBeenCalledWith({
        name: "Jane",
        familyName: "Smith",
      });
    });
  });

  it("shows an error toast when update fails", () => {
    vi.mocked(updateUserAttributes).mockRejectedValueOnce(
      new Error("Update failed")
    );

    render(<ProfilePage />);
    fireEvent.change(screen.getByTestId("name"), {
      target: { value: "Jane" },
    });
    fireEvent.click(screen.getByTestId("update-button"));

    waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update Profile");
    });
  });
});
