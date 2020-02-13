package com.ark.arkmind.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.dao.ChartDao;
import com.ark.arkmind.dao.EvaluateDao;
import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.CourseEvaluate;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.service.EvaluateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class EvaluateServiceImpl implements EvaluateService {

    @Autowired
    EvaluateDao evaluateDao;
    @Autowired
    ChartDao chartDao;
    @Autowired
    StudentDao studentDao;

    @Override
    public List<CourseEvaluate> findCourseEvaluateByClassId(String classId, String chartId){
        return evaluateDao.findCourseEvaluateByClassId(classId, chartId);
    }

    @Override
    public List<Map<String, Object>> generateCourseEvaluate(String classId, String chartId) {
        //  根据班级id和课程id生成该班级每个学生对于这门课程的评价，
        //  结合课程的每个知识点（有习题的）的评分得出该学生在这门课程中的总分作为最终评价，百分制
        Chart chart = chartDao.findChartById(chartId);
        String sep = System.getProperty("file.separator");
        String path = chart.getPath().substring(0, chart.getPath().lastIndexOf(sep));
        //  查询所有该班级对应该课程的答题记录
        List<AnswerRecord> arList = studentDao.findAnswerRecordByClassIdAndChartPath(classId, path);
        List<Student> studentList = studentDao.findAllStudentByClassId(classId);
        //  获取该课程中所有的有习题的知识点的个数
        int pidNum = 0;
        File chartDir = new File(path);
        if(!chartDir.exists()){
            return null;
        }
        for(String childDirName: chartDir.list()){
            StringBuilder newPath = new StringBuilder(path);
            newPath.append(sep);
            newPath.append(childDirName);
            newPath.append(sep);
            newPath.append("exercise");
            File exerciseDir = new File(newPath.toString());
            if(exerciseDir.exists() && exerciseDir.list().length > 0){
                pidNum++;
            }
        }
        if(pidNum == 0){
            return null;
        }
        List<Map<String, Object>> result= new LinkedList<>();
        int pidScore;
        double finalScore;
        for(Student student:studentList){
            Map<String, Object> smap = new HashMap<>();
            pidScore = 0;
            for(AnswerRecord ar:arList){
                if(ar.getStudentId().equals(student.getStudentId())){
                    pidScore += ar.getScore();
                }
            }
            finalScore = pidScore / (pidNum * 1.0);
            smap.put("student", student);
            smap.put("score", (int) Math.round(finalScore));
            result.add(smap);
        }
        return result;
    }

    @Override
    public List<Map<String, Object>> getStudentEvaluate(String chartId, String studentId, String classId) {
        List<Map<String, Object>> result = new ArrayList<>();
        //  根据chartId获取图表的存储路径，将json文件取出
        Chart chart = chartDao.findChartById(chartId);
        File jsonFile = new File(chart.getPath());
        String sep = System.getProperty("file.separator");
        String path = chart.getPath().substring(0, chart.getPath().lastIndexOf(sep));
        String jsonStr = "";
        if(!jsonFile.exists()){
            return null;
        }
        try { //    读出json字符串
            BufferedReader br = new BufferedReader(new FileReader(jsonFile));
            jsonStr = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //  将json字符串转换为对象
        JSONObject jsonObject = JSON.parseObject(jsonStr);
        //  获取该课程中所有知识点（有习题的）的name和pid
        File chartDir = new File(path);
        if(!chartDir.exists()){
            return null;
        }
        for(String childDirName: chartDir.list()){
            StringBuilder newPath = new StringBuilder(path);
            newPath.append(sep);
            newPath.append(childDirName);
            newPath.append(sep);
            newPath.append("exercise");
            File exerciseDir = new File(newPath.toString());
            if(exerciseDir.exists() && exerciseDir.list().length > 0){
                Map<String, Object> pmap = new HashMap<>();
                pmap.put("pid", childDirName);
                result.add(pmap);
            }
        }
        //  根据studentId获取该学生的本课程的所有答题记录
        List<AnswerRecord> arList = studentDao.findAnswerRecordByStudentIdAndChartPath(studentId, path);
        for(int i=0; i<result.size(); i++){
            //  存入每个知识点的name
            findNodeNameByPid(jsonObject, (String)result.get(i).get("pid"), result, i);
            //  存入每个知识点的得分
            int j;
            for(j=0; j<arList.size(); j++){
                if(arList.get(j).getPid().equals(result.get(i).get("pid"))){
                    result.get(i).put("score", arList.get(j).getScore());
                    break;
                }
            }
            //  如果该知识点学生未作答，则直接给0分
            if(j >= arList.size()){
                result.get(i).put("score", 0);
            }
        }
        return result;
    }

    //  遍历json对象，找到并设置pid对应的节点的name
    private void findNodeNameByPid(JSONObject jsonObject, String pid, List<Map<String, Object>> result, int i){
        if(jsonObject.getString("pid") == null){
            return;
        }
        if(jsonObject.getString("pid").equals(pid)){
            result.get(i).put("name", jsonObject.getString("name"));
        }else{
            for(Object obj: jsonObject.getJSONArray("children")){
                findNodeNameByPid((JSONObject) obj, pid, result, i);
            }
        }
    }
}
