package com.matt.myTodoAppJavaSide.controller;

import com.matt.myTodoAppJavaSide.dataclasses.*;
import com.matt.myTodoAppJavaSide.model.TodoItemStorageModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TodoAppController {

    @Autowired
    private ApplicationContext appContext;
    @Autowired
    private TodoItemStorageModel storageModel;

    @MessageMapping("/items")
    @SendTo("/topic/allItems")
    public TodoItemsMessage getTodoItems() {
        return new TodoItemsMessage(storageModel.getItems());
    }

    // Only the title is expected to be set here
    @MessageMapping("/add")
    @SendTo("/topic/newItem")
    public TodoItem addTodoItem(TodoItem request) {
        TodoItem newItem = new TodoItem(request.getTitle(), null, null, null, null);
        storageModel.addItem(newItem);
        return newItem;
    }

    // Only the ID is expected to be set here
    @MessageMapping("/update")
    @SendTo("/topic/allItems")
    public TodoItemsMessage updateItem(TodoItem request) {
        int id = request.id;
        TodoItem item = storageModel.getItem(id);
        if (item == null) return new TodoItemsMessage(storageModel.getItems());
        item.followDifferences(request);
        return new TodoItemsMessage(storageModel.getItems());
    }

    // Only the ID is expected to be set here
    @MessageMapping("/delete")
    @SendTo("/topic/allItems")
    public TodoItemsMessage deleteTodoItem(TodoItem request) {
        int id = request.id;
        TodoItem item = storageModel.getItem(id);
        if (item == null) return new TodoItemsMessage(storageModel.getItems());
        storageModel.deleteItem(id);
        return new TodoItemsMessage(storageModel.getItems());
    }

    @MessageMapping("/killServer")
    public void killServer() {
        System.out.println("Received call to end server! Killing now.");
        SpringApplication.exit(appContext);
    }

}
