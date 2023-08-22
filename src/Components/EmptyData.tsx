import React from "react";
import emptyDataImage from "../assets/empty-data-vector.png";
import styled from "@emotion/styled";

const EmptyDataWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: fit-content;
`;

const EmptyDataText = styled.h5`
  font-size: 1rem;
  font-weight: 700;
  color: grey;
  margin: 0;
  text-align: center;
`;

interface EmptyDataProps {
  text?: string;
}
export default function EmptyData({ text = "No Data Found" }: EmptyDataProps) {
  return (
    <EmptyDataWrapper>
      <img src={emptyDataImage} alt="Empty Data" />
      <EmptyDataText>{text}</EmptyDataText>
    </EmptyDataWrapper>
  );
}
