package com.matt.myTodoAppJavaSide.model;

import com.matt.myTodoAppJavaSide.dataclasses.TodoItem;

import java.util.ArrayList;

public class TodoItemStorageModel {

    ArrayList<TodoItem> items;

    public TodoItemStorageModel() {
        items = new ArrayList<>();
    }

    public void addItem(TodoItem item) {
        items.add(item);
    }

    public ArrayList<TodoItem> getItems() {
        return items;
    }

    public TodoItem getItem(int id) {
        for (TodoItem item : items) {
            if (item.id == id) return item;
        }
        return null;
    }

    public void deleteItem(int id) {
        items.removeIf((item) -> item.id == id);
    }

}
