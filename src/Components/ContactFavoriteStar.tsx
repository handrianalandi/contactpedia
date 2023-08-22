import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { addFavorite, removeFavorite } from "../redux/store";
import { useDispatch } from "react-redux";
import { toastHelper } from "../helper/toastHelper";

interface ContactFavoriteStarProps {
  isFavorite: boolean;
  contactId: number;
}
export default function ContactFavoriteStar({
  isFavorite,
  contactId,
}: ContactFavoriteStarProps) {
  const dispatch = useDispatch();
  const handleStarClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (isFavorite) {
      dispatch(removeFavorite(contactId));
      toastHelper("Contact removed from favorites!👋", "warn", 1500);
    } else {
      dispatch(addFavorite(contactId));
      toastHelper("Contact added to favorites!🎉", "success", 1500);
    }
  };
  return (
    <FontAwesomeIcon
      icon={isFavorite ? faStar : farStar}
      color={isFavorite ? "orange" : "lightgrey"}
      data-testid="favorite-star"
      onClick={handleStarClick}
    />
  );
}
