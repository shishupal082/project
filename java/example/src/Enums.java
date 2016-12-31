/**
 * Created by shishupalkumar on 31/12/16.
 */
public class Enums {
    public enum Season { WINTER, SPRING, SUMMER, FALL }
    public static void main(String[] args) throws Exception {
        for (Season s : Season.values()) {
            System.out.println(s);
        }
        // Get season by NAME
        System.out.println("***Get season by NAME**");
        System.out.println(Season.WINTER); // WINTER
        System.out.println(Season.WINTER.name()); // WINTER
        System.out.println(Season.valueOf("WINTER")); // WINTER

        // Get season by INDEX
        System.out.println("***Get season by INDEX**");
        System.out.println(Season.values().length); //4
        System.out.println(Season.values()[2]); // SUMMER

        // Switch statement
        Season s = Season.SUMMER;
        switch (s) {
            case WINTER:
                break;
            case SPRING:
                break;
            case SUMMER:
                break;
            case FALL:
                break;
            default:
                break;
        }
    }

}
