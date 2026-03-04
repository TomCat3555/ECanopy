package com.ecanopy.repository;

import com.ecanopy.entity.DailyHelpLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyHelpLogRepository extends JpaRepository<DailyHelpLog, Long> {
    List<DailyHelpLog> findByDomesticHelp_HelpId(Long helpId);

    java.util.Optional<DailyHelpLog> findTopByDomesticHelp_HelpIdAndExitTimeIsNullOrderByEntryTimeDesc(Long helpId);
}
