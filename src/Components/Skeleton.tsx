import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import React from "react";

const loadingAnimation = keyframes`
0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
`;
const SkeletonElement = styled.div`
  width: 100%;
  border-radius: 15px;
  margin-bottom: 10px;
  animation: ${loadingAnimation} 1s linear infinite alternate;
`;

const SkeletonCard = styled(SkeletonElement)`
  height: 50px;
`;

const SkeletonTextLong = styled(SkeletonElement)`
  height: 20px;
  width: 80%;
`;

const SkeletonTextShort = styled(SkeletonElement)`
  height: 20px;
  width: 40%;
`;

export default function Skeleton() {
  return (
    <>
      <SkeletonCard />
      <SkeletonTextLong />
      <SkeletonTextShort />
    </>
  );
}