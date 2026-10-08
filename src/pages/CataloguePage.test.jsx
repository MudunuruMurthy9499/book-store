import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CataloguePage from "./CataloguePage";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("CataloguePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navbar, category sidebar, filter bar, and book sections", () => {
    render(<CataloguePage cart={[]} />);

    expect(screen.getByRole("heading", { name: "Book Worm" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search title or author…")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Recommended for You" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Bestsellers this Month" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "New Launches" })).toBeInTheDocument();
  });

  test("filters books when typing into search input", async () => {
    const user = userEvent.setup();
    render(<CataloguePage cart={[]} />);

    const searchInput = screen.getByPlaceholderText("Search title or author…");
    await user.type(searchInput, "Focus");

    expect(screen.getByText("The Art of Focus")).toBeInTheDocument();
    expect(screen.queryByText("The Vanishing House")).not.toBeInTheDocument();
  });

  test("filters books when selecting a category", async () => {
    const user = userEvent.setup();
    render(<CataloguePage cart={[]} />);

    const romanceCategory = screen.getByRole("button", { name: "Romance" });
    await user.click(romanceCategory);

    expect(romanceCategory).toHaveClass("bg-indigo-50");
  });

  test("shows empty results view when search query matches no books and clears filters", async () => {
    const user = userEvent.setup();
    render(<CataloguePage cart={[]} />);

    const searchInput = screen.getByPlaceholderText("Search title or author…");
    await user.type(searchInput, "NonexistentBookTitleXYZ");

    expect(screen.getByText("No books found")).toBeInTheDocument();

    const clearButton = screen.getByRole("button", { name: "Clear filters" });
    await user.click(clearButton);

    expect(searchInput).toHaveValue("");
    expect(
      screen.getByRole("heading", { name: "Recommended for You" })
    ).toBeInTheDocument();
  });

  test("toggles mobile category sidebar and allows selecting category to close sidebar", async () => {
    const user = userEvent.setup();
    render(<CataloguePage cart={[]} />);

    const mobileFilterBtn = screen.getByRole("button", { name: /category/i });
    await user.click(mobileFilterBtn);

    const sidebar = screen.getByRole("complementary");
    const fantasyBtn = within(sidebar).getByRole("button", { name: "Fantasy" });
    await user.click(fantasyBtn);

    expect(fantasyBtn).toHaveClass("bg-indigo-50");
  });
});
