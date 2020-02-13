package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.UserDao;
import com.ark.arkmind.mapper.UserMapper;
import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserDaoImpl implements UserDao {
    @Autowired
    UserMapper userMapper;

    @Override
    public User findUserByAccountAndPassword(String account, String password) {
        User user = userMapper.findUserByAccountAndPassword(account, password);
        return user;
    }

    @Override
    public User findUserByAccount(String account) {
        User user = userMapper.findUserByAccount(account);
        return user;
    }

    @Override
    public void saveUser(User user) {
        userMapper.saveUser(user);
    }

    @Override
    public List<User> findAllByPage() {
        return userMapper.findAllByPage();
    }

    @Override
    public void updateUser(User user) {
        userMapper.updateUser(user);
    }

    @Override
    public User findUserById(String userId) {
        return userMapper.findUserById(userId);
    }

    @Override
    public void deleteUserBatch(List<String> userIdList) {
        userMapper.deleteUserBatch(userIdList);
    }

    @Override
    public void addClassForUser(List<ClassAndTeacher> newClassList) {
        userMapper.addClassForUser(newClassList);
    }

    @Override
    public void delClassForUser(List<ClassAndTeacher> cancelClassList) {
        userMapper.delClassForUser(cancelClassList);
    }

    @Override
    public void updatePwd(String newPwd, String userId) {
        userMapper.updatePwd(newPwd, userId);
    }
}
