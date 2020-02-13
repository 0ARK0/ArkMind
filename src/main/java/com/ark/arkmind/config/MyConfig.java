package com.ark.arkmind.config;

import com.ark.arkmind.config.Interceptor.LoginInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.io.File;

@Configuration
public class MyConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/","/admin/login","/user/login","/user/register","/toLogin","/toRegister","/static/**","/usersDir/**");
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //静态资源映射
        //判断是windows还是linux
        String os = System.getProperty("os.name");
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            registry.addResourceHandler("/usersDir/**").addResourceLocations("file:E:/SpringBootProjects/ArkMind/");
        } else {  //linux 和mac
            registry.addResourceHandler("/usersDir/**").addResourceLocations("file:/usr/local/SpringBootProjects/ArkMind/");
        }
    }
}
