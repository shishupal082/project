package TestApi.domain.test;

/**
 * Created by shishupal.kumar on 22/12/15.
 */

public class DateResponse {
    private String ist;
    private String gmt;
    private String formate;

    public String getIst() {
        return ist;
    }

    public void setIst(String ist) {
        this.ist = ist;
    }

    public String getGmt() {
        return gmt;
    }

    public void setGmt(String gmt) {
        this.gmt = gmt;
    }

    public String getFormate() {
        return formate;
    }

    public void setFormate(String formate) {
        this.formate = formate;
    }

    @Override
    public String toString() {
        return "DateResponse{" +
            "ist='" + ist + '\'' +
            ", gmt='" + gmt + '\'' +
            ", formate='" + formate + '\'' +
            '}';
    }
}
