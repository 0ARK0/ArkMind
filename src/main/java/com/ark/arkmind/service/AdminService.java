package com.ark.arkmind.service;

import com.ark.arkmind.po.Admin;

public interface AdminService {
    Admin findAdminByAccountAndPassword(String account, String password);
}
