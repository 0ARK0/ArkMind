package com.ark.arkmind.dao;

import com.ark.arkmind.po.CourseEvaluate;

import java.util.List;

public interface EvaluateDao {
    List<CourseEvaluate> findCourseEvaluateByClassId(String classId, String chartId);
}
