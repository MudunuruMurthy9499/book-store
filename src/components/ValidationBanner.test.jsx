import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast, ValidationBanner } from "./ValidationBanner";

describe("ValidationBanner component", () => {
  test("returns null when no message is provided", () => {
    const { container } = render(<ValidationBanner message="" />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders message with error style by default", () => {
    render(<ValidationBanner message="An error occurred" />);
    expect(screen.getByText("An error occurred")).toBeInTheDocument();
  });

  test("renders with different alert types (warning, success, info)", () => {
    const { rerender } = render(
      <ValidationBanner message="Warning message" type="warning" />
    );
    expect(screen.getByText("Warning message")).toBeInTheDocument();

    rerender(<ValidationBanner message="Success message" type="success" />);
    expect(screen.getByText("Success message")).toBeInTheDocument();

    rerender(<ValidationBanner message="Info message" type="info" />);
    expect(screen.getByText("Info message")).toBeInTheDocument();
  });

  test("renders close button and triggers onClose callback", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(<ValidationBanner message="Dismissible message" onClose={handleClose} />);

    const closeButton = screen.getByRole("button");
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe("Toast component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("renders toast message and auto-dismisses after duration", () => {
    const handleDone = jest.fn();
    render(<Toast message="Item added to cart" duration={3000} onDone={handleDone} />);

    expect(screen.getByText("Item added to cart")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText("Item added to cart")).not.toBeInTheDocument();
    expect(handleDone).toHaveBeenCalledTimes(1);
  });

  test("can be dismissed by clicking the close button", () => {
    const handleDone = jest.fn();
    render(<Toast message="Item added" onDone={handleDone} />);

    const closeBtn = screen.getByRole("button");
    act(() => {
      closeBtn.click();
    });

    expect(screen.queryByText("Item added")).not.toBeInTheDocument();
    expect(handleDone).toHaveBeenCalledTimes(1);
  });
});
