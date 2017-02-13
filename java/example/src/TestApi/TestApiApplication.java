package TestApi;

import TestApi.domain.enums.Festival;
import TestApi.service.TestService;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by shishupalkumar on 13/02/17.
 */
public class TestApiApplication {
    public void getFestivalDetails(){
        Festival festival = Festival.Holi;
        Map<String, String> resoponse = new HashMap<String, String>();
        resoponse.put("festival_name", festival.getFestivalName());
        resoponse.put("year", festival.getYear().toString());
        resoponse.put("month", festival.getMonth().getFullName());
        resoponse.put("date", festival.getDate().toString());
        resoponse.put("day", festival.getDay().getFullName());
        System.out.println(resoponse);
    }
    public void getCurrentDate(){
        TestService testService = new TestService();
        System.out.println(testService.getCurrentDate());
    }
    public static void main(String[] args) {
        TestApiApplication testApiApplication = new TestApiApplication();
        testApiApplication.getCurrentDate();
        testApiApplication.getFestivalDetails();

//        UserAgentInfo userAgentInfo = testService.getUserAgentInfo(httpServletRequest);
    }
}
