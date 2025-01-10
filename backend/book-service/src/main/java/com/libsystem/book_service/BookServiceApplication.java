package com.libsystem.book_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class BookServiceApplication {
	Dotenv dotenv = Dotenv.load();
	public static void main(String[] args) {
		SpringApplication.run(BookServiceApplication.class, args);
	}

}
