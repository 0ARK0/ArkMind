package com.ark.arkmind.dao;

import com.ark.arkmind.po.Admin;

public interface AdminDao {
    Admin findAdminByAccountAndPassword(String account, String password);
}
