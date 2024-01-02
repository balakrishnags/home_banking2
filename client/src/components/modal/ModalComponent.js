import React from "react";
import { Modal } from "react-bootstrap";

export const ModalComponent = (props) => {
  const { show, size, onHide, modal_header, modal_body } = props;
  return (
    <Modal size={size} show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {modal_header && <Modal.Title>
          {modal_header}
        </Modal.Title>}
      </Modal.Header>
      <Modal.Body>{modal_body}</Modal.Body>
    </Modal>
  );
};
