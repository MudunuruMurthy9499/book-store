import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  test("renders without crashing and displays the catalogue on default route", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Book Worm" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search title or author…")).toBeInTheDocument();
  });
});
