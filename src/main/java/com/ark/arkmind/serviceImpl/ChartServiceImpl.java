package com.ark.arkmind.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.dao.ChartDao;
import com.ark.arkmind.dao.FileDao;
import com.ark.arkmind.dao.MyClassDao;
import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.po.Chart;
import com.ark.arkmind.po.Node;
import com.ark.arkmind.service.ChartService;
import com.fasterxml.jackson.annotation.JsonAlias;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class ChartServiceImpl implements ChartService {
    @Autowired
    ChartDao chartDao;
    @Autowired
    MyClassDao myClassDao;
    @Autowired
    FileDao fileDao;
    @Autowired
    StudentDao studentDao;

    @Override
    public Chart saveNewChart(String jsonData, String userId) {
        //  将json字符串保存到一个文件当中，文件名采用日期+随机数序列，将文件保存在服务器磁盘上，
        //  在用户文件夹中创建charts文件夹，将json数据的存入该文件夹，
        //  同时，为json数据的每个节点都建立一个文件夹，用于存放每个知识点的内容（包括office文件、图片、视频等）
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind"  + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind"  + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        }
        if(!dir.exists()){
            dir.mkdirs();
        }
        //  为每个新的图表创建自己的文件夹
        File chartDir = new File(dir.getPath() + System.getProperty("file.separator") + UUID.randomUUID());
        if(!chartDir.exists()){
            chartDir.mkdirs();
        }
        String fileName = chartDir.getName() + ".json";
        //  调用dao层逻辑将图表的信息存入数据库的chart表中
        Chart chart = new Chart();
        chart.setChartId(UUID.randomUUID().toString());
        //  将json字符串转换为json对象，读取该图表的名称
        JSONObject jsonObj = JSON.parseObject(jsonData);
        chart.setChartName(jsonObj.getString("name"));
        chart.setPath(chartDir.getPath() + System.getProperty("file.separator") + fileName);
        chart.setUserId(userId);
        chart.setJsonFileName(fileName);
        chartDao.saveNewChart(chart);

        //  存json文件
        try {
            File file = new File(chartDir.getPath() + System.getProperty("file.separator") + fileName);
            if(!file.exists()){
                file.createNewFile();
            }
            BufferedWriter bw = new BufferedWriter(new FileWriter(file));
            bw.write(jsonData);
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return chart;
    }

    @Override
    public Chart saveChart(String jsonData, String userId, String fileName) {
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        }
        File jsonFile = new File(dir.getPath() + System.getProperty("file.separator") + fileName.substring(0, fileName.lastIndexOf(".")) + System.getProperty("file.separator") + fileName);
        //  修改数据库中的chartName
        //  将json字符串转换为json对象，读取该图表的名称
        JSONObject jsonObj = JSON.parseObject(jsonData);
        Chart chart = new Chart();
        chart.setChartName(jsonObj.getString("name"));
        chart.setPath(jsonFile.getPath());
        chart.setJsonFileName(fileName);
        chartDao.updateChartName(chart);
        //  覆盖原有的json文件
        if(jsonFile.exists()){
            try {
                BufferedWriter bf = new BufferedWriter(new FileWriter(jsonFile));
                bf.write("");
                bf.flush();
                bf.write(jsonData);
                bf.flush();
                bf.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return chart;
    }

    @Override
    public List<Map<String,String>> getCharts(String userId) {
        //  根据userId去指定目录中查找json文件，将所有的json文件读出来存入list中
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts");
        }
        if(!dir.exists()){
            dir.mkdirs();
        }
        List<Map<String,String>> chartList = new ArrayList<>();
        Map<String, String> cmap = null;
        BufferedReader br = null;
        for(File jsonDir: dir.listFiles()){
            try {
                File[] jsonFiles = jsonDir.listFiles(new FilenameFilter() {
                    @Override
                    public boolean accept(File dir, String name) {
                        if(name.toLowerCase().endsWith(".json")){
                            return true;
                        }
                        return false;
                    }
                });
                cmap = new HashMap<>();
                cmap.put("fileName", jsonFiles[0].getName());
                cmap.put("filePath", jsonFiles[0].getPath());
                br = new BufferedReader(new FileReader(jsonFiles[0]));
                String line = "";
                String jsonStr = "";
                while ((line = br.readLine()) != null){
                    jsonStr += line;
                }
                cmap.put("jsonData", jsonStr);
                chartList.add(cmap);
                br.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return chartList;
    }

    @Override
    public void deleteChart(String userId, String fileName) {
        String os = System.getProperty("os.name");
        File dir;
        String chartDir = fileName.substring(0, fileName.lastIndexOf("."));
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts"+ System.getProperty("file.separator") + chartDir);
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts"+ System.getProperty("file.separator") + chartDir);
        }
        //  删除数据库中关于图表的所有数据
        //  先删除chart表中的数据
        Chart chart = new Chart();
        chart.setPath(dir.getPath() + System.getProperty("file.separator") + fileName);
        chart.setUserId(userId);
        chartDao.deleteChart(chart);
        //  然后删除class_chart表中的数据
        myClassDao.deleteClassChart(chart);
        //  删除file中关于图表的学习内容的记录
        fileDao.deleteFileByChartDir(chartDir, userId);
        //  删除answer_record表中关于该图表的学生答题记录
        studentDao.deleteAnswerRecordByDelChart(dir.getPath(), userId);
        //  删除图表的所有文件
        if(dir.exists() && dir.isDirectory()){
            deleteAllFiles(dir);
        }
    }

    @Override
    public List<Chart> findAllCharts(String userId) {
        return chartDao.findAllCharts(userId);
    }

    @Override
    public Chart findChartByPath(String chartPath) {
        return chartDao.findChartByPath(chartPath);
    }

    //递归删除目录下所有文件和文件夹
    private void deleteAllFiles(File file){
        if(file.isDirectory()){
            for(File childFile:file.listFiles()){
                deleteAllFiles(childFile);
            }
            file.delete();
        }else{
            file.delete();
        }
    }
}
