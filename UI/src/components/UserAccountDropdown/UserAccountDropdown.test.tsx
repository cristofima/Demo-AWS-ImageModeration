import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UserAccountDropdown from "./UserAccountDropdown";
import { useUserData } from "../../hooks";
import { User } from "../../interfaces";
import { signOut } from "@aws-amplify/auth";

vi.mock("../../hooks/useUserData", () => ({
  useUserData: vi.fn(),
}));

vi.mock("@aws-amplify/auth", () => ({
  signOut: vi.fn(),
}));

describe("UserAccountDropdown", () => {

  beforeEach(() => {
    vi.mocked(useUserData).mockReturnValue({
      user: {
        name: "John",
        familyName: "Doe",
        email: "john.doe@example.com",
      } as unknown as User,
      updateUser: vi.fn(),
    });
    vi.mocked(signOut).mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the user avatar", () => {
    render(
      <MemoryRouter>
        <UserAccountDropdown />
      </MemoryRouter>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("displays user details in the dropdown", async () => {
    render(
      <MemoryRouter>
        <UserAccountDropdown />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("calls signOut and navigates to the home page on logout", () => {
    render(
      <MemoryRouter>
        <UserAccountDropdown />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("logout-button"));

    waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
