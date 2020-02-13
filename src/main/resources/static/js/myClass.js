var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";

//  跳转到我的图表页面
function toStartPage() {
    window.location.href = URL + "/toStart";
}

//  get请求跳转到班级信息界面
function toClassPage(classDiv) {
    var classId = $(classDiv).attr("id");
    var className = $(classDiv).attr("name");
    var grade = $(classDiv).prev().val();
    window.location.href = URL + "/toClassMsg?classId=" + classId + "&className=" + className + "&grade=" + grade + "&pageNum=" + 0 + "&pageSize=" + 10;
}

//  打开课程的对话框
//  将该班级已有的课程的CheckBox勾选上
function showChartsDiv(btn){
    $(".fullHide").show();
    var classId = $(btn).prev().attr("id");
    $.ajax({
        url: URL + '/chart/findAllCharts',
        type: 'POST',
        data: {classId:classId},
        dataType: "json",
        success: function (data) {
            var charts = data.chartList; // 所有课程列表
            var selectedCharts = data.selectedCharts; //    班级已有的课程列表
            for(var i in charts){
                var flag = false;
                for(var j in selectedCharts){
                    if(charts[i].path === selectedCharts[j].chartPath){
                        flag = true;
                        break;
                    }
                }
                var child1;
                if(flag === true){
                    child1 = "<input name='chartCheckBox' type='checkbox' checked value='"+charts[i].path+"'>";
                }else{
                    child1 = "<input name='chartCheckBox' type='checkbox' value='"+charts[i].path+"'>";
                }
                var child2 = "<span>"+charts[i].chartName+"</span>";
                var cnbCn = "<div class='cnb-cn'>"+child1+child2+"</div>";
                $(".cnb-chartNames").append(cnbCn);
            }
        },
        error: function () {
            alert("服务器内部出错！");
        }
    });
    var className = $(btn).prev().attr("name");
    var classId = $(btn).prev().attr("id");
    $(".cnb-className").append(className);
    $("#cnb-classId").val(classId);
    $("#chartsNameBlock").show();
}

//  保存班级课程的修改
function addChartsForClass() {
    var chartBoxes = document.getElementsByName("chartCheckBox");
    var tranData = [];
    for(var i=0; i<chartBoxes.length; i++){
        if(chartBoxes[i].checked){
            tranData.push(chartBoxes[i].value);
        }
    }
    var classId = $("#cnb-classId").val();
    if(tranData.length === 0){
        tranData.push("");
    }
    $.ajax({
        url: URL + '/myClass/addOrDelCharts',
        type: 'POST',
        data: {pathList:tranData, classId:classId},
        async:false,
        success: function () {
            alert("保存成功！");
        },
        error: function () {
            alert("服务器内部出错！");
        }
    });
}

//  关闭添加课程的对话框
function closeChartsNameBlock() {
    $(".cnb-className").empty();
    $(".cnb-chartNames").empty();
    $("#chartsNameBlock").hide();
    $(".fullHide").hide();
}

//  打开显示班级所有课程的对话框
function showCourseDiv(btn) {
    $(".fullHide").show();
    $(".cnb-className").html("请选择课程");
    var className = $(btn).prev().prev().attr("name");
    var classId = $(btn).prev().prev().attr("id");
    var grade = $(btn).prev().prev().prev().val();
    $("#cnb-classId").val(classId);
    $(".cnb-cn-input").val(className);
    $("#cnb-classGrade").val(grade);
    $("#saveBtn").hide();
    $("#closeBtn1").hide();
    $("#closeBtn2").show();
    //  请求该班级所有的课程
    var formData = new FormData();
    formData.append("classId", classId);
    $.ajax({
        url: URL + '/chart/findAllCharts',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            var charts = data.chartList; // 所有课程列表
            var selectedCharts = data.selectedCharts; //    班级已有的课程列表
            for(var i in charts) {
                var flag = false;
                for (var j in selectedCharts) {
                    if (charts[i].path === selectedCharts[j].chartPath) {
                        flag = true;
                        break;
                    }
                }
                var child1;
                if (flag === true) {
                    child1 = "<input type='hidden' value='" + charts[i].chartId + "'>";
                    var child2 = "<span>" + charts[i].chartName + "</span>";
                    var cnbCn = "<div class='cnb-courseName' onclick='checkClassAnalyse(this)'>" + child1 + child2 + "</div>";
                    $(".cnb-chartNames").append(cnbCn);
                }
            }
        }
    });
    $("#chartsNameBlock").show();
}

//  关闭显示班级所有课程的对话框
function closeCouserDiv() {
    $(".cnb-className").empty();
    $(".cnb-chartNames").empty();
    $("#closeBtn1").show();
    $("#saveBtn").show();
    $("#closeBtn2").hide();
    $("#chartsNameBlock").hide();
    $(".fullHide").hide();
}

//  打开一个新的页面，查看班级的某一门课程的评价
function checkClassAnalyse(d) {
    var chartId = $(d).find("input").val();
    var classId = $("#cnb-classId").val();
    var className = $(".cnb-cn-input").val();
    var chartName = $(d).find("span").html();
    var grade = $("#cnb-classGrade").val();
    window.open(URL + "/toCourseEvaluatePage?chartId="+chartId+"&classId="+classId+"&className="+className+"&grade="+grade+"&chartName="+chartName, '_blank');
}