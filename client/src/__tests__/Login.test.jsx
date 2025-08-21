import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../pages/Login";

describe("Login Page", () => {
  it("renders login form", () => {
    render(<Login />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("shows error when form is empty", async () => {
    render(<Login />);
    fireEvent.click(screen.getByText("Login"));
    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });
});