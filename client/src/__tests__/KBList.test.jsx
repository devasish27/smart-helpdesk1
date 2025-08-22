import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // <-- add this
import { describe, it, expect, vi } from "vitest";
import KBList from "../pages/KBList";
import { AuthContext, useAuth } from "../store/auth";

vi.mock('../store/auth');

describe("KBList", () => {
  it("shows add button for admin", () => {
    useAuth.mockReturnValue({ user: { role: "admin" } });
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { role: "admin" } }}>
          <KBList />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText("+ Add Article")).toBeInTheDocument();
  });

  it("hides add button for normal user", () => {
    useAuth.mockReturnValue({ user: { role: "user" } });
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: { role: "user" } }}>
          <KBList />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.queryByText("+ Add Article")).not.toBeInTheDocument();
  });
});