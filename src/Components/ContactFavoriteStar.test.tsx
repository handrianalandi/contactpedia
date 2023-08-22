import { render, screen, fireEvent } from "@testing-library/react";
import ContactFavoriteStar from "./ContactFavoriteStar";
import { createSerializer } from "@emotion/jest";

expect.addSnapshotSerializer(createSerializer());

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

const props = {
  isFavorite: false,
  contactId: 1,
};

describe("ContactFavoriteStar", () => {
  it("should render correctly", () => {
    const { container } = render(<ContactFavoriteStar {...props} />);
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with favorite", () => {
    const { container } = render(
      <ContactFavoriteStar {...props} isFavorite={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should call dispatch", () => {
    render(<ContactFavoriteStar {...props} />);
    const star = screen.getByTestId("favorite-star");
    fireEvent.click(star);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
