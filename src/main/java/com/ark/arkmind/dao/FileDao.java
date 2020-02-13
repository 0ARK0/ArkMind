package com.ark.arkmind.dao;

import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.MyFile;

import java.util.List;

public interface FileDao {
    void saveMyFile(MyFile myFile);

    List<MyFile> getMyFiles(MyFile myFile);

    void deleteLearningFile(String filePath);

    void saveClassAndStudent(MyClass myClass);

    void delSomeNode(String pidPath);

    void deleteFileByChartDir(String chartDir, String userId);
}
