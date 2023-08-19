import styled from '@emotion/styled'
import React, { forwardRef } from 'react'
const InputComponent = styled.input`
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
interface InputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder: string;
    type: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ onChange, placeholder, ...restProps }, ref) => (
        <InputComponent
            ref={ref}
            placeholder={placeholder}
            onChange={onChange}
            {...restProps}
        />
    )
);

export default Input;