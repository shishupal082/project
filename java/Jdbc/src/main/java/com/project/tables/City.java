package com.project.tables;

import java.sql.ResultSet;

public class City {
    private int id;
    private String name;
    private String countryCode;
    private String district;
    private int population;
    public City(ResultSet set) {
        if (set == null) {
            return;
        }
        try {
            id = set.getInt("ID");
            name = set.getString("Name");
            countryCode = set.getString("CountryCode");
            district = set.getString("District");
            population = set.getInt("Population");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    @Override
    public String toString() {
        return "City{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", countryCode='" + countryCode + '\'' +
                ", district='" + district + '\'' +
                ", population=" + population +
                '}';
    }
}
