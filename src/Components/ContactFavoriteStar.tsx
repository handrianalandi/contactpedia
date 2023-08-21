import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { addFavorite, removeFavorite } from '../redux/store';
import { useDispatch } from 'react-redux';

interface ContactFavoriteStarProps {
    isFavorite: boolean;
    contactId: number;
}
export default function ContactFavoriteStar({isFavorite, contactId}: ContactFavoriteStarProps) {
    const dispatch = useDispatch();
    const handleStarClick = (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>
      ) => {
        event.preventDefault();
        if (isFavorite) {
          dispatch(removeFavorite(contactId));
        } else {
          dispatch(addFavorite(contactId));
        }
      };
  return (
    <FontAwesomeIcon
            icon={isFavorite ? faStar : farStar}
            color={isFavorite ? "orange" : "lightgrey"}
            onClick={handleStarClick}
          />
  )
}

