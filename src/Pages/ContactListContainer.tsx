import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetContactList } from "../GraphQL/queries";
import { Row, Col } from "react-bootstrap";
import ContactList from "../Components/ContactList";
import styled from "@emotion/styled";

const SearchBar = styled.input`
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 10px;
    width: 100%;
    margin: 0 auto;
    display: block;
    box-sizing: border-box;

    &:focus{
        outline: none;
        border: 2px solid #06BA63;
    }
`
const RowWrapper = styled(Row)`
    margin-bottom: 10px;
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
                  { phones: { number: { _ilike: `%${word}%` } } },
                ],
              })),
          },
        ],
      },
    },
  });
  return (
    <>
      <RowWrapper>
        <Col className="d-flex justify-content-center">
          <SearchBar
            type="text"
            placeholder="Find by Name or Phone Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </RowWrapper>
      <RowWrapper>
        <Col>
          <ContactList {...contactQuery} />
        </Col>
      </RowWrapper>
      {/* <RowWrapper>
        <Col>
          <ContactList {...contactQueryNonFavorite} isFavorite={false} />
        </Col>
      </RowWrapper> */}
    </>
  );
}
