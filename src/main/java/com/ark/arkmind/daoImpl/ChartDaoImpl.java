package com.ark.arkmind.daoImpl;

import com.ark.arkmind.dao.ChartDao;
import com.ark.arkmind.mapper.ChartMapper;
import com.ark.arkmind.po.Chart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ChartDaoImpl implements ChartDao {
    @Autowired
    ChartMapper chartMapper;

    @Override
    public void saveNewChart(Chart chart) {
        chartMapper.saveNewChart(chart);
    }

    @Override
    public void updateChartName(Chart chart) {
        chartMapper.updateChartName(chart);
    }

    @Override
    public void deleteChart(Chart chart) {
        chartMapper.deleteChart(chart);
    }

    @Override
    public List<Chart> findAllCharts(String userId) {
        return chartMapper.findAllCharts(userId);
    }

    @Override
    public void deleteChartByUserBatch(List<String> userIdList) {
        chartMapper.deleteChartByUserBatch(userIdList);
    }

    @Override
    public Chart findChartById(String chartId) {
        return chartMapper.findChartById(chartId);
    }

    @Override
    public Chart findChartByPath(String chartPath) {
        return chartMapper.findChartByPath(chartPath);
    }
}
