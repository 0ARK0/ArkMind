package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.EvaluateDao;
import com.ark.arkmind.mapper.EvaluateMapper;
import com.ark.arkmind.po.CourseEvaluate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class EvaluateDaoImpl implements EvaluateDao {
    @Autowired
    EvaluateMapper evaluateMapper;

    @Override
    public List<CourseEvaluate> findCourseEvaluateByClassId(String classId, String chartId) {
        return evaluateMapper.findCourseEvaluateByClassId(classId, chartId);
    }
}
