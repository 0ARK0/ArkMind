package com.ark.arkmind.dao;

import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;

import java.util.List;
import java.util.Map;

public interface StudentDao {
    List<Student> findAllStudentByClassId(String classId);

    Student findStudentByIdAndPassword(Student student);

    void deleteStudentsByClassId(String classId);

    void updatePwd(String newPwd, String studentId);

    void saveStuAnswerRecord(AnswerRecord ar);

    AnswerRecord getAnswerRecord(String studentId, String pid, String userId);

    List<AnswerRecord> getAllStuAnswerRecords(Map<String, String> dataMap);

    List<Student> findStudentsByIdList(List<String> studentIdList);

    void delStuAnswerRecordByNode(String path, String pid, String userId);

    void deleteAnswerRecordByDelChart(String path, String userId);

    void deleteAnswerMsgById(String answerRecordId);

    void deleteAllAnswerMsgForPid(String path, String pid, String userId);

    void saveEcAnswerScore(AnswerRecord ar);

    List<AnswerRecord> findAnswerRecordByClassIdAndChartPath(String classId, String path);

    List<AnswerRecord> findAnswerRecordByStudentIdAndChartPath(String studentId, String path);
}
