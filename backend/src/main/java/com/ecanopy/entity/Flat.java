package com.ecanopy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

/**
 * Flat Entity
 * Represents individual residential units
 */
@Entity
@Table(name = "flats", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "building_id", "flat_number" })
})
public class Flat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long flatId;

    @NotBlank(message = "Flat number is required")
    @Column(nullable = false, length = 20)
    private String flatNumber;

    @Min(value = 0, message = "Floor must be non-negative")
    @Column(nullable = false)
    private Integer floor;

    @Column(precision = 8, scale = 2)
    private BigDecimal area;

    @Min(value = 0, message = "Bedrooms must be non-negative")
    private Integer bedrooms;

    @Min(value = 1, message = "Max resident must be at least 1")
    @Column(nullable = false)
    private Integer maxResident = 4;

    @Column(nullable = false)
    private Boolean isOccupied = false;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;

    @OneToMany(mappedBy = "flat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Resident> residents = new HashSet<>();

    @OneToMany(mappedBy = "flat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MaintenanceBill> maintenanceBills = new HashSet<>();

    @OneToMany(mappedBy = "flat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VisitorLog> visitorLogs = new HashSet<>();

    @ManyToMany(mappedBy = "flats")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<DomesticHelp> domesticHelps = new HashSet<>();

    public Flat() {
    }

    public Flat(Long flatId, String flatNumber, Integer floor, BigDecimal area, Integer bedrooms, Integer maxResident,
            Boolean isOccupied, Building building, Set<Resident> residents, Set<MaintenanceBill> maintenanceBills,
            Set<VisitorLog> visitorLogs, Set<DomesticHelp> domesticHelps) {
        this.flatId = flatId;
        this.flatNumber = flatNumber;
        this.floor = floor;
        this.area = area;
        this.bedrooms = bedrooms;
        this.maxResident = maxResident != null ? maxResident : 4;
        this.isOccupied = isOccupied != null ? isOccupied : false;
        this.building = building;
        this.residents = residents != null ? residents : new HashSet<>();
        this.maintenanceBills = maintenanceBills != null ? maintenanceBills : new HashSet<>();
        this.visitorLogs = visitorLogs != null ? visitorLogs : new HashSet<>();
        this.domesticHelps = domesticHelps != null ? domesticHelps : new HashSet<>();
    }

    public static FlatBuilder builder() {
        return new FlatBuilder();
    }

    public Long getFlatId() {
        return flatId;
    }

    public void setFlatId(Long flatId) {
        this.flatId = flatId;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public BigDecimal getArea() {
        return area;
    }

    public void setArea(BigDecimal area) {
        this.area = area;
    }

    public Integer getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(Integer bedrooms) {
        this.bedrooms = bedrooms;
    }

    public Integer getMaxResident() {
        return maxResident;
    }

    public void setMaxResident(Integer maxResident) {
        this.maxResident = maxResident;
    }

    public Boolean getIsOccupied() {
        return isOccupied;
    }

    public void setIsOccupied(Boolean isOccupied) {
        this.isOccupied = isOccupied;
    }

    public Building getBuilding() {
        return building;
    }

    public void setBuilding(Building building) {
        this.building = building;
    }

    public Set<Resident> getResidents() {
        return residents;
    }

    public void setResidents(Set<Resident> residents) {
        this.residents = residents;
    }

    public Set<MaintenanceBill> getMaintenanceBills() {
        return maintenanceBills;
    }

    public void setMaintenanceBills(Set<MaintenanceBill> maintenanceBills) {
        this.maintenanceBills = maintenanceBills;
    }

    public Set<VisitorLog> getVisitorLogs() {
        return visitorLogs;
    }

    public void setVisitorLogs(Set<VisitorLog> visitorLogs) {
        this.visitorLogs = visitorLogs;
    }

    public Set<DomesticHelp> getDomesticHelps() {
        return domesticHelps;
    }

    public void setDomesticHelps(Set<DomesticHelp> domesticHelps) {
        this.domesticHelps = domesticHelps;
    }

    public static class FlatBuilder {
        private Long flatId;
        private String flatNumber;
        private Integer floor;
        private BigDecimal area;
        private Integer bedrooms;
        private Integer maxResident;
        private Boolean isOccupied;
        private Building building;
        private Set<Resident> residents;
        private Set<MaintenanceBill> maintenanceBills;
        private Set<VisitorLog> visitorLogs;
        private Set<DomesticHelp> domesticHelps;

        FlatBuilder() {
        }

        public FlatBuilder flatId(Long flatId) {
            this.flatId = flatId;
            return this;
        }

        public FlatBuilder flatNumber(String flatNumber) {
            this.flatNumber = flatNumber;
            return this;
        }

        public FlatBuilder floor(Integer floor) {
            this.floor = floor;
            return this;
        }

        public FlatBuilder area(BigDecimal area) {
            this.area = area;
            return this;
        }

        public FlatBuilder bedrooms(Integer bedrooms) {
            this.bedrooms = bedrooms;
            return this;
        }

        public FlatBuilder maxResident(Integer maxResident) {
            this.maxResident = maxResident;
            return this;
        }

        public FlatBuilder isOccupied(Boolean isOccupied) {
            this.isOccupied = isOccupied;
            return this;
        }

        public FlatBuilder building(Building building) {
            this.building = building;
            return this;
        }

        public FlatBuilder residents(Set<Resident> residents) {
            this.residents = residents;
            return this;
        }

        public FlatBuilder maintenanceBills(Set<MaintenanceBill> maintenanceBills) {
            this.maintenanceBills = maintenanceBills;
            return this;
        }

        public FlatBuilder visitorLogs(Set<VisitorLog> visitorLogs) {
            this.visitorLogs = visitorLogs;
            return this;
        }

        public FlatBuilder domesticHelps(Set<DomesticHelp> domesticHelps) {
            this.domesticHelps = domesticHelps;
            return this;
        }

        public Flat build() {
            return new Flat(flatId, flatNumber, floor, area, bedrooms, maxResident, isOccupied, building, residents,
                    maintenanceBills, visitorLogs, domesticHelps);
        }

        public String toString() {
            return "Flat.FlatBuilder(flatId=" + this.flatId + ", flatNumber=" + this.flatNumber + ", floor="
                    + this.floor + ", area=" + this.area + ", bedrooms=" + this.bedrooms + ", maxResident="
                    + this.maxResident + ", isOccupied=" + this.isOccupied + ", building=" + this.building
                    + ", residents=" + this.residents + ", maintenanceBills=" + this.maintenanceBills + ", visitorLogs="
                    + this.visitorLogs + ", domesticHelps=" + this.domesticHelps + ")";
        }
    }
}
