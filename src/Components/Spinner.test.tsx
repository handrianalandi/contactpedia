import { render } from "@testing-library/react";
import Spinner from "./Spinner";
describe("Spinner", () => {
  const sizes: ("xs" | "sm" | "lg")[] = ["xs", "sm", "lg"];
  describe("should render correctly", () => {
    sizes.forEach((size) => {
      it(`with size ${size}`, () => {
        const { container } = render(<Spinner size={size} />);
        expect(container).toMatchSnapshot();
      });
    });
  });

  it("should render correctly with isInvertedColor", () => {
    const { container } = render(<Spinner isInvertedColor />);
    expect(container).toMatchSnapshot();
  });
});
