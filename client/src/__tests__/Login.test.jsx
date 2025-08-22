import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../pages/Login";
import { AuthContext } from "../store/auth";
import { MemoryRouter } from "react-router-dom";

describe("Login Page", () => {
  it("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows error when form is empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/Required/i)).toBeInTheDocument();
  });
});