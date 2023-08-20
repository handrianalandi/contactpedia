import React from 'react'
import { useLocation } from 'react-router-dom'

export default function ContactDetailContainer() {
    const location = useLocation();
    const contactId = location.pathname.split("/")[1];
  return (
    <div>{contactId}</div>
  )
}
