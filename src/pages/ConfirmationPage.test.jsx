import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmationPage from "./ConfirmationPage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("ConfirmationPage", () => {
  const mockCart = [
    {
      id: 1,
      title: "The Art of Focus",
      author: "Arjun Patel",
      description: "Practical guide to mastering focus",
      format: "Paperback",
      tags: ["Self Help"],
      price: 399,
      qty: 1,
      delivery: "Mon, 21 Jul",
      cover: "bg-orange-500",
      coverText: "THE ART OF FOCUS",
      coverSub: "ARJUN PATEL",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders order confirmation message and purchased book cards", () => {
    render(<ConfirmationPage cart={mockCart} />);

    expect(
      screen.getByText("Your purchase of the following reads is successful")
    ).toBeInTheDocument();
    expect(screen.getByText("The Art of Focus")).toBeInTheDocument();
    expect(screen.getByText("by Arjun Patel")).toBeInTheDocument();
  });

  test("renders empty message when no items in cart", () => {
    render(<ConfirmationPage cart={[]} />);

    expect(screen.getByText("No items found.")).toBeInTheDocument();
  });

  test("navigates to product page when clicking on purchased book card", async () => {
    const user = userEvent.setup();
    render(<ConfirmationPage cart={mockCart} />);

    const bookTitle = screen.getByText("The Art of Focus");
    await user.click(bookTitle);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  test("navigates to home when clicking Continue Shopping button", async () => {
    const user = userEvent.setup();
    render(<ConfirmationPage cart={mockCart} />);

    const continueBtn = screen.getByRole("button", { name: /continue shopping/i });
    await user.click(continueBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
