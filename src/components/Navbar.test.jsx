import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Navbar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo and brand name, clicking navigates to home", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const logoBtn = screen.getByRole("button", { name: /book worm/i });
    expect(logoBtn).toBeInTheDocument();

    await user.click(logoBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders desktop navigation links; clicking My Wishlist opens wishlist panel", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const wishlistBtn = screen.getByRole("button", { name: "My Wishlist" });
    expect(wishlistBtn).toBeInTheDocument();

    await user.click(wishlistBtn);
    // My Wishlist opens the wishlist modal, not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText(/your wishlist is empty/i)).toBeInTheDocument();
  });

  test("when cart is empty, clicking cart shows warning toast and does not navigate", async () => {
    const user = userEvent.setup();
    render(<Navbar cartCount={0} />);

    const cartBtn = screen.getByRole("button", { name: "Cart is empty" });
    await user.click(cartBtn);

    expect(
      screen.getByText(/your cart is empty\. browse books and add one to get started/i)
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("when cart has items, displays badge and clicking navigates to /cart", async () => {
    const user = userEvent.setup();
    render(<Navbar cartCount={3} />);

    expect(screen.getByText("3")).toBeInTheDocument();
    const cartBtn = screen.getByRole("button", { name: "Cart (3 items)" });
    await user.click(cartBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  test("toggles mobile menu when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar cartCount={2} />);

    const menuToggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(menuToggle).toBeInTheDocument();

    // Open mobile menu
    await user.click(menuToggle);
    expect(screen.getByText("Cart (2)")).toBeInTheDocument();

    // Click link inside mobile menu
    const mobileWriters = screen.getAllByRole("button", { name: "My Writers" })[1];
    await user.click(mobileWriters);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
