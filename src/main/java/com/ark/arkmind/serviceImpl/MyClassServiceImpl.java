package com.ark.arkmind.serviceImpl;

import com.ark.arkmind.dao.MyClassDao;
import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.service.MyClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.support.CustomSQLErrorCodesTranslation;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class MyClassServiceImpl implements MyClassService {
    @Autowired
    MyClassDao myClassDao;
    @Autowired
    StudentDao studentDao;

    @Override
    public List<MyClass> findAllMyClass(String userId) {
        //先到class_teacher表中查出所有的该教师的班级的classId
        List<String> classIdList = myClassDao.findAllMyClassId(userId);
        //然后根据classId的list去查找所有班级信息
        if(classIdList.isEmpty()){
            return new ArrayList<>();
        }else{
            return myClassDao.findAllMyClass(classIdList);
        }
    }

    @Override
    public void deleteClassById(String classId) {
        //删除班级中的全部学生
        studentDao.deleteStudentsByClassId(classId);
        //删除班级
        myClassDao.deleteClassById(classId);
        //删除为该班级分配的课程记录
        myClassDao.deleteClassChartByClassId(classId);
    }

    @Override
    public List<Map<String, String>> findChartsByClassId(String classId) {
        //  先到数据库中取出所有该班级的图表的存储路径
        List<ClassAndChart> charts = myClassDao.findChartsByClassId(classId);
        //  根据路径集合中的所有路径，取出对应的图表的json文件，将其读出为字符串存入list
        File jsonFile;
        List<Map<String,String>> chartList = new ArrayList<>();
        Map<String, String> cmap = null;
        BufferedReader br = null;
        for(int i=0; i<charts.size(); i++){
            String path = charts.get(i).getChartPath();
            jsonFile = new File(path);
            try {
                cmap = new HashMap<>();
                cmap.put("userId", charts.get(i).getUserId());
                cmap.put("fileName", jsonFile.getName());
                cmap.put("filePath", jsonFile.getPath());
                br = new BufferedReader(new FileReader(jsonFile));
                String line = "";
                String jsonStr = "";
                while ((line = br.readLine()) != null){
                    jsonStr += line;
                }
                cmap.put("jsonData", jsonStr);
                chartList.add(cmap);
                br.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return chartList;
    }

    @Override
    public void addCharts(List<String> pathList, String classId, String userId) {
        //  循环创建classAndChart对象，将属性注入
        List<ClassAndChart> classAndChartList = new ArrayList<>();
        for(String path: pathList){
            ClassAndChart cac = new ClassAndChart();
            cac.setClassChartId(UUID.randomUUID().toString());
            cac.setClassId(classId);
            cac.setChartPath(path);
            cac.setUserId(userId);
            classAndChartList.add(cac);
        }
        //  将传过来的list中的课程与该班级已有的课程做对比，添加新的课程，删除没有了的课程
        List<ClassAndChart> selectedChartList = myClassDao.findChartsByClassId(classId);
        List<ClassAndChart> newChartList = new ArrayList<>(); //    需要添加的新的课程的list
        List<ClassAndChart> cancelChartList = new ArrayList<>(); // 本来有，但现在被取消了的课程的list
        for(ClassAndChart cac:classAndChartList){
            int i;
            for(i=0; i<selectedChartList.size(); i++){
                if(cac.getChartPath().equals(selectedChartList.get(i).getChartPath())){
                    break;
                }
            }
            if(i >= selectedChartList.size()){
                newChartList.add(cac);
            }
        }

        for(ClassAndChart cac:selectedChartList){
            int i;
            for(i=0; i<classAndChartList.size(); i++){
                if(cac.getChartPath().equals(classAndChartList.get(i).getChartPath())){
                    break;
                }
            }
            if(i >= classAndChartList.size()){
                cancelChartList.add(cac);
            }
        }

        if(newChartList.size() > 0){
            myClassDao.addCharts(newChartList);
        }
        if(cancelChartList.size() > 0){
            myClassDao.delCharts(cancelChartList);
        }
    }

    @Override
    public List<ClassAndChart> findSelectedCharts(String classId) {
        List<ClassAndChart> charts = myClassDao.findChartsByClassId(classId);
        return charts;
    }

    @Override
    public List<MyClass> findAllClass() {
        return myClassDao.findAllClass();
    }

    @Override
    public List<MyClass> findClassesForChart(String jsonFileName, String userId) {
        String os = System.getProperty("os.name");
        String jsonDir = jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
        String path;
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            path = "E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + jsonFileName;
        } else {  //linux 和mac
            path = "/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + jsonFileName;
        }
        return myClassDao.findClassesForChart(path, userId);
    }

    @Override
    public int getStuNumByClassId(String classId) {
        return myClassDao.getStuNumByClassId(classId);
    }

    @Override
    public MyClass getClassByClassId(String classId) {
        return myClassDao.getClassByClassId(classId);
    }

}
