import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookCard from "./BookCard";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("BookCard component", () => {
  const mockBook = {
    id: 1,
    title: "The Art of Focus",
    author: "Arjun Patel",
    description: "Practical guide to mastering focus",
    format: "Paperback",
    tags: ["Non-fiction", "Self Help"],
    price: 399,
    delivery: "Mon, 21 Jul",
    cover: "bg-orange-500",
    coverText: "THE ART OF FOCUS",
    coverSub: "ARJUN PATEL",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders book information correctly", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("The Art of Focus")).toBeInTheDocument();
    expect(screen.getByText("Arjun Patel")).toBeInTheDocument();
    expect(screen.getByText("Practical guide to mastering focus")).toBeInTheDocument();
    expect(screen.getByText("Paperback")).toBeInTheDocument();
    expect(screen.getByText("Non-fiction")).toBeInTheDocument();
    expect(screen.getByText("Self Help")).toBeInTheDocument();
    expect(screen.getByText("₹399")).toBeInTheDocument();
    expect(screen.getByText("Delivery by Mon, 21 Jul")).toBeInTheDocument();
    expect(screen.getByText("THE ART OF FOCUS")).toBeInTheDocument();
    expect(screen.getByText("ARJUN PATEL")).toBeInTheDocument();
  });

  test("navigates to product detail page when card is clicked", async () => {
    const user = userEvent.setup();
    render(<BookCard book={mockBook} />);

    const card = screen.getByText("The Art of Focus").closest("div");
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  test("handles Add button click: calls onAddToCart and navigates", async () => {
    const user = userEvent.setup();
    const handleAddToCart = jest.fn();
    render(<BookCard book={mockBook} onAddToCart={handleAddToCart} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    expect(handleAddToCart).toHaveBeenCalledTimes(1);
    expect(handleAddToCart).toHaveBeenCalledWith(mockBook);
    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  test("handles Add button click when onAddToCart is not provided", async () => {
    const user = userEvent.setup();
    render(<BookCard book={mockBook} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });
});
