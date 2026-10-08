import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartPage from "./CartPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CartPage", () => {
  const mockCart = [
    {
      id: 1,
      title: "The Art of Focus",
      author: "Arjun Patel",
      description: "Practical guide to mastering focus",
      format: "Paperback",
      tags: ["Self Help"],
      price: 399,
      qty: 2,
      delivery: "Mon, 21 Jul",
      cover: "bg-orange-500",
      coverText: "THE ART OF FOCUS",
      coverSub: "ARJUN PATEL",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  test("renders empty cart state when cart is empty", async () => {
    const user = userEvent.setup();
    render(<CartPage cart={[]} setCart={jest.fn()} />);

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    const browseBtn = screen.getByRole("button", { name: /browse catalogue/i });
    await user.click(browseBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("renders cart items, price calculations, and address section", () => {
    render(<CartPage cart={mockCart} setCart={jest.fn()} />);

    expect(screen.getByRole("heading", { name: "The Art of Focus" })).toBeInTheDocument();
    expect(screen.getByText("₹798")).toBeInTheDocument(); // 399 * 2
    expect(screen.getByText("Grand Total")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Address" })).toBeInTheDocument();
  });

  test("allows incrementing and decrementing item quantities", async () => {
    const user = userEvent.setup();
    const setCart = jest.fn();
    render(<CartPage cart={mockCart} setCart={setCart} />);

    const increaseBtn = screen.getByRole("button", { name: "Increase" });
    await user.click(increaseBtn);
    expect(setCart).toHaveBeenCalled();

    const decreaseBtn = screen.getByRole("button", { name: "Decrease" });
    await user.click(decreaseBtn);
    expect(setCart).toHaveBeenCalled();
  });

  test("allows removing an item from the cart", async () => {
    const user = userEvent.setup();
    const setCart = jest.fn();
    render(<CartPage cart={mockCart} setCart={setCart} />);

    const removeBtn = screen.getByRole("button", { name: "Remove" });
    await user.click(removeBtn);
    expect(setCart).toHaveBeenCalled();
  });

  test("applies and removes coupon code BOOK10 correctly", async () => {
    const user = userEvent.setup();
    render(<CartPage cart={mockCart} setCart={jest.fn()} />);

    const couponInput = screen.getByPlaceholderText("Apply Coupon");
    const applyBtn = screen.getByRole("button", { name: "Apply" });

    // Invalid coupon
    await user.type(couponInput, "INVALIDCODE");
    await user.click(applyBtn);
    expect(screen.getByText("Invalid code. Try BOOK10.")).toBeInTheDocument();

    // Valid coupon
    await user.clear(couponInput);
    await user.type(couponInput, "BOOK10");
    await user.click(applyBtn);
    expect(
      screen.getByText("✓ Gift points redeemed — 10% off!")
    ).toBeInTheDocument();

    // Remove coupon
    const removeCouponBtn = screen.getByText("Remove", { selector: "button" });
    await user.click(removeCouponBtn);
    expect(
      screen.queryByText("✓ Gift points redeemed — 10% off!")
    ).not.toBeInTheDocument();
  });

  test("validates required address fields when clicking Pay Now", async () => {
    const user = userEvent.setup();
    render(<CartPage cart={mockCart} setCart={jest.fn()} />);

    const payNowBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payNowBtn);

    expect(screen.getByText("First name is required.")).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Address is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("City is required.")).toBeInTheDocument();
    expect(screen.getByText("PIN code is required.")).toBeInTheDocument();
    expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
    expect(screen.getByText("State is required.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("populates saved address and proceeds to payment when valid", async () => {
    const user = userEvent.setup();
    const handleCheckout = jest.fn();
    render(<CartPage cart={mockCart} setCart={jest.fn()} onCheckout={handleCheckout} />);

    const savedCheckbox = screen.getByRole("checkbox", { name: "Use Saved Address" });
    await user.click(savedCheckbox);

    const payNowBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payNowBtn);

    expect(handleCheckout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/payment", expect.objectContaining({
      state: expect.objectContaining({ total: expect.any(Number) }),
    }));
  });
});
