package com.ark.arkmind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.page.PageRequest;
import com.github.pagehelper.PageInfo;

import java.util.List;
import java.util.Map;

public interface StudentService {
    PageInfo<Student> findAllStudentByClassId(PageRequest pageRequest, String classId);

    PageInfo<Student> findByPage(PageRequest pageRequest, String classId);

    Student findStudentByIdAndPassword(Student student);

    JSONObject judgeExercise(AnswerRecord ar, JSONArray stuAnswerList);

    void updatePwd(String newPwd, String studentId);

    AnswerRecord getAnswerRecord(String studentId, String pid, String userId);

    List<Map<String, String>> getStuAnswerMsgAndStuMsg(Map<String, String> dataMap);

    void deleteAnswerMsgById(String answerRecordId);

    void deleteAllAnswerMsgForPid(String jsonFileName, String pid, String userId);

    AnswerRecord saveEcAnswerScore(List<String> scoreList, String answerRecordId, String row,String answer, String userId);
}
