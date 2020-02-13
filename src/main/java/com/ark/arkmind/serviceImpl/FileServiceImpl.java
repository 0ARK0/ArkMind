package com.ark.arkmind.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.ark.arkmind.dao.FileDao;
import com.ark.arkmind.dao.StudentDao;
import com.ark.arkmind.po.MyClass;
import com.ark.arkmind.po.MyFile;
import com.ark.arkmind.po.Node;
import com.ark.arkmind.po.Student;
import com.ark.arkmind.service.FileService;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    FileDao fileDao;
    @Autowired
    StudentDao studentDao;

    //读取excel文件，经过转换后返回用于生成思维导图的json字符串
    @Override
    public String readWorkbookToChartJson(MultipartFile file) {
        Workbook workbook = getWorkbook(file); //获取文档
        Sheet sheet = workbook.getSheetAt(0); //获取文档中第一个sheet页
        String[] longName = file.getOriginalFilename().split("\\/");
        String tempName = longName[longName.length-1];
        Node root = new Node();
        root.setName(tempName.split("\\.")[0]);
        int rowNum = sheet.getPhysicalNumberOfRows(); //获取总行数
        generateObject(sheet, 0, rowNum, 0, getNumberOfCols(sheet), root);
        String result = JSON.toJSONString(root); //将java对象转换为json字符串
        return result;
    }

    //读取excel文件，生成班级信息，excel文件中必须包含姓名、学号、年级信息，否则传回错误信息
    @Override
    public MyClass readWorkbookToClass(MultipartFile file) {
        Workbook workbook = getWorkbook(file); //获取文档
        Sheet sheet = workbook.getSheetAt(0); //获取文档中第一个sheet页
        String[] longName = file.getOriginalFilename().split("\\/");
        String tempName = longName[longName.length-1];
        MyClass myClass = new MyClass();
        //为班级生成唯一的班级id
        myClass.setClassId(UUID.randomUUID().toString());
        myClass.setName(tempName.split("\\.")[0]);
        int rowNum = sheet.getPhysicalNumberOfRows(); //获取总行数
        int colNum = sheet.getRow(0).getLastCellNum(); //获取第一行的列数
        Integer stuIdCol = null;
        Integer stuNameCol = null;
        Integer stuSexCol = null;
        Integer stuGradeCol = null;
        for(int i=0; i<colNum; i++){ // 遍历表头，找到姓名，学号，年级和性别列
            String cellStr = getCellValueByCell(sheet.getRow(0).getCell(i));
            if("学号".equals(cellStr)){
                stuIdCol = i;
            }else if("姓名".equals(cellStr)){
                stuNameCol = i;
            }else if("性别".equals(cellStr)){
                stuSexCol = i;
            }else if("年级".equals(cellStr)){
                stuGradeCol = i;
            }
        }
        //  如果没有学号、姓名、年级列则不能创建班级信息
        if(stuIdCol == null || stuNameCol == null || stuGradeCol == null){
            return null;
        }
        List<Student> studentList = new ArrayList<>();
        Student student;
        //  将学生数据保存为java对象，学生的账号为学号，学生的初始密码是学号
        for(int i=1;i<rowNum;i++){
            student = new Student();
            student.setStudentId(getCellValueByCell(sheet.getRow(i).getCell(stuIdCol)));
            student.setPassword(student.getStudentId());
            student.setName(getCellValueByCell(sheet.getRow(i).getCell(stuNameCol)));
            if(stuSexCol != null){
                student.setSex(getCellValueByCell(sheet.getRow(i).getCell(stuSexCol)));
            }
            student.setGrade(getCellValueByCell(sheet.getRow(i).getCell(stuGradeCol)));
            student.setClassId(myClass.getClassId());
            studentList.add(student);
        }
        myClass.setGrade(studentList.get(0).getGrade());
        myClass.setStudentList(studentList);
        //  调用dao层将班级和学生的数据存入数据库中
        fileDao.saveClassAndStudent(myClass);
        return myClass;
    }

    @Override
    public MyFile saveLearningFile(MultipartFile file, String userId, String jsonDir, String pid) {
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        }
        if(!dir.exists()){
            dir.mkdirs();
        }
        File newFile = new File(dir.getPath() + System.getProperty("file.separator") + UUID.randomUUID().toString() + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")));
        //  调用dao层逻辑，将文件的原文件名和新文件名对应起来存到数据库，以便回显到前端页面
        MyFile myFile = new MyFile();
        myFile.setFilePath(newFile.getPath());
        myFile.setPidPath(dir.getPath());
        myFile.setOriginalName(file.getOriginalFilename());
        myFile.setChartDir(jsonDir);
        myFile.setUserId(userId);
        fileDao.saveMyFile(myFile);
        //  将文件保存在对应的用户目录的对应图表目录的对应节点目录中
        try {
            if(!newFile.exists()){
                newFile.createNewFile();
            }
            BufferedInputStream bis = new BufferedInputStream(file.getInputStream());
            BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(newFile));
            byte[] datas = new byte[1024];
            int len = 0;
            while((len = bis.read(datas)) >0){
                bos.write(datas, 0, len);
            }
            bos.close();
            bis.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return myFile;
    }

    @Override
    public List<MyFile> getMyFiles(String userId, String jsonDir, String pid) {
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        }
        MyFile myFile = new MyFile();
        myFile.setPidPath(dir.getPath());
        myFile.setUserId(userId);
        return fileDao.getMyFiles(myFile);
    }

    @Override
    public void deleteLearningFile(String filePath) {
        //  数据库中删除对应的数据
        fileDao.deleteLearningFile(filePath);
        File beDelFile = new File(filePath);
        beDelFile.delete();
    }

    @Override
    public boolean haveLearningFiles(String userId, String jsonDir, String pid) {
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {  //如果是Windows系统
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid);
        }
        if(!dir.exists()){
            return false;
        }
        File[] files =  dir.listFiles();
        if(files.length ==0){
            return false;
        }else{
            return true;
        }
    }

    @Override
    public void exerciseToJson(String pid, String jsonDir, String userId, String jsonStr) {
        //  将json字符串写入文件，在pid目录下新建一个exercise目录
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        }
        if(!dir.exists()){
            dir.mkdirs();
        }
        File jsonFile;
        if(dir.listFiles().length > 0){
            jsonFile = dir.listFiles()[0];
        }else{
            jsonFile = new File(dir.getPath() + System.getProperty("file.separator") + UUID.randomUUID().toString() + ".json");
        }
        if(!jsonFile.exists()){
            try {
                jsonFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        try {
            BufferedWriter bf = new BufferedWriter(new FileWriter(jsonFile));
            bf.write("");
            bf.flush();
            bf.write(jsonStr);
            bf.flush();
            bf.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public JSONArray getExercise(String pid, String jsonDir, String userId) {
        //  从该节点的exercise目录下读取json文件
        String os = System.getProperty("os.name");
        File dir;
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        }
        if(!dir.exists()){
            return null;
        }
        File[] files = dir.listFiles();
        if(files.length == 0){
            return null;
        }
        StringBuffer jsonStr = new StringBuffer();
        try {
            String line;
            BufferedReader br = new BufferedReader(new FileReader(files[0]));
            while((line = br.readLine()) != null){
                jsonStr.append(line);
            }
            br.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        JSONArray jsonArray = JSON.parseArray(jsonStr.toString());
        return jsonArray;
    }

    @Override
    public void delSomeNode(String userId, String jsonDir, String pid) {
        //  删除某个节点时，要删除该节点和子节点的所有文件夹以及数据库中保存的学习内容的记录
        //  先删除文件夹
        String os = System.getProperty("os.name");
        File dir; //    图表目录
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir);
        } else {
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir);
        }
        //  获取该图表目录下所有名称以pid开头的文件夹
        File[] fileList = dir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.startsWith(pid);
            }
        });
        if(fileList == null){
            return;
        }
        //  删除该节点的答题记录
        studentDao.delStuAnswerRecordByNode(dir.getPath(), pid, userId);
        //  删除这些文件夹,然后删除数据库file表中的记录
        for(File file: fileList){
            fileDao.delSomeNode(file.getPath());
            if(file.exists()){
                deleteAllFiles(file);
            }
        }
    }

    @Override
    public void delAllExerciseOfNode(String userId, String jsonDir, String pid) {
        //  删除数据库answer_record表中所有对应的答题记录
        String os = System.getProperty("os.name");
        String path;
        if (os.toLowerCase().startsWith("win")) {
            path = "E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir;
        } else {
            path = "/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir;
        }
        studentDao.delStuAnswerRecordByNode(path, pid, userId);

        //  删除对应节点的目录下的exercise文件夹
        File dir; //    图表目录
        if (os.toLowerCase().startsWith("win")) {
            dir = new File("E:\\SpringBootProjects\\ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        } else {  //linux 和mac
            dir = new File("/usr/local/SpringBootProjects/ArkMind" + System.getProperty("file.separator") + userId + System.getProperty("file.separator") + "charts" + System.getProperty("file.separator") + jsonDir + System.getProperty("file.separator") + pid + System.getProperty("file.separator") + "exercise");
        }
        deleteAllFiles(dir);
    }

    //  递归删除目录下所有文件和文件夹
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

    private Workbook getWorkbook(MultipartFile file){ //    根据excel文件的后缀名来获取对应的文档
        Workbook workbook = null;
        String suffix = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
        InputStream in = null;
        try {
            in = file.getInputStream();
            if("xls".equals(suffix)){
                workbook = new HSSFWorkbook(in);
            }else if("xlsx".equals(suffix)){
                workbook = new XSSFWorkbook(in);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return workbook;
    }

    private String getCellValueByCell(Cell cell) { //   判断单元格中数据的类型，并以字符串形式返回
        //  判断是否为null或空串
        if (cell == null || cell.toString().trim().equals("")) {
            return "";
        }
        String cellValue = "";
        switch (cell.getCellTypeEnum()) {
            case NUMERIC:
                if (HSSFDateUtil.isCellDateFormatted(cell)) {  //   判断日期类型
                    cellValue = new SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue());
                } else {  //否
                    cellValue = new DecimalFormat("#.######").format(cell.getNumericCellValue());
                }
                break;
            case STRING:
                cellValue = cell.getStringCellValue().trim();
                break;
            case BOOLEAN:
                cellValue = String.valueOf(cell.getBooleanCellValue());
                break;
            default:
                cellValue = "";
                break;
        }
        return cellValue;
    }

    private int getNumberOfCols(Sheet sheet){ //    获取表格的总列数(由于api没有提供这个方法所以要自己写)
        int rowNum = sheet.getPhysicalNumberOfRows();
        int maxColNum = sheet.getRow(0).getLastCellNum();
        for(int i=1; i<rowNum; i++){
            int colNum = sheet.getRow(i).getLastCellNum();
            if(colNum > maxColNum){
                maxColNum = colNum;
            }
        }
        return maxColNum;
    }

    //  递归将excel表中的数据封装成java对象
    private void generateObject(Sheet sheet, int start, int end, int index,int colNum, Node node){
        if(index >= colNum){
            return;
        }
        List<Node> children = new ArrayList<>();
        int newStart = 0;
        int newEnd = 0;
        for(int i=start; i<end; i++){
            Cell cell = sheet.getRow(i).getCell(index);
            String name = getCellValueByCell(cell);
            if(!"".equals(name)){
                Node node1 = new Node();
                node1.setName(name);
                newStart = i;
                int k = i + 1;

                while (k < end && "".equals(getCellValueByCell(sheet.getRow(k).getCell(index)))){
                    k++;
                }
                newEnd = k;
                i = k - 1;
                generateObject(sheet, newStart, newEnd, index+1, colNum, node1);
                children.add(node1);
            }
        }
        node.setChildren(children);
    }
}
