import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductDetailPage from "./ProductDetailPage";

const mockNavigate = jest.fn();
let mockParams = { id: "1" };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

describe("ProductDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { id: "1" };
  });

  test("renders 'Book not found.' when invalid ID is provided", () => {
    mockParams = { id: "999" };
    render(<ProductDetailPage cart={[]} setCart={jest.fn()} />);

    expect(screen.getByText("Book not found.")).toBeInTheDocument();
  });

  test("renders book details for a valid book", () => {
    render(<ProductDetailPage cart={[]} setCart={jest.fn()} />);

    expect(screen.getByRole("heading", { name: "The Art of Focus" })).toBeInTheDocument();
    expect(screen.getByText("by Arjun Patel")).toBeInTheDocument();
    expect(screen.getByText("ABC Publishers")).toBeInTheDocument();
    expect(screen.getByText("₹399")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About the writer" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Reviews" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Related Reads" })).toBeInTheDocument();
  });

  test("adds book to cart when Add to Cart button is clicked", async () => {
    const user = userEvent.setup();
    const setCart = jest.fn();
    render(<ProductDetailPage cart={[]} setCart={setCart} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    expect(setCart).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /added to cart ✓/i })).toBeInTheDocument();
  });

  test("shows validation error when attempting to proceed to cart without adding item", async () => {
    const user = userEvent.setup();
    render(<ProductDetailPage cart={[]} setCart={jest.fn()} />);

    const proceedBtn = screen.getByRole("button", { name: /proceed to cart/i });
    await user.click(proceedBtn);

    expect(
      screen.getByText("Please add this book to your cart before proceeding.")
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("proceeds to cart when book has already been added", async () => {
    const user = userEvent.setup();
    const setCart = jest.fn();
    render(<ProductDetailPage cart={[]} setCart={setCart} />);

    const addToCartBtn = screen.getByRole("button", { name: /add to cart/i });
    await user.click(addToCartBtn);

    const proceedBtn = screen.getByRole("button", { name: /proceed to cart/i });
    await user.click(proceedBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  test("validates review submission errors and accepts valid review", async () => {
    const user = userEvent.setup();
    render(<ProductDetailPage cart={[]} setCart={jest.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);

    expect(screen.getByText("Please select a star rating.")).toBeInTheDocument();
    expect(screen.getByText("Review must be at least 10 characters.")).toBeInTheDocument();

    // Select 5 stars (find the interactive button in the review form)
    const star5 = screen
      .getAllByRole("button", { name: "5 stars" })
      .find((btn) => !btn.disabled);
    await user.click(star5);

    // Enter short review
    const textarea = screen.getByPlaceholderText("Placeholder text");
    await user.type(textarea, "Short");
    await user.click(submitBtn);
    expect(screen.getByText("Review must be at least 10 characters.")).toBeInTheDocument();

    // Enter valid review
    await user.clear(textarea);
    await user.type(textarea, "This is an amazing and insightful book!");
    await user.click(submitBtn);

    expect(screen.getByText("This is an amazing and insightful book!")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });
});
