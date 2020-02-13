package com.ark.arkmind.serviceImpl;

import com.ark.arkmind.dao.ChartDao;
import com.ark.arkmind.dao.MyClassDao;
import com.ark.arkmind.dao.UserDao;
import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.User;
import com.ark.arkmind.po.page.PageRequest;
import com.ark.arkmind.service.UserService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;
    @Autowired
    MyClassDao myClassDao;
    @Autowired
    ChartDao chartDao;

    @Override
    public User findUserByAccountAndPassword(String account, String password) {
        User user = userDao.findUserByAccountAndPassword(account, password);
        return user;
    }

    @Override
    public User findUserByAccount(String account) {
        User user = userDao.findUserByAccount(account);
        return user;
    }

    @Override
    public void addNewUser(User user) {
        //  为用户生成userId，并在服务器的指定目录下创建以userId为名的文件夹存放用户的图表等数据
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind");
            if(!dir.exists()){
                dir.mkdirs();
            }
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind");
            if(!dir.exists()){
                dir.mkdirs();
            }
        }
        File userDir = new File(dir.getPath() + System.getProperty("file.separator") + user.getUserId());
        if(!userDir.exists()){
            userDao.saveUser(user);
            userDir.mkdir();
        }
    }

    @Override
    public void updateUser(User user) {
        userDao.updateUser(user);
    }

    @Override
    public User findUserById(String userId) {
        return userDao.findUserById(userId);
    }

    @Override
    public void deleteUserBatch(List<String> userIdList) {
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            dir = new File("E:\\SpringBootProjects\\ArkMind");
            if(!dir.exists()){
                dir.mkdirs();
            }
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind");
            if(!dir.exists()){
                dir.mkdirs();
            }
        }
        //  删除数据库中的用户数据
        //  删除user表中的数据
        userDao.deleteUserBatch(userIdList);
        //  删除chart表中的数据
        chartDao.deleteChartByUserBatch(userIdList);
        //  删除class_chart表中的数据
        myClassDao.deleteClassChartByUserBatch(userIdList);
        //  删除class_teacher表中的数据
        myClassDao.deleteClassTeacherByUserBatch(userIdList);

        //  删除用户在服务器的目录
        for(String userId: userIdList){
            File userDir = new File(dir + System.getProperty("file.separator") + userId);
            if(userDir.exists()){
                deleteAllFiles(userDir);
            }
        }
    }

    @Override
    public void addClassForUser(List<String> classIdList, String userId) {
        List<ClassAndTeacher> classTeacherList = new ArrayList<>();
        //  循环创建ClassAndTeacher对象，将属性注入
        for(String classId: classIdList){
            ClassAndTeacher ct = new ClassAndTeacher();
            ct.setClassTeacherId(UUID.randomUUID().toString());
            ct.setClassId(classId);
            ct.setTeacherId(userId);
            classTeacherList.add(ct);
        }
        //  将传过来的list中的班级与该教师已有的班级做对比，添加新的班级，删除没有了的班级
        List<ClassAndTeacher> selectedClassList = myClassDao.findAllMyClassAndTeacher(userId);
        List<ClassAndTeacher> newClassList = new ArrayList<>(); //  需要添加的新的班级的list
        List<ClassAndTeacher> cancelClassList = new ArrayList<>(); //   本来有，但现在被取消了的班级的list
        for(ClassAndTeacher cat:classTeacherList){
            int i;
            for(i=0; i<selectedClassList.size(); i++){
                if(cat.getClassId().equals(selectedClassList.get(i).getClassId()) && cat.getTeacherId().equals(selectedClassList.get(i).getTeacherId())){
                    break;
                }
            }
            if(i >= selectedClassList.size()){
                newClassList.add(cat);
            }
        }

        for(ClassAndTeacher cat:selectedClassList){
            int i;
            for(i=0; i<classTeacherList.size(); i++){
                if(cat.getClassId().equals(classTeacherList.get(i).getClassId()) && cat.getTeacherId().equals(classTeacherList.get(i).getTeacherId())){
                    break;
                }
            }
            if(i >= classTeacherList.size()){
                cancelClassList.add(cat);
            }
        }

        if(newClassList.size() > 0){
            userDao.addClassForUser(newClassList);
        }
        if(cancelClassList.size() > 0){
            userDao.delClassForUser(cancelClassList);
        }
    }

    @Override
    public void updatePwd(String newPwd, String userId) {
        userDao.updatePwd(newPwd, userId);
    }

    @Override
    public PageInfo<User> findAllByPage(PageRequest pageRequest) {
        PageHelper.startPage(pageRequest.getPageNum(), pageRequest.getPageSize());
        List<User> userList = userDao.findAllByPage();
        return new PageInfo<User>(userList);
    }

    //  递归删除目录下所有文件和文件夹
    private void deleteAllFiles(File file){
        if(file.isDirectory()){
            for(File childFile:file.listFiles()){
                deleteAllFiles(childFile);
            }
            file.delete();
        }else{
            file.delete();
        }
    }
}
