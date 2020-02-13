package com.ark.arkmind.mapper;

import com.ark.arkmind.po.AnswerRecord;
import com.ark.arkmind.po.Student;
import org.apache.ibatis.annotations.*;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

public interface StudentMapper {
    @InsertProvider(type = Provider.class, method = "batchInsert")
    void saveStudentList(List<Student> studentList);

    @Select("SELECT * FROM student WHERE student_id = #{studentId} AND password = #{password}")
    @Results({
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "password", column = "password"),
            @Result(property = "name", column = "name"),
            @Result(property = "sex", column = "sex"),
            @Result(property = "classId", column = "class_id")
    })
    Student findStudentByIdAndPassword(Student student);

    @Select("SELECT * FROM student WHERE class_id = #{classId}")
    @Results({
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "password", column = "password"),
            @Result(property = "name", column = "name"),
            @Result(property = "sex", column = "sex"),
            @Result(property = "classId", column = "class_id")
    })
    List<Student> findAllStudentByClassId(String classId);

    @Delete("DELETE FROM student WHERE class_id = #{classId}")
    int deleteStudentsByClassId(String classId);

    @Update("UPDATE student SET password = #{newPwd} WHERE student_id = #{studentId}")
    void updatePwd(String newPwd, String studentId);

    @Insert("INSERT INTO answer_record VALUES(#{answerRecordId},#{score},#{answer},#{row},#{studentId},#{chartPath},#{pid},#{state},#{userId})")
    void saveStuAnswerRecord(AnswerRecord ar);

    @Select("SELECT * FROM answer_record WHERE student_id = #{studentId} AND pid = #{pid} AND user_id = #{userId}")
    @Results({
            @Result(property = "answerRecordId", column = "answer_record_id"),
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "chartPath", column = "chart_path"),
            @Result(property = "userId", column = "user_id"),
    })
    AnswerRecord getAnswerRecord(String studentId, String pid, String userId);

    @Select("SELECT * FROM answer_record WHERE chart_path = #{chartPath} AND pid = #{pid} AND user_id = #{userId}")
    @Results({
            @Result(property = "answerRecordId", column = "answer_record_id"),
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "chartPath", column = "chart_path"),
            @Result(property = "userId", column = "user_id"),
    })
    List<AnswerRecord> getAllStuAnswerRecords(Map<String, String> dataMap);

    @SelectProvider(type = Provider.class, method = "batchSelect")
    @Results({
            @Result(property = "studentId", column = "student_id"),
            @Result(property = "password", column = "password"),
            @Result(property = "name", column = "name"),
            @Result(property = "sex", column = "sex"),
            @Result(property = "classId", column = "class_id")
    })
    List<Student> findStudentsByIdList(List<String> studentIdList);

    @Delete("DELETE FROM answer_record WHERE chart_path = #{path} AND pid = #{pid} AND user_id = #{userId}")
    void delStuAnswerRecordByNode(String path, String pid, String userId);

    @Delete("DELETE FROM answer_record WHERE chart_path = #{path} AND user_id = #{userId}")
    void deleteAnswerRecordByDelChart(String path, String userId);

    @Delete("DELETE FROM answer_record WHERE answer_record_id = #{answerRecordId}")
    void deleteAnswerMsgById(String answerRecordId);

    @Update("UPDATE answer_record SET score = #{score}, `row` = #{row}, state = #{state} WHERE answer_record_id = #{answerRecordId}")
    void saveEcAnswerScore(AnswerRecord ar);

    @Select("SELECT answer_record_id,score,B.student_id,pid FROM answer_record A JOIN student B ON A.student_id = B.student_id AND chart_path=#{path}")
    @Results({
            @Result(property = "answerRecordId", column = "answer_record_id"),
            @Result(property = "studentId", column = "student_id"),
    })
    List<AnswerRecord> findAnswerRecordByClassIdAndChartPath(String classId, String path);

    @Select("SELECT score,pid FROM answer_record WHERE student_id = #{studentId} AND chart_path=#{path}")
    List<AnswerRecord> findAnswerRecordByStudentIdAndChartPath(String studentId, String path);

    class Provider{
        public String batchInsert(Map map){
            List<Student> studentList = (List<Student>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("INSERT INTO student VALUES");
            MessageFormat mf = new MessageFormat(
                    "(#'{'list[{0}].studentId}, #'{'list[{0}].password}, #'{'list[{0}].name}, #'{'list[{0}].sex}, #'{'list[{0}].grade}, #'{'list[{0}].classId})"
            );
            for (int i=0; i<studentList.size(); i++) {
                sb.append(mf.format(new Object[] {i}));
                if (i < studentList.size() - 1){
                    sb.append(",");
                }
            }
            return sb.toString();
        }

        public String batchSelect(Map map){
            List<String> studentIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("SELECT * FROM student WHERE student_id IN (");
            for (int i = 0; i < studentIdList.size(); i++) {
                sb.append("'").append(studentIdList.get(i)).append("'");
                if (i < studentIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }
    }
}
