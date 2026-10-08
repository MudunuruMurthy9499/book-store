import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  test("renders brand name and description", () => {
    render(<Footer />);
    expect(screen.getByRole("heading", { name: "Book Worm" })).toBeInTheDocument();
    expect(
      screen.getByText(/your online destination for books across every genre/i)
    ).toBeInTheDocument();
  });

  test("renders footer section headings and links", () => {
    render(<Footer />);
    expect(screen.getByText("Quick Links")).toBeInTheDocument();
    expect(screen.getByText("Top Categories")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Fiction" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact Us" })).toBeInTheDocument();
  });

  test("renders current year in copyright text", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear} Book Worm`, "i"))).toBeInTheDocument();
  });
});
