import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Overlay, ModalWindow } from "./Modal.styled";

const modalRoot = document.querySelector("#modal-root");

export default function Modal({ chooseImage, onClose }) {
  useEffect(() => {
    const onClickForEscape = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onClickForEscape);

    return () => {
      window.removeEventListener("keydown", onClickForEscape);
    };
  }, [onClose]);

  const onClickForOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={onClickForOverlay}>
      <ModalWindow>
        <img src={chooseImage.url} alt={chooseImage.alt} />
      </ModalWindow>
    </Overlay>,
    modalRoot
  );
}
