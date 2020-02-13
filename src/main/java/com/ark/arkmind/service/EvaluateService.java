package com.ark.arkmind.service;

import com.ark.arkmind.po.CourseEvaluate;
import com.ark.arkmind.po.Student;

import java.util.List;
import java.util.Map;

public interface EvaluateService {
    List<CourseEvaluate> findCourseEvaluateByClassId(String classId, String chartId);

    List<Map<String, Object>> generateCourseEvaluate(String classId, String chartId);

    List<Map<String, Object>> getStudentEvaluate(String chartId, String studentId, String classId);
}
