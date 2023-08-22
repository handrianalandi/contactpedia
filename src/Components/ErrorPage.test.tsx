import { render } from "@testing-library/react";
import ErrorPage from "./ErrorPage";
import { MemoryRouter } from "react-router-dom";
import { createSerializer } from "@emotion/jest";

expect.addSnapshotSerializer(createSerializer());

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

describe("ErrorPage", () => {
  it("should render correctly", () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );
    expect(container).toMatchSnapshot();
  });
});
