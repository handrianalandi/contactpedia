import { render, screen, fireEvent } from "@testing-library/react";
import ContactCard from "./ContactCard";
import { Contact } from "../Interfaces/Contact";
import { MemoryRouter } from "react-router-dom";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

const contact: Contact = {
  id: 2,
  first_name: "Jane",
  last_name: "Doe",
  phones: [
    {
      number: "628912398789",
    },
    {
      number: "628987654321",
    },
  ],
};
const props = {
  isFavorite: false,
  handleClickDelete: jest.fn(),
  ...contact,
};

describe("ContactCard", () => {
  it("should render correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <ContactCard {...props} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with favorite", () => {
    const { container } = render(
      <MemoryRouter>
        <ContactCard {...props} isFavorite={true} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("should call handleClickDelete", () => {
    render(
      <MemoryRouter>
        <ContactCard {...props} />
      </MemoryRouter>
    );
    const button = screen.getByTestId("delete-contact-button");
    fireEvent.click(button);
    expect(props.handleClickDelete).toHaveBeenCalled();
  });
});
