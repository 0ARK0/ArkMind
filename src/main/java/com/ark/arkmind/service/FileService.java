package com.ark.arkmind.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.MyFile;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileService {
    String readWorkbookToChartJson(MultipartFile file);

    MyClass readWorkbookToClass(MultipartFile file);

    @Transactional
    MyFile saveLearningFile(MultipartFile file, String userId, String jsonDir, String pid);

    List<MyFile> getMyFiles(String userId, String jsonDir, String pid);

    @Transactional
    void deleteLearningFile(String filePath);

    boolean haveLearningFiles(String userId, String jsonDir, String pid);

    void exerciseToJson(String pid, String jsonData, String userId, String jsonStr);

    JSONArray getExercise(String pid, String jsonDir, String userId);

    @Transactional
    void delSomeNode(String userId, String jsonDir, String pid);

    @Transactional
    void delAllExerciseOfNode(String userId, String jsonDir, String pid);
}
