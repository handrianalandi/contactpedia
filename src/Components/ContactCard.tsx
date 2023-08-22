import React from "react";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import {
  faCircleInfo,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ContactFavoriteStar from "./ContactFavoriteStar";

const ContactCardElement = styled.div<{ visible: boolean, favorite: boolean }>`
  flex: 0 0 100%;
  border: ${(props) =>
    props.visible ? "1px solid #06ba63" : "1px solid #ccc"};
  border-top: ${(props) =>
    props.favorite ? "5px solid #06ba63" : props.visible?"1px solid #06ba63" : "1px solid #ccc"};
  border-radius: 15px;
  padding: 10px;
  text-decoration: none;
  background: white;
  color: #000;
  display: flex;
  flex-wrap: wrap;
  transition: 0.5s linear;
  cursor: pointer;

  &:hover {
    text-decoration: none;
    transition: 0.5s linear;
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

const ContactButtonWrapper = styled.div<{ visible: boolean }>`
  flex: auto;
  width: 100%;
  height: ${(props) => (props.visible ? "25px" : "0")};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  border-top: 1px solid #ccc;
  padding-top: ${(props) => (props.visible ? "10px" : "0")};
  margin-top: ${(props) => (props.visible ? "10px" : "0")};
  transition: height 0.2s linear, padding 0.2s linear, margin 0.2s linear,
    visibility 0.1s linear;
  display: flex;
  justify-content: space-around;
`;

const ContactInformationWrapper = styled.div`
  flex: 0 0 90%;
`;
const FavoriteIconWrapper = styled.div`
  z-index: 2;
  display: flex;
  justify-content: end;
  align-items: center;
  flex: 0 0 10%;
`;

const PhoneLink = styled(Link)`
  color: green;
`

interface ContactCardProps extends Contact {
  isFavorite?: boolean;
  handleClickDelete: (contactId: number, contactName: string) => void;
}

export default function ContactCard({
  id,
  isFavorite=false,
  first_name,
  last_name,
  phones,
  handleClickDelete}: ContactCardProps) {
  const [visible, setVisible] = React.useState(false);

  const navigate = useNavigate();
  const handleContactClick = () => {
    navigate(`/contact/${id}`);
  };

  return (
    <ContactCardElement visible={visible} favorite={isFavorite}>
      <ContactCardWrapper>
        <ContactInformationWrapper
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <div>
            <b>
              {first_name} {last_name}
            </b>
          </div>
          <div>
            {phones.map((phone, index) => (
              <span key={index}>
                Phone {index + 1}: <PhoneLink target="_blank" rel="noopener noreferrer" to={`https://wa.me/${phone.number}`}>{phone.number}</PhoneLink>
                <br />
              </span>
            ))}
          </div>
        </ContactInformationWrapper>
        <FavoriteIconWrapper>
          <ContactFavoriteStar
            isFavorite={isFavorite}
            contactId={id}
          />
        </FavoriteIconWrapper>
      </ContactCardWrapper>
      <ContactButtonWrapper visible={visible}>
        <FontAwesomeIcon 
        icon={faCircleInfo} 
        color={"grey"} 
        onClick={handleContactClick}
        />
        <FontAwesomeIcon
          icon={faTrash}
          color={"grey"}
          data-testid="delete-contact-button"
          onClick={() => {
            handleClickDelete(
              id,
              `${first_name} ${last_name}`
            );
          }}
        />
      </ContactButtonWrapper>
    </ContactCardElement>
  );
}
