package com.ark.arkmind.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.MyFile;
import com.ark.arkmind.po.User;
import com.ark.arkmind.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Controller
@RequestMapping("/file")
public class FileController {
    @Autowired
    FileService fileService;

    @RequestMapping("/excelToChart")
    @ResponseBody
    public String uploadExcelToChart(MultipartFile file){
        String jsonStr = fileService.readWorkbookToChartJson(file);
        return jsonStr;
    }

    @RequestMapping("/excelToClass")
    @ResponseBody
    public MyClass uploadExcelToClass(MultipartFile file){
        MyClass myClass = fileService.readWorkbookToClass(file);
        return myClass;
    }

    @RequestMapping("/learningFiles")
    @ResponseBody
    public MyFile uploadLearningFile(MultipartFile file, String jsonDir, String pid, HttpServletRequest request){
        User user = (User)request.getSession().getAttribute("user");
        MyFile myFile = fileService.saveLearningFile(file, user.getUserId(), jsonDir, pid);
        return myFile;
    }

    @RequestMapping("/getMyFiles")
    @ResponseBody
    public List<MyFile> getMyFiles(String jsonDir, String pid, HttpServletRequest request){
        User user = (User)request.getSession().getAttribute("user");
        List<MyFile> myFiles = fileService.getMyFiles(user.getUserId(), jsonDir, pid);
        return myFiles;
    }

    @RequestMapping("/getStuFiles")
    @ResponseBody
    public List<MyFile> getStuFiles(String jsonDir, String pid, String userId){
        List<MyFile> myFiles = fileService.getMyFiles(userId, jsonDir, pid);
        return myFiles;
    }

    @RequestMapping("/deleteLearningFile")
    @ResponseBody
    public String deleteLearningFile(String filePath){
        fileService.deleteLearningFile(filePath);
        return "success";
    }

    @RequestMapping("/haveLearningFiles")
    @ResponseBody
    public boolean haveLearningFiles(String jsonDir, String pid, HttpServletRequest request){
        User user = (User)request.getSession().getAttribute("user");
        boolean result = fileService.haveLearningFiles(user.getUserId(), jsonDir, pid);
        return result;
    }

    @RequestMapping("/downloadFile")
    public ResponseEntity<Resource> downloadCacheFile(HttpServletRequest request) {
        String filePath = request.getParameter("filePath");
        try {
            String fileName = filePath.substring(filePath.lastIndexOf(System.getProperty("file.separator")) + 1);
            // 获取文件名称，中文可能被URL编码
            fileName = URLDecoder.decode(fileName, "UTF-8");
            // 获取本地文件系统中的文件资源
            FileSystemResource resource = new FileSystemResource(filePath);
            // 解析文件的 mime 类型
            String mediaTypeStr = URLConnection.getFileNameMap().getContentTypeFor(fileName);
            // 无法判断MIME类型时，作为流类型
            mediaTypeStr = (mediaTypeStr == null) ? MediaType.APPLICATION_OCTET_STREAM_VALUE : mediaTypeStr;
            // 实例化MIME
            MediaType mediaType = MediaType.parseMediaType(mediaTypeStr);
            /*
             * 构造响应的头
             */
            HttpHeaders headers = new HttpHeaders();
            // 下载之后需要在请求头中放置文件名，该文件名按照ISO_8859_1编码。
            String filename = new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentType(mediaType);
            /*
             * 返还资源
             */
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(resource.getInputStream().available())
                    .body(resource);
        } catch (IOException e) {
            System.out.println(e.getStackTrace());
            return null;
        }
    }

    @RequestMapping("/exerciseToJson")
    @ResponseBody
    public String exerciseToJson(@RequestBody JSONObject jsonObj, HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        //将json数组转化为json字符串
        String jsonStr = jsonObj.getJSONArray("exerciseList").toJSONString();
        String pid = jsonObj.getString("pid");
        String jsonDir = jsonObj.getString("jsonDir");
        //将json字符串输出为json文件，存入该节点的目录下
        fileService.exerciseToJson(pid, jsonDir, user.getUserId(), jsonStr);
        return "success";
    }

    @RequestMapping("/getExercise")
    @ResponseBody
    public JSONArray getExercise(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        String userId;
        if(user == null){
            userId = request.getParameter("userId");
        }else{
            userId = user.getUserId();
        }
        String pid = request.getParameter("pid");
        String jsonDir = request.getParameter("jsonDir");
        JSONArray jsonArray = fileService.getExercise(pid, jsonDir, userId);
        return jsonArray;
    }

    @RequestMapping("/delSomeNode")
    @ResponseBody
    public String delSomeNode(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        String jsonDir = request.getParameter("jsonDir");
        String pid = request.getParameter("pid");
        fileService.delSomeNode(user.getUserId(), jsonDir, pid);
        return "success";
    }

    @RequestMapping("/delAllExerciseOfNode")
    @ResponseBody
    public String delAllExerciseOfNode(HttpServletRequest request){
        User user = (User) request.getSession().getAttribute("user");
        String jsonDir = request.getParameter("jsonDir");
        String pid = request.getParameter("pid");
        fileService.delAllExerciseOfNode(user.getUserId(), jsonDir, pid);
        return "success";
    }
}
