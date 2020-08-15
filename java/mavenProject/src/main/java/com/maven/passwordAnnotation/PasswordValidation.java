package com.maven.passwordAnnotation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;


public class PasswordValidation implements ConstraintValidator<Password, String> {

    private static final boolean NUMBER_OF_REQUIRED_DIGITS = true;

    public static boolean validate(String password) {
        if (password == null || password.length() == 0) {
            return true;
        } else if (password.length() < 10 || password.length() > 15) {
            return false;
        }

        boolean numberOfDigits = false;

        for (char p : password.toCharArray()) {
            if (Character.isDigit(p)) {
                numberOfDigits = true;
            } else if (Character.isSpaceChar(p)) {
                return false;
            }
        }
        return (numberOfDigits == NUMBER_OF_REQUIRED_DIGITS);
    }

    public void initialize(Password gap) {
        // No-op.
    }

    public boolean isValid(String password, ConstraintValidatorContext cac) {
        // The password field should be annotated with @NotNull, so we return true because
        // lack of a (null) password field is valid in certain validation scenarios.
        return password == null || validate(password);
    }

}
