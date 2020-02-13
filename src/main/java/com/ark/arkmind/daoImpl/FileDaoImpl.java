package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.FileDao;
import com.ark.arkmind.mapper.FileMapper;
import com.ark.arkmind.mapper.MyClassMapper;
import com.ark.arkmind.mapper.StudentMapper;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.MyFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FileDaoImpl implements FileDao {
    @Autowired
    FileMapper fileMapper;
    @Autowired
    MyClassMapper myClassMapper;
    @Autowired
    StudentMapper studentMapper;

    @Override
    public void saveMyFile(MyFile myFile) {
        fileMapper.saveMyFile(myFile);
    }

    @Override
    public List<MyFile> getMyFiles(MyFile myFile) {
        return fileMapper.getMyFiles(myFile);
    }

    @Override
    public void deleteLearningFile(String filePath) {
        fileMapper.deleteLearningFile(filePath);
    }

    @Override
    public void saveClassAndStudent(MyClass myClass) {
        myClassMapper.saveMyClass(myClass);
        studentMapper.saveStudentList(myClass.getStudentList());
    }

    @Override
    public void delSomeNode(String pidPath) {
        fileMapper.delSomeNode(pidPath);
    }

    @Override
    public void deleteFileByChartDir(String chartDir, String userId) {
        fileMapper.deleteFileByChartDir(chartDir, userId);
    }
}
