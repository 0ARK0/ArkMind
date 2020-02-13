package com.ark.arkmind.serviceImpl;

import com.ark.arkmind.dao.AdminDao;
import com.ark.arkmind.po.Admin;
import com.ark.arkmind.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    AdminDao adminDao;

    @Override
    public Admin findAdminByAccountAndPassword(String account, String password) {
        return adminDao.findAdminByAccountAndPassword(account, password);
    }
}
