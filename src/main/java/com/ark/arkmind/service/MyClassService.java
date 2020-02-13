package com.ark.arkmind.service;

import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.MyClass;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface MyClassService {
    @Transactional
    void deleteClassById(String classId);

    List<MyClass> findAllMyClass(String userId);

    List<Map<String, String>> findChartsByClassId(String classId);

    @Transactional
    void addCharts(List<String> pathList, String classId, String userId);

    List<ClassAndChart> findSelectedCharts(String classId);

    List<MyClass> findAllClass();

    List<MyClass> findClassesForChart(String jsonFileName, String userId);

    int getStuNumByClassId(String classId);

    MyClass getClassByClassId(String classId);
}
