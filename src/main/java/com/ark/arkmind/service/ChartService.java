package com.ark.arkmind.service;

import com.ark.arkmind.po.Chart;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface ChartService {
    @Transactional
    Chart saveNewChart(String jsonData, String userId);

    @Transactional
    Chart saveChart(String jsonData, String userId, String fileName);

    List<Map<String,String>> getCharts(String userId);

    @Transactional
    void deleteChart(String userId, String fileName);

    List<Chart> findAllCharts(String userId);

    Chart findChartByPath(String chartPath);
}
