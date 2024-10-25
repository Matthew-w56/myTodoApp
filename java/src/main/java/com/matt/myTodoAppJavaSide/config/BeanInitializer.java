package com.matt.myTodoAppJavaSide.config;

import com.matt.myTodoAppJavaSide.model.TodoItemStorageModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BeanInitializer {

    @Bean
    public TodoItemStorageModel itemStorageModel() {
        return new TodoItemStorageModel();
    }

}
