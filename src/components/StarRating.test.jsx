import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StarRating from "./StarRating";

describe("StarRating component", () => {
  test("renders 5 star buttons", () => {
    render(<StarRating value={3} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
  });

  test("disables buttons when onChange is not provided", () => {
    render(<StarRating value={3} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  test("enables buttons when onChange is provided", () => {
    const handleChange = jest.fn();
    render(<StarRating value={3} onChange={handleChange} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled();
    });
  });

  test("calls onChange with selected star number when clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<StarRating value={2} onChange={handleChange} />);

    const fourthStar = screen.getByRole("button", { name: "4 stars" });
    await user.click(fourthStar);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  test("applies correct aria-labels for single and plural stars", () => {
    render(<StarRating value={1} />);
    expect(screen.getByRole("button", { name: "1 star" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2 stars" })).toBeInTheDocument();
  });

  test("applies custom className", () => {
    const { container } = render(<StarRating value={0} className="custom-test-class" />);
    expect(container.firstChild).toHaveClass("custom-test-class");
  });
});
