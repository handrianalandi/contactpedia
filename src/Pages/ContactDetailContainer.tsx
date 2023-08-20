import React from "react";
import { useLocation } from "react-router-dom";
import AppHeader from "../Components/AppHeader";
import { useQuery } from "@apollo/client";
import { GetContactDetail } from "../GraphQL/queries";
import { Contact } from "../Interfaces/Contact";

export default function ContactDetailContainer() {
  const location = useLocation();
  const contactId = location.pathname.split("/")[1];
  const {loading,error,data} = useQuery(GetContactDetail,{
    variables: {
      id: contactId
    }
  })
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oopsie! Fail to load the contact.</p>;

  const {first_name, last_name, phones}: Contact = data.contact_by_pk;
  return (
    <>
      <AppHeader
      enableBackButton
      backRoute="/"
      >
      {first_name} {last_name}
      </AppHeader>
      <div>
        {phones.map((phone, index) => (
          <span key={index}>
            Phone {index + 1}: {phone.number}
            <br />
          </span>
        ))}
      </div>
    </>
  );
}
