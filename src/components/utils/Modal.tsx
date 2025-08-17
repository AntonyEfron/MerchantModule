const Modal = ({ children, onClose }) => {
    return (
      <>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
          {children}
          </>
    );
  };
  
  export default Modal;
  