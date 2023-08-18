import styled from '@emotion/styled'
import React from 'react'
const SearchBarComponent = styled.input`
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 10px;
    width: 100%;
    margin: 0 auto;
    display: block;
    box-sizing: border-box;

    &:focus{
        outline: none;
        border: 2px solid #06BA63;
    }
`
interface SearchBarProps {
    setSearchTerm: (searchTerm: any) => void;
}
export default function SearchBar({setSearchTerm}: SearchBarProps) {
  return (
    <SearchBarComponent
        type="text"
        placeholder="Find by Name or Phone Number"
        onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
