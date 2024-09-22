import { useState, useEffect } from "react";

export default function ProgressBar({ timer }) {
	const [remainingTime, setRemainingTime] = useState(timer);

	// Update remainingTime every 10ms
	useEffect(() => {
		const interval = setInterval(() => {
			setRemainingTime((prev) => prev - 10);
		}, 10);
		return () => {
			clearInterval(interval);
		};
	}, []);
	return <progress value={remainingTime} max={timer} />;
}
