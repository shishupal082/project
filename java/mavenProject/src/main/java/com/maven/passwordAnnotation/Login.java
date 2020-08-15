package com.maven.passwordAnnotation;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

public class Login {
    public static void test() {
        String username = "username";
        String password = "password90";

        try {
            ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
            Validator validator = factory.getValidator();
            User newUser = new User(username, password);
            Set<ConstraintViolation<User>> violations = validator.validate(newUser);

            for (ConstraintViolation<User> violation : violations) {
                if (!("".equals(violation.getMessage()))) {
                    throw new RuntimeException(violation.getMessage());
                }
            }
            System.out.println("User created");
            System.out.println(newUser.getUsername() + " Created\n");
        } catch (Exception ex) {
            System.out.println(ex.getMessage());

        }
    }
}
