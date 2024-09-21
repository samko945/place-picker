import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// Load existing places from localStorage as initial state pickedPlaces
const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place) => place.id === id));

export default function App() {
	const modal = useRef();
	// selectedPlace = id
	const selectedPlace = useRef();
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition((position) => {
			const sortedPlaces = sortPlacesByDistance(
				AVAILABLE_PLACES,
				position.coords.latitude,
				position.coords.longitude
			);

			setAvailablePlaces(sortedPlaces);
		});
	}, []);

	function handleStartRemovePlace(id) {
		modal.current.open();
		selectedPlace.current = id;
	}

	function handleStopRemovePlace() {
		modal.current.close();
	}

	function handleSelectPlace(id) {
		setPickedPlaces((prevPickedPlaces) => {
			if (prevPickedPlaces.some((place) => place.id === id)) {
				return prevPickedPlaces;
			}
			const place = AVAILABLE_PLACES.find((place) => place.id === id);
			return [place, ...prevPickedPlaces];
		});
		// retrieve places saved in localStorage
		const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
		// append new selected places to localStorage
		if (storedIds.indexOf(id) === -1) {
			localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedIds]));
		}
	}

	function handleRemovePlace() {
		setPickedPlaces((prevPickedPlaces) => prevPickedPlaces.filter((place) => place.id !== selectedPlace.current));
		modal.current.close();

		// retrieve places saved in localStorage
		const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
		// update localStorage, remove a place
		const updatedIds = storedIds.filter((id) => id !== selectedPlace.current);
		localStorage.setItem("selectedPlaces", JSON.stringify(updatedIds));
	}

	return (
		<>
			<Modal ref={modal}>
				<DeleteConfirmation onCancel={handleStopRemovePlace} onConfirm={handleRemovePlace} />
			</Modal>

			<header>
				<img src={logoImg} alt="Stylized globe" />
				<h1>PlacePicker</h1>
				<p>Create your personal collection of places you would like to visit or you have visited.</p>
			</header>
			<main>
				<Places
					title="I'd like to visit ..."
					fallbackText={"Select the places you would like to visit below."}
					places={pickedPlaces}
					onSelectPlace={handleStartRemovePlace}
				/>
				<Places
					title="Available Places"
					places={availablePlaces}
					fallbackText="Sorting places by distance..."
					onSelectPlace={handleSelectPlace}
				/>
			</main>
		</>
	);
}
