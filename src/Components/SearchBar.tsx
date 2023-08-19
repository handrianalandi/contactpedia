import React from 'react'
import Input from './Input';

interface SearchBarProps {
    setSearchTerm: (searchTerm: any) => void;
}
export default function SearchBar({setSearchTerm}: SearchBarProps) {
  return (
    <Input 
        type="text"
        placeholder="Find by Name or Phone Number"
        onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
