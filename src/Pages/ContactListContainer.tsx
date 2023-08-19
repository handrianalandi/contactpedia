import { useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetContactList } from "../GraphQL/queries";
import { Row, Col, Button } from "react-bootstrap";
import ContactList from "../Components/ContactList";
import styled from "@emotion/styled";
import SearchBar from "../Components/SearchBar";
import { css } from "@emotion/react";
import { AddContact, DeleteContactById } from "../GraphQL/mutations";
import { useDispatch } from "react-redux";
import { removeFavorite } from "../redux/store";
import Modal from "../Components/Modal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "../Components/Input";

type FormValues = {
  first_name: string;
  last_name: string;
  phones: {
    number: string;
  }[];
};

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

const FAB = styled(Button)`
  background-color: #06ba63;
  border: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 1rem;
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
`

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AddPhoneButton = styled(Button)`
  border: 1px dashed #06ba63;
  border-radius: 15px;
  color: #06ba63;
  font-size: 1rem;
  background-color: white;

  &:hover {
    background-color: #06ba63;
    color: white;
    border: 1px solid #06ba63;
  }
`

const PhoneNumberDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const PhoneNumberInput = styled(Input)`
  flex: 0 0 70%;
`

const PhoneNumberDeleteButton = styled(Button)`
  flex: 0 0 10%;
  border: none;
  background-color: transparent;
  color: #06ba63;
  font-size: 1rem;
`

const RequiredWarningText = styled.span`
  color: red;
`


export default function ContactListContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

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

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [deleteContactId, setDeleteContactId] = useState<number | null>(null); 
  const [deleteContactName, setDeleteContactName] = useState<string | null>(null);
  const onCloseDeleteModal = () => setIsOpenDeleteModal(false);
  const handleClickDelete = (contactId: number, contactName: string) => {
    setDeleteContactId(contactId);
    setDeleteContactName(contactName);
    setIsOpenDeleteModal(true);
  };

  const { register, control, handleSubmit, reset, formState:{ errors } } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const onCloseAddModal = () => setIsOpenAddModal(false);
  const handleClickAdd = () => setIsOpenAddModal(true);
  const [addContact] = useMutation(AddContact, {
    refetchQueries: GET_QUERY,
  });
  const onSubmit = async (data: FormValues) => {
    //erase all phone numbers that are empty
    data.phones = data.phones.filter((phone) => phone.number !== "");
    await addContact({
      variables: {
        first_name: data.first_name,
        last_name: data.last_name,
        phones: data.phones,
      },
    });
    onCloseAddModal();
    reset();
  };


  

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
      {/* delete modal */}
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

      {/* add modal */}
      <Modal
        isOpen={isOpenAddModal}
        onClose={onCloseAddModal}
        heading="Add Contact"
        confirmText="Add"
        confirmButtonType="primary"
        onConfirm={handleSubmit(onSubmit)}
        
      >
        <AddForm onSubmit={handleSubmit(onSubmit)}>
          <Input type="text" placeholder="First Name" {...register("first_name", {required: true})} />
          {errors.first_name && errors.first_name.type === "required" && <RequiredWarningText>First Name is Required</RequiredWarningText>}
          <br/>
          <Input type="text" placeholder="Last Name" {...register("last_name")} />
          <br/>
          {fields.map((field, index) => (
            <PhoneNumberDiv key={field.id}>
              <PhoneNumberInput type="text" placeholder="Phone Number" {...register(`phones.${index}.number` as const)} />
              <PhoneNumberDeleteButton variant="danger" onClick={() => remove(index)}>
                Delete
              </PhoneNumberDeleteButton>
            </PhoneNumberDiv>
          ))}
          <AddPhoneButton variant="primary" onClick={() => append({ number: "" })}>Add Phone Number</AddPhoneButton>
          
        </AddForm>
      </Modal>

      <FAB 
      variant="primary"
      onClick={handleClickAdd}
      >
        <FontAwesomeIcon icon={faPlus} />
      </FAB>
    </>
  );
}
