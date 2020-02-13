package com.ark.arkmind.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.page.PageRequest;
import com.ark.arkmind.service.StudentService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    StudentDao studentDao;

    @Override
    public PageInfo<Student> findAllStudentByClassId(PageRequest pageRequest, String classId) {
        int pageNum = pageRequest.getPageNum();
        int pageSize = pageRequest.getPageSize();
        PageHelper.startPage(pageNum, pageSize);
        List<Student> studentList = studentDao.findAllStudentByClassId(classId);
        return new PageInfo<Student>(studentList);
    }

    @Override
    public PageInfo<Student> findByPage(PageRequest pageRequest, String classId) {
        PageHelper.startPage(pageRequest.getPageNum(), pageRequest.getPageSize());
        List<Student> studentList = studentDao.findAllStudentByClassId(classId);
        return new PageInfo<Student>(studentList);
    }

    @Override
    public Student findStudentByIdAndPassword(Student student) {
        return studentDao.findStudentByIdAndPassword(student);
    }

    @Override
    public JSONObject judgeExercise(AnswerRecord ar, JSONArray stuAnswerList) {
        //  判断学生的答案，返回答题情况
        //  除问答题以外，根据提交的答案来计算分数
        int ecAnswerNum = 0; //   问答题的数量
        int score = 0; //   学生的得分
        int total = 0; //   该知识点练习题的总分
        JSONArray row = new JSONArray(); // 是否正确的数组
        for (Iterator<Object> iterator = stuAnswerList.iterator(); iterator.hasNext();) {
            boolean flag = true;
            JSONObject next = (JSONObject) iterator.next();
            total += next.getInteger("score");
            if(next.getString("type").equals("ec-answer")){
                ecAnswerNum++;
                row.add(JSON.parseObject("{\"value\":-1}"));
                continue;
            }
            JSONArray reply = next.getJSONArray("reply");
            JSONArray answer = next.getJSONArray("answer");
            String rowItem;
            if(reply.size() != answer.size()){
                flag = false;
            }else{
                for(int i=0; i<reply.size(); i++){
                    if(!reply.getJSONObject(i).getString("value").equals(answer.getJSONObject(i).getString("value"))) {
                        flag = false;
                        break;
                    }
                }
            }
            if(flag){
                rowItem = "{\"value\":true}";
                score += next.getInteger("score");
            }else{
                rowItem = "{\"value\":false}";
            }
            row.add(JSON.parseObject(rowItem));
        }
        //  将学生的得分转换为百分制(四舍五入)
        double doubleScore = score / (total * 1.0);
        score = (int) Math.round(doubleScore * 100);
        JSONObject result = new JSONObject();
        result.put("row", row);
        //将学生的答题情况存入数据库
        if(ecAnswerNum > 0){
            //  有问答题的时候，需要教师手动打分
            ar.setState("未阅");
        }else{
            ar.setState("已阅");
        }
        ar.setRow(row.toJSONString());
        ar.setScore(score);
        studentDao.saveStuAnswerRecord(ar);
        return result;
    }

    @Override
    public void updatePwd(String newPwd, String studentId) {
        studentDao.updatePwd(newPwd, studentId);
    }

    @Override
    public AnswerRecord getAnswerRecord(String studentId, String pid, String userId) {
        return studentDao.getAnswerRecord(studentId, pid, userId);
    }

    @Override
    public List<Map<String, String>> getStuAnswerMsgAndStuMsg(Map<String, String> dataMap) {
        //先获取到所有在该知识点答题了的学生的答题记录和学号
        String userId = dataMap.get("userId");
        String jsonFileName = dataMap.get("jsonFileName");
        String jsonDir = jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
        String os = System.getProperty("os.name");
        String path;
        if (os.toLowerCase().startsWith("win")) {
            path = "E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir;
        } else {
            path = "/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir;
        }
        dataMap.put("chartPath", path);
        List<AnswerRecord> answerRecords = studentDao.getAllStuAnswerRecords(dataMap);
        if(answerRecords.size() == 0){
            return null;
        }
        //  获得已经答题的学生的学号
        List<String> studentIdList = new ArrayList<>();
        for(AnswerRecord answerRecord : answerRecords){
            studentIdList.add(answerRecord.getStudentId());
        }
        //  根据学号查询学生信息
        List<Student> studentList = studentDao.findStudentsByIdList(studentIdList);
        //  将学生list与答题记录list对应起来存入一个map中返回
        List<Map<String, String>> result = new ArrayList<>();
        Map<String, String> rmap;
        for(Student stu: studentList){
            for(AnswerRecord answerRecord : answerRecords){
                if(stu.getStudentId().equals(answerRecord.getStudentId())){
                    rmap = new HashMap<>();
                    rmap.put("answerRecordId", answerRecord.getAnswerRecordId());
                    rmap.put("state", answerRecord.getState());
                    rmap.put("score", String.valueOf(answerRecord.getScore()));
                    rmap.put("studentId", stu.getStudentId());
                    rmap.put("studentName", stu.getName());
                    rmap.put("sex", stu.getSex());
                    rmap.put("answer", answerRecord.getAnswer());
                    rmap.put("row", answerRecord.getRow());
                    result.add(rmap);
                    break;
                }
            }
        }
        return result;
    }

    @Override
    public void deleteAnswerMsgById(String answerRecordId) {
        studentDao.deleteAnswerMsgById(answerRecordId);
    }

    @Override
    public void deleteAllAnswerMsgForPid(String jsonFileName, String pid, String userId) {
        String os = System.getProperty("os.name");
        String path;
        String chartDir = jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
        if (os.toLowerCase().startsWith("win")) {
            path = "E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts"+ System.getProperty("file.separator") + chartDir;
        } else {
            path = "/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts"+ System.getProperty("file.separator") + chartDir;
        }
        studentDao.deleteAllAnswerMsgForPid(path, pid, userId);
    }

    @Override
    public AnswerRecord saveEcAnswerScore(List<String> scoreList, String answerRecordId, String row, String answer, String userId) {
        JSONArray answerArr = JSONArray.parseArray(answer);
        JSONArray rowArr = JSONArray.parseArray(row);
        int total = 0; //   知识点总分
        int score = 0; //    学生得分
        int checkedScore = 0;
        int j = 0;
        boolean flag;
        for(int i=0; i<answerArr.size(); i++){
            JSONObject answerNext = (JSONObject) answerArr.get(i);
            total += Integer.parseInt(answerNext.getString("score"));
            if(!answerNext.getString("type").equals("ec-answer")){
                //   重新计算学生的得分
                flag = true;
                JSONArray reply = answerNext.getJSONArray("reply");
                JSONArray a = answerNext.getJSONArray("answer");
                if(reply.size() != a.size()){
                    flag = false;
                }else{
                    for(int k=0; k<reply.size(); k++){
                        if(!reply.getJSONObject(k).getString("value").equals(a.getJSONObject(k).getString("value"))) {
                            flag = false;
                            break;
                        }
                    }
                }
                if(flag){
                    score += answerNext.getInteger("score");
                }
            }else{
                //  修改问答题的得分
                checkedScore = Integer.parseInt(scoreList.get(j));
                ((JSONObject) rowArr.get(i)).replace("value", checkedScore);
                score += checkedScore;
                j++;
            }
        }
        //  将学生的得分转换为百分制(四舍五入)
        double doubleScore = score / (total * 1.0);
        score = (int) Math.round(doubleScore * 100);
        AnswerRecord ar = new AnswerRecord();
        ar.setScore(score);
        ar.setRow(rowArr.toJSONString());
        ar.setState("已阅");
        ar.setAnswerRecordId(answerRecordId);
        //  修改数据库表answer_record中的值
        studentDao.saveEcAnswerScore(ar);
        return ar;
    }
}
