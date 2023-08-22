import React from 'react'
import Input from './Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const SearchBarWrapper = styled.div`
  position: relative;
  width: 100%;
`
const InputElement = styled(Input)`
  width: 100%;
  padding-left: 2.5rem;
`
const SearchIcon = styled(FontAwesomeIcon)`
  height: 1.3rem;
  width: 1.3rem;
  position: absolute;
  left: .5rem;
  top:50%;
  transform: translateY(-50%);
  color: #656565;
`
interface SearchBarProps {
    placeholder?: string;
    setSearchTerm: (searchTerm: any) => void;
}
export default function SearchBar({placeholder="Search here",setSearchTerm}: SearchBarProps) {
  return (
    <SearchBarWrapper>
    <SearchIcon icon={faSearch} />
    <InputElement 
        type="text"
        data-testid="search-bar"
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
    </SearchBarWrapper>
  )
}
