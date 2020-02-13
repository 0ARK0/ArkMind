package com.ark.arkmind.config.Interceptor;

import com.ark.arkmind.po.Admin;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.po.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        Student student = (Student) session.getAttribute("student");
        Admin admin = (Admin) session.getAttribute("admin");
        if(user == null && student == null && admin == null){
            response.sendRedirect(request.getContextPath()+"/toLogin");
            return false;
        }else{
            return true;
        }
    }
    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
