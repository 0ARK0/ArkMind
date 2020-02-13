var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";
var currentTR = null;

//  查看学生的答题情况
function checkStuAnswerMsg(btn) {
    var bodyHeight = document.body.offsetHeight;
    $(".fullHide").css("height", bodyHeight);
    $(".fullHide").show();
    currentTR = $(btn).parent().parent();
    var exercise = JSON.parse($("#exerciseInput").val());
    var answer = JSON.parse($(btn).next().val());
    var row = JSON.parse($(btn).next().next().val());
    //  填充answer_record_id
    var answer_record_id = $(btn).parent().next().find(".answer-record-id").val();
    $("#samb-answer-record-id").val(answer_record_id);
    //  填充题目
    fillThisNodeExerciseForStudent(exercise);
    //  填充答案
    fillStuAnswer({"answer":answer});
    //  填充答题情况
    backViewAnswer({"row":row});
    //  使所有表单的填写失效，防止用户更改
    $(".ec-inner").find("input").attr("disabled","disabled");
    $(".ec-textarea").attr("disabled","disabled");
    //  如果有问答题就显示提交按钮，并显示打分的input
    hasEcAnswer();
    var scrollTop = document.documentElement.scrollTop;
    $("#stuAnswerMsgBlock").css("top", scrollTop+30);
    $("#stuAnswerMsgBlock").show();
}

//  关闭学生答题情况的对话框
function closeSamb() {
    $(".ec-inner").empty();
    $("#stuAnswerMsgBlock").hide();
    $(".fullHide").hide();
}

//  清空本知识点所有答题记录
function emptyAllAnswerMsg() {
    var yn = confirm("确认清空该知识点所有学生的答题记录吗？");
    if(yn === false){
        return;
    }
    var jsonFileName = $("#jsonFileNameInput").val();
    var pid = $("#pidInput").val();
    var formData = new FormData();
    formData.append("jsonFileName", jsonFileName);
    formData.append("pid", pid);
    $.ajax({
        url: URL + '/student/deleteAllAnswerMsgForPid',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            $(".stu-tr").remove();
        },
        error: function () {
            alert("服务器内部错误");
        }
    });
}

//  删除一条答题记录
function deleteOneAnswerMsg(btn) {
    var yn = confirm("确认删除该学生的答题记录吗？");
    if(yn === false){
        return;
    }
    var answerRecordId = $(btn).next().val();
    var formData = new FormData();
    formData.append("answerRecordId", answerRecordId);
    $.ajax({
        url: URL + '/student/deleteAnswerMsgById',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            $(btn).parent().parent().remove();
        },
        error: function () {
            alert("服务器内部错误");
        }
    });
}

//  判断是否有问答题，如果有则显示提交按钮并显示打分input
function hasEcAnswer() {
    var flag = false;
    $(".ec-inner").find(".ec-inner-item").each(function (i) {
        var type = $(this).attr("name");
        var score = $(this).find(".item-score").val();
        var parentDiv = $(this);
        if(type === "ec-answer"){
            flag = true;
            $(parentDiv).find(".ec-title").append('&nbsp;&nbsp;&nbsp;&nbsp;<input name="'+score+'" class="score-input" type="text" placeholder="评分">');
        }
    });
    if(flag === true){
        $("#submitAnswerScoreBtn").show();
    }
}

//  提交问答题分数
function submitAnswerScore() {
    var flag = true;
    var scoreList = [];
    $(".ec-inner").find(".score-input").each(function (i) {
        var oScore = $(this).attr("name");
        var score = $(this).val();
        if(score === "" || score === null || score === undefined){
            alert("必须给所有问答题评分");
            flag = false;
            return;
        }
        if(!(/^[0-9]*[0-9][0-9]*$/.test(score))){
            alert("分值必须为整数");
            flag = false;
            return;
        }
        if(parseInt(score) < 0 || parseInt(score) > parseInt(oScore)){
            alert("必须在规定分值的范围内[0—"+oScore+"]");
            flag = false;
            return;
        }
        scoreList.push(score);
    });
    if(flag === false){
        return;
    }
    var answerRecordId = $("#samb-answer-record-id").val();
    var score = $(currentTR).find("td").eq(4).html();
    var row = $(currentTR).find(".stu-row").val();
    var answer = $(currentTR).find(".stu-answer").val();
    //  提交评分
    $.ajax({
        url: URL + '/student/saveEcAnswerScore',
        type: 'POST',
        data: {scoreList:scoreList, answerRecordId:answerRecordId, row:row, answer:answer, score:score},
        async:false,
        success: function (data) {
            $(currentTR).find(".stu-row").val(data.row);
            $(currentTR).find("td").eq(4).html(data.score);
            $(currentTR).children(":first").html(data.state);
            $(currentTR).children(":first").removeClass("uncheckedColor");
            $(currentTR).children(":first").addClass("checkedColor");
            currentTR = null;
            closeSamb();
        },
        error: function () {
            alert("服务器内部错误");
        }
    });
}

var xData = []; //  横轴的姓名，一次显示10个
var scoreData = []; //  每个姓名对应的成绩
var colorData = []; //  不同的成绩用不同颜色显示，90——100是绿色，60——89是蓝色，0——59是红色
var pageIndex = 1;  //  当前页码
var k = 10;

function openAnalyseDiv() {
    var bodyHeight = document.body.offsetHeight;
    $(".fullHide").css("height", bodyHeight);
    $(".fullHide").show();
    //  填充班级总人数、答题人数等信息
    var stuNum = $("#classStuNum").val();
    $("#ardc-item-classStuNum").find("span").html(stuNum);
    var answeredNum = $(".stu-tr").length;
    $("#ardc-item-answeredNum").find("span").html(answeredNum);
    var checkedNum = 0;
    var excellentNum = 0;
    var regularNum = 0;
    var unqualifiedNum = 0;
    $(".stu-tr").each(function (i) {
        var state = $(this).find("td").eq(0).html();
        var score = $(this).find("td").eq(4).html();
        if(state === "已阅"){
            checkedNum++;
        }
        if(parseInt(score) >= 90){
            excellentNum++;
        }else if(parseInt(score) >= 60 && parseInt(score) < 90){
            regularNum++;
        }else {
            unqualifiedNum++;
        }
    });
    $("#ardc-item-checkedNum").find("span").html(checkedNum);
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
        var stuName = $(this).find("td").eq(2).html();
        var stuScore = $(this).find("td").eq(4).html();
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
    showAChart();
    $("#analyseDiv").show();
}

//  显示图表
function showAChart() {
    option = {
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
    aChart.setOption(option);
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
        var stuName = $(this).find("td").eq(2).html();
        var stuScore = $(this).find("td").eq(4).html();
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
    showAChart();
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
        var stuName = $(this).find("td").eq(2).html();
        var stuScore = $(this).find("td").eq(4).html();
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
    showAChart();
}