package com.ecanopy.dto.response;

import com.ecanopy.entity.enums.VisitorCategory;
import java.time.LocalDateTime;

public class VisitorResponse {
    private Long visitorId;
    private Long logId;
    private String name;
    private String phone;
    private VisitorCategory category;
    private String purpose;
    private String imageUrl;
    private String vehicleNumber;
    private LocalDateTime inTime;
    private LocalDateTime outTime;
    private LocalDateTime expectedOutTime;
    private Long flatId;
    private String flatNumber;
    private String gateEntry;
    private String checkedInBy;
    private String status;

    public VisitorResponse() {
    }

    public VisitorResponse(Long visitorId, Long logId, String name, String phone, VisitorCategory category,
            String purpose, String imageUrl, String vehicleNumber, LocalDateTime inTime, LocalDateTime outTime,
            LocalDateTime expectedOutTime, Long flatId, String flatNumber, String gateEntry, String checkedInBy,
            String status) {
        this.visitorId = visitorId;
        this.logId = logId;
        this.name = name;
        this.phone = phone;
        this.category = category;
        this.purpose = purpose;
        this.imageUrl = imageUrl;
        this.vehicleNumber = vehicleNumber;
        this.inTime = inTime;
        this.outTime = outTime;
        this.expectedOutTime = expectedOutTime;
        this.flatId = flatId;
        this.flatNumber = flatNumber;
        this.gateEntry = gateEntry;
        this.checkedInBy = checkedInBy;
        this.status = status;
    }

    public static VisitorResponseBuilder builder() {
        return new VisitorResponseBuilder();
    }

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public Long getLogId() {
        return logId;
    }

    public void setLogId(Long logId) {
        this.logId = logId;
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

    public LocalDateTime getInTime() {
        return inTime;
    }

    public void setInTime(LocalDateTime inTime) {
        this.inTime = inTime;
    }

    public LocalDateTime getOutTime() {
        return outTime;
    }

    public void setOutTime(LocalDateTime outTime) {
        this.outTime = outTime;
    }

    public LocalDateTime getExpectedOutTime() {
        return expectedOutTime;
    }

    public void setExpectedOutTime(LocalDateTime expectedOutTime) {
        this.expectedOutTime = expectedOutTime;
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

    public String getGateEntry() {
        return gateEntry;
    }

    public void setGateEntry(String gateEntry) {
        this.gateEntry = gateEntry;
    }

    public String getCheckedInBy() {
        return checkedInBy;
    }

    public void setCheckedInBy(String checkedInBy) {
        this.checkedInBy = checkedInBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public static class VisitorResponseBuilder {
        private Long visitorId;
        private Long logId;
        private String name;
        private String phone;
        private VisitorCategory category;
        private String purpose;
        private String imageUrl;
        private String vehicleNumber;
        private LocalDateTime inTime;
        private LocalDateTime outTime;
        private LocalDateTime expectedOutTime;
        private Long flatId;
        private String flatNumber;
        private String gateEntry;
        private String checkedInBy;
        private String status;

        VisitorResponseBuilder() {
        }

        public VisitorResponseBuilder visitorId(Long visitorId) {
            this.visitorId = visitorId;
            return this;
        }

        public VisitorResponseBuilder logId(Long logId) {
            this.logId = logId;
            return this;
        }

        public VisitorResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public VisitorResponseBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public VisitorResponseBuilder category(VisitorCategory category) {
            this.category = category;
            return this;
        }

        public VisitorResponseBuilder purpose(String purpose) {
            this.purpose = purpose;
            return this;
        }

        public VisitorResponseBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public VisitorResponseBuilder vehicleNumber(String vehicleNumber) {
            this.vehicleNumber = vehicleNumber;
            return this;
        }

        public VisitorResponseBuilder inTime(LocalDateTime inTime) {
            this.inTime = inTime;
            return this;
        }

        public VisitorResponseBuilder outTime(LocalDateTime outTime) {
            this.outTime = outTime;
            return this;
        }

        public VisitorResponseBuilder expectedOutTime(LocalDateTime expectedOutTime) {
            this.expectedOutTime = expectedOutTime;
            return this;
        }

        public VisitorResponseBuilder flatId(Long flatId) {
            this.flatId = flatId;
            return this;
        }

        public VisitorResponseBuilder flatNumber(String flatNumber) {
            this.flatNumber = flatNumber;
            return this;
        }

        public VisitorResponseBuilder gateEntry(String gateEntry) {
            this.gateEntry = gateEntry;
            return this;
        }

        public VisitorResponseBuilder checkedInBy(String checkedInBy) {
            this.checkedInBy = checkedInBy;
            return this;
        }

        public VisitorResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public VisitorResponse build() {
            return new VisitorResponse(visitorId, logId, name, phone, category, purpose, imageUrl, vehicleNumber,
                    inTime, outTime, expectedOutTime, flatId, flatNumber, gateEntry, checkedInBy, status);
        }

        public String toString() {
            return "VisitorResponse.VisitorResponseBuilder(visitorId=" + this.visitorId + ", logId=" + this.logId
                    + ", name=" + this.name + ", phone=" + this.phone + ", category=" + this.category + ", purpose="
                    + this.purpose + ", imageUrl=" + this.imageUrl + ", vehicleNumber=" + this.vehicleNumber
                    + ", inTime=" + this.inTime + ", outTime=" + this.outTime + ", expectedOutTime="
                    + this.expectedOutTime + ", flatId=" + this.flatId + ", flatNumber=" + this.flatNumber
                    + ", gateEntry=" + this.gateEntry + ", checkedInBy=" + this.checkedInBy + ", status=" + this.status
                    + ")";
        }
    }
}
