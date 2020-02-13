package com.ark.arkmind.mapper;

import com.ark.arkmind.po.Admin;
import org.apache.ibatis.annotations.Select;

public interface AdminMapper {
    @Select("SELECT * FROM admin WHERE account = #{account} AND password = #{password}")
    Admin findAdminByAccountAndPassword(String account, String password);
}
