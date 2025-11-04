
package com.MCIT.ArchiveManagementSystem.models.enums;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AttendanceCategory {

    PROVINCIAL_JUDICIAL,
    CENTRAL_SERVICES,
    CENTRAL_JUDICIAL,
    PROVINCIAL_ADMINISTRATIVE,
    CENTRAL_ADMINISTRATIVE,
    PROVINCIAL_SERVICES;

    @JsonCreator
    public static AttendanceCategory fromString(String key) {
        if (key == null) return null;

        switch (key.toUpperCase()) {
            case "PROVINCIAL_JUDICIAL":
            case "PROV_JUD":
            case "PROV_JUDICIAL":
                return PROVINCIAL_JUDICIAL;

            case "CENTRAL_SERVICES":
            case "CENT_SERV":
            case "CENT_SERVICES":
                return CENTRAL_SERVICES;

            case "CENTRAL_JUDICIAL":
            case "CENT_JUD":
            case "CENT_JUDICIAL":
                return CENTRAL_JUDICIAL;

            case "PROVINCIAL_ADMINISTRATIVE":
            case "PROV_ADMIN":
            case "PROV_ADMINISTRATIVE":
            case "PROVINCIAL_ADMIN":  // د Jackson لپاره مهمه اضافه
                return PROVINCIAL_ADMINISTRATIVE;

            case "CENTRAL_ADMINISTRATIVE":
            case "CENT_ADMIN":
            case "CENT_ADMINISTRATIVE":
                return CENTRAL_ADMINISTRATIVE;

            case "PROVINCIAL_SERVICES":
            case "PROV_SERV":
            case "PROV_SERVICES":
                return PROVINCIAL_SERVICES;

            default:
                throw new IllegalArgumentException("Invalid AttendanceCategory: " + key);
        }
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
