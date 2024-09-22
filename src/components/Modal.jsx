import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose }) {
	const dialog = useRef();

	// runs after the component has been rendered and the ref is attached
	useEffect(() => {
		if (open) {
			dialog.current.showModal();
		} else {
			dialog.current.close();
		}
	}, [open]);

	return createPortal(
		<dialog className="modal" ref={dialog} onClose={onClose}>
			{children}
		</dialog>,
		document.getElementById("modal")
	);
}
