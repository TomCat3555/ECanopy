package com.ecanopy.dto.request;

import com.ecanopy.entity.enums.VisitorCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class VisitorRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone validation failed")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    private String phone;

    @NotNull(message = "Category is required")
    private VisitorCategory category;

    @NotNull(message = "Flat ID is required")
    private Long flatId;

    private String purpose;

    @NotBlank(message = "Visitor photo is required")
    private String imageUrl;

    // Vehicle tracking
    private String vehicleNumber;

    // ID Proof (mandatory for first-time visitors)
    private String idProofType; // AADHAAR, PAN, DL, PASSPORT
    private String idProofNumber;

    // Expected duration in minutes (optional)
    private Integer expectedDurationMinutes;

    public VisitorRequest() {
    }

    public VisitorRequest(String name, String phone, VisitorCategory category, Long flatId, String purpose,
            String imageUrl, String vehicleNumber, String idProofType, String idProofNumber,
            Integer expectedDurationMinutes) {
        this.name = name;
        this.phone = phone;
        this.category = category;
        this.flatId = flatId;
        this.purpose = purpose;
        this.imageUrl = imageUrl;
        this.vehicleNumber = vehicleNumber;
        this.idProofType = idProofType;
        this.idProofNumber = idProofNumber;
        this.expectedDurationMinutes = expectedDurationMinutes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public VisitorCategory getCategory() {
        return category;
    }

    public void setCategory(VisitorCategory category) {
        this.category = category;
    }

    public Long getFlatId() {
        return flatId;
    }

    public void setFlatId(Long flatId) {
        this.flatId = flatId;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getIdProofType() {
        return idProofType;
    }

    public void setIdProofType(String idProofType) {
        this.idProofType = idProofType;
    }

    public String getIdProofNumber() {
        return idProofNumber;
    }

    public void setIdProofNumber(String idProofNumber) {
        this.idProofNumber = idProofNumber;
    }

    public Integer getExpectedDurationMinutes() {
        return expectedDurationMinutes;
    }

    public void setExpectedDurationMinutes(Integer expectedDurationMinutes) {
        this.expectedDurationMinutes = expectedDurationMinutes;
    }

    @Override
    public String toString() {
        return "VisitorRequest{" +
                "name='" + name + '\'' +
                ", phone='" + phone + '\'' +
                ", category=" + category +
                ", flatId=" + flatId +
                ", purpose='" + purpose + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", vehicleNumber='" + vehicleNumber + '\'' +
                ", idProofType='" + idProofType + '\'' +
                ", idProofNumber='" + idProofNumber + '\'' +
                ", expectedDurationMinutes=" + expectedDurationMinutes +
                '}';
    }
}
