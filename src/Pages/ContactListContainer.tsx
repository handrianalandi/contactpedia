import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetContactList } from "../GraphQL/queries";
import { Row, Col } from "react-bootstrap";
import ContactList from "../Components/ContactList";
import styled from "@emotion/styled";
import SearchBar from "../Components/SearchBar";
import { css } from "@emotion/react";
import { DeleteContactById } from "../GraphQL/mutations";
import { useDispatch } from "react-redux";
import { removeFavorite } from "../redux/store";
import Modal from "../Components/Modal";

const RowWrapper = styled(Row)`
  margin-bottom: 10px;
  flex-direction: column;
  gap: 10px;
`;

const SearchBarRow = styled(RowWrapper)`
  background-color: #06ba63;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 0 0 10px 10px;
`;

const AppTitle = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

export default function ContactListContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null); 
  const [deleteContactName, setDeleteContactName] = useState<string | null>(null);
  const onCloseDeleteModal = () => setIsOpenDeleteModal(false);
  const handleClickDelete = (contactId: number, contactName: string) => {
    setDeleteContactId(contactId);
    setDeleteContactName(contactName);
    setIsOpenDeleteModal(true);
  };

  const GET_QUERY = [
    {
      query: GetContactList,
      variables: {
        where: {
          _or: [
            { first_name: { _ilike: `%${searchTerm}%` } },
            { last_name: { _ilike: `%${searchTerm}%` } },
            { phones: { number: { _ilike: `%${searchTerm}%` } } },
            {
              _and: searchTerm.split(" ").map((word) => ({
                _or: [
                  { first_name: { _ilike: `%${word}%` } },
                  { last_name: { _ilike: `%${word}%` } },
                ],
              })),
            },
          ],
        },
        order_by: {
          first_name: "asc",
        },
      },
    },
  ];

  const [deleteContact] = useMutation(DeleteContactById, {
    variables: {
      id: deleteContactId,
    },
    refetchQueries: GET_QUERY,
    update: (cache) => {
      cache.evict({ id: `contact:${deleteContactId}` });
    },
  });

  const handleConfirmDelete = () => {
    deleteContact();
    dispatch(removeFavorite(deleteContactId));
    onCloseDeleteModal();
  };

  const contactQuery = useQuery(GET_QUERY[0].query, {
    variables: GET_QUERY[0].variables,
  });

  return (
    <>
      <SearchBarRow
        css={css`
          background-color: black;
        `}
      >
        <Col className="d-flex justify-content-center">
          <AppTitle>Contact KU</AppTitle>
        </Col>
        <Col className="d-flex justify-content-center">
          <SearchBar setSearchTerm={setSearchTerm} />
        </Col>
      </SearchBarRow>
      <RowWrapper>
        <Col>
          <ContactList {...contactQuery} handleClickDelete={handleClickDelete}/>
        </Col>
      </RowWrapper>
      <Modal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        heading="Delete Contact"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmButtonType="danger"
      >
        <p>Are you sure you want to delete {deleteContactName}?</p><br/>
      </Modal>
    </>
  );
}
