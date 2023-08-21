import React from 'react'
import errorVectorImage from '../assets/error_vector.png'
import styled from '@emotion/styled'
import { Link, useNavigate } from 'react-router-dom'
import Button from './Button'

const ErrorPageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
`
const ErrorImage = styled.img`
    width: 50vw;
    max-width: 250px;
`

const ErrorTitle = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    font-style: italic;
    text-align: center;
`

const ErrorDescription = styled.p`
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    text-align: center;
`

const ErrorLink = styled(Link)`
    color: #06ba63;
`

export default function ErrorPage() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate('/');
    }
    const reload = () => {
        navigate(window.location.pathname);
    }
  return (
    <ErrorPageWrapper>
        <ErrorImage src={errorVectorImage} alt="Error" />
        <ErrorTitle>Oops! Something went wrong.</ErrorTitle>
        <ErrorDescription>Please <ErrorLink to={'#'} onClick={reload}>refresh</ErrorLink> this page or try again later</ErrorDescription>
        <Button onClick={goBack}>Back to Home</Button>
    </ErrorPageWrapper>
  )
}
