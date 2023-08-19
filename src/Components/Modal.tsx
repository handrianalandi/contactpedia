import styled from "@emotion/styled";
import React, { ForwardedRef, forwardRef } from "react";
import { Button, Modal as ModalElement } from "react-bootstrap";

const ModalStyle = styled(ModalElement)`
  @keyframes slideInFromBottom {
    0% {
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0);
    }
  }

  & .modal-dialog {
    position: fixed;
    top: auto;
    right: auto;
    left: auto;
    bottom: 0;
    width: 100%;
    margin: 0;
    max-height: 90vh;

    & .modal-body {
      max-height: 70vh;
      overflow-y: auto;
    }
  }

  & .modal-content {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    animation: 0.3s ease-out 0s 1 slideInFromBottom;
  }

  & .modal-footer {
    border-top: none;
    & .btn-primary {
      background-color: #06ba63;
      border: 1px solid #06ba63;
      font-weight: 500;
    }
  }

  & .modal-header {
    border-bottom: none;
  }

  @media (min-width: 768px) {
    & .modal-dialog {
      position: relative;
      display: flex;
      align-items: center;
      margin-right: auto;
      margin-left: auto;
      height: 100%;
    }

    & .modal-content {
      border-radius: var(--bs-modal-border-radius);
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  heading?: string;
  confirmText?: string;
  confirmButtonType?: "primary" | "danger";
  onClose: () => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export default function Modal({
  isOpen,
  heading,
  confirmText = "Confirm",
  confirmButtonType = "primary",
  onClose,
  onConfirm,
  children,
}: ModalProps) {
  return (
    <ModalStyle show={isOpen} onHide={onClose}>
      {heading && (
        <ModalElement.Header closeButton>
          <ModalElement.Title>{heading}</ModalElement.Title>
        </ModalElement.Header>
      )}
      <ModalElement.Body>
        {children}
    </ModalElement.Body>
      <ModalElement.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Close
        </Button>
        <Button className="confirmBtn" variant={confirmButtonType} onClick={onConfirm}>
          {confirmText}
        </Button>
      </ModalElement.Footer>
    </ModalStyle>
  );
}