import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { GetContactList } from "../GraphQL/queries";
import { Row, Col, Button } from "react-bootstrap";
import ContactList from "../Components/ContactList";
import styled from "@emotion/styled";
import SearchBar from "../Components/SearchBar";
import { AddContact, DeleteContactById } from "../GraphQL/mutations";
import { useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/store";
import Modal from "../Components/Modal";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm, useFieldArray } from "react-hook-form";
import Input from "../Components/Input";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import AppHeader from "../Components/AppHeader";
import { toastHelper } from "../helper/toastHelper";

type FormValues = {
  first_name: string;
  last_name: string;
  phones: {
    number: string;
  }[];
  favorite: boolean;
};

const RowWrapper = styled(Row)`
  margin-bottom: 10px;
  flex-direction: column;
  gap: 10px;
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

  &:hover,
  &:active {
    background-color: #06ba63 !important;
    color: white;
  }
`;

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
  background-color: white !important;
  margin-top: 10px;

  &:hover {
    background-color: #06ba63 !important;
    color: white;
    border: 1px solid #06ba63;
  }
`;

const SingleInformationWrapper = styled.div`
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const SingleInformationLabel = styled.label`
  color: #757575;
  font-size: 0.8rem;
`;

const RedStar = styled.span`
  color: red;
`;

const PhoneNumberDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  margin-top: 10px;
`;

const PhoneNumberInput = styled(Input)`
  flex: 0 0 80%;
  margin: 0;
`;

const PhoneNumberDeleteButton = styled(Button)`
  flex: 0 0 20%;
  border: none;
  background-color: transparent;
  color: #06ba63;
  font-size: 1rem;

  &:hover,
  &:active {
    background-color: transparent !important;
    color: #06ba63 !important;
  }
`;

const AddToFavoriteDiv = styled(PhoneNumberDiv)`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const AddToFavoriteButton = styled(BootstrapSwitchButton)`
  & .switch-on.btn {
    background-color: red;
  }
`;

const AddToFavoriteText = styled.span`
  color: #ccc;
  font-size: 0.8rem;
`;

const RequiredWarningText = styled.span`
  color: red;
  width: 100%;
`;

const DeleteText = styled.p`
  text-align: center;
  margin: 0;
  padding: 0;
`;

export default function ContactListContainer() {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const GET_CONTACT_QUERY = [
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
  const [deleteContactName, setDeleteContactName] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const onCloseDeleteModal = () => setIsOpenDeleteModal(false);
  const handleClickDelete = (contactId: number, contactName: string) => {
    setDeleteContactId(contactId);
    setDeleteContactName(contactName);
    setIsOpenDeleteModal(true);
  };

  const nameRegex = /^[a-zA-Z0-9\s]*$/;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phones: [{ number: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [numberExists, setNumberExists] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [existedName, setExistedName] = useState<string | null>(null);
  const [isAddingNewContact, setIsAddingNewContact] = useState(false);
  const onCloseAddModal = () => setIsOpenAddModal(false);
  const onOpenAddModal = () => setIsOpenAddModal(true);
  const [addContact] = useMutation(AddContact, {
    refetchQueries: GET_CONTACT_QUERY,
  });
  const client = useApolloClient();

  const onSubmitNewContact = async (data: FormValues) => {
    setIsAddingNewContact(true);
    let favorite = isFavorite;
    setNumberExists(false);
    setNameExists(false);
    if (data.phones && Array.isArray(data.phones)) {
      data.phones = data.phones.filter((phone) => phone.number !== "");
    }

    const { data: contactData } = await client.query({
      query: GetContactList,
      variables: {
        where: {
          _and: [
            { first_name: { _ilike: data.first_name } },
            { last_name: { _ilike: data.last_name } },
          ],
        },
      },
    });
    if (contactData.contact.length > 0) {
      setNameExists(true);
      setExistedName(`${data.first_name} ${data.last_name}`);
      setIsAddingNewContact(false);
      return;
    }

    await addContact({
      variables: {
        first_name: data.first_name,
        last_name: data.last_name,
        phones: data.phones,
      },
      onCompleted: (response) => {
        if (favorite) {
          dispatch(addFavorite(response.insert_contact.returning[0].id));
        }
        onCloseAddModal();
        reset();
        toastHelper(`${data.first_name} added successfully!🎉`);
      },
      onError: (error) => {
        if (
          error.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          setNumberExists(true);
        }
      },
    });
    setIsFavorite(false);
    setIsAddingNewContact(false);
  };

  const [deleteContact] = useMutation(DeleteContactById, {
    variables: {
      id: deleteContactId,
    },
    refetchQueries: GET_CONTACT_QUERY,
    update: (cache) => {
      cache.evict({ id: `contact:${deleteContactId}` });
    },
  });

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteContact();
    dispatch(removeFavorite(deleteContactId));
    onCloseDeleteModal();
    setIsDeleting(false);
    toastHelper(`${deleteContactName} deleted successfully!👋`, "warn");
  };

  const contactQuery = useQuery(GET_CONTACT_QUERY[0].query, {
    variables: GET_CONTACT_QUERY[0].variables,
  });

  return (
    <>
      <AppHeader>
        <SearchBar
          setSearchTerm={setSearchTerm}
          placeholder={"Name or Phone: Seek and You Shall Find!"}
        />
      </AppHeader>
      <RowWrapper>
        <Col>
          <ContactList
            loading={contactQuery.loading}
            error={contactQuery.error}
            data={contactQuery.data}
            searchTerm={searchTerm}
            handleClickDelete={handleClickDelete}
          />
        </Col>
      </RowWrapper>
      <Modal
        isOpen={isOpenDeleteModal}
        onClose={onCloseDeleteModal}
        heading="Delete Contact"
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmButtonType="danger"
        isLoading={isDeleting}
      >
        <DeleteText>
          👋 Hold up! Are you sure you wanna remove <b>{deleteContactName}</b>{" "}
          from your contacts?{" "}
          <RequiredWarningText>
            This action can't be undone!
          </RequiredWarningText>
        </DeleteText>
        <br />
      </Modal>

      <Modal
        isOpen={isOpenAddModal}
        onClose={onCloseAddModal}
        heading="Add Contact"
        confirmText="Add"
        confirmButtonType="primary"
        onConfirm={handleSubmit(onSubmitNewContact)}
        isLoading={isAddingNewContact}
      >
        <AddForm>
          <SingleInformationWrapper>
            <SingleInformationLabel>
              First Name<RedStar>*</RedStar>
            </SingleInformationLabel>
            <Input
              type="text"
              placeholder="Ex: John"
              disabled={isAddingNewContact}
              {...register("first_name", {
                required: true,
                pattern: {
                  value: nameRegex,
                  message: "First Name should contain only letter and number",
                },
              })}
            />
            {errors.first_name && errors.first_name.type === "required" ? (
              <RequiredWarningText>First Name is Required</RequiredWarningText>
            ) : (
              <RequiredWarningText>
                {errors.first_name?.message}
              </RequiredWarningText>
            )}
            {nameExists && (
              <RequiredWarningText>
                Contact named "{existedName}" already exists
              </RequiredWarningText>
            )}
          </SingleInformationWrapper>
          <SingleInformationWrapper>
            <SingleInformationLabel>Last Name</SingleInformationLabel>
            <Input
              type="text"
              placeholder="Ex: Doe"
              disabled={isAddingNewContact}
              {...register("last_name", {
                pattern: {
                  value: nameRegex,
                  message: "Last Name should contain only letter and number",
                },
              })}
            />
            {errors.last_name && (
              <RequiredWarningText>
                {errors.last_name?.message}
              </RequiredWarningText>
            )}
            {nameExists && (
              <RequiredWarningText>
                Contact named "{existedName}" already exists
              </RequiredWarningText>
            )}
          </SingleInformationWrapper>
          <AddToFavoriteDiv>
            <AddToFavoriteButton
              checked={isFavorite}
              onlabel="Favorite"
              offlabel="Regular"
              width={125}
              disabled={isAddingNewContact}
              onChange={(checked: boolean) => {
                setIsFavorite(checked);
              }}
            />
            <AddToFavoriteText>*Click to add to favorite</AddToFavoriteText>
          </AddToFavoriteDiv>
          {fields.map((field, index) => (
            <SingleInformationWrapper key={field.id}>
              <SingleInformationLabel>
                Phone Number {index + 1}
                <RedStar>*</RedStar>
              </SingleInformationLabel>
              <PhoneNumberDiv>
                <PhoneNumberInput
                  type="number"
                  disabled={isAddingNewContact}
                  placeholder="Ex: 628123456789"
                  {...register(`phones.${index}.number` as const, {
                    required: true,
                  })}
                />
                {index > 0 && (
                  <PhoneNumberDeleteButton
                    variant="danger"
                    disabled={isAddingNewContact}
                    onClick={() => remove(index)}
                  >
                    Delete
                  </PhoneNumberDeleteButton>
                )}
              </PhoneNumberDiv>
              {errors.phones &&
                errors.phones[index] &&
                errors.phones[index]?.number && (
                  <RequiredWarningText>
                    Phone Number is Required
                  </RequiredWarningText>
                )}
            </SingleInformationWrapper>
          ))}
          {numberExists && (
            <RequiredWarningText>
              One of the phone number already exists
            </RequiredWarningText>
          )}
          <AddPhoneButton
            variant="primary"
            disabled={isAddingNewContact}
            onClick={() => append({ number: "" })}
          >
            Add Phone Number +
          </AddPhoneButton>
        </AddForm>
      </Modal>
      <FAB variant="primary" onClick={onOpenAddModal} aria-label="Add">
        <FontAwesomeIcon icon={faPlus} />
      </FAB>
    </>
  );
}