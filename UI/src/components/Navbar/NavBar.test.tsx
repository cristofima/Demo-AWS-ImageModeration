import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "./NavBar";

describe("NavBar", () => {
  it("renders the navigation links", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    expect(screen.getByText("Gallery")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  it("toggles the menu on mobile view", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>
    );

    const menuToggle = screen.getByLabelText("Open menu");
    fireEvent.click(menuToggle);

    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });
});
