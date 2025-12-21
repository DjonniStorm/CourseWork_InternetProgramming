package com.coursework.calendar.api.event.dto;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = EventTimeValidator.class)
@Documented
public @interface ValidEventTime {
    String message() default "Время окончания события не может быть раньше времени начала";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

