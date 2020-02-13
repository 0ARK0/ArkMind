package com.ark.arkmind.service;

import com.ark.arkmind.po.User;
import com.ark.arkmind.po.page.PageRequest;
import com.github.pagehelper.PageInfo;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserService {
    User findUserByAccountAndPassword(String account, String password);

    User findUserByAccount(String account);

    PageInfo<User> findAllByPage(PageRequest pageRequest);

    @Transactional
    void addNewUser(User user);

    void updateUser(User user);

    User findUserById(String userId);

    @Transactional
    void deleteUserBatch(List<String> userIdList);

    @Transactional
    void addClassForUser(List<String> classIdList, String userId);

    void updatePwd(String newPwd, String userId);
}
