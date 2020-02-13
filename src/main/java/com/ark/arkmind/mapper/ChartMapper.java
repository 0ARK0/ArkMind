package com.ark.arkmind.mapper;

import com.ark.arkmind.po.Chart;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

public interface ChartMapper {
    @Insert("INSERT INTO chart VALUES(#{chartId},#{path},#{chartName},#{userId})")
    void saveNewChart(Chart chart);

    @Update("UPDATE chart SET chart_name = #{chartName} WHERE path = #{path}")
    void updateChartName(Chart chart);

    @Delete("DELETE FROM chart WHERE path = #{path} AND user_id = #{userId}")
    void deleteChart(Chart chart);

    @Select("SELECT * FROM chart WHERE user_id = #{userId}")
    @Results({
            @Result(property = "chartId", column = "chart_id"),
            @Result(property = "path", column = "path"),
            @Result(property = "chartName", column = "chart_name"),
            @Result(property = "userId", column = "user_id")
    })
    List<Chart> findAllCharts(String userId);

    @DeleteProvider(type = Provider.class, method = "batchDelete")
    void deleteChartByUserBatch(List<String> userIdList);

    @Select("SELECT * FROM chart WHERE chart_id = #{chartId}")
    @Results({
            @Result(property = "chartId", column = "chart_id"),
            @Result(property = "path", column = "path"),
            @Result(property = "chartName", column = "chart_name"),
            @Result(property = "userId", column = "user_id")
    })
    Chart findChartById(String chartId);

    @Select("SELECT * FROM chart WHERE path = #{chartPath}")
    @Results({
            @Result(property = "chartId", column = "chart_id"),
            @Result(property = "path", column = "path"),
            @Result(property = "chartName", column = "chart_name"),
            @Result(property = "userId", column = "user_id")
    })
    Chart findChartByPath(String chartPath);

    class Provider{
        public String batchDelete(Map map){
            List<String> userIdList = (List<String>) map.get("list");
            StringBuffer sb = new StringBuffer();
            sb.append("DELETE FROM chart WHERE user_id IN (");
            for (int i = 0; i < userIdList.size(); i++) {
                sb.append("'").append(userIdList.get(i)).append("'");
                if (i < userIdList.size() - 1)
                    sb.append(",");
            }
            sb.append(")");
            return sb.toString();
        }
    }
}
