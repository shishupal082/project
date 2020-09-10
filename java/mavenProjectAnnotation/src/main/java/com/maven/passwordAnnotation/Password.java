package com.maven.passwordAnnotation;
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordValidation.class)
public @interface Password {

    Class<?>[] groups() default {};

    String message() default "the password must be 10 character long and must include the 1 numeric digit.";

    Class<? extends Payload>[] payload() default {};
}