import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import {
  EditContactById,
  EditPhoneNumber,
  GetContactDetail,
  GetContactList,
} from "../GraphQL/queries";
import { AddNumberToContact } from "../GraphQL/mutations";
import { Contact } from "../Interfaces/Contact";
import { useSelector } from "react-redux";
import { selectFavorites } from "../redux/store";
import ContactFavoriteStar from "../Components/ContactFavoriteStar";
import styled from "@emotion/styled";
import { Row, Col } from "react-bootstrap";
import Button from "../Components/Button";
import { useFieldArray, useForm } from "react-hook-form";
import Input from "../Components/Input";
import Modal from "../Components/Modal";
import Preloader from "../Components/Preloader";
import ErrorPage from "../Components/ErrorPage";

type FormValues = {
  first_name: string;
  last_name: string;
  phones: {
    number: number|null;
  }[];
  favorite: boolean;
};

type FormValuesAddPhone = {
  number: string;
};

type UpdateNameType = {
  first_name?: string;
  last_name?: string;
};

const FavoriteStarWrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 15px;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
`;

const FavoriteStar = styled(ContactFavoriteStar)`
  width: 25px;
  height: 25px;
`;

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const RequiredWarningText = styled.span`
  color: red;
  width: 100%;
`;

const AddPhoneButton = styled(Button)`
  border: 1px dashed #06ba63;
  border-radius: 15px;
  color: #06ba63;
  font-size: 1rem;
  background-color: white !important;
  margin-top: 10px;
  width: 100%;
  margin-bottom: 70px;

  &:hover {
    background-color: #06ba63 !important;
    color: white;
    border: 1px solid #06ba63;
  }
`;

const SaveContactButton = styled(Button)`
  border: 1px solid #06ba63;
  border-radius: 15px;
  color: white;
  font-size: 1rem;
  background-color: #06ba63 !important;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
`;

export default function ContactDetailContainer() {
  const location = useLocation();
  const contactId = location.pathname.split("/")[2];

  const favoriteStatus = useSelector(selectFavorites);
  const isFavorite = favoriteStatus.includes(parseInt(contactId));

  const [originalPhones, setOriginalPhones] = useState<string[]>([]);
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");

  const [isOpenAddPhone, setIsOpenAddPhone] = useState(false);
  const [newNumberExists, setNewNumberExists] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [nameExists, setNameExists] = useState(false);
  const [existedName, setExistedName] = useState<string | null>(null);
  const [isAddingNewPhone, setIsAddingNewPhone] = useState(false);

  const nameRegex = /^[a-zA-Z0-9\s]*$/;

  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  useEffect(() => {}, [fields, originalPhones]);

  const {
    register: registerAddPhone,
    handleSubmit: handleSubmitAddPhone,
    formState: { errors: errorsAddPhone },
    reset: resetAddPhone,
  } = useForm<FormValuesAddPhone>({
    defaultValues: {
      number: "",
    },
  });

  const GET_CONTACT = [
    {
      query: GetContactDetail,
      variables: {
        id: contactId,
      },
    },
  ];

  const client = useApolloClient();


  const { loading, error, data } = useQuery(GET_CONTACT[0].query, {
    variables: GET_CONTACT[0].variables,
  });
  const [addNumberToContact] = useMutation(AddNumberToContact, {
    refetchQueries: GET_CONTACT,
  });
  const [editContactById] = useMutation(EditContactById, {
    refetchQueries: GET_CONTACT,
  });
  const [editPhoneNumber] = useMutation(EditPhoneNumber, {
    refetchQueries: GET_CONTACT,
  });

  useEffect(() => {
    if (!loading && !error && data.contact_by_pk) {
      const { first_name, last_name, phones }: Contact = data.contact_by_pk;
      setValue("first_name", first_name);
      setValue("last_name", last_name);
      setOriginalFirstName(first_name);
      setOriginalLastName(last_name);
      setOriginalPhones([]);
      phones.forEach((phone, index) => {
        //clear phones
        remove(index);
        append({ number: null });
        setValue(`phones.${index}.number`, parseInt(phone.number));
        setOriginalPhones((originalPhones) => [
          ...originalPhones,
          phone.number,
        ]);
      });
    }
  }, [loading, error, data, setValue, remove, append]);

  if (loading) return <><AppHeader /><Preloader /></>;
  if (error) return <><AppHeader /><ErrorPage /></>;

  if (!data.contact_by_pk) {
    navigate("/");
    return null;
  }

  const onSaveContact = async (data: FormValues) => {
    setIsSaving(true);
    setNameExists(false);

    const { first_name, last_name, phones } = data;

    const updateName: UpdateNameType = {
      first_name,
      last_name,
    };

    if (first_name === originalFirstName) {
      delete updateName.first_name;
    }
    if (last_name === originalLastName) {
      delete updateName.last_name;
    }

    if (updateName.first_name || updateName.last_name) {
      const { data: contactData } = await client.query({
        query: GetContactList,
        variables: {
          where: {
            _and: [
              { first_name: { _ilike: first_name } },
              { last_name: { _ilike: last_name } },
            ],
          },
        },
      });
      if(contactData.contact.length > 0) {
        setNameExists(true);
        setExistedName(`${first_name} ${last_name}`);
        setIsSaving(false);
        return;
      }
      await editContactById({
        variables: {
          id: parseInt(contactId),
          _set: { ...updateName },
        },
        onCompleted: (response) => {
          if (updateName.first_name) {
            setOriginalFirstName(updateName.first_name);
          }
          if (updateName.last_name) {
            setOriginalLastName(updateName.last_name);
          }
        },
      });
    }
    const updatePhones = phones
      .map((phone, index) => {
        if (phone.number?.toString() === originalPhones[index]) {
          return null;
        }
        return {
          pk_columns: {
            number: originalPhones[index],
            contact_id: parseInt(contactId),
          },
          new_phone_number: phone.number,
        };
      })
      .filter((updatedPhone) => updatedPhone !== null);

    if (updatePhones.length > 0) {
      updatePhones.forEach(async (newPhoneData) => {
        await editPhoneNumber({
          variables: {
            ...newPhoneData,
          },
        });
      });
    }

    setIsSaving(false);
  };

  const onCloseAddPhone = () => setIsOpenAddPhone(false);
  const onOpenAddPhone = () => setIsOpenAddPhone(true);

  const onSubmitNewPhone = async (data: { number: string }) => {
    setIsAddingNewPhone(true);
    setNewNumberExists(false);
    const { number } = data;
    await addNumberToContact({
      variables: {
        contact_id: parseInt(contactId),
        phone_number: number,
      },
      onCompleted: (response) => {
        //check if phone number already exists on the fields
        onCloseAddPhone();
        resetAddPhone();
      },
      onError: (error) => {
        if (
          error.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          setNewNumberExists(true);
        }
      },
    });
    setIsAddingNewPhone(false);
  };

  return (
    <>
      <AppHeader enableBackButton backRoute="/">
        <FavoriteStarWrapper>
          <FavoriteStar
            isFavorite={isFavorite}
            contactId={parseInt(contactId)}
          />
        </FavoriteStarWrapper>
      </AppHeader>
      <AddForm>
        <Row>
          <Col md={6}>
            <SingleInformationWrapper>
              <SingleInformationLabel>
                First Name<RedStar>*</RedStar>
              </SingleInformationLabel>
              <Input
                type="text"
                placeholder="First Name"
                disabled={isSaving}
                {...register("first_name", {
                  required: true,
                  pattern: {
                    value: nameRegex,
                    message: "First Name should contain only letter and number",
                  },
                })}
              />
              {errors.first_name && errors.first_name.type === "required" ? (
                <RequiredWarningText>
                  First Name is Required
                </RequiredWarningText>
              ) : (
                <RequiredWarningText>
                  {errors.first_name?.message}
                </RequiredWarningText>
              )}
              {nameExists && (
            <RequiredWarningText>Contact named "{existedName}" already exists</RequiredWarningText>
          )}
            </SingleInformationWrapper>
          </Col>
          <Col md={6}>
            <SingleInformationWrapper>
              <SingleInformationLabel>Last Name</SingleInformationLabel>
              <Input
                type="text"
                disabled={isSaving}
                placeholder="Last Name"
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
            <RequiredWarningText>Contact named "{existedName}" already exists</RequiredWarningText>
          )}
            </SingleInformationWrapper>
          </Col>
          {fields.map((phone, index) => (
            <Col xs={12} key={phone.id}>
              <SingleInformationWrapper>
                <SingleInformationLabel>
                  Phone Number {index + 1}
                  <RedStar>*</RedStar>
                </SingleInformationLabel>
                <Input
                  type="number"
                  disabled={isSaving}
                  placeholder="Phone Number"
                  {...register(`phones.${index}.number` as const, {
                    required: true,
                  })}
                />
                {errors.phones &&
                  errors.phones[index] &&
                  errors.phones[index]?.number && (
                    <RequiredWarningText>
                      Phone Number is Required
                    </RequiredWarningText>
                  )}
              </SingleInformationWrapper>
            </Col>
          ))}
          <Col>
            <AddPhoneButton variant="primary" onClick={onOpenAddPhone}>
              Add Phone Number +
            </AddPhoneButton>
          </Col>
        </Row>
      </AddForm>
      <SaveContactButton
        variant="primary"
        onClick={handleSubmit(onSaveContact)}
        isLoading={isSaving}
      >
        Save
      </SaveContactButton>

      <Modal
        isOpen={isOpenAddPhone}
        onClose={onCloseAddPhone}
        onConfirm={handleSubmitAddPhone(onSubmitNewPhone)}
        confirmText="Add"
        heading="Add New Phone Number"
        isLoading={isAddingNewPhone}
      >
        <AddForm>
          <SingleInformationWrapper>
            <SingleInformationLabel>
              Phone Number<RedStar>*</RedStar>
            </SingleInformationLabel>
            <Input
              type="number"
              placeholder="Phone Number"
              disabled={isAddingNewPhone}
              {...registerAddPhone("number", { required: true })}
            />
            {errorsAddPhone.number &&
              errorsAddPhone.number.type === "required" && (
                <RequiredWarningText>
                  Phone Number is Required
                </RequiredWarningText>
              )}
            {newNumberExists && (
              <RequiredWarningText>
                Phone Number already exists
              </RequiredWarningText>
            )}
          </SingleInformationWrapper>
        </AddForm>
      </Modal>
    </>
  );
}
