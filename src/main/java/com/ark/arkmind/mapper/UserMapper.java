package com.ark.arkmind.mapper;

import com.ark.arkmind.po.ClassAndChart;
import com.ark.arkmind.po.ClassAndTeacher;
import com.ark.arkmind.po.User;
import org.apache.ibatis.annotations.*;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

public interface UserMapper {
    @Select("SELECT * FROM user WHERE account = #{account} AND password = #{password}")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "account", column = "account"),
            @Result(property = "password", column = "password"),
            @Result(property = "userName", column = "user_name"),
            @Result(property = "sex", column = "sex")
    })
    User findUserByAccountAndPassword(String account, String password);

    @Select("SELECT * FROM user WHERE account = #{account}")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "account", column = "account"),
            @Result(property = "password", column = "password"),
            @Result(property = "userName", column = "user_name"),
            @Result(property = "sex", column = "sex")
    })
    User findUserByAccount(String account);

    @Insert("INSERT INTO user VALUES(#{userId},#{account},#{password},#{userName},#{sex})")
    void saveUser(User user);

    @Select("SELECT * FROM user")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "account", column = "account"),
            @Result(property = "password", column = "password"),
            @Result(property = "userName", column = "user_name"),
            @Result(property = "sex", column = "sex")
    })
    List<User> findAllByPage();

    @Update("UPDATE user SET account = #{account}, password = #{password}, user_name = #{userName}, sex = #{sex} WHERE user_id = #{userId}")
    void updateUser(User user);

    @Select("SELECT * FROM user WHERE user_id = #{userId}")
    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "account", column = "account"),
            @Result(property = "password", column = "password"),
            @Result(property = "userName", column = "user_name"),
            @Result(property = "sex", column = "sex")
    })
    User findUserById(String userId);

    @DeleteProvider(type = Provider.class, method = "batchDelete")
    void deleteUserBatch(List<String> userIdList);

    @InsertProvider(type = Provider.class, method = "batchInsertClassAndTeacher")
    void addClassForUser(List<ClassAndTeacher> newClassList);

    @DeleteProvider(type = Provider.class, method = "batchDeleteClassAndTeacher")
    void delClassForUser(List<ClassAndTeacher> cancelClassList);

    @Update("UPDATE user SET password = #{newPwd} WHERE user_id = #{userId}")
    void updatePwd(String newPwd, String userId);

    class Provider{
        public String batchDelete(Map map){
            List<String> userIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM user WHERE user_id IN (");
            for (int i = 0; i < userIdList.size(); i++) {
                sb.append("'").append(userIdList.get(i)).append("'");
                if (i < userIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }

        public String batchInsertClassAndTeacher(Map map){
            List<ClassAndTeacher> classAndTeacherList = (List<ClassAndTeacher>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("INSERT INTO class_teacher VALUES");
            MessageFormat mf = new MessageFormat(
                    "(#'{'list[{0}].classTeacherId}, #'{'list[{0}].classId}, #'{'list[{0}].teacherId})"
            );
            for (int i=0; i<classAndTeacherList.size(); i++) {
                sb.append(mf.format(new Object[] {i}));
                if (i < classAndTeacherList.size() - 1){
                    sb.append(",");
                }
            }
            return sb.toString();
        }

        public String batchDeleteClassAndTeacher(Map map){
            List<ClassAndTeacher> classAndTeacherList = (List<ClassAndTeacher>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM class_teacher WHERE class_teacher_id IN (");
            for (int i = 0; i < classAndTeacherList.size(); i++) {
                sb.append("'").append(classAndTeacherList.get(i).getClassTeacherId()).append("'");
                if (i < classAndTeacherList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }
    }
}
