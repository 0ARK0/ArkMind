package com.ark.arkmind.dao;

import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.MyClass;

import java.util.List;

public interface MyClassDao {
    void deleteClassById(String classId);

    List<MyClass> findAllMyClass(List<String> classIdList);

    List<ClassAndChart> findChartsByClassId(String classId);

    void deleteClassChart(Chart chart);

    void addCharts(List<ClassAndChart> classAndChartList);

    void deleteClassChartByClassId(String classId);

    void delCharts(List<ClassAndChart> cancelChartList);

    List<MyClass> findAllClass();

    List<String> findAllMyClassId(String userId);

    List<ClassAndTeacher> findAllMyClassAndTeacher(String userId);

    void deleteClassChartByUserBatch(List<String> userIdList);

    void deleteClassTeacherByUserBatch(List<String> userIdList);

    List<MyClass> findClassesForChart(String path, String userId);

    int getStuNumByClassId(String classId);

    MyClass getClassByClassId(String classId);
}
