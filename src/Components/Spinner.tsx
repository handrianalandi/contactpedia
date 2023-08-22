import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";

interface SpinnerProps {
  isInvertedColor?: boolean;
  size?: "xs" | "sm" | "lg";
}

const SpinnerElement = styled(FontAwesomeIcon)<SpinnerProps>`
  color: ${(props) => (props.isInvertedColor ? "white" : "#06ba63")};
  font-size: ${(props) =>
    props.size === "xs" ? "1rem" : props.size === "sm" ? "1.5rem" : "2rem"};
`;

export default function Spinner({
  isInvertedColor = false,
  size = "xs",
}: SpinnerProps) {
  return (
    <div>
      <SpinnerElement
        size={size}
        isInvertedColor={isInvertedColor}
        icon={faSpinner}
        spin
      />
    </div>
  );
}