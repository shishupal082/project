public class StaticService {
    public static void printLog(String str) {
        System.out.println(str);
    }
    public static void printLog(Integer str) {
        System.out.println(str);
    }
    public static void printLog(String[] str) {
        System.out.println(String.join(",",str));
    }
    public static void printLogSameLine(String str) {
        System.out.print(str);
    }
}
