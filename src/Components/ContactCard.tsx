import React from "react";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { addFavorite, removeFavorite } from "../redux/store";
import { useDispatch } from "react-redux";
import { DeleteContactById } from "../GraphQL/mutations";
import { useMutation } from "@apollo/client";

const ContactCardElement = styled.div`
  flex: 0 0 100%;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
  text-decoration: none;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  transition: 0.5s ease;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    border: 2px solid #06ba63;
    transition: 0.5s ease;
  }

  @media (min-width: 768px) {
    flex: 0 0 45%;
  }

  @media (min-width: 992px) {
    flex: 0 0 30%;
  }
`;

const ContactCardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const ContactButtonWrapper = styled.div`
  content: "";
  flex: auto;
  width: 100%;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
  transition: height 5s ease;
  display: flex;
  justify-content: space-around;
`;

const ContactInformationWrapper = styled.div`
  flex: 0 0 90%;
`;
const FavoriteIconWrapper = styled.div`
  z-index: 999;
  display: flex;
  justify-content: end;
  align-items: center;
  flex: 0 0 10%;
`;

interface ContactCardProps extends Contact {
  isFavorite: boolean;
}

export default function ContactCard(contact: ContactCardProps) {
  const [visible, setVisible] = React.useState(false);
  const dispatch = useDispatch();
  const handleStarClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (contact.isFavorite) {
      dispatch(removeFavorite(contact.id));
    } else {
      dispatch(addFavorite(contact.id));
    }
  };

  const [deleteContact] = useMutation(DeleteContactById);

  const handleDeleteClick = (contactId: Number,isFavorite:boolean) => {
    deleteContact({
      variables: {
        id: contactId,
      },
      update: (cache) => {
        cache.evict({ id: `contact:${contactId}` });
      }
    });
    if(isFavorite){
      dispatch(removeFavorite(contactId));
    }
  };

  
  return (
    <ContactCardElement onClick={() => {
      setVisible(!visible);
    }}>
      <ContactCardWrapper>
        <ContactInformationWrapper>
          <div>
            <b>
              {contact.first_name} {contact.last_name}
            </b>
          </div>
          <div>
            {contact.phones.map((phone, index) => (
              <span key={index}>
                Phone {index + 1}: {phone.number}
                <br />
              </span>
            ))}
          </div>
        </ContactInformationWrapper>
        <FavoriteIconWrapper>
          <FontAwesomeIcon
            icon={faStar}
            color={contact.isFavorite ? "orange" : "lightgrey"}
            onClick={handleStarClick}
          />
        </FavoriteIconWrapper>
      </ContactCardWrapper>
      
      {visible && (<ContactButtonWrapper>
            <button className="">Edit</button>
            <button className="" onClick={() => handleDeleteClick(contact.id,contact.isFavorite)}>Delete</button>
      </ContactButtonWrapper>)}
    </ContactCardElement>
  );
}
