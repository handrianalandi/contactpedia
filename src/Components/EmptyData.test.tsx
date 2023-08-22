import { render } from "@testing-library/react";
import EmptyData from "./EmptyData";
import { createSerializer } from "@emotion/jest";

expect.addSnapshotSerializer(createSerializer());

describe("EmptyData", () => {
  it("should render correctly", () => {
    const { container } = render(<EmptyData />);
    expect(container).toMatchSnapshot();
  });
});
