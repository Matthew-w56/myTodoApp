

export interface TodoItem {
	id: number,
	title: string,
	creationDate: string,
	lastUpdated: string,
	markedAsDone: boolean
}

export interface TodoItemsMessage {
	items: TodoItem[]
}

