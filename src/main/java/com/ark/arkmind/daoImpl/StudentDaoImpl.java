package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.mapper.StudentMapper;
import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class StudentDaoImpl implements StudentDao {
    @Autowired
    StudentMapper studentMapper;

    @Override
    public List<Student> findAllStudentByClassId(String classId) {
        return studentMapper.findAllStudentByClassId(classId);
    }

    @Override
    public Student findStudentByIdAndPassword(Student student) {
        return studentMapper.findStudentByIdAndPassword(student);
    }

    @Override
    public void deleteStudentsByClassId(String classId) {
        int result = studentMapper.deleteStudentsByClassId(classId);
        System.out.println(result);
    }

    @Override
    public void updatePwd(String newPwd, String studentId) {
        studentMapper.updatePwd(newPwd, studentId);
    }

    @Override
    public void saveStuAnswerRecord(AnswerRecord ar) {
        studentMapper.saveStuAnswerRecord(ar);
    }

    @Override
    public AnswerRecord getAnswerRecord(String studentId, String pid, String userId) {
        return studentMapper.getAnswerRecord(studentId, pid, userId);
    }

    @Override
    public List<AnswerRecord> getAllStuAnswerRecords(Map<String, String> dataMap) {
        return studentMapper.getAllStuAnswerRecords(dataMap);
    }

    @Override
    public List<Student> findStudentsByIdList(List<String> studentIdList) {
        return studentMapper.findStudentsByIdList(studentIdList);
    }

    @Override
    public void delStuAnswerRecordByNode(String path, String pid, String userId) {
        studentMapper.delStuAnswerRecordByNode(path, pid, userId);
    }

    @Override
    public void deleteAnswerRecordByDelChart(String path, String userId) {
        studentMapper.deleteAnswerRecordByDelChart(path, userId);
    }

    @Override
    public void deleteAnswerMsgById(String answerRecordId) {
        studentMapper.deleteAnswerMsgById(answerRecordId);
    }

    @Override
    public void deleteAllAnswerMsgForPid(String path, String pid, String userId) {
        studentMapper.delStuAnswerRecordByNode(path, pid, userId);
    }

    @Override
    public void saveEcAnswerScore(AnswerRecord ar) {
        studentMapper.saveEcAnswerScore(ar);
    }

    @Override
    public List<AnswerRecord> findAnswerRecordByClassIdAndChartPath(String classId, String path) {
        return studentMapper.findAnswerRecordByClassIdAndChartPath(classId, path);
    }

    @Override
    public List<AnswerRecord> findAnswerRecordByStudentIdAndChartPath(String studentId, String path) {
        return studentMapper.findAnswerRecordByStudentIdAndChartPath(studentId, path);
    }
}
