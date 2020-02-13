package com.ark.arkmind.controller;

import com.alibaba.fastjson.JSONArray;
import com.ark.arkmind.po.*;
import com.ark.arkmind.po.page.PageRequest;
import com.ark.arkmind.service.*;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class WelcomeController {
    @Autowired
    ChartService chartService;
    @Autowired
    MyClassService myClassService;
    @Autowired
    StudentService studentService;
    @Autowired
    FileService fileService;
    @Autowired
    EvaluateService evaluateService;

    @RequestMapping("/")
    public String allToLogin(){
        return "login";
    }

    @RequestMapping("/toLogin")
    public String toLogin(){
        return "login";
    }

    @RequestMapping("/toStart")
    public String toStart(HttpServletRequest request, Model model){
        User user = (User)request.getSession().getAttribute("user");
        List<Map<String, String>> chartList;
        if(user != null){
            chartList = chartService.getCharts(user.getUserId());
        }else{
            Student student = (Student)request.getSession().getAttribute("student");
            chartList = myClassService.findChartsByClassId(student.getClassId());
        }
        model.addAttribute("chartList", chartList);
        return "start";
    }

    @RequestMapping("/toRegister")
    public String toRegister(){
        return "register";
    }

    @RequestMapping("/toMain")
    public String toMain(HttpServletRequest request, Model model){
        String jsonData = request.getParameter("jsonData");
        String jsonFileName = request.getParameter("fileName");
        String chartPath = request.getParameter("chartPath");
        String userId = request.getParameter("userId");
        //  根据chartPath查询chartId存入model
        Chart chart = chartService.findChartByPath(chartPath);
        if(chart != null){
            model.addAttribute("chartId", chart.getChartId());
            model.addAttribute("chartName", chart.getChartName());
        }else{
            model.addAttribute("chartId", null);
            model.addAttribute("chartName", null);
        }
        model.addAttribute("jsonData", jsonData);
        model.addAttribute("jsonFileName", jsonFileName);
        if(userId != null && !"".equals(userId)){
            model.addAttribute("userId", userId);
        }
        return "main";
    }

    @RequestMapping("/toMyClass")
    public String toMyClass(HttpServletRequest request, Model model) {
        //跳转到班级页面之前先将所有的班级信息从数据库中取出来存入model中
        User user = (User) request.getSession().getAttribute("user");
        List<MyClass> myClasses = myClassService.findAllMyClass(user.getUserId());
        model.addAttribute("myClassList", myClasses);
        return "myClass";
    }

    @RequestMapping("/toClassMsg")
    public String toClassMsg(HttpServletRequest request, Model model){
        PageRequest pageRequest = new PageRequest();
        String classId = request.getParameter("classId");
        String className = request.getParameter("className");
        String grade = request.getParameter("grade");
        pageRequest.setPageNum(Integer.parseInt(request.getParameter("pageNum")));
        pageRequest.setPageSize(Integer.parseInt(request.getParameter("pageSize")));
        //  获取该班级的所有学生信息，存入model中
        PageInfo<Student> studentPageInfo = studentService.findAllStudentByClassId(pageRequest, classId);
        model.addAttribute("studentPageInfo", studentPageInfo);
        model.addAttribute("classId", classId);
        model.addAttribute("className", className);
        model.addAttribute("grade", grade);
        return "classMsg";
    }

    @RequestMapping("/toStuAnswerMsg")
    public String toStuAnswerMsg(HttpServletRequest request, Model model){
        User user = (User) request.getSession().getAttribute("user");
        String jsonFileName = request.getParameter("jsonFileName");
        String pid = request.getParameter("pid");
        String pName = request.getParameter("pname");   //  知识点名称
        String classId = request.getParameter("classId");
        String className = request.getParameter("className");
        Map<String, String> dataMap = new HashMap<>();
        dataMap.put("userId", user.getUserId());
        dataMap.put("jsonFileName", jsonFileName);
        dataMap.put("pid", pid);
        dataMap.put("classId", classId);
        dataMap.put("className", className);
        //  获取该班级的所有已经在该知识点答题的学生的学生信息和答题情况信息
        List<Map<String, String>> result = studentService.getStuAnswerMsgAndStuMsg(dataMap);
        //  获得班级人数
        int stuNum = myClassService.getStuNumByClassId(classId);
        //  获取该节点的题目
        JSONArray exercise = fileService.getExercise(pid, jsonFileName.substring(0, jsonFileName.lastIndexOf(".")), user.getUserId());
        model.addAttribute("exercise", exercise.toJSONString());
        model.addAttribute("msgList", result);
        model.addAttribute("classId", classId);
        model.addAttribute("className", className);
        model.addAttribute("pname", pName);
        model.addAttribute("jsonFileName", jsonFileName);
        model.addAttribute("pid", pid);
        model.addAttribute("stuNum", stuNum);
        return "stuAnswerMsg";
    }

    @RequestMapping("/getUserMsg")
    public String getUserMsg(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        if(user == null){
            //  跳转到学生信息
            return "forward:/student/getStuMsg";
        }
        //  跳转到用户信息
        return "forward:/user/getUserMsg";
    }

    @RequestMapping("/toCourseEvaluatePage")
    public String toCourseEvaluatePage(HttpServletRequest request, Model model){
        String chartId = request.getParameter("chartId");
        String chartName = request.getParameter("chartName");
        String classId = request.getParameter("classId");
        String className = request.getParameter("className");
        String grade = request.getParameter("grade");
        model.addAttribute("chartId", chartId);
        model.addAttribute("chartName", chartName);
        model.addAttribute("classId", classId);
        model.addAttribute("className", className);
        model.addAttribute("grade", grade);
        List<Map<String, Object>> courseEvaluateList = evaluateService.generateCourseEvaluate(classId, chartId);
        model.addAttribute("courseEvaluateList", courseEvaluateList);
        return "courseEvaluate";
    }
}
