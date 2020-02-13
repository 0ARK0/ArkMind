package com.ark.arkmind.controller;

import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.User;
import com.ark.arkmind.service.MyClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/myClass")
public class MyClassController {
    @Autowired
    MyClassService myClassService;

    @RequestMapping("/addOrDelCharts")
    @ResponseBody
    public String addOrDelCharts(@RequestParam(value="pathList[]") List<String> pathList, String classId, HttpServletRequest request){
        User user = (User)request.getSession().getAttribute("user");
        myClassService.addCharts(pathList, classId, user.getUserId());
        return "success";
    }

    @RequestMapping("/deleteById")
    @ResponseBody
    public String deleteClassById(HttpServletRequest request){
        String classId = request.getParameter("classId");
        myClassService.deleteClassById(classId);
        return "success";
    }

    @RequestMapping("/findAllClass")
    @ResponseBody
    public List<MyClass> findAllClass(){
        List<MyClass> myClassList = myClassService.findAllClass();
        return myClassList;
    }

    @RequestMapping("/findAllMyClass")
    @ResponseBody
    public List<MyClass> findAllMyClass(HttpServletRequest request){
        String userId = request.getParameter("userId");
        return myClassService.findAllMyClass(userId);
    }

    @RequestMapping("/findAllClassForUser")
    @ResponseBody
    public Map<String,List> findAllClassForUser(HttpServletRequest request){
        String userId = request.getParameter("userId");
        //先找出所有的班级信息
        List<MyClass> classList = myClassService.findAllClass();
        //然后找出该教师已分配的班级信息
        List<MyClass> selectedClassList = myClassService.findAllMyClass(userId);
        Map<String,List> classMap = new HashMap<>();
        classMap.put("classList", classList);
        classMap.put("selectedClassList", selectedClassList);
        return classMap;
    }

    @RequestMapping("/findClassesForChart")
    @ResponseBody
    public List<MyClass> findClassesForChart(@RequestBody JSONObject tranObj, HttpServletRequest request){
        String jsonFileName = tranObj.getString("jsonFileName");
        User user = (User) request.getSession().getAttribute("user");
        List<MyClass> myClassList = myClassService.findClassesForChart(jsonFileName, user.getUserId());
        return myClassList;
    }

    @RequestMapping("/getClassByStudentId")
    @ResponseBody
    public MyClass getClassByStudentId(HttpServletRequest request){
        Student student = (Student) request.getSession().getAttribute("student");
        MyClass myClass = myClassService.getClassByClassId(student.getClassId());
        return myClass;
    }
}
