package com.ark.arkmind.dao;

import com.ark.arkmind.po.Chart;

import java.util.List;

public interface ChartDao {
    void saveNewChart(Chart chart);

    void updateChartName(Chart chart);

    void deleteChart(Chart chart);

    List<Chart> findAllCharts(String userId);

    void deleteChartByUserBatch(List<String> userIdList);

    Chart findChartById(String chartId);

    Chart findChartByPath(String chartPath);
}
