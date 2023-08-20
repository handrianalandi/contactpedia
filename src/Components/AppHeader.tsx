import styled from "@emotion/styled";
import React from "react";
import { Col, Row } from "react-bootstrap";

const RowWrapper = styled(Row)`
  margin-bottom: 10px;
  flex-direction: column;
  gap: 10px;
`;

const AppHeaderRow = styled(RowWrapper)`
  background-color: #06ba63;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 0 0 10px 10px;
    position: sticky;
    top: 0;
    z-index: 1000;
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
    font-style: italic;
`;

interface AppHeaderProps {
    children?: React.ReactNode;
}

export default function AppHeader({children}: AppHeaderProps) {
  return (
    <AppHeaderRow>
      <Col className="d-flex justify-content-center">
        <AppTitle>Contactpedia</AppTitle>
      </Col>
      <Col className="d-flex justify-content-center">
        {children}
      </Col>
    </AppHeaderRow>
  );
}
