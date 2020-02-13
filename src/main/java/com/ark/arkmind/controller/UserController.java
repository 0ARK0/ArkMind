package com.ark.arkmind.controller;

import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.User;
import com.ark.arkmind.po.page.PageRequest;
import com.ark.arkmind.service.ChartService;
import com.ark.arkmind.service.MyClassService;
import com.ark.arkmind.service.StudentService;
import com.ark.arkmind.service.UserService;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    StudentService studentService;
    @Autowired
    ChartService chartService;
    @Autowired
    MyClassService myClassService;

    @RequestMapping("/login")
    public String login(HttpServletRequest request, Model model){
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        String identity = request.getParameter("identity");

        if(identity.equals("学生")){
            Student student = new Student();
            student.setStudentId(account);
            student.setPassword(password);
            Student student1 = studentService.findStudentByIdAndPassword(student);
            if(student1 == null){
                model.addAttribute("errorMsg", "用户名或密码错误，请重试");
                return "login";
            }
            request.getSession().setAttribute("student", student1);
            List<Map<String,String>> chartList = myClassService.findChartsByClassId(student1.getClassId());
            model.addAttribute("chartList", chartList);
            return "start";
        }else if(identity.equals("教师")){
            User user = userService.findUserByAccountAndPassword(account, password);
            if(user == null){
                model.addAttribute("errorMsg", "用户名或密码错误，请重试");
                return "login";
            }
            request.getSession().setAttribute("user", user);
            List<Map<String,String>> chartList = chartService.getCharts(user.getUserId());
            model.addAttribute("chartList", chartList);
            return "start";
        }else{
            //跳转到管理员登录
            return "forward:/admin/login";
        }
    }

    @RequestMapping("/findAllByPage")
    @ResponseBody
    public PageInfo<User> findAllByPage(HttpServletRequest request){
        PageRequest pageRequest = new PageRequest();
        pageRequest.setPageNum(Integer.parseInt(request.getParameter("pageNum")));
        pageRequest.setPageSize(Integer.parseInt(request.getParameter("pageSize")));
        PageInfo<User> userPageInfo = userService.findAllByPage(pageRequest);
        return userPageInfo;
    }

    @RequestMapping("/findUserById")
    @ResponseBody
    public User findUserById(HttpServletRequest request){
        String userId = request.getParameter("userId");
        User user = userService.findUserById(userId);
        return user;
    }

    @RequestMapping("/getUserMsg")
    @ResponseBody
    public User getUserMsg(HttpServletRequest request){
        User user = (User)request.getSession().getAttribute("user");
        return user;
    }

    @RequestMapping("/addNewUser")
    @ResponseBody
    public String addNewUser(HttpServletRequest request){
        User user = new User();
        user.setUserId(UUID.randomUUID().toString());
        user.setAccount(request.getParameter("account"));
        user.setPassword(request.getParameter("account"));
        user.setUserName(request.getParameter("userName"));
        user.setSex(request.getParameter("sex"));
        User user1 = userService.findUserByAccount(request.getParameter("account"));
        if(user1 != null){
            return null;
        }
        userService.addNewUser(user);
        return "success";
    }

    @RequestMapping("/updateUser")
    @ResponseBody
    public String updateUser(HttpServletRequest request){
        User user = new User();
        user.setUserId(request.getParameter("userId"));
        user.setAccount(request.getParameter("account"));
        user.setPassword(request.getParameter("account"));
        user.setUserName(request.getParameter("userName"));
        user.setSex(request.getParameter("sex"));
        userService.updateUser(user);
        return "success";
    }

    @RequestMapping("/deleteUserBatch")
    @ResponseBody
    public String deleteUserBatch(@RequestParam(value="userIdList[]") List<String> userIdList){
        userService.deleteUserBatch(userIdList);
        return "success";
    }

    @RequestMapping("/addClassForUser")
    @ResponseBody
    public String addClassForUser(@RequestParam(value="classIdList[]") List<String> classIdList, String userId){
        userService.addClassForUser(classIdList, userId);
        return "success";
    }

    @RequestMapping("/updatePwd")
    @ResponseBody
    public String updatePwd(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        String newPwd = request.getParameter("newPwd");
        userService.updatePwd(newPwd, user.getUserId());
        return "success";
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        request.getSession().setAttribute("user", null);
        return "forward:/";
    }
}
