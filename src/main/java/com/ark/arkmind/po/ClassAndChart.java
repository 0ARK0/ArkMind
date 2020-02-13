package com.ark.arkmind.po;

//老师分发给班级的图表（课程）
public class ClassAndChart {
    private String classChartId;
    private String classId;
    private String chartPath;
    private String userId;

    public String getClassChartId() {
        return classChartId;
    }

    public void setClassChartId(String classChartId) {
        this.classChartId = classChartId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getChartPath() {
        return chartPath;
    }

    public void setChartPath(String chartPath) {
        this.chartPath = chartPath;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
