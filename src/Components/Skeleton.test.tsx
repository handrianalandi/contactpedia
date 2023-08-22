import { render } from "@testing-library/react";
import Skeleton from "./Skeleton";
import { createSerializer } from "@emotion/jest";

expect.addSnapshotSerializer(createSerializer());

describe("Skeleton", () => {
  it("should render correctly", () => {
    const { container } = render(<Skeleton />);
    expect(container).toMatchSnapshot();
  });
});