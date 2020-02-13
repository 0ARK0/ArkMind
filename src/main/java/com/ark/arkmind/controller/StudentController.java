package com.ark.arkmind.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.User;
import com.ark.arkmind.po.page.PageRequest;
import com.ark.arkmind.service.StudentService;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.List;
import java.util.UUID;

@Controller
@RequestMapping("/student")
public class StudentController {
    @Autowired
    StudentService studentService;

    @RequestMapping("/findByPage")
    @ResponseBody
    public PageInfo<Student> findByPage(HttpServletRequest request){
        PageRequest pageRequest = new PageRequest();
        String classId = request.getParameter("classId");
        pageRequest.setPageNum(Integer.parseInt(request.getParameter("pageNum")));
        pageRequest.setPageSize(Integer.parseInt(request.getParameter("pageSize")));
        return studentService.findByPage(pageRequest, classId);
    }

    @RequestMapping("/judgeExercise")
    @ResponseBody
    public JSONObject judgeExercise(@RequestBody JSONObject jsonObj, HttpServletRequest request){
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            dir = new File("E:\\SpringBootProjects\\ArkMind");
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind");
        }
        String sp = System.getProperty("file.separator");
        String jsonFileName = jsonObj.getString("jsonFileName");
        String chartPath = dir.getPath() + sp + jsonObj.getString("userId") + sp + "charts" + sp + jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
        Student student = (Student) request.getSession().getAttribute("student");
        AnswerRecord ar = new AnswerRecord();
        ar.setAnswerRecordId(UUID.randomUUID().toString());
        ar.setStudentId(student.getStudentId());
        ar.setAnswer(jsonObj.getJSONArray("stuAnswerList").toJSONString());
        ar.setChartPath(chartPath);
        ar.setPid(jsonObj.getString("pid"));
        ar.setUserId(jsonObj.getString("userId"));
        JSONObject result = studentService.judgeExercise(ar, jsonObj.getJSONArray("stuAnswerList"));
        return result;
    }

    @RequestMapping("/saveEcAnswerScore")
    @ResponseBody
    public AnswerRecord saveEcAnswerScore(@RequestParam(value="scoreList[]") List<String> scoreList, String answerRecordId, String row, String answer, String score, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        AnswerRecord ar = studentService.saveEcAnswerScore(scoreList, answerRecordId, row, answer, user.getUserId());
        return ar;
    }

    @RequestMapping("/getAnswerRecord")
    @ResponseBody
    public JSONObject getAnswerRecord(@RequestBody JSONObject tranObj, HttpServletRequest request){
        String userId = tranObj.getString("userId");
        String pid = tranObj.getString("pid");
        Student student = (Student) request.getSession().getAttribute("student");
        AnswerRecord ar = studentService.getAnswerRecord(student.getStudentId(), pid, userId);
        JSONArray row = ar != null ? JSONArray.parseArray(ar.getRow()) : null;
        JSONArray answer = ar != null ? JSONArray.parseArray(ar.getAnswer()) : null;
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("row", row);
        jsonObj.put("answer", answer);
        return jsonObj;
    }

    @RequestMapping("/deleteAnswerMsgById")
    @ResponseBody
    public String deleteAnswerMsgById(HttpServletRequest request){
        String answerRecordId = request.getParameter("answerRecordId");
        studentService.deleteAnswerMsgById(answerRecordId);
        return "success";
    }

    @RequestMapping("/deleteAllAnswerMsgForPid")
    @ResponseBody
    public String deleteAllAnswerMsgForPid(HttpServletRequest request){
        String jsonFileName = request.getParameter("jsonFileName");
        String pid = request.getParameter("pid");
        User user = (User) request.getSession().getAttribute("user");
        studentService.deleteAllAnswerMsgForPid(jsonFileName, pid, user.getUserId());
        return "success";
    }

    @RequestMapping("/getStuMsg")
    @ResponseBody
    public Student getStuMsg(HttpServletRequest request){
        Student student = (Student) request.getSession().getAttribute("student");
        return student;
    }

    @RequestMapping("/updatePwd")
    @ResponseBody
    public String updatePwd(HttpServletRequest request){
        Student student = (Student) request.getSession().getAttribute("student");
        String newPwd = request.getParameter("newPwd");
        studentService.updatePwd(newPwd, student.getStudentId());
        return "success";
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        request.getSession().setAttribute("student", null);
        return "forward:/";
    }
}
