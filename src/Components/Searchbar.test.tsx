import { render, fireEvent, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";
const props = {
  setSearchTerm: jest.fn(),
  placeholder: "Test Placeholder",
};
describe("Searchbar", () => {
  it("should render correctly with props", () => {
    const { container } = render(<SearchBar {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should call onChange when input is changed", () => {
    const mockOnChange = jest.fn();
    render(<SearchBar setSearchTerm={mockOnChange} />);
    //get the input
    const input = screen.getByTestId("search-bar");
    //fire the change event
    fireEvent.change(input, { target: { value: "test" } });
    expect(mockOnChange).toHaveBeenCalledWith("test");
  });
});
