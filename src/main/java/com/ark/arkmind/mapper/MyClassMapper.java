package com.ark.arkmind.mapper;

import com.ark.arkmind.po.*;
import org.apache.ibatis.annotations.*;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

public interface MyClassMapper {
    @Insert("INSERT INTO class VALUES(#{classId},#{name},#{grade})")
    void saveMyClass(MyClass myClass);

    @SelectProvider(type = Provider.class, method = "batchSelect")
    @Results({
            @Result(property = "classId", column = "class_id"),
            @Result(property = "name", column = "name"),
    })
    List<MyClass> findAllMyClass(List<String> classIdList);

    @Delete("DELETE FROM class WHERE class_id = #{classId}")
    void deleteMyClassById(String classId);

    @Select("SELECT * FROM class_chart WHERE class_id = #{classId}")
    @Results({
            @Result(property = "classChartId", column = "class_chart_id"),
            @Result(property = "classId", column = "class_id"),
            @Result(property = "chartPath", column = "chart_path"),
            @Result(property = "userId", column = "user_id")
    })
    List<ClassAndChart> findChartsByClassId(String classId);

    @Delete("DELETE FROM class_chart WHERE chart_path = #{path} AND user_id = #{userId}")
    void deleteClassChart(Chart chart);

    @InsertProvider(type = Provider.class, method = "batchInsert")
    void addCharts(List<ClassAndChart> classAndChartList);

    @Delete("DELETE FROM class_chart WHERE class_id = #{classId}")
    void deleteClassChartByClassId(String classId);

    @DeleteProvider(type = Provider.class, method = "batchDelete")
    void delCharts(List<ClassAndChart> cancelChartList);

    @Select("SELECT * FROM class")
    @Results({
            @Result(property = "classId", column = "class_id"),
            @Result(property = "name", column = "name"),
    })
    List<MyClass> findAllClass();

    @Select("SELECT class_id FROM class_teacher WHERE teacher_id = #{userId}")
    List<String> findAllMyClassId(String userId);

    @Select("SELECT * FROM class_teacher WHERE teacher_id = #{userId}")
    @Results({
            @Result(property = "classTeacherId", column = "class_teacher_id"),
            @Result(property = "classId", column = "class_id"),
            @Result(property = "teacherId", column = "teacher_id"),
    })
    List<ClassAndTeacher> findAllMyClassAndTeacher(String userId);

    @DeleteProvider(type = Provider.class, method = "batchDeleteClassChartByUserId")
    void deleteClassChartByUserBatch(List<String> userIdList);

    @DeleteProvider(type = Provider.class, method = "batchDeleteClassTeacherByUserId")
    void deleteClassTeacherByUserBatch(List<String> userIdList);

    @Select("SELECT * FROM class WHERE class_id in (SELECT class_id FROM class_chart WHERE chart_path = #{path} AND user_id = #{userId})")
    @Results({
            @Result(property = "classId", column = "class_id"),
    })
    List<MyClass> findClassesForChart(String path, String userId);

    @Select("SELECT COUNT(*) FROM student WHERE class_id = #{classId}")
    int getStuNumByClassId(String classId);

    @Select("SELECT * FROM class WHERE class_id = #{classId}")
    @Results({
            @Result(property = "classId", column = "class_id"),
    })
    MyClass getClassByClassId(String classId);

    class Provider{
        public String batchInsert(Map map){
            List<ClassAndChart> classAndChartList = (List<ClassAndChart>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("INSERT INTO class_chart VALUES");
            MessageFormat mf = new MessageFormat(
                    "(#'{'list[{0}].classChartId}, #'{'list[{0}].classId}, #'{'list[{0}].chartPath}, #'{'list[{0}].userId})"
            );
            for (int i=0; i<classAndChartList.size(); i++) {
                sb.append(mf.format(new Object[] {i}));
                if (i < classAndChartList.size() - 1){
                    sb.append(",");
                }
            }
            return sb.toString();
        }

        public String batchDelete(Map map){
            List<ClassAndChart> classAndChartList = (List<ClassAndChart>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM class_chart WHERE class_chart_id IN (");
            for (int i = 0; i < classAndChartList.size(); i++) {
                sb.append("'").append(classAndChartList.get(i).getClassChartId()).append("'");
                if (i < classAndChartList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }

        public String batchDeleteClassChartByUserId(Map map){
            List<String> userIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM class_chart WHERE user_id IN (");
            for (int i = 0; i < userIdList.size(); i++) {
                sb.append("'").append(userIdList.get(i)).append("'");
                if (i < userIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }

        public String batchDeleteClassTeacherByUserId(Map map){
            List<String> userIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM class_teacher WHERE teacher_id IN (");
            for (int i = 0; i < userIdList.size(); i++) {
                sb.append("'").append(userIdList.get(i)).append("'");
                if (i < userIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }

        public String batchSelect(Map map){
            List<String> classIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("SELECT * FROM class WHERE class_id IN (");
            for (int i = 0; i < classIdList.size(); i++) {
                sb.append("'").append(classIdList.get(i)).append("'");
                if (i < classIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }
    }
}
