package com.ark.arkmind.dao;

import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.User;

import java.util.List;

public interface UserDao {
    User findUserByAccountAndPassword(String account, String password);

    User findUserByAccount(String account);

    void saveUser(User user);

    List<User> findAllByPage();

    void updateUser(User user);

    User findUserById(String userId);

    void deleteUserBatch(List<String> userIdList);

    void addClassForUser(List<ClassAndTeacher> newClassList);

    void delClassForUser(List<ClassAndTeacher> cancelClassList);

    void updatePwd(String newPwd, String userId);
}
