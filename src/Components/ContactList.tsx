import { QueryResult } from "@apollo/client";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import ContactCard from "./ContactCard";
import { useSelector } from "react-redux";
import { selectFavorites } from "../redux/store";
import { useState } from "react";
import ReactPaginate from "react-paginate";

const ContactWrapper = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 0%;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    gap: 10px 10%;
  }

  @media (min-width: 992px) {
    gap: 10px 5%;
  }
`;

const ContactPagination = styled(ReactPaginate)`
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  gap: 10px;
  margin-bottom: 10px;
  & li {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    cursor: pointer;

    & a {
      text-decoration: none;
      color: white;
    }

    &.previous,
    &.next,
    &.selected {
      background-color: #06ba63;
      font-weight: 500;
      color: white;
    }
  }
`;

interface ContactListProps extends QueryResult {
  handleClickDelete: (contactId: number, contactName: string) => void;
}

const ContactList = (contactQuery: ContactListProps) => {
  const { loading, error, data, handleClickDelete } = contactQuery;
  const favoriteStatus = useSelector(selectFavorites);

  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contactPerPage, setContactPerPage] = useState(9);
  const indexOfLastContact = currentPage * contactPerPage;
  const indexOfFirstContact = indexOfLastContact - contactPerPage;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Oopsie! Fail to load the contact.</p>;
  const contacts = data.contact;
  const favoriteContacts = contacts.filter((contact: Contact) =>
    favoriteStatus.includes(contact.id)
  );

  const nonFavoriteContacts = contacts.filter(
    (contact: Contact) => !favoriteStatus.includes(contact.id)
  );

  const currentContacts = nonFavoriteContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalContacts = nonFavoriteContacts.length;

  return (
    <div>
      {favoriteContacts.length > 0 ? (
        <ContactWrapper>
          {favoriteContacts.map((contact: Contact) => (
            <ContactCard key={contact.id} isFavorite {...contact} handleClickDelete={handleClickDelete}>
              {contact.first_name} {contact.last_name}
              <br />
              {contact.phones.map((phone, index) => (
                <span key={index}>
                  {phone.number}
                  <br />
                </span>
              ))}
            </ContactCard>
          ))}
        </ContactWrapper>
      ) : (
        <p>You have no favorite contact.</p>
      )}
      {nonFavoriteContacts.length > 0 ? (
        <ContactWrapper>
          {currentContacts.map((contact: Contact) => (
            <ContactCard key={contact.id} isFavorite={false} {...contact} handleClickDelete={handleClickDelete}>
              {contact.first_name} {contact.last_name}
              <br />
              {contact.phones.map((phone, index) => (
                <span key={index}>
                  {phone.number}
                  <br />
                </span>
              ))}
            </ContactCard>
          ))}
        </ContactWrapper>
      ) : (
        <p>You have no contact.</p>
      )}
      <ContactPagination
        breakLabel="..."
        onPageChange={(page) => setCurrentPage(page.selected + 1)}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(totalContacts / contactPerPage)}
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default ContactList;
