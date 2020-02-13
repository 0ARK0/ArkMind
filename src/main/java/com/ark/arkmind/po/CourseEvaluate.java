package com.ark.arkmind.po;

//  课程评价
public class CourseEvaluate {
    private String courseEvaluateId;
    private String studentId;
    private String classId;
    private String chartId;
    private String courseScore;

    public String getCourseEvaluateId() {
        return courseEvaluateId;
    }

    public void setCourseEvaluateId(String courseEvaluateId) {
        this.courseEvaluateId = courseEvaluateId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getChartId() {
        return chartId;
    }

    public void setChartId(String chartId) {
        this.chartId = chartId;
    }

    public String getCourseScore() {
        return courseScore;
    }

    public void setCourseScore(String courseScore) {
        this.courseScore = courseScore;
    }
}
