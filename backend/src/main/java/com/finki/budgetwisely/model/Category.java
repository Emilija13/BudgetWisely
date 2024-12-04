package com.finki.budgetwisely.model;

import com.finki.budgetwisely.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "categories")
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String image;

    public Category(String name, String image){
        this.name = name;
        this.image = image;
    }
}
