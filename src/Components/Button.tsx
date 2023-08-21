import React from 'react'
import { Button as ButtonElement } from 'react-bootstrap'
import Spinner from './Spinner';

interface ButtonProps {
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    variant?: string;
    isLoading?: boolean;
}
export default function Button({isLoading=false,children, ...restProps}: ButtonProps) {
  return (
    <ButtonElement 
        {...restProps}
        disabled={isLoading}
    >
        {isLoading ? <Spinner size='sm' isInvertedColor/> : children}
    </ButtonElement>
  )
}
