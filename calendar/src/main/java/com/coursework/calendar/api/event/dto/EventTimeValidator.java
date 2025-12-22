package com.coursework.calendar.api.event.dto;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EventTimeValidator implements ConstraintValidator<ValidEventTime, EventRequest> {
    @Override
    public void initialize(ValidEventTime constraintAnnotation) {
    }

    @Override
    public boolean isValid(EventRequest eventRequest, ConstraintValidatorContext context) {
        if (eventRequest.startTime() == null || eventRequest.endTime() == null) {
            return true; // @NotNull уже проверит это
        }
        return !eventRequest.endTime().isBefore(eventRequest.startTime());
    }
}

