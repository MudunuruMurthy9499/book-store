import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionHeading from "./SectionHeading";

describe("SectionHeading component", () => {
  test("renders the title", () => {
    render(<SectionHeading title="Recommended for You" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Recommended for You"
    );
  });

  test("does not render View All button when onViewAll is not provided", () => {
    render(<SectionHeading title="Recommended for You" />);
    expect(screen.queryByRole("button", { name: /view all/i })).not.toBeInTheDocument();
  });

  test("renders View All button and handles clicks when onViewAll is provided", async () => {
    const user = userEvent.setup();
    const handleViewAll = jest.fn();
    render(<SectionHeading title="Recommended for You" onViewAll={handleViewAll} />);

    const button = screen.getByRole("button", { name: /view all/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(handleViewAll).toHaveBeenCalledTimes(1);
  });
});
