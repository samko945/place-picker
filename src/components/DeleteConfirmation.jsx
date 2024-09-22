import { useEffect } from "react";

export default function DeleteConfirmation({ onConfirm, onCancel }) {
	// Confirm the modal automatically after 3000ms
	// use useCallback hook on functions passed as dependencies, in this case it's the handleRemovePlace function definition that needs to be passed into useCallback
	//    otherwise this will create an infinite loop if this component is not removed manually with conditional rendering
	useEffect(() => {
		const timer = setTimeout(() => {
			onConfirm();
		}, 3000);
		// cleanup function runs before component dismounts
		return () => {
			clearTimeout(timer);
		};
	}, [onConfirm]);

	return (
		<div id="delete-confirmation">
			<h2>Are you sure?</h2>
			<p>Do you really want to remove this place?</p>
			<div id="confirmation-actions">
				<button onClick={onCancel} className="button-text">
					No
				</button>
				<button onClick={onConfirm} className="button">
					Yes
				</button>
			</div>
		</div>
	);
}
