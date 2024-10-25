package com.matt.myTodoAppJavaSide.dataclasses;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public class TodoItem {

    private static int nextId = 1;

    public  final int           id;
    private       String        title;
    private final LocalDateTime creationDate;
    private       LocalDateTime lastUpdated;
    private       boolean       markedAsDone;

    /**
     * Creates a new Item with all the information that it holds.  This holds the assumption that
     * we are just creating a new object for an existing object, since you otherwise wouldn't specify
     * the ID.
     *
     * @param title The title of the Item
     * @param creationDate The date/time that the Item was first created
     * @param lastUpdated The date/time that the Item was last updated
     * @param isDone Whether this Item is marked as done
     * @param id The ID of the existing Item
     */
    @JsonCreator
    public TodoItem(
            @JsonProperty(value="title") String title,
            @JsonProperty(value="creationDate") LocalDateTime creationDate,
            @JsonProperty(value="lastUpdated") LocalDateTime lastUpdated,
            @JsonProperty(value="isDone") Boolean isDone,
            @JsonProperty(value="id") Integer id) {
        this.title = title != null ? title : "";
        this.creationDate = creationDate != null ? creationDate : LocalDateTime.now();
        this.lastUpdated = lastUpdated != null ? lastUpdated : LocalDateTime.now();
        this.markedAsDone = isDone != null ? isDone : false;
        this.id = id != null ? id : nextId++;
    }

    /**
     * Updates the last updated timestamp to now, marking that a change just occurred.
     */
    private void markNewUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }

    /**
     * Sets any values that differ from the input to match the input
     */
    public void followDifferences(TodoItem other) {
        if (!other.title.equals(title)) setTitle(other.title);
        if (other.markedAsDone != markedAsDone) toggleMarkedAsDone();
    }

    // Getters and Setters beyond here ------------------------------------------------------------

    public String getTitle() {
        return title;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public boolean getMarkedAsDone() {
        return markedAsDone;
    }

    // (No setter for creation date)
    // (No explicit setter for last updated date)

    public void setTitle(String title) {
        if (!title.equals(this.title)) markNewUpdate();
        this.title = title;
    }

    public void toggleMarkedAsDone() {
        markNewUpdate();
        markedAsDone = !markedAsDone;
    }

}
