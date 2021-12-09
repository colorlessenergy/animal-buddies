import { useRef, useEffect } from 'react';

import classes from './Modal.module.css';

const Modal = ({ isOpen, toggleModal, children }) => {
    const modalRef = useRef(null);
    const handleCloseModal = (event) => {
        if (modalRef.current === event.target) {
            toggleModal();
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-is-open');
        } else {
            document.body.classList.remove('modal-is-open');
        }

        return () => {
            document.body.classList.remove('modal-is-open');
        }
    }, [ isOpen ]);

    return (
       <div
        ref={ modalRef }
        onClick={ toggleModal === undefined ? (null) : (handleCloseModal) }
        className={`${ classes["modal"] } ${ isOpen ? classes["flex"] : "d-none" }`}>
           <div className={classes["modal-content"]}>
               { children }
            </div>
       </div>
    );
}

export default Modal;