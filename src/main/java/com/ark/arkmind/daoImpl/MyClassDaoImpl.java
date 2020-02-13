package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.MyClassDao;
import com.ark.arkmind.mapper.MyClassMapper;
import com.ark.arkmind.mapper.StudentMapper;
import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.MyClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MyClassDaoImpl implements MyClassDao {
    @Autowired
    MyClassMapper myClassMapper;
    @Autowired
    StudentMapper studentMapper;

    @Override
    public List<MyClass> findAllMyClass(List<String> classIdList) {
        return myClassMapper.findAllMyClass(classIdList);
    }

    @Override
    public void deleteClassById(String classId) {
        myClassMapper.deleteMyClassById(classId);
    }

    @Override
    public List<ClassAndChart> findChartsByClassId(String classId) {
        return myClassMapper.findChartsByClassId(classId);
    }

    @Override
    public void deleteClassChart(Chart chart) {
        myClassMapper.deleteClassChart(chart);
    }

    @Override
    public void addCharts(List<ClassAndChart> classAndChartList) {
        myClassMapper.addCharts(classAndChartList);
    }

    @Override
    public void deleteClassChartByClassId(String classId) {
        myClassMapper.deleteClassChartByClassId(classId);
    }

    @Override
    public void delCharts(List<ClassAndChart> cancelChartList) {
        myClassMapper.delCharts(cancelChartList);
    }

    @Override
    public List<MyClass> findAllClass() {
        return myClassMapper.findAllClass();
    }

    @Override
    public List<String> findAllMyClassId(String userId) {
        return myClassMapper.findAllMyClassId(userId);
    }

    @Override
    public List<ClassAndTeacher> findAllMyClassAndTeacher(String userId) {
        return myClassMapper.findAllMyClassAndTeacher(userId);
    }

    @Override
    public void deleteClassChartByUserBatch(List<String> userIdList) {
        myClassMapper.deleteClassChartByUserBatch(userIdList);
    }

    @Override
    public void deleteClassTeacherByUserBatch(List<String> userIdList) {
        myClassMapper.deleteClassTeacherByUserBatch(userIdList);
    }

    @Override
    public List<MyClass> findClassesForChart(String path, String userId) {
        return myClassMapper.findClassesForChart(path, userId);
    }

    @Override
    public int getStuNumByClassId(String classId) {
        return myClassMapper.getStuNumByClassId(classId);
    }

    @Override
    public MyClass getClassByClassId(String classId) {
        return myClassMapper.getClassByClassId(classId);
    }
}
