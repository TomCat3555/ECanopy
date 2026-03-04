package com.ecanopy.repository;

import com.ecanopy.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findBySeller_IdOrderByCreatedAtDesc(Long userId);

    List<Item> findByCategory(String category);

    List<Item> findByStatus(com.ecanopy.entity.enums.ItemStatus status);
}
