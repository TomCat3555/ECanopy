package com.ecanopy.repository;

import com.ecanopy.entity.AccessLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessRepository extends JpaRepository<AccessLog, Long> {
    // Find latest log for a user to determine if next is ENTRY or EXIT
    Optional<AccessLog> findTopByUserOrderByTimestampDesc(com.ecanopy.entity.User user);

    Optional<AccessLog> findTopByDomesticHelpOrderByTimestampDesc(com.ecanopy.entity.DomesticHelp domesticHelp);
}
