package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.AdminDao;
import com.ark.arkmind.mapper.AdminMapper;
import com.ark.arkmind.po.Admin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AdminDaoImpl implements AdminDao {
    @Autowired
    AdminMapper adminMapper;

    @Override
    public Admin findAdminByAccountAndPassword(String account, String password) {
        return adminMapper.findAdminByAccountAndPassword(account, password);
    }
}
