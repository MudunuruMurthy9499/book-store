import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentPage from "./PaymentPage";

const mockNavigate = jest.fn();
let mockLocation = { state: { total: 499 } };

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe("PaymentPage", () => {
  const mockCart = [
    {
      id: 1,
      title: "The Art of Focus",
      price: 399,
      qty: 1,
      cover: "bg-orange-500",
      coverText: "THE ART OF FOCUS",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation = { state: { total: 499 } };
  });

  test("renders payment page with methods and order summary", () => {
    render(<PaymentPage cart={mockCart} />);

    expect(screen.getByRole("heading", { name: "Complete Payment" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Order Summary" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Credit Card" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Debit Card" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "UPI" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Wallet" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Net Banking" })).toBeInTheDocument();
  });

  test("validates card inputs on submit", async () => {
    const user = userEvent.setup();
    render(<PaymentPage cart={mockCart} />);

    const payBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payBtn);

    expect(screen.getByText("Card number is required.")).toBeInTheDocument();
    expect(screen.getByText("Name is required.")).toBeInTheDocument();
    expect(screen.getByText("CVV required.")).toBeInTheDocument();
    expect(screen.getByText("Expiry required.")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("completes card payment with valid inputs", async () => {
    const user = userEvent.setup();
    const handleSuccess = jest.fn();
    render(<PaymentPage cart={mockCart} onPaymentSuccess={handleSuccess} />);

    const cardInput = screen.getByPlaceholderText("XXXX-XXXX-XXXX-XXXX");
    const nameInput = screen.getByPlaceholderText("Name");
    const cvvInput = screen.getByPlaceholderText("XXX");
    const expiryInput = screen.getByPlaceholderText("MM/YY");

    await user.type(cardInput, "1234567812345678");
    await user.type(nameInput, "John Doe");
    await user.type(cvvInput, "123");
    await user.type(expiryInput, "12/28");

    const payBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payBtn);

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
  });

  test("validates and submits UPI payment method", async () => {
    const user = userEvent.setup();
    const handleSuccess = jest.fn();
    render(<PaymentPage cart={mockCart} onPaymentSuccess={handleSuccess} />);

    const upiTab = screen.getByRole("button", { name: "UPI" });
    await user.click(upiTab);

    const payBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payBtn);
    expect(screen.getByText("UPI ID required.")).toBeInTheDocument();

    const upiInput = screen.getByPlaceholderText("yourname@upi");
    await user.type(upiInput, "user@okaxis");
    await user.click(payBtn);

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
  });

  test("validates and submits Wallet payment method", async () => {
    const user = userEvent.setup();
    const handleSuccess = jest.fn();
    render(<PaymentPage cart={mockCart} onPaymentSuccess={handleSuccess} />);

    const walletTab = screen.getByRole("button", { name: "Wallet" });
    await user.click(walletTab);

    const payBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payBtn);
    expect(screen.getByText("Select a wallet.")).toBeInTheDocument();
    expect(screen.getByText("Enter 10-digit number.")).toBeInTheDocument();

    const providerSelect = screen.getByRole("combobox");
    const phoneInput = screen.getByPlaceholderText("10-digit number");

    await user.selectOptions(providerSelect, "Paytm");
    await user.type(phoneInput, "9876543210");
    await user.click(payBtn);

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
  });

  test("validates and submits Net Banking payment method", async () => {
    const user = userEvent.setup();
    const handleSuccess = jest.fn();
    render(<PaymentPage cart={mockCart} onPaymentSuccess={handleSuccess} />);

    const netBankingTab = screen.getByRole("button", { name: "Net Banking" });
    await user.click(netBankingTab);

    const payBtn = screen.getByRole("button", { name: /pay now/i });
    await user.click(payBtn);
    expect(screen.getByText("Select a bank.")).toBeInTheDocument();

    const bankSelect = screen.getByRole("combobox");
    await user.selectOptions(bankSelect, "HDFC Bank");
    await user.click(payBtn);

    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/confirmation");
  });
});
