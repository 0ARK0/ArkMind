package com.ark.arkmind.controller;

import com.ark.arkmind.service.EvaluateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/evaluate")
public class EvaluateController {
    @Autowired
    EvaluateService evaluateService;

    @RequestMapping("/getStudentEvaluate")
    @ResponseBody
    public List<Map<String, Object>> getStudentEvaluate(HttpServletRequest request){
        String classId = request.getParameter("classId");
        String studentId = request.getParameter("studentId");
        String chartId = request.getParameter("chartId");
        List<Map<String, Object>> result = evaluateService.getStudentEvaluate(chartId, studentId, classId);
        return result;
    }
}
