var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";
var nodeValue = [];
var indicatorData = [];

//  图表初始化
var aChart = echarts.init(document.getElementById("chartDiv"));
var cChart = echarts.init(document.getElementById("chartDiv2"));

//  显示个人分析图表
function showChart(){
    var option = {
        title: {
            text: '知识点雷达分析图'
        },
        tooltip: {},
        legend: {
            data: ['知识点得分']
        },
        radar: {
            shape: 'circle',
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#00b894',
                },
            },
            indicator: indicatorData
        },
        series: [{
            name: '分数',
            type: 'radar',
            areaStyle: {normal: {color: "rgba(0, 184, 148, 0.6)"}},
            symbolSize: 10, // 拐点的大小
            data: [
                {
                    value: nodeValue,
                    name: '知识点得分',
                    itemStyle: {
                        normal: {
                            color: 'rgba(0, 184, 148, 0.6)',
                            lineStyle: {
                                width: 1,
                                color: 'rgba(0, 184, 148, 0.3)',
                            },
                        },
                    }
                }
            ]
        }]
    };
    aChart.setOption(option);
}

//   当前点击的tr，全局变量
var currentTr;

//  打开个人分析评价的对话框
function individualAnalyse(btn) {
    var bodyHeight = document.body.offsetHeight;
    $(".fullHide").css("height", bodyHeight);
    $(".fullHide").show();
    currentTr = $(btn).parent().parent();
    var studentId = $(btn).parent().parent().find("td").eq(0).html();
    var classId = $("#classIdInput").val();
    var chartId = $("#chartIdInput").val();
    //  请求数据，生成图表
    generateChart(studentId, classId, chartId);
    //  显示右侧学生信息
    var studentName = $(btn).parent().parent().find("td").eq(1).html();
    var score = $(btn).parent().parent().find("td").eq(3).html();
    var msgDiv = "<div class='iadr-item'>学生学号："+studentId+"</div>" + "<div class='iadr-item'>学生姓名："+studentName+"</div>" + "<div class='iadr-item'>课程总评："+score+"</div>";
    $(".iadr-content").append(msgDiv);
    var scrollTop = document.documentElement.scrollTop;
    $(".individualAnalyseDiv").css("top", scrollTop+30);
    $(".individualAnalyseDiv").show();
}

//  切换到上一个学生的评价信息
function toPrevStuItem() {
    var prevTr = $(currentTr).prev();
    if($(prevTr).find("td").eq(0).html() === undefined){
        return;
    }
    nodeValue = [];
    indicatorData = [];
    $(".iadr-content").empty();
    currentTr = prevTr;
    var studentId = $(prevTr).find("td").eq(0).html();
    var classId = $("#classIdInput").val();
    var chartId = $("#chartIdInput").val();
    //  请求数据，生成图表
    generateChart(studentId, classId, chartId);
    //  显示右侧学生信息
    var studentName = $(prevTr).find("td").eq(1).html();
    var score = $(prevTr).find("td").eq(3).html();
    var msgDiv = "<div class='iadr-item'>学生学号："+studentId+"</div>" + "<div class='iadr-item'>学生姓名："+studentName+"</div>" + "<div class='iadr-item'>课程总评："+score+"</div>";
    $(".iadr-content").append(msgDiv);
}

//  切换到下一个学生的评价信息
function toNextStuItem() {
    var nextTr = $(currentTr).next();
    if($(nextTr).find("td").eq(0).html() === undefined){
        return;
    }
    nodeValue = [];
    indicatorData = [];
    $(".iadr-content").empty();
    currentTr = nextTr;
    var studentId = $(nextTr).find("td").eq(0).html();
    var classId = $("#classIdInput").val();
    var chartId = $("#chartIdInput").val();
    //  请求数据，生成图表
    generateChart(studentId, classId, chartId);
    //  显示右侧学生信息
    var studentName = $(nextTr).find("td").eq(1).html();
    var score = $(nextTr).find("td").eq(3).html();
    var msgDiv = "<div class='iadr-item'>学生学号："+studentId+"</div>" + "<div class='iadr-item'>学生姓名："+studentName+"</div>" + "<div class='iadr-item'>课程总评："+score+"</div>";
    $(".iadr-content").append(msgDiv);
}

//  请求数据生成雷达图
function generateChart(studentId, classId, chartId) {
    var formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("classId", classId);
    formData.append("chartId", chartId);
    $.ajax({
        url: URL + "/evaluate/getStudentEvaluate",
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        async : false,
        success: function (data) {
            for(var i in data){
                indicatorData.push({name: data[i].name, max: 100});
                nodeValue.push(data[i].score);
            }
        }
    });
    showChart();
}

//  关闭个人分析评价的对话框
function closeIndividualAnalyseDiv() {
    nodeValue = [];
    indicatorData = [];
    $(".iadr-content").empty();
    $(".individualAnalyseDiv").hide();
    $(".fullHide").hide();
}

var xData = []; //  横轴的姓名，一次显示10个
var scoreData = []; //  每个姓名对应的成绩
var colorData = []; //  不同的成绩用不同颜色显示，90——100是绿色，60——89是蓝色，0——59是红色
var pageIndex = 1;  //  当前页码
var k = 10;

//  显示综合分析图表
function showComprehensiveChart() {
    var option = {
        color: ['#22a6b3'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xData,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: 100,
                splitArea: {
                    show: true
                }
            }

        ],
        series: [
            {
                name: '分数',
                type: 'bar',
                barWidth: '60%',
                data: scoreData,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList = colorData;
                            return colorList[params.dataIndex]
                        }
                    }
                }
            }
        ]
    };
    cChart.setOption(option);
}

//  打开综合分析的对话框
function openAnalyseDiv() {
    var bodyHeight = document.body.offsetHeight;
    $(".fullHide").css("height", bodyHeight);
    $(".fullHide").show();
    var stuNum =  $(".stu-tr").length;
    //  填充班级总人数信息
    $("#ardc-item-classStuNum").find("span").html(stuNum);
    var excellentNum = 0;
    var regularNum = 0;
    var unqualifiedNum = 0;
    $(".stu-tr").each(function (i) {
        var score = $(this).find("td").eq(3).html();
        if(parseInt(score) >= 90){
            excellentNum++;
        }else if(parseInt(score) >= 60 && parseInt(score) < 90){
            regularNum++;
        }else {
            unqualifiedNum++;
        }
    });
    $("#ardc-item-excellent").find("span").html(excellentNum);
    $("#ardc-item-regular").find("span").html(regularNum);
    $("#ardc-item-unqualified").find("span").html(unqualifiedNum);
    pageIndex = 1;
    k = 10;
    //  获取表格前十个学生的答题数据填充数组
    $(".zebra").find(".stu-tr").each(function (i) {
        if(i >= k){
            return;
        }
        var stuName = $(this).find("td").eq(1).html();
        var stuScore = $(this).find("td").eq(3).html();
        var stuScoreColor;
        if(parseInt(stuScore) < 60){
            stuScoreColor = "#c0392b";
        }else if(parseInt(stuScore) >= 90){
            stuScoreColor = "#2ecc71";
        }else{
            stuScoreColor = "#3498db";
        }
        xData.push(stuName);
        scoreData.push(stuScore);
        colorData.push(stuScoreColor);
    });
    showComprehensiveChart();
    $("#analyseDiv").show();
}

//  显示图表前一页
function toPrevPage() {
    if(pageIndex === 1){
        return;
    }
    xData = [];
    scoreData = [];
    colorData = [];
    var start = ((pageIndex - 2) * k) > 0 ? (pageIndex - 2) * k : 0;
    var end = (pageIndex - 1) * k;
    pageIndex--;
    $(".zebra").find(".stu-tr").each(function (i) {
        if(i < start || i >= end){
            return;
        }
        var stuName = $(this).find("td").eq(1).html();
        var stuScore = $(this).find("td").eq(3).html();
        var stuScoreColor;
        if(parseInt(stuScore) < 60){
            stuScoreColor = "#c0392b";
        }else if(parseInt(stuScore) >= 90){
            stuScoreColor = "#2ecc71";
        }else{
            stuScoreColor = "#3498db";
        }
        xData.push(stuName);
        scoreData.push(stuScore);
        colorData.push(stuScoreColor);
    });
    showComprehensiveChart();
}

//  显示图表后一页
function toNextPage() {
    xData = [];
    scoreData = [];
    colorData = [];
    var start = pageIndex * k;
    var end = start + k;
    if($(".zebra").find(".stu-tr").length <= start){
        return;
    }
    pageIndex++;
    $(".zebra").find(".stu-tr").each(function (i) {
        if(i < start || i >= end){
            return;
        }
        var stuName = $(this).find("td").eq(1).html();
        var stuScore = $(this).find("td").eq(3).html();
        var stuScoreColor;
        if(parseInt(stuScore) < 60){
            stuScoreColor = "#c0392b";
        }else if(parseInt(stuScore) >= 90){
            stuScoreColor = "#2ecc71";
        }else{
            stuScoreColor = "#3498db";
        }
        xData.push(stuName);
        scoreData.push(stuScore);
        colorData.push(stuScoreColor);
    });
    showComprehensiveChart();
}

function closeAnalyseDiv() {
    xData = [];
    scoreData = [];
    colorData = [];
    pageIndex = 1;
    k = 10;
    $("#analyseDiv").hide();
    $(".fullHide").hide();
}