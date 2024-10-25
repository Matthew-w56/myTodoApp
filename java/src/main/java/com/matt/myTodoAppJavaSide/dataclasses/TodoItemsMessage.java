package com.matt.myTodoAppJavaSide.dataclasses;

import java.util.ArrayList;
import java.util.List;

public class TodoItemsMessage {

    private List<TodoItem> items;

    public TodoItemsMessage(List<TodoItem> items) {
        this.items = items;
    }

    public TodoItemsMessage() {
        items = new ArrayList<>();
    }

    public List<TodoItem> getItems() {
        return items;
    }

    public void setItems(List<TodoItem> items) {
        this.items = items;
    }

}
