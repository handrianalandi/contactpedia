import { render } from "@testing-library/react";
import Preloader from "./Preloader";
import { createSerializer } from "@emotion/jest";

expect.addSnapshotSerializer(createSerializer());

describe("Preloader", () => {
  it("should render correctly", () => {
    const { container } = render(<Preloader />);
    expect(container).toMatchSnapshot();
  });
});
