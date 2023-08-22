import { render } from "@testing-library/react";
import ContactList from "./ContactList";
import { ApolloError } from "@apollo/client";
import { MemoryRouter } from "react-router-dom";
import * as redux from "react-redux";

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

const props = {
  loading: false,
  error: undefined,
  data: {
    contact: [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        phones: [
          {
            number: "628912345678",
          },
          {
            number: "628987654321",
          },
        ],
      },
      {
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
      },
    ],
  },
  searchTerm: "",
  handleClickDelete: jest.fn(),
};

describe("ContactList", () => {
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  beforeEach(() => {
    useSelectorMock.mockClear();
  });
  it("should render correctly", () => {
    useSelectorMock.mockReturnValue([]);
    const { container } = render(
      <MemoryRouter>
        <ContactList {...props} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with favorite contact", () => {
    useSelectorMock.mockReturnValue([1]);
    const { container } = render(
      <MemoryRouter>
        <ContactList {...props} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with loading", () => {
    const { container } = render(
      <MemoryRouter>
        <ContactList {...props} loading={true} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render correctly with error", () => {
    const { container } = render(
      <MemoryRouter>
        <ContactList {...props} error={new ApolloError({})} />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
