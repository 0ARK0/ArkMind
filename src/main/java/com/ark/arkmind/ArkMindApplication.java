package com.ark.arkmind;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement // 开启注解事务管理
@SpringBootApplication()
@MapperScan("com.ark.arkmind.mapper")
@ComponentScan(basePackages = {"com.ark.arkmind.controller", "com.ark.arkmind.service", "com.ark.arkmind.serviceImpl","com.ark.arkmind.dao","com.ark.arkmind.daoImpl","com.ark.arkmind.po", "com.ark.arkmind.config"})
public class ArkMindApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArkMindApplication.class, args);
	}

}
