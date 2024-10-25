import { ReactNode } from "react";
import './ItemCard.css';
import { useStompClient } from "./StompProvider";
import { TodoItem } from "../BackEndInterfaces";


function ItemCard({item}: {item: TodoItem}): ReactNode {
	const stompClient = useStompClient();
	
	const onCheckboxClick = () => {
		let modifiedItem: TodoItem = {
			id: item.id,
			title: item.title,
			creationDate: item.creationDate,
			lastUpdated: item.lastUpdated,
			markedAsDone: !item.markedAsDone // Flip mark 
		};
		stompClient.publish('/api/v1/update', JSON.stringify(modifiedItem));
	};
	
	const onDeleteClick = () => {
		let itemToDelete = {
			id: item.id
		};
		stompClient.publish('/api/v1/delete', JSON.stringify(itemToDelete));
	};
	
	return (
		<div className={"todo-item-wrapper" + (item.markedAsDone ? " completed" : "")}>
			<div className="left-section">
					<img className="check-box" src={item.markedAsDone ? "/images/checkbox-filled.svg" : "/images/checkbox-empty.svg"} 
							key={"checked-" + item.id} onClick={onCheckboxClick} />
					<p className="todo-item-text">{item.title}</p>
			</div>
			<div className="right-section">
				<img className="delete-icon" src="/images/delete.svg" onClick={onDeleteClick} />
			</div>
		</div>
	);
}

export default ItemCard;