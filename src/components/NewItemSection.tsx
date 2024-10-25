import { ReactNode, useRef } from "react";
import { useStompClient } from "./StompProvider";
import './NewItemSection.css';


function NewItemSection(): ReactNode {
	const stompClient = useStompClient();
	const textInputRef = useRef<HTMLInputElement | null>(null);
	
	const handleButtonClick = () => {
		let newNote = {
			title: textInputRef.current?.value ?? "My new note!"
		};
		if (newNote.title.length === 0) newNote.title = "My new note!";
		stompClient.publish('/api/v1/add', JSON.stringify(newNote));
		if (textInputRef.current) textInputRef.current.value = "";
	};
	
	return (
		<>
			<input className="new-item-text" type="text" ref={textInputRef} placeholder="What do you need to do?" />
			<button className="new-item-button" onClick={handleButtonClick}>
				+ New To-Do Item
			</button>
		</>
		
	);
}

export default NewItemSection;