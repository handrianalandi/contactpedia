import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetContactList } from "../GraphQL/queries";
import { Row, Col } from "react-bootstrap";
import ContactList from "../Components/ContactList";
import styled from "@emotion/styled";
import SearchBar from "../Components/SearchBar";
import { css } from "@emotion/react";


const RowWrapper = styled(Row)`
    margin-bottom: 10px;
    flex-direction: column;
    gap: 10px;
`

const SearchBarRow = styled(RowWrapper)`
    background-color: #06BA63;
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 0 0 10px 10px;
`

const AppTitle = styled.h1`
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
`

export default function ContactListContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const contactQuery = useQuery(GetContactList, {
    variables: {
      where: {
        _or: [
          { first_name: { _ilike: `%${searchTerm}%` } },
          { last_name: { _ilike: `%${searchTerm}%` } },
          { phones: { number: { _ilike: `%${searchTerm}%` } } },
          {
            _and: searchTerm
              .split(" ")
              .map((word) => ({
                _or: [
                  { first_name: { _ilike: `%${word}%` } },
                  { last_name: { _ilike: `%${word}%` } },
                ],
              })),
          },
        ],
      },
      order_by:{
        first_name: "asc",
      }
    },
  });

  return (
    <>
      <SearchBarRow css={css`
      background-color: black;
      `}>
        <Col className="d-flex justify-content-center">
          <AppTitle>
            Contact KU
          </AppTitle>
        </Col>
        <Col className="d-flex justify-content-center">
          <SearchBar setSearchTerm={setSearchTerm} />
        </Col>
      </SearchBarRow>
      <RowWrapper>
        <Col>
          <ContactList {...contactQuery} />
        </Col>
      </RowWrapper>
    </>
  );
}
