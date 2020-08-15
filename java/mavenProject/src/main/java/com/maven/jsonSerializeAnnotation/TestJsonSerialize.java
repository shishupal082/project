package com.maven.jsonSerializeAnnotation;

public class TestJsonSerialize {
    public static void test() {
        Car car = new Car("Ford", "F150", "2018");
        JsonSerializer serializer = new JsonSerializer();
        serializer.serialize(car);
    }
}
