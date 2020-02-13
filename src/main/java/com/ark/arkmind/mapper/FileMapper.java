package com.ark.arkmind.mapper;

import com.ark.arkmind.po.MyFile;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface FileMapper {
    @Insert("INSERT INTO file VALUES(#{filePath},#{pidPath},#{originalName},#{chartDir},#{userId})")
    void saveMyFile(MyFile myFile);

    @Select("SELECT * FROM file WHERE pid_path = #{pidPath} AND user_id = #{userId}")
    @Results({
            @Result(property = "filePath", column = "file_path"),
            @Result(property = "pidPath", column = "pid_path"),
            @Result(property = "originalName", column = "original_name"),
            @Result(property = "chartDir", column = "chart_dir"),
            @Result(property = "userId", column = "user_id")
    })
    List<MyFile> getMyFiles(MyFile myFile);

    @Delete("DELETE FROM file WHERE file_path = #{filePath}")
    void deleteLearningFile(String filePath);

//    @DeleteProvider(type = Provider.class, method = "batchDelete")
//    void delSomeNode(List<String> pidPathList);

    @Delete("DELETE FROM file WHERE pid_path = #{pidPath}")
    void delSomeNode(String pidPath);

    @Delete("DELETE FROM file WHERE chart_dir = #{chartDir} AND user_id = #{userId}")
    void deleteFileByChartDir(String chartDir, String userId);

    class Provider{
        public String batchDelete(Map map){
            List<String> pidPathList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM file WHERE pid_path IN (");
            for (int i = 0; i < pidPathList.size(); i++) {
                sb.append("'").append(pidPathList.get(i)).append("'");
                if (i < pidPathList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }
    }
}
