package com.ark.arkmind.controller;

import com.ark.arkmind.po.Admin;
import com.ark.arkmind.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    AdminService adminService;

    @RequestMapping("/login")
    public String login(HttpServletRequest request, Model model){
        String account = request.getParameter("account");
        String password = request.getParameter("password");
        Admin admin = adminService.findAdminByAccountAndPassword(account, password);
        if(admin == null){
            model.addAttribute("errorMsg", "用户名或密码错误，请重试");
            return "login";
        }else{
            request.getSession().setAttribute("admin", admin);
            return "adminPage";
        }
    }

    @RequestMapping("/toAdminPage")
    public String toAdminPage(){
        return "adminPage";
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request){
        request.getSession().setAttribute("admin", null);
        return "forward:/";
    }
}
