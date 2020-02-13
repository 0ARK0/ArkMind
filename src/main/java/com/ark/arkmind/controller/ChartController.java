package com.ark.arkmind.controller;

import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.User;
import com.ark.arkmind.service.ChartService;
import com.ark.arkmind.service.MyClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/chart")
public class ChartController {
    @Autowired
    ChartService chartService;
    @Autowired
    MyClassService myClassService;

    @RequestMapping("/saveNew")
    @ResponseBody
    public Chart saveNewChart(@RequestBody String jsonData, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        Chart chart = chartService.saveNewChart(jsonData, user.getUserId());
        return chart;
    }

    @RequestMapping("/save")
    @ResponseBody
    public Chart saveChart(String fileName, String jsonData, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        Chart chart = chartService.saveChart(jsonData, user.getUserId(), fileName);
        return chart;
    }

    @RequestMapping("/delete")
    @ResponseBody
    public String deleteChart(String fileName, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        chartService.deleteChart(user.getUserId(), fileName);
        return "success";
    }

    @RequestMapping("/findAllCharts")
    @ResponseBody
    public Map<String,List> findAllCharts(String classId, HttpServletRequest request){
        //  传回的的是课程名称的list，以及该班级已有的课程的chartId的list
        Map<String,List> chartMap = new HashMap<>();
        User user = (User) request.getSession().getAttribute("user");
        List<Chart> chartList = chartService.findAllCharts(user.getUserId()); //查询所有的课程
        chartMap.put("chartList", chartList);
        //  查询该班级已有的课程
        List<ClassAndChart> selectedCharts = myClassService.findSelectedCharts(classId);
        chartMap.put("selectedCharts", selectedCharts);
        return chartMap;
    }
}
