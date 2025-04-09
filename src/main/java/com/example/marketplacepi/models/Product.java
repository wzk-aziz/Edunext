package com.example.marketplacepi.models;

import com.example.marketplacepi.dto.ProductDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@AllArgsConstructor
@Builder(toBuilder = true)
@NoArgsConstructor
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private Long price;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @Lob
    @Column(columnDefinition = "mediumblob")        // current limit : 16MB____use longblob for 4gb size (postgres)
    private byte[] img;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Category category;
    @Column(name = "pdf_path")  // Nouveau champ pour le PDF
    private String pdfPath;


    //	TODO  : add mapstruct
    public ProductDto getDto() {
        return ProductDto.builder()
                .id(this.id)  // Ensure the ID is being correctly assigned here
                .name(this.name)
                .price(this.price)
                .description(this.description)
                .byteImg(this.img)
                .categoryId(this.category.getId())
                .categoryName(this.category.getName())
                .build();
    }


}
