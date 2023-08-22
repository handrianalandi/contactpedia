import { ApolloError } from "@apollo/client";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import ContactCard from "./ContactCard";
import { useSelector } from "react-redux";
import { selectFavorites } from "../redux/store";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import Preloader from "./Preloader";
import ErrorPage from "./ErrorPage";
import EmptyData from "./EmptyData";

const ContactWrapper = styled.div`
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

    &.disabled {
      & a {
        color: #ccc;
      }
    }

    & a {
      text-decoration: none;
      color: black;
    }

    &.selected {
      background-color: #06ba63;
      font-weight: 500;
      color: white;
    }

    &.previous,
    &.next {
      border: none;
      font-weight: 500;
      background-color: transparent;
    }
  }
`;

const ContactSegmentTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ContactSegmentWrapper = styled.div`
  background-color: #f0f8f1;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 10px;
`;

interface ContactListProps {
  loading: boolean;
  error: ApolloError | undefined;
  data: {
    contact: Contact[];
  };
  handleClickDelete: (contactId: number, contactName: string) => void;
  searchTerm?: string;
}

const ContactList = (contactQuery: ContactListProps) => {
  const {
    loading,
    error,
    data,
    handleClickDelete,
    searchTerm = "",
  } = contactQuery;
  const favoriteStatus = useSelector(selectFavorites);

  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contactPerPage, setContactPerPage] = useState(10);
  const indexOfLastContact = currentPage * contactPerPage;
  const indexOfFirstContact = indexOfLastContact - contactPerPage;

  if (loading) return <Preloader />;
  if (error) return <ErrorPage />;
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
      <ContactSegmentWrapper>
        <ContactSegmentTitle>Favorite</ContactSegmentTitle>
        {favoriteContacts.length > 0 ? (
          <ContactWrapper>
            {favoriteContacts.map((contact: Contact) => (
              <ContactCard
                key={contact.id}
                isFavorite
                {...contact}
                handleClickDelete={handleClickDelete}
              >
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
          <EmptyData
            text={
              searchTerm === ""
                ? "You don't have a favorite buddies!🌟"
                : `You have no favorite buddy named ${searchTerm}!`
            }
          />
        )}
      </ContactSegmentWrapper>
      <ContactSegmentWrapper>
        <ContactSegmentTitle>Regular</ContactSegmentTitle>
        {nonFavoriteContacts.length > 0 ? (
          <ContactWrapper>
            {currentContacts.map((contact: Contact) => (
              <ContactCard
                key={contact.id}
                isFavorite={false}
                {...contact}
                handleClickDelete={handleClickDelete}
              >
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
          <EmptyData
            text={
              searchTerm === ""
                ? "Uh-oh! It seems you haven't added any buddies to your contact list.😔"
                : `You have no buddy named ${searchTerm}!`
            }
          />
        )}
        <ContactPagination
          breakLabel="..."
          onPageChange={(page) => setCurrentPage(page.selected + 1)}
          pageRangeDisplayed={5}
          pageCount={Math.ceil(totalContacts / contactPerPage)}
          renderOnZeroPageCount={null}
          previousLabel={"<"}
          nextLabel={">"}
        />
      </ContactSegmentWrapper>
    </div>
  );
};

export default ContactList;
