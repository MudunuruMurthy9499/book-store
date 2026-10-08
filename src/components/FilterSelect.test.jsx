import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterSelect from "./FilterSelect";

describe("FilterSelect component", () => {
  const options = ["All", "Paperback", "Hardcover", "eBook"];

  test("renders select element with all options", () => {
    render(
      <FilterSelect
        label="Format"
        value="All"
        onChange={jest.fn()}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("All");

    const optionElements = screen.getAllByRole("option");
    expect(optionElements).toHaveLength(options.length);
    options.forEach((opt) => {
      expect(screen.getByRole("option", { name: opt })).toBeInTheDocument();
    });
  });

  test("renders label when provided", () => {
    render(
      <FilterSelect
        label="Language"
        value="All"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.getByText("Language")).toBeInTheDocument();
  });

  test("does not render label when label prop is omitted", () => {
    render(
      <FilterSelect
        value="All"
        onChange={jest.fn()}
        options={options}
      />
    );
    expect(screen.queryByText("Language")).not.toBeInTheDocument();
  });

  test("calls onChange callback when user selects a new option", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <FilterSelect
        label="Format"
        value="All"
        onChange={handleChange}
        options={options}
      />
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "Hardcover");

    expect(handleChange).toHaveBeenCalledWith("Hardcover");
  });
});
