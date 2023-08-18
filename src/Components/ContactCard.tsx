import React from "react";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { addFavorite, removeFavorite } from "../redux/store";
import { useDispatch } from "react-redux";

const ContactCardElement = styled(Link)`
  list-style: none;
  flex: 0 0 100%;
  border: 1px solid #ccc;
  border-radius: 15px;
  //box shadow
  padding: 10px;
  text-decoration: none;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  transition: 0.2s ease;


  &:hover {
    text-decoration: none;
    border: 2px solid #06BA63;
    transition: 0.2s ease;
  }

  @media (min-width: 768px) {
    flex: 0 0 45%;
  }

  @media (min-width: 992px) {
    flex: 0 0 30%;
  }
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
  return (
    <ContactCardElement to={`http://www.google.com`}>
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
    </ContactCardElement>
  );
}
