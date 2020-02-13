package com.ark.arkmind.mapper;

import com.ark.arkmind.po.CourseEvaluate;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface EvaluateMapper {
    @Select("SELECT * FROM course_evaluate WHERE class_id = #{classId} AND chart_id = #{chartId}")
    @Results({
            @Result(property = "courseEvaluateId", column = "course_evaluate_id"),
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "classId", column = "class_id"),
            @Result(property = "chartId", column = "chart_id"),
            @Result(property = "courseScore", column = "course_score"),
    })
    List<CourseEvaluate> findCourseEvaluateByClassId(String classId, String chartId);
}
