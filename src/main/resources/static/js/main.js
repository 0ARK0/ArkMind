var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";

var jsonInputVal = $("#jsonDataInput").val();
if(""!==jsonInputVal && null !== jsonInputVal && jsonInputVal !== undefined){
    var jsonData = JSON.parse($("#jsonDataInput").val());
}else{
    var jsonData = {"name":"Begin","children":[]};
}

var myChart = echarts.init(document.getElementById("main"));

var highLight = ""; //用于将匹配文本高亮显示的全局变量

var chartBackgroundColor = "white"; //图表背景色

var chartTextColor = "black"; //图表中的文字颜色

var option;
function showChart(data) {
    myChart.setOption(option = {
        backgroundColor: chartBackgroundColor,
        tooltip: {
            trigger: 'item',  //触发类型，默认：item（数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用）。可选：'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none':什么都不触发。
            triggerOn: 'mousemove' //提示框触发的条件，默认mousemove|click（鼠标点击和移动时触发）。可选mousemove：鼠标移动时，click：鼠标点击时，none：无
        },
        series: [ //系列列表
            {
                type: 'tree',        //图表种类为树图
                data: [data],        //数据数组
                top: '1%',           //与顶部的距离
                left: '7%',          //与左边的距离
                bottom: '1%',        //与底部的距离
                right: '20%',        //与右边的距离
                roam: true,          //允许缩放和平移
                symbol: 'emptyCircle', //标记的样式
                itemStyle: {         //标记的颜色设置
                    color: '#d63031',
                    borderColor: '#e17055'
                },
                symbolSize: 10,      //标记（小圆圈）的大小，默认是7
                initialTreeDepth: 1, //默认：2，树图初始展开的层级（深度）。根节点是第 0 层，然后是第 1 层、第 2 层，... ，直到叶子节点
                label: {             //每个节点对应的标签的样式
                    normal: {
                        position: 'left',           //标签的位置
                        verticalAlign: 'middle',    //文字垂直对齐方式，默认自动。可选：top，middle，bottom
                        align: 'right',             //文字水平对齐方式，默认自动。可选：top，center，bottom
                        fontSize: 18,               //标签文字大小
                        color: chartTextColor,
                        formatter: function (param) {
                            //  formatter通过设置为函数，对name进行判断，看是否有匹配的关键字，如果匹配上了，就返回一个匹配富文本的格式；下边的rich就是富文本样式设置。
                            if ("" !== highLight && param.name.match(highLight)) {
                                return '{a|' + param.name + '}';
                            } else {
                                return param.name;
                            }
                        },
                        rich: {
                            a: { // 查询时显示出的高亮节点
                                color: 'red',
                                lineHeight: 10,
                                fontSize: 24
                            }
                        }
                    }
                },
                leaves: {   // 叶子节点的特殊配置
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },
                expandAndCollapse: true,     // 子树折叠和展开的交互，默认打开
                animationDuration: 1000,      // 初始动画的时长，支持回调函数,默认1000
                animationDurationUpdate: 750 // 数据更新动画的时长，默认300
            }
        ]
    });
}

// 遍历json数据为每个json节点添加pid属性唯一标识,同时为每个echarts节点添加value属性，使每个节点的pid==value
function setPid(node, pid, collapsed) {
    if(undefined === node.name || null == node.name){
        return;
    }
    node.pid = pid + "";
    node.value = pid + "";
    node.collapsed = collapsed;
    for(var sub in node.children){
        setPid(node.children[sub], pid+"."+sub, true);
    }
}

setPid(jsonData,0, false);
showChart(jsonData);

function reshowChart(){ // 将图表还原
    closeNodes(jsonData);
    highLight = "";
    showChart(jsonData);
}

//保存图表
function saveChart(notClose){
    //保存之前先将二级以上的节点闭合
    if(notClose === false){
        closeNodes(jsonData);
    }
    //先判断该图表是新建的还是在原有图表基础上修改的，新建图表的隐藏input属性值为null
    var tranData = "";
    var jsonInputVal = $("#jsonDataInput").val();
    if("" === jsonInputVal || null === jsonInputVal || jsonInputVal === undefined){
        $("#jsonDataInput").val(JSON.stringify(jsonData));
        $.ajax({
            url: URL + "/chart/saveNew",
            type: "post",
            data: JSON.stringify(jsonData),
            contentType: "application/json; charset=utf-8",
            traditional: true, //防止深度序列化
            async: false,
            success: function (data) {
                if(notClose === false){
                    alert("保存成功!");
                }
                $("#jsonFileNameInput").val(data.jsonFileName);
            },
            error: function () {
                alert("服务器错误");
            }
        });
    }else{
        $("#jsonDataInput").val(JSON.stringify(jsonData));
        var fileName = $("#jsonFileNameInput").val();
        tranData = {"fileName":fileName, "jsonData":JSON.stringify(jsonData)};
        $.ajax({
            url: URL + "/chart/save",
            type: "post",
            data: tranData,
            async: false,
            success: function (data) {
                if(notClose === false){
                    alert("保存成功!");
                }
                $("#jsonFileNameInput").val(data.jsonFileName);
            },
            error: function () {
                alert("服务器错误");
            }
        });
    }
}

//鼠标点击节点时判断它是否展开，设置相应的collapsed值，因为echarts本身没有提供判断节点是否展开的节点属性
myChart.on("click", function (param) {
    findNodeByValueAndSetCollapsed(jsonData, param.value);
    console.log(JSON.stringify(jsonData))
});

function findNodeByValueAndSetCollapsed(node, value) {
    if(node.name === null || node.name === undefined){
        return;
    }
    if(node.value === value){
        if(node.collapsed === true){
            node.collapsed = false;
        }else{
            node.collapsed = true;
        }
        return;
    }else{
        for(var i in node.children){
            findNodeByValueAndSetCollapsed(node.children[i], value);
        }
    }
}

function changeChartColor() { //更换界面颜色
    if(chartBackgroundColor == "white"){
        chartBackgroundColor = '#2d3436';
        chartTextColor = 'white';
    }else{
        chartBackgroundColor = 'white';
        chartTextColor = 'black';
    }
    showChart(jsonData);
}

function toStartPage() {
    location.href = "/ArkMind/toStart";
}

function uploadFile() { //上传excel文件返回图表的json数据
    var f = $('#fileUploader').get(0).files[0];
    if("" === f || null === f || f === undefined){
        alert("请选择文件！");
        return;
    }
    var formData = new FormData();
    formData.append("file", f);
    $.ajax({
        url: URL + '/file/excelToChart',
        type: 'POST',
        data: formData,
        dataType: "json",
        contentType: false, //用ajax传文件时需要将此参数设置为false，否则报错
        processData: false, //用ajax传文件时需要将此参数设置为false，否则报错
        success: function (data) {
            jsonData = data;
            setPid(jsonData,0); //新传来的json中没有pid属性，所以需要重新设置
            showChart(jsonData);
        },
        error: function (msg) {
            alert("服务器出错！");
        }
    });
}

//json数据中的collapsed:false表示该节点默认展开，为true时折叠
//检索搜索框中的文本，展开搜索的数据节点

var isFound = false; //用于判断是否匹配到了文本的全局变量

function searchData() {
    var text = $("#searchInput").val();
    if(text === "" || text == null){
        alert("请输入需要匹配的文字！");
        return;
    }
    var expression = /^\s+?/;
    if(text.match(expression)){ //不匹配空白字符
        return;
    }
    closeNodes(jsonData);
    findNodesAndMatchText(text, jsonData, 0);
    highLight = text;
    showChart(jsonData);
}

function findNodesAndMatchText(text, node) { //遍历json数据匹配搜索的文本
    if(node.name === undefined || node.name == null){
        return;
    }
    var name = node.name;
    if(name.indexOf(text) >= 0){
        if(isFound === false){
            isFound = true;
        }
        if(isFound === true){
            findParents(jsonData, node);
            isFound = false;
        }
    }
    for(var sub in node.children){
        findNodesAndMatchText(text, node.children[sub]);
    }
}

function findParents(jsonData, node) { //根据节点的pid寻找其所有的父节点
    var pidString = node.pid + "";
    var temp = pidString.split("\.");
    var pids = [];
    var str = "";
    for(var i=0; i<temp.length-1; i++){
        str += temp[i];
        pids[i] = str;
        str += ".";
    }
    setParentsOpen(pids, 0, jsonData);
}

function setParentsOpen(pids, index, node) { //递归寻找父节点，并将符合要求的父节点设置为展开状态
    if(index >= pids.length){
        return;
    }
    if(node.pid == pids[index]){
        node.collapsed = false;
    }
    for(i in node.children){
        setParentsOpen(pids, index+1, node.children[i]);
    }
}

function closeNodes(node) { //将所有的节点的collapsed状态还原（闭合）
    if(node.name === undefined || node.name == null){
        return;
    }
    if(node.pid !== "0"){ //根节点不收缩
        node.collapsed = true;
    }else{
        node.collapsed = false;
    }
    for(var sub in node.children){
        closeNodes(node.children[sub]);
    }
}

//防止默认菜单弹出
$('#main').bind("contextmenu", function () { return false; });

var nodeParams = null; //用于保存被右击的节点的全局变量

myChart.on('contextmenu', function (params) {
    $(".small-menu").hide();
    $('#right-click-menu').css({ //右击节点弹出选项框
        'left': params.event.offsetX + 10,
        'top' : params.event.offsetY + 70,
        "visibility": "visible",
    });
    $('#right-click-menu').show();
    nodeParams = params;
});

$('#main').click(function () { //点击任意处关闭弹框
    $('.click-menu').hide();
    $('.click-menu').find('input').val("");
    if("" !== highLight){ //如果有高亮显示的节点则点击任意处消除
        highLight = "";
        showChart(jsonData);
    }
    nodeParams = null;
});

//通过寻找父节点来删除子节点，但是还需要将父节点的children中的node的pid和value属性做相应的更改
function findParentAndDeleteSomeNode(node, parentPid, childIndex) {
    if(node.name === undefined || node.name == null){
        return;
    }
    if(node.pid === parentPid){
        node.collapsed = false;
        if(childIndex !== node.children.length - 1){ //如果要删除的不是最后一个子节点，就需要更改其后面的节点的属性
            updateNodePidAndValue(node.children, childIndex, 0);
        }
        node.children.splice(childIndex, 1);
        //delete node.children[childIndex]; //用delete删除json数组中的元素时，会将被删元素变成null，用splice则直接删除干净
        return;
    }else{
        for(var sub in node.children){
            findParentAndDeleteSomeNode(node.children[sub], parentPid, childIndex);
        }
    }
}

//将被删除的子节点后面的兄弟节点的pid和value属性做相应的更改(包括兄弟节点的子节点，因此要递归)
function updateNodePidAndValue(children, childIndex, num) {
    if(children == null){
        return;
    }
    for(var i=childIndex; i<children.length; i++){
        var oldPid = children[i].pid + "";
        var times = oldPid.split("\.");
        times[times.length-1-num]--;
        var newPid = times.join("\."); //join方法将数组转为字符串，中间加上分隔符
        console.log(newPid);
        children[i].pid = newPid;
        children[i].value = newPid; //pid与value是相等的
        updateNodePidAndValue(children[i].children, 0, num+1);
    }
}

function findNodesAndDoAction(value, node, action, text) { // 遍历json数据寻找指定节点
    if(node.name === undefined || node.name == null){
        return;
    }
    if(node.pid === value){
        if(action === "add"){//添加一个子节点
            var newNodePid;
            if(node.children != null){
                newNodePid = node.pid + "." + node.children.length;
            }else{
                node.children=[];
                newNodePid = node.pid + "." + "0";
            }
            var newNode = {"name":text,"children":[],"pid":newNodePid,"value":newNodePid,"collapsed":true};
            node.children.push(newNode);
            node.collapsed = false;
            findParents(jsonData, node); //添加一个节点后，新节点到根节点的路径上的所有父节点都要展开
        }else if(action === "delete"){ //删除一个节点
            if(node.pid === "0"){//不能删除根节点
                return;
            }
            var nodePidStr = node.pid + "";
            var parentPid = nodePidStr.substring(0, nodePidStr.lastIndexOf("\."));
            findParents(jsonData, node); //删除节点前先将其父路径节点展开
            findParentAndDeleteSomeNode(jsonData, parentPid, nodePidStr.substring(nodePidStr.lastIndexOf("\.")+1, node.pid.length));
        }else if(action === "update"){ //修改一个节点的名称
            node.name = text;
        }
        showChart(jsonData, node);
        return;
    }
    for(var sub in node.children){
        findNodesAndDoAction(value, node.children[sub], action, text);
    }
}

function addNode() { // 新增子节点
    $('.click-menu').hide();
    $('#input-menu').css({ // 右击节点弹出选项框
        'left': nodeParams.event.offsetX + 10,
        'top' : nodeParams.event.offsetY + 70,
        "visibility": "visible",
    });

    $('#input-menu').show();
    // 使其自动获得焦点
    setTimeout(function(){
        $('#input-menu').find("input").focus();
    },50)

}

function addNodeConfirm(yn) {
    var expression = /^\s+?/; //不匹配空白字符
    var text = $("#newNodeName").val();
    if(yn === true){
        if(text === "" || text.match(expression)){
            alert("名称不能是空白字符");
            return;
        }
        findNodesAndDoAction(nodeParams.value, jsonData, "add", text);
    }
    nodeParams = null;
    shutDownMenu("input-menu");
}

function deleteNode() { //删除节点
    $('.click-menu').hide();
    $('#delete-menu').css({ //右击节点弹出选项框
        'left': nodeParams.event.offsetX + 10,
        'top' : nodeParams.event.offsetY + 70,
        "visibility": "visible",
    });
    $('#delete-menu').show();
}


var nodeColor = null; // 节点的颜色的全局变量

function findNodesAndGetColor(pid, node) { //遍历json数据找到节点的颜色
    if(node.name === undefined || node.name == null){
        return;
    }
    if(node.pid === pid && node.label !== undefined){
        nodeColor = node.label.color;
        return;
    }
    for(var sub in node.children){
        findNodesAndGetColor(pid, node.children[sub]);
    }
}

function deleteNodeConfirm(yon) {
    if(yon === false) {
        shutDownMenu("delete-menu");
        return;
    }
    //  删除节点前先判断该节点是否有学习资料或习题，如果都没有则无需访问后台，直接前端删除即可
    findNodesAndGetColor(nodeParams.value, jsonData);
    if(nodeColor == null || nodeColor !== "#f1c40f" && nodeColor !== "#2980b9" && nodeColor !== "#27ae60")
    {
        findNodesAndDoAction(nodeParams.value, jsonData, "delete", "");
        shutDownMenu("delete-menu");
        nodeParams = null;
        return;
    }
    nodeColor = null;
    //  删除节点后将会删除该节点和其子节点中所有的学习内容和题目，并保存，无法撤销
    var jsonFileName = $("#jsonFileNameInput").val();
    if(jsonFileName === null || "" === jsonFileName || jsonFileName === undefined){
        saveChart(true);
        jsonInputVal = $("#jsonDataInput").val();
    }else{
        var jsonDir = jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
        var pid = nodeParams.value;
        var formData = new FormData();
        formData.append("jsonDir", jsonDir);
        formData.append("pid", pid);
        $.ajax({
            url: URL + '/file/delSomeNode',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {}
        });
    }
    findNodesAndDoAction(nodeParams.value, jsonData, "delete", "");
    saveChart(true);
    shutDownMenu("delete-menu");
    nodeParams = null;
}

function updateNode() { //编辑节点的名称
    $('.click-menu').hide();
    $('#update-menu').css({ //右击节点弹出选项框
        'left': nodeParams.event.offsetX + 10,
        'top' : nodeParams.event.offsetY + 70,
        "visibility": "visible",
    });
    //使其自动获得焦点
    setTimeout(function(){
        $('#update-menu').find("input").focus();
    },50);
    $('#update-menu').show();
}

function updateNodeConfirm(yn) {
    var expression = /^\s+?/; //不匹配空白字符
    var newName = $("#newNodeName2").val();
    if(yn === true){
        if(newName === "" || newName.match(expression)){
            alert("名称不能是空白字符");
            return;
        }
        findNodesAndDoAction(nodeParams.value, jsonData, "update", newName);
    }
    shutDownMenu("update-menu");//$('#update-menu').hide();
    nodeParams = null;
}

function shutDownMenu(menuId) { //关闭信息框
    $("#"+menuId).find('input').val("");
    $("#"+menuId).hide();
}

//输入的确认按钮绑定回车键
function bindEnterByUpdateMenu() {
    var button = $("#update-menu-ybtn");
    if(event.keyCode == 13)
    {
        button.click();
        event.returnValue = false;
    }
}
function bindEnterByAddMenu() {
    var button = $("#add-menu-ybtn");
    if(event.keyCode == 13)
    {
        button.click();
        event.returnValue = false;
    }
}
function bindEnterBySearch() {
    var button = $("#searchBtn");
    if(event.keyCode == 13)
    {
        button.click();
        event.returnValue = false;
    }
}

//  为添加/删除了学习内容或者练习题的节点增加/删除"label":{"color":""}属性来区分颜色
//  黄色(#f1c40f)节点表示有学习内容，蓝色(#2980b9)节点表示有练习题，绿色(#27ae60)节点表示都有。
function findNodeByValueAndSetColor(node, value, color, option) {
    if(node.name === null || node.name === undefined){
        return;
    }
    if(node.value === value){
        if(option === "add"){   //  增加特殊颜色
            if(node.label === undefined){
                if(color === "yellow"){ //    表示有学习内容
                    node.label = {"color":"#f1c40f"};
                }else if(color === "blue"){  //     表示有练习题
                    node.label = {"color":"#2980b9"};
                }
                return;
            }
            if(node.label.color === "#27ae60"){
                return;
            }else if(node.label.color === "#f1c40f" && color === "blue" || node.label.color === "#2980b9" && color === "yellow"){//  表示已有学习内容或者练习题
                node.label.color = "#27ae60";
            }else if(color === "yellow"){ //    表示有学习内容
                node.label.color = "#f1c40f";
            }else if(color === "blue"){  //     表示有练习题
                node.label.color = "#2980b9";
            }
        }else if(option === "delete"){  //  去除特殊颜色
            if(node.label.color === "#27ae60"){
                if(color === "yellow"){
                    node.label.color = "#2980b9"; //    还剩练习题
                }else if(color === "blue"){
                    node.label.color = "#f1c40f"; //    还剩学习内容
                }
            }else{
                node.label.color = null;
            }
        }
        return;
    }else{
        for(var i in node.children){
            findNodeByValueAndSetColor(node.children[i], value, color, option);
        }
    }
}

//  打开学习资料对话框
function openLearningContent() {
    $('.click-menu').hide();
    $(".fullHide").show();
    $(".lc-name").append(nodeParams.name);
    var jsonDataVal = $("#jsonDataInput").val();
    if(jsonDataVal == null || "" === jsonDataVal || jsonDataVal === undefined){
        $(".learningContent").show();
        return;
    }
    var fileName = $("#jsonFileNameInput").val();
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData = new FormData();
    formData.append("jsonDir", jsonDir);
    formData.append("pid", pid);
    //学生和教师请求ajax不同
    var user = $("#identityInput").val();
    if(user === undefined || user === null || user === ""){
        var userId = $("#userIdInput").val();
        formData.append("userId", userId);
        $.ajax({
            url: URL + '/file/getStuFiles',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                //  显示数据
                for(var i in data){
                    var lcChild = "<div id='lc-file"+i+"' class='lc-file' onclick='previewFile(this)'>" + "<input type='hidden' value='"+data[i].filePath+"'>"
                        + data[i].originalName +"</div>";
                    $(".lc-content").append(lcChild);
                    var lcChild2 = "<button class='small-btn-download' onclick='downloadFile(this)'>下载</button>"
                    $(".lc-content").append(lcChild2);
                }
            }
        });
    }else{
        $.ajax({
            url: URL + '/file/getMyFiles',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                //  显示数据
                for(var i in data){
                    var lcChild = "<div id='lc-file"+i+"' class='lc-file' onclick='previewFile(this)'>" + "<input type='hidden' value='"+data[i].filePath+"'>"
                        + data[i].originalName +"</div>";
                    $(".lc-content").append(lcChild);
                    var lcChild2 = "<button class='small-btn-del' onclick='deleteLearningFile(this)'>删除</button>"
                    $(".lc-content").append(lcChild2);
                }
            }
        });
    }
    $(".learningContent").show();
}

//  关闭学习资料对话框
function closeLearningContent() {
    $(".fullHide").hide();
    $(".learningContent").hide();
    $(".lc-name").empty();
    $(".lc-content").empty();   //清空子元素
}

//  上传学习资料文件
function uploadLearningFile() {
    var files = document.getElementById("fileUploader2").files;
    var filesSize = 0;
    for(var i=0;i<files.length;i++){
        filesSize += files[i].size;
    }
    if(filesSize/1024/1024 > 500) {
        alert("单次上传文件不可以超过500MB！");
        return;
    }
    //  为该节点添加表示有学习内容的特殊颜色
    findNodeByValueAndSetColor(jsonData, nodeParams.value, "yellow", "add");
    showChart(jsonData);
    //  上传文件前需要保存图表，但不关闭节点，也不提示保存成功
    saveChart(true);
    var fileName = $("#jsonFileNameInput").val()
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData;
    for(var i=0;i<files.length;i++){
        formData = new FormData();
        formData.append("file", files[i]);
        formData.append("jsonDir", jsonDir);
        formData.append("pid", pid);
        $.ajax({
            url: URL + '/file/learningFiles',
            type: 'POST',
            data: formData,
            cache: false,//上传文件无需缓存
            contentType: false, //用ajax传文件时需要将此参数设置为false，否则报错
            processData: false, //用ajax传文件时需要将此参数设置为false，否则报错
            async: false,
            success: function (data) {
                //回显文件名
                var lcChild = "<div id='lc-file"+i+"' class='lc-file' onclick='previewFile(this)'>" + "<input type='hidden' value='"+data.filePath+"'>"
                    + data.originalName +"</div>";
                $(".lc-content").append(lcChild);
                var lcChild2 = "<button class='small-btn-del' onclick=''>删除</button>"
                $(".lc-content").append(lcChild2);
                alert("上传成功");
            },
            error: function () {
                alert("服务器出错！");
                return;
            }
        });
    }
}

//  预览文件
function previewFile(lcFile) {
    var filePath = $(lcFile).find("input").val();
    filePath = filePath.replace(/\\/g,"/");
    filePath = filePath.replace("E:/SpringBootProjects/ArkMind/", "/usersDir/");
    var suffix = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    if(suffix === ".xls" || suffix === ".xlsx" || suffix === ".doc" || suffix === ".docx" || suffix === ".ppt" || suffix === ".pptx"){
        window.open("https://view.officeapps.live.com/op/view.aspx?src="+URL+filePath);
    }else if(suffix === ".pdf" || suffix === ".jpg" || suffix === ".png" || suffix === ".gif" || suffix === ".bmp" || suffix === ".jpeg"){
        window.open(URL+filePath);
    }else if(suffix === ".mp4"){
        //视频格式的文件预览
        $("#videoPreviewDiv").append('<video controls="controls" class="myVideo" style="margin-top: 100px" width="700px" height="400px"><source src="'+URL+filePath+'"></video>');
        $("#videoPreviewDiv").append('<button class="btn close-btn" onclick="closeVideo()">关闭</button>');
        $("#videoPreviewDiv").show();
    }else {
        alert("该格式文件目前不支持在线预览");
    }
}

function closeVideo() {
    $("#videoPreviewDiv").empty();
    $("#videoPreviewDiv").hide();
}

//  删除学习内容文件
function deleteLearningFile(btn) {
    var yn = confirm("确认删除此文件吗？");
    if(yn === false){
        return;
    }
    var filePath = $(btn).prev().find("input").val();
    var formData = new FormData();
    formData.append("filePath", filePath);
    $.ajax({
        url: URL + '/file/deleteLearningFile',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            //删除元素
            $(btn).prev().remove();
            $(btn).remove();
        },
        error: function () {
            alert("服务器出错！");
            return;
        }
    });
    //  如果该节点已经没有了学习内容，那么将该节点的特殊颜色去除
    if($(".lc-content").children().length === 0){
        findNodeByValueAndSetColor(jsonData, nodeParams.value, "yellow", "delete");
        showChart(jsonData);
        saveChart(true);
    }
}

//  判断节点内是否有学习内容，有返回true，无返回false
function haveLearningFiles() {
    var fileName = $("#jsonFileNameInput").val()
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData = new FormData();
    formData.append("jsonDir", jsonDir);
    formData.append("pid", pid);
    var result = false;
    $.ajax({
        url: URL + '/file/haveLearningFiles',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            result = data;
        },
        error: function () {
            alert("服务器出错！");
            return;
        }
    });
    return result;
}

//打开创建题目的对话框
function openCreateExerciseContent() {
    //先请求后台，将该节点的题目的显示
    $('.click-menu').hide();
    $(".fullHide").show();
    var fileName = $("#jsonFileNameInput").val()
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData = new FormData();
    formData.append("jsonDir", jsonDir);
    formData.append("pid", pid);
    $.ajax({
        url: URL + '/file/getExercise',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            if("" !== data && data !==undefined && data !==null){
                fillThisNodeExercise(data);
                $(".ec-name").append('<div id="check-stu-answers" class="ec-name-item"><button class="btn add-btn" onclick="checkStuAnswers()">学生作答情况</button></div>')
            }
        }
    });
    $(".editExerciseContent").show();
}

//  关闭创建题目的对话框并清空内容
function closeEditExerciseContent() {
    $(".ec-inner").empty();
    $(".editExerciseContent").hide();
    $(".fullHide").hide();
    $("#check-stu-answers").remove();
    nodeParams = null;
}

//  填充该节点已有的题目
function fillThisNodeExercise(jsonArray) {
    for(var i in jsonArray){
        var ecIndex = parseInt(i)+1; //题目的序号
        var newChildId = "ec-inner-" + ecIndex;
        //如果是单选题
        if(jsonArray[i].type === "ec-oselect"){
            var index = jsonArray[i].answer[0].value; //答案的序号
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-oselect">' +
                '<span>'+ecIndex+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目" value="'+jsonArray[i].title+'">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)" value="'+jsonArray[i].score+'">&nbsp;&nbsp;' +
                '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
                '<img src="'+URL+'/static/img/addition_fill.png" title="添加选项" width="30px" height="30px" onclick="addNewItemForRadio(this)">' +
                '<div class="choice-item">';
            for(var j in jsonArray[i].item){ //生成选项
                var newItem;
                if(j == index){
                    newItem = '<input type="radio" name="'+newChildId+'" checked><input type="text" placeholder="选项" value="'+jsonArray[i].item[j].name+'"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>';
                }else{
                    newItem = '<input type="radio" name="'+newChildId+'"><input type="text" placeholder="选项" value="'+jsonArray[i].item[j].name+'"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>';
                }
                newChild += newItem;
            }
            newChild += "</div></div>";
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-mutiselect"){ //多选题
            var answer = jsonArray[i].answer;
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-mutiselect">' +
                '<span>'+ecIndex+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目" value="'+jsonArray[i].title+'">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)" value="'+jsonArray[i].score+'">&nbsp;&nbsp;' +
                '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
                '<img src="'+URL+'/static/img/addition_fill.png" title="添加选项" width="30px" height="30px" onclick="addNewItemForCheckBox(this)">' +
                '<div class="choice-item">';
            for(var j in jsonArray[i].item){ //生成选项
                var newItem;
                var flag = false;
                for(var k in answer){
                    if(j == answer[k].value){
                        flag = true;
                        newItem = '<input type="checkbox" name="'+newChildId+'" checked><input type="text" placeholder="选项" value="'+jsonArray[i].item[j].name+'"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>';
                        break;
                    }
                }
                if(flag == false){
                    newItem = '<input type="checkbox" name="'+newChildId+'"><input type="text" placeholder="选项" value="'+jsonArray[i].item[j].name+'"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>';
                }
                newChild += newItem;
            }
            newChild += "</div></div>";
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-fillblank"){ //  填空题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-fillblank">' +
                '<span>'+ecIndex+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目" value="'+jsonArray[i].title+'">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)" value="'+jsonArray[i].score+'">&nbsp;&nbsp;' +
                '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
                '<img src="'+URL+'/static/img/addition_fill.png" title="添加填空" width="30px" height="30px" onclick="addNewItemForFillBlank(this)">';
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-yn"){ // 判断题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-yn">' +
                '<span>'+ecIndex+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目" value="'+jsonArray[i].title+'">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)" value="'+jsonArray[i].score+'">&nbsp;&nbsp;' +
                '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
                '<div class="choice-item">';
            if(jsonArray[i].answer[0].value === "true"){
                newChild += '<input type="radio" name="'+newChildId+'" value="true" checked> 正确</br>' + '<input type="radio" name="'+newChildId+'" value="false"> 错误</br></div>';
            }else{
                newChild += '<input type="radio" name="'+newChildId+'" value="true"> 正确</br>' + '<input type="radio" name="'+newChildId+'" value="false" checked> 错误</br></div>';
            }
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-answer"){ // 问答题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-answer">' +
                '<span>'+ecIndex+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目" value="'+jsonArray[i].title+'">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)" value="'+jsonArray[i].score+'">&nbsp;&nbsp;' +
                '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)"><br>' +
                '<textarea class="ec-textarea">'+jsonArray[i].answer[0].value+'</textarea>';
            $(".ec-inner").append(newChild);
        }
    }
}

//获得新题目的div的id的序号
function getNewEDivId() {
    var lastChildId = $(".ec-inner").find(".ec-inner-item").last().attr("id");
    var newChildId;
    if(lastChildId === undefined){
        newChildId = 1;
    }else{
        newChildId = parseInt(lastChildId.substring(lastChildId.lastIndexOf("-")+1)) + 1;
    }
    return newChildId;
}

//添加一个单选题
function addASelect() {
    var index = getNewEDivId();
    var newChildId = "ec-inner-" + index;
    var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-oselect">' +
        '<span>'+index+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)">&nbsp;&nbsp;' +
        '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
        '<img src="'+URL+'/static/img/addition_fill.png" title="添加选项" width="30px" height="30px" onclick="addNewItemForRadio(this)">' +
        '<div class="choice-item">' + '<input type="radio" name="'+newChildId+'" checked><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>' +
        '<input type="radio" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>' +
        '<input type="radio" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>' +
        '<input type="radio" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItem(this)"><br>' + '</div></div>';
    $(".ec-inner").append(newChild);
}

//添加一个多选题
function addMutiSelect() {
    var index = getNewEDivId();
    var newChildId = "ec-inner-" + index;
    var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-mutiselect">' +
        '<span>'+index+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)">&nbsp;&nbsp;' +
        '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
        '<img src="'+URL+'/static/img/addition_fill.png" title="添加选项" width="30px" height="30px" onclick="addNewItemForCheckBox(this)">' +
        '<div class="choice-item">' + '<input type="checkbox" name="'+newChildId+'" checked><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItemForCheckbox(this)"><br>' +
        '<input type="checkbox" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItemForCheckbox(this)"><br>' +
        '<input type="checkbox" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItemForCheckbox(this)"><br>' +
        '<input type="checkbox" name="'+newChildId+'"><input type="text" placeholder="选项"><img title="删除选项" src="'+URL+'/static/img/offline_fill.png" width="20px" height="20px" onclick="delItemForCheckbox(this)"><br>' + '</div></div>';
    $(".ec-inner").append(newChild);
}

//添加一个填空题
function addFillBlank() {
    var index = getNewEDivId();
    var newChildId = "ec-inner-" + index;
    var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-fillblank">' +
        '<span>'+index+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)">&nbsp;&nbsp;' +
        '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
        '<img src="'+URL+'/static/img/addition_fill.png" title="添加填空" width="30px" height="30px" onclick="addNewItemForFillBlank(this)">';
    $(".ec-inner").append(newChild);
}

//添加一个判断题
function addYN() {
    var index = getNewEDivId();
    var newChildId = "ec-inner-" + index;
    var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-yn">' +
        '<span>'+index+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)">&nbsp;&nbsp;' +
        '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)">' +
        '<div class="choice-item">' + '<input type="radio" name="'+newChildId+'" value="true" checked> 正确</br>' +
        '<input type="radio" name="'+newChildId+'" value="false"> 错误</br>';
    $(".ec-inner").append(newChild);
}

//添加一个简答题
function addAnswer() {
    var index = getNewEDivId();
    var newChildId = "ec-inner-" + index;
    var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-answer">' +
        '<span>'+index+'.</span>' + '<input class="exerciseInput" type="text" placeholder="题目">' + '&nbsp;&nbsp;<input class="score-input" type="text" placeholder="分值(1-100)">&nbsp;&nbsp;' +
        '<img src="'+URL+'/static/img/deleteUser.png" title="删除此题" width="30px" height="30px" onclick="deleteExercise(this)"><br>' +
        '<textarea class="ec-textarea"></textarea>';
    $(".ec-inner").append(newChild);
}

//删除题目
function deleteExercise(child) {
    var yn = confirm("确认删除此题吗？")
    if(yn === true){
        $(child).parent().remove();
    }
}

//删除选项
function delItem(img) {
    if($(img).prev().prev().is(":checked")){
        alert("不能删除答案项");
        return;
    }
    $(img).prev().prev().remove();
    $(img).prev().remove();
    $(img).next().remove();
    $(img).remove();
}

//删除多选题选项
function delItemForCheckbox(img) {
    var checkBoxes = $(".choice-item").find("input[type='checkbox']");
    if(checkBoxes.length <= 2){
        alert("选项不能少于2项");
        return;
    }
    $(img).prev().prev().remove();
    $(img).prev().remove();
    $(img).next().remove();
    $(img).remove();
}

//为单选题增加选项
function addNewItemForRadio(img) {
    var itemName = $(img).parent().attr("id");
    $(img).next().append("<input type='radio' name='"+itemName+"'>" + "<input type='text' placeholder='选项'>" +
     "<img title='删除选项' src='"+URL+"/static/img/offline_fill.png' width='20px' height='20px' onclick='delItem(this)'><br>");
}

// 为多选题增加选项
function addNewItemForCheckBox(img) {
    var itemName = $(img).parent().attr("id");
    $(img).next().append("<input type='checkbox' name='"+itemName+"'>" + "<input type='text' placeholder='选项'>" +
        "<img title='删除选项' src='"+URL+"/static/img/offline_fill.png' width='20px' height='20px' onclick='delItem(this)'><br>");
}


// 添加填空
function addNewItemForFillBlank(img) {
    var text = $(img).prev().prev().prev().val();
    $(img).prev().prev().prev().val(text + "/-答案-/");
}

// 保存所有题目及答案
function saveExerciseContent() {
    if($(".ec-inner").children().length === 0){
        alert("请先添加题目再保存");
        return;
    }
    //  遍历分值input，如果存在没有值的分值则提示用户填写值，同时对分值进行校验
    var flag = true;
    $(".ec-inner").find(".score-input").each(function (i) {
        var value = $(this).val();
        if(value === "" || value === null || value === undefined){
            alert("必须填写题目的分值");
            flag = false;
            return;
        }
        if(!(/^[0-9]*[1-9][0-9]*$/.test(value))){
            alert("分值必须为1——100的正整数");
            flag = false;
            return;
        }
        if(parseInt(value) < 1 || parseInt(value) > 100){
            alert("分值必须为1——100的正整数");
            flag = false;
            return;
        }
    });
    if(flag === false){
        return;
    }
    //  设置该节点的特殊颜色并保存图表
    findNodeByValueAndSetColor(jsonData, nodeParams.value, "blue", "add");
    showChart(jsonData);
    saveChart(true);
    //  提取数据，保存题目
    var exerciseList = [];
    $(".ec-inner .ec-inner-item").each(function(){
        var type = $(this).attr("name");
        var title = $(this).find(".exerciseInput").val();
        var score = $(this).find(".score-input").val();
        var item = [];
        var answer = [];
        // 获取该题的所有选项，没有选项的则为空
        $(this).find(".choice-item input[type='text']").each(function () {
            var i = {"name":$(this).val()};
            item.push(i);
        });
        // 获取该题的答案，分类型获取
        // 如果是单选题，则获取被选中的那一项的序号（从0开始）即可
        if(type === "ec-oselect"){
            var value = $(this).find('input[type="radio"]:checked').next().val();
            var index = -1;
            $(this).find('.choice-item input[type="radio"]').each(function (i) {
                if($(this).next().val() === value){
                    index = i;
                    return;
                }
            });
            answer.push({"value":index});
        }else if(type === "ec-mutiselect"){ //  如果是多选题
            var current = $(this);
            $(this).find('.choice-item input[type="checkbox"]').each(function (i){
                var iVal = $(this).next().val();
                $(current).find('input[type="checkbox"]:checked').each(function () {
                    if(iVal === $(this).next().val()){
                        answer.push({"value":i});
                    }
                });
            });
        }else if(type === "ec-fillblank"){ //   如果是填空题
            var value;
            var start;
            var end;
            for(var j=0; j<title.length; j++){
                if(title.charAt(j) === '/'){
                    if(title.charAt(++j) === '-' ){
                        start = ++j;
                        while(title.charAt(j)!=="-" && title.charAt(j+1)!=="/"){
                            j++;
                        }
                        end = j;
                        value = title.substring(start, end);
                        answer.push({"value":value});
                    }else{
                        j--;
                    }
                }
            }
        }else if(type === "ec-yn"){ //   如果是判断题
            var value = $(this).find('input[type="radio"]:checked').val();
            answer.push({"value":value});
        }else if(type === "ec-answer"){ //   如果是问答题
            var value = $(this).find('.ec-textarea').val();
            answer.push({"value":value});
        }
        exerciseList.push({"type":type, "title":title, "score":score, "item":item, "answer":answer});
    });
    //  将封装好的对象提交到后台，在后台转化为json字符串，存入对应节点的目录下;
    var pid = nodeParams.value;
    var fileName = $("#jsonFileNameInput").val();
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var tranData = {"pid":pid, "jsonDir":jsonDir, "exerciseList":exerciseList};
    $.ajax({
        url: URL + '/file/exerciseToJson',
        type: 'POST',
        data: JSON.stringify(tranData),
        contentType: "application/json",
        success: function (data) {
            alert("保存成功！");
        },
        error: function () {
            alert("服务器出错！");
        }
    });
}

//  清空本节点所有练习题
function deleteAllExercise() {
    if($(".ec-inner").children().length === 0){
        alert("暂无练习题");
        return;
    }
    var yn = confirm("清除习题后将同时清空对应的学生答题记录，确认清空吗？");
    if(yn === false){
        return;
    }
    //设置该节点的特殊颜色并保存图表
    findNodeByValueAndSetColor(jsonData, nodeParams.value, "blue", "delete");
    showChart(jsonData);
    saveChart(true);
    var jsonFileName = $("#jsonFileNameInput").val();
    var jsonDir = jsonFileName.substring(0, jsonFileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData = new FormData();
    formData.append("jsonDir", jsonDir);
    formData.append("pid", pid);
    $.ajax({
        url: URL + '/file/delAllExerciseOfNode',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            $(".ec-inner").empty();
        },
        error: function () {
            alert("服务器内部错误！");
        }
    });
}

//  教师端打开选择班级对话框
function checkStuAnswers() {
    $(".editExerciseContent").hide();
    //  请求该被分配了该课程的班级列表，将班级显示在对话框中
    var jsonFileName = $("#jsonFileNameInput").val();
    $.ajax({
        url: URL + '/myClass/findClassesForChart',
        type: 'post',
        data: JSON.stringify({"jsonFileName":jsonFileName}),
        contentType: "application/json",
        success: function (data) {
            for(var i in data){
                var item = '<div class="ccfc-content-item" onclick="openClassMsgPage(this)"><span class="ccfc-className">'+data[i].name+'</span><input type="hidden" value="'+data[i].classId+'"></div>';
                $(".ccfc-content").append(item);
            }
        }
    });
    $("#chooseClassForCheckAnswer").show();
}

//  打开一个新的页面，跳转到班级详细信息页面，显示该班级的学生对于该知识点的作答情况
function openClassMsgPage(theDiv) {
    var classId = $(theDiv).find("input[type='hidden']").val();
    var jsonFileName = $("#jsonFileNameInput").val();
    var className = $(theDiv).find(".ccfc-className").html();
    window.open(URL + "/toStuAnswerMsg?pname="+nodeParams.name+"&pid="+nodeParams.value+"&jsonFileName="+jsonFileName+"&classId="+classId+"&className="+className, '_blank');
    closeCCFC();
}

//  关闭选择班级对话框
function closeCCFC() {
    $(".ccfc-content").empty();
    $("#chooseClassForCheckAnswer").hide();
    $(".editExerciseContent").show();
}

//  打开浏览习题的对话框（学生端）
function openViewExerciseContent() {
    $('.click-menu').hide();
    $(".fullHide").show();
    $(".ec-name").empty();
    $(".ec-name").append('<div class="ec-name-item">'+nodeParams.name+'练习题</div>');
    $("#ec-bottom-saveBtn").remove();
    $("#ec-bottom-delBtn").remove();
    $("#ec-bottom-submitBtn").show();
    //请求题目
    var userId = $("#userIdInput").val();
    var fileName = $("#jsonFileNameInput").val()
    var jsonDir = fileName.substring(0, fileName.lastIndexOf("."));
    var pid = nodeParams.value;
    var formData = new FormData();
    formData.append("jsonDir", jsonDir);
    formData.append("pid", pid);
    formData.append("userId", userId);
    $.ajax({
        url: URL + '/file/getExercise',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            //  填充题目
            fillThisNodeExerciseForStudent(data);
        }
    });
    //  学生端：再请求该知识点学生已经答题的答题情况（如果有）
    var user = $("#identityInput").val();
    if(user === undefined || user === null || user === ""){
        $.ajax({
            url: URL + '/student/getAnswerRecord',
            type: 'POST',
            data: JSON.stringify({"pid":pid, "userId":userId}),
            contentType: "application/json",
            async: false,
            success: function (data) {
                if(data.row !== undefined && data.answer !== undefined){
                    //填充答案
                    fillStuAnswer(data);
                    //填充答题情况
                    backViewAnswer(data);
                    //使所有表单的填写失效，防止用户更改
                    $(".ec-inner").find("input").attr("disabled","disabled");
                    $(".ec-textarea").attr("disabled","disabled");
                    //隐藏提交按钮
                    $("#ec-bottom-submitBtn").hide();
                }
            }
        });
    }
    $(".editExerciseContent").show();
}

//学生端填充节点的题目内容
function fillThisNodeExerciseForStudent(jsonArray) {
    for(var i in jsonArray){
        var answer = jsonArray[i].answer;
        var ecIndex = parseInt(i)+1; // 题目的序号
        var score = jsonArray[i].score; //  题目的分值
        var newChildId = "ec-inner-" + ecIndex;
        //单选题
        if(jsonArray[i].type === "ec-oselect"){
            var index = answer[0].value; //答案的序号
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-oselect">' +
                '<div class="ec-title">'+ecIndex+"."+jsonArray[i].title+"[单选题-"+score+"分]" + "<input class='item-score' type='hidden' value='"+score+"'>" + '<span class="ec-result"></span></div>' +
                '<div class="choice-item">';
            //填充选项
            for(var j in jsonArray[i].item){
                var newItem;
                var newItemId = newChildId+"-"+j;
                if(index == j){
                    newItem = '<input id="'+newItemId+'" type="radio" name="'+newChildId+'" class="ec-true"><span>'+jsonArray[i].item[j].name+'</span> <br>';
                }else{
                    newItem = '<input id="'+newItemId+'" type="radio" name="'+newChildId+'"><span>'+jsonArray[i].item[j].name+'</span> <br>';
                }
                newChild += newItem;
            }
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-mutiselect"){ // 多选题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-mutiselect">' +
                '<div class="ec-title">'+ecIndex+"."+jsonArray[i].title+"[多选题-"+score+"分]" + "<input class='item-score' type='hidden' value='"+score+"'>"  + '<span class="ec-result"></span></div>' +
                '<div class="choice-item">';
            for(var j in jsonArray[i].item){
                var newItem;
                var newItemId = newChildId+"-"+j;
                for(var k in answer){
                    if(answer[k].value == j){
                        newItem = '<input id="'+newItemId+'" type="checkbox" name="'+newChildId+'" class="ec-true"><span>'+jsonArray[i].item[j].name+'</span> <br>';
                        break;
                    }else{
                        newItem = '<input id="'+newItemId+'" type="checkbox" name="'+newChildId+'"><span>'+jsonArray[i].item[j].name+'</span> <br>';
                    }
                }
                newChild += newItem;
            }
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-fillblank"){ // 填空题
            var title = jsonArray[i].title;
            title = title.replace(/\/-[\s\S]*?-\//g, "<input type='text' class='small-blank'>");
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-fillblank">' +
                '<div class="ec-title">'+ecIndex+"."+ title +"[填空题-"+score+"分]" + "<input class='item-score' type='hidden' value='"+score+"'>" + '<span class="ec-result"></span></div>' +
                '<div class="choice-item">';
            var newItem = '';
            for(var j in answer){
                newItem += '<input type="hidden" class="ec-true" value="'+answer[j].value+'">'
            }
            newChild += newItem + '</div>';
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-yn") { // 判断题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-yn">' +
                '<div class="ec-title">'+ecIndex+"."+jsonArray[i].title+"[判断题-"+score+"分]" + "<input class='item-score' type='hidden' value='"+score+"'>" + '<span class="ec-result"></span></div>' +
                '<div class="choice-item">';
            var value = answer[0].value;
            if(value === "true"){
                newChild += '<input type="radio" name="'+newChildId+'" value="true" class="ec-true"> 正确</br><input type="radio" name="'+newChildId+'" value="false"> 错误</br>';
            }else{
                newChild += '<input type="radio" name="'+newChildId+'" value="true"> 正确</br><input type="radio" name="'+newChildId+'" value="false" class="ec-true"> 错误</br>';
            }
            newChild += '</div>'
            $(".ec-inner").append(newChild);
        }else if(jsonArray[i].type === "ec-answer") { // 问答题
            var newChild = '<div id="'+newChildId+'" class="ec-inner-item" name="ec-answer">' +
                '<div class="ec-title">'+ecIndex+"."+jsonArray[i].title+"[简答题-"+score+"分]" + "<input class='item-score' type='hidden' value='"+score+"'>" + '<span class="ec-result"></span></div>' +
                '<div class="choice-item">';
            newChild += '<textarea class="ec-textarea"></textarea>';
            newChild += '<input type="hidden" value="'+answer[0].value+'"></diva>';
            $(".ec-inner").append(newChild);
        }
    }
}

//学生端提交练习题
function submitExerciseContent() {
    //使所有表单的填写失效，防止用户更改
    $(".ec-inner").find("input").attr("disabled","disabled");
    $(".ec-textarea").attr("disabled","disabled");
    var stuAnswerList = [];
    $(".ec-inner .ec-inner-item").each(function(){
        var type = $(this).attr("name");
        var score = $(this).find(".item-score").val();
        var reply = [];
        var answer = [];
        //分类型
        //如果是单选题
        if(type === "ec-oselect"){
            if($(this).find('input[type="radio"]:checked').attr("id") === undefined){
                reply.push({"value":-1});
            }else {
                var stu_choice_id = $(this).find('input[type="radio"]:checked').attr("id");
                var stu_index = stu_choice_id.substring(stu_choice_id.lastIndexOf("-")+1);
                reply.push({"value":stu_index});
            }
            var true_choice_id = $(this).find(".ec-true").attr("id");
            var true_index = true_choice_id.substring(true_choice_id.lastIndexOf("-")+1);
            answer.push({"value":true_index});
        }else if(type === "ec-mutiselect"){ //  多选题
            if($(this).find('input[type="checkbox"]:checked').attr("id") === undefined){
                reply.push({"value":-1});
            }else{
                $(this).find('input[type="checkbox"]:checked').each(function (j) {
                    var stu_choice_id = $(this).attr("id");
                    var stu_index = stu_choice_id.substring(stu_choice_id.lastIndexOf("-")+1);
                    reply.push({"value":stu_index});
                });
            }
            $(this).find(".ec-true").each(function (j) {
                var true_choice_id = $(this).attr("id");
                var true_index = true_choice_id.substring(true_choice_id.lastIndexOf("-")+1);
                answer.push({"value":true_index});
            });
        }else if(type === "ec-fillblank"){ //    填空题
            $(this).find(".ec-title").find("input[type='text']").each(function (j) {
                reply.push({"value":$(this).val()});
            });
            $(this).find(".choice-item").find("input[type='hidden']").each(function (j) {
                answer.push({"value":$(this).val()});
            });
        }else if(type === "ec-yn"){ //   判断题
            if($(this).find(".choice-item").find('input[type="radio"]:checked').val() === undefined){
                reply.push({"value":""});
            }else{
                var stu_value = $(this).find(".choice-item").find('input[type="radio"]:checked').val();
                reply.push({"value":stu_value});
            }
            var true_value = $(this).find(".choice-item").find(".ec-true").val();
            answer.push({"value":true_value});
        }else if(type === "ec-answer"){
            var stu_value = $(this).find(".ec-textarea").val();
            reply.push({"value":stu_value});
            var true_value = $(this).find(".choice-item").find("input[type='hidden']").val();
            answer.push({"value":true_value});
        }
        stuAnswerList.push({"type":type,"score":score,"reply":reply,"answer":answer});
    });
    //将封装好的对象提交到后台，在后台判断正误，然后返回学生的答题情况
    var userId = $("#userIdInput").val();
    var pid = nodeParams.value;
    var jsonFileName = $("#jsonFileNameInput").val();
    var tranData = {"stuAnswerList":stuAnswerList, "userId":userId, "pid":pid, "jsonFileName":jsonFileName};
    $.ajax({
        url: URL + '/student/judgeExercise',
        type: 'POST',
        data: JSON.stringify(tranData),
        contentType: "application/json",
        success: function (data) {
            backViewAnswer(data);
        },
        error: function () {
            alert("提交失败，服务器出错");
        }
    });
}

//学生端填充答案
function fillStuAnswer(data) {
    var answer = data.answer;
    $(".ec-inner .ec-inner-item").each(function(i){
        var type = $(this).attr("name");
        if(type === "ec-oselect"){ //   单选
            var replyIndex = answer[i].reply[0].value;
            $(this).find(".choice-item input").each(function (j) {
               if(replyIndex == j){
                   $(this).prop("checked", "checked");
               }
            });
        }else if(type === "ec-mutiselect"){ //  多选
            var replyIndexArray = answer[i].reply;
            $(this).find(".choice-item input").each(function (j) {
                var curInput = $(this);
                for(var k in replyIndexArray){
                    if(j == replyIndexArray[k].value){
                        $(curInput).prop("checked", "checked");
                    }
                }
            })
        }else if(type === "ec-fillblank"){ //   填空
            var replyArray = answer[i].reply;
            $(this).find(".small-blank").each(function (j) {
                $(this).val(replyArray[j].value);
            })
        }else if(type === "ec-yn"){ //  判断
            var replyYn = answer[i].reply[0].value;
            if(replyYn == true){
                $(this).find(".choice-item input[value='true']").prop("checked", "checked");
            }else{
                $(this).find(".choice-item input[value='false']").prop("checked", "checked");
            }
        }else if(type === "ec-answer"){ //  简答
            var replyAnswer = answer[i].reply[0].value;
            $(".ec-textarea").html(replyAnswer);
        }
    });
}

//学生端回显答题情况
function backViewAnswer(data) {
    var row = data.row;
    $(".ec-inner .ec-inner-item").each(function(i){
        if(i >= row.length){
            return;
        }
        if(row[i].value === true){
            $(this).find(".ec-result").append("正确");
            $(this).find(".ec-result").css("color","#4CAF50");
        }else if(row[i].value === false){
            //分类型给出错误信息
            //单选
            var type = $(this).attr("name");
            if(type === "ec-oselect"){
                var true_choice_id = $(this).find(".ec-true").attr("id");
                var true_index = true_choice_id.substring(true_choice_id.lastIndexOf("-")+1);
                $(this).find(".ec-result").append("错误" + " 正确答案：" + String.fromCharCode(65+parseInt(true_index)));
            }else if(type === "ec-mutiselect"){ //  多选
                var result = $(this).find(".ec-result");
                $(result).append("错误" + " 正确答案：");
                $(this).find(".ec-true").each(function (j) {
                    var true_choice_id = $(this).attr("id");
                    var true_index = true_choice_id.substring(true_choice_id.lastIndexOf("-")+1);
                    $(result).append(String.fromCharCode(65 + parseInt(true_index)) + " ");
                });
            }else if(type === "ec-fillblank"){ //   填空
                var result = $(this).find(".ec-result");
                $(result).append("错误" + " 正确答案：");
                $(this).find(".ec-true").each(function (j) {
                    $(result).append($(this).val()+" ");
                });
            }else if(type === "ec-yn"){ //  判断
                var true_value = $(this).find(".ec-true").val();
                if(true_value === true){
                    true_value = "对";
                }else {
                    true_value = "错";
                }
                $(this).find(".ec-result").append("错误" + " 正确答案：" + true_value);
            }
            //简答题不判断对错
            $(this).find(".ec-result").css("color","#d63031");
        }else if(row[i].value === -1){ //  表示问答题未被评分
            $(this).find(".ec-result").append("暂无评分");
            $(this).find(".ec-result").css("color","#FFC312");
        }else{
            $(this).find(".ec-result").append("得分：" + row[i].value);
            $(this).find(".ec-result").css("color","#4CAF50");
        }
        $(this).find(".ec-result").show();
    });
}

//  打开一个新的页面，查看班级的某一门课程的评价
function checkClassAnalyse() {
    var chartId = $("#chartIdInput").val();
    var chartName = $("#chartNameInput").val();
    var classId = "";
    var className = "";
    var grade = "";
    //  查询班级信息
    $.ajax({
        url: URL + '/myClass/getClassByStudentId',
        type: 'POST',
        data: {},
        contentType: "application/json",
        async: false,
        success: function (data) {
            classId = data.classId;
            className = data.name;
            grade = data.grade;
        },
        error: function () {
            alert("服务器出错");
        }
    });
    window.open(URL + "/toCourseEvaluatePage?chartId="+chartId+"&classId="+classId+"&className="+className+"&grade="+grade+"&chartName="+chartName, '_blank');
}