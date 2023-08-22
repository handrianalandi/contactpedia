import { render } from "@testing-library/react";
import EmptyData from "./EmptyData";

describe("EmptyData", () => {
  it("should render correctly", () => {
    const { container } = render(<EmptyData />);
    expect(container).toMatchSnapshot();
  });
});
