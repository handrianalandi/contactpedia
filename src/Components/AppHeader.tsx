import styled from "@emotion/styled";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
  cursor: pointer;
  position: absolute;
  left: 20px;
  top: 15px;
  width: 25px;
  height: 25px;
`;

interface AppHeaderProps {
  children?: React.ReactNode;
  enableBackButton?: boolean;
  backRoute?: string | undefined;
}

export default function AppHeader({
  children,
  enableBackButton = false,
  backRoute,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const goBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };
  return (
    <AppHeaderRow>
      {enableBackButton && (
        <BackButton onClick={goBack} aria-label="Back">
          <FontAwesomeIcon icon={faArrowLeft} />
        </BackButton>
      )}
      <Col className="d-flex justify-content-center">
        <AppTitle
          onClick={() => {
            navigate("/");
          }}
        >
          Contactpedia
        </AppTitle>
      </Col>
      {children && (
        <Col className="d-flex justify-content-center">{children}</Col>
      )}
    </AppHeaderRow>
  );
}
