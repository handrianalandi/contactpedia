import React from "react";
import { Contact } from "../Interfaces/Contact";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { addFavorite, removeFavorite } from "../redux/store";
import { useDispatch } from "react-redux";

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

const ContactButtonWrapper = styled.div<{visible: boolean}>`
  flex: auto;
  width: 100%;
  height: ${(props) => (props.visible ? "25px" : "0")};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
  border-top: 1px solid #ccc;
  padding-top: ${(props) => (props.visible ? "10px" : "0")};
  margin-top: ${(props) => (props.visible ? "10px" : "0")};
  transition: height .2s linear, padding .2s linear, margin .2s linear, visibility .1s linear;
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
  handleClickDelete: (contactId: number, contactName: string) => void;
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

  // const [deleteContact] = useMutation(DeleteContactById);

  // const handleDeleteClick = (contactId: Number, isFavorite: boolean) => {
  //   deleteContact({
  //     variables: {
  //       id: contactId,
  //     },
  //     update: (cache) => {
  //       cache.evict({ id: `contact:${contactId}` });
  //     },
  //   });
  //   if (isFavorite) {
  //     dispatch(removeFavorite(contactId));
  //   }
  // };

  return (
    <ContactCardElement
      onClick={() => {
        setVisible(!visible);
      }}
    >
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
      <ContactButtonWrapper visible={visible}>
            <FontAwesomeIcon
              icon={faCircleInfo}
              color={"grey"}
            />
            <FontAwesomeIcon
            icon={faTrash}
            color={"grey"}
            onClick={() => {
              contact.handleClickDelete(contact.id, `${contact.first_name} ${contact.last_name}`);
            }}
          />
        </ContactButtonWrapper>
        
    </ContactCardElement>
  );
}
