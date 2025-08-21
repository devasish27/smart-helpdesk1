import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KBList from "../pages/KBList";
import { AuthContext } from "../store/auth";

describe("KBList", () => {
  it("shows add button for admin", () => {
    render(
      <AuthContext.Provider value={{ user: { role: "admin" } }}>
        <KBList />
      </AuthContext.Provider>
    );
    expect(screen.getByText("+ Add Article")).toBeInTheDocument();
  });

  it("hides add button for normal user", () => {
    render(
      <AuthContext.Provider value={{ user: { role: "user" } }}>
        <KBList />
      </AuthContext.Provider>
    );
    expect(screen.queryByText("+ Add Article")).not.toBeInTheDocument();
  });
});