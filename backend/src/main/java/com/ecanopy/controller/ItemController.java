package com.ecanopy.controller;

import com.ecanopy.entity.Item;
import com.ecanopy.entity.User;
import com.ecanopy.repository.UserRepository;
import com.ecanopy.service.ItemService;
import com.ecanopy.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Marketplace", description = "Resident-to-Resident Marketplace")
public class ItemController {

    private final ItemService itemService;
    private final UserRepository userRepository;
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @PostMapping("/upload")
    @Operation(summary = "Post New Item", description = "Upload a new item with image and video")
    public ResponseEntity<Item> uploadItem(
            @RequestParam String itemName,
            @RequestParam String description,
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam Boolean negotiable,
            @RequestParam Long sellerId,
            @RequestParam(required = false) String category,
            @RequestParam MultipartFile image,
            @RequestParam(required = false) MultipartFile video) throws IOException {

        Files.createDirectories(this.fileStorageLocation.resolve("images"));
        Files.createDirectories(this.fileStorageLocation.resolve("videos"));

        String imageFileName = UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(image.getOriginalFilename());
        Path imageTarget = this.fileStorageLocation.resolve("images").resolve(imageFileName);
        Files.copy(image.getInputStream(), imageTarget, StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = "/uploads/images/" + imageFileName;

        String videoUrl = null;
        if (video != null && !video.isEmpty()) {
            String videoFileName = UUID.randomUUID().toString() + "_"
                    + StringUtils.cleanPath(video.getOriginalFilename());
            Path videoTarget = this.fileStorageLocation.resolve("videos").resolve(videoFileName);
            Files.copy(video.getInputStream(), videoTarget, StandardCopyOption.REPLACE_EXISTING);
            videoUrl = "/uploads/videos/" + videoFileName;
        }

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new NotFoundException("Seller not found"));

        Item item = Item.builder()
                .itemName(itemName)
                .description(description)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .negotiable(negotiable)
                .category(category != null ? category : "General")
                .imageUrl(imageUrl)
                .videoUrl(videoUrl)
                .seller(seller)
                .build();

        return ResponseEntity.ok(itemService.saveItem(item));
    }

    @GetMapping
    @Operation(summary = "Get All Items", description = "Retrieve all items listed in the marketplace")
    public ResponseEntity<List<Item>> getItems() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Item", description = "Remove an item from the marketplace")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
