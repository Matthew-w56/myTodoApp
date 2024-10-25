import { ReactNode, useEffect, useState } from "react";
import { TodoItem, TodoItemsMessage } from "../BackEndInterfaces";
import { useStompClient } from '../components/StompProvider';
import NewItemSection from "../components/NewItemSection";
import ItemCard from "../components/ItemCard";
import './ItemView.css';


function ItemView(): ReactNode {
	
	const stompClient = useStompClient();
	const [allItems, setAllItems] = useState<TodoItemsMessage | null>(null);
	
	useEffect(() => {
		// Subscribe to Websocket messages
		let allItemsSub = stompClient.subscribe('/topic/allItems', (message) => {
			let parsedResponse: TodoItemsMessage = JSON.parse(message.body);
			if (parsedResponse) setAllItems(parsedResponse);
		});
		let newItemSub = stompClient.subscribe('/topic/newItem', (message) => {
			let parsedResponse:TodoItem = JSON.parse(message.body);
			if (parsedResponse) setAllItems((prevItems) => {
				return {items: [...prevItems?.items ?? [], parsedResponse]}});
		});
		
		// Kick off the request for all the items that exist already
		stompClient.publish('/api/v1/items', '');
		
		// Return callback to unsubscribe to Websocket messages
		return () => {
			allItemsSub?.unsubscribe();
			newItemSub?.unsubscribe();
		};
	}, [stompClient]);
	
	return (
		<>
			<div className="item-view-wrapper">
				{
					allItems && allItems.items.filter((item) => !item.markedAsDone).map((item) => {
						return <ItemCard key={item.id} item={item} />;
					})
				}
				<NewItemSection />
				<div className="done-items-seperator" />
				{
					allItems && allItems.items.filter((item) => item.markedAsDone).map((item) => {
						return <ItemCard key={item.id} item={item} />;
					})
				}
			</div>
		</>
	);
}

export default ItemView;