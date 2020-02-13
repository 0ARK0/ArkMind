var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";

var user = $("#identityInput").val();
var jsonDataArray = [];
var jsonFileNameArray = [];
var jsonPathArray = [];
var userIdArray = [];
var myChartArray = [];

//遍历隐藏的div，其子元素是input，每个input中都保存着后端发过来的json字符串
$("#jsonDataList input").each(function (i, n) {
    var childStr = $(n).val();
    jsonDataArray[i] = JSON.parse(childStr);
});

//遍历隐藏的div，子元素input中存放每个图表对应的json文件的文件名
$("#fileNameList input").each(function (i, n) {
    var childStr = $(n).val();
    jsonFileNameArray[i] = childStr;
});

//遍历隐藏的div，子元素input中存放每个图表对应的json文件的路径
$("#filePathList input").each(function (i, n) {
    var childStr = $(n).val();
    jsonPathArray[i] = childStr;
});

if(user === null || user === "" || user === undefined){
    //遍历隐藏的div，子元素input中存放每个图表对应的userId
    $("#userIdList input").each(function (i, n) {
        var childStr = $(n).val();
        userIdArray[i] = childStr;
    });
}

//循环创建方块div
//如果用户是教师，则添加删除按钮
if(user !== null && user !== "" && user !== undefined){
    for(var i in jsonDataArray){
        var ccDiv1 = "<div id='chartName"+i+"' class='chartName'></div>";
        var ccDiv2 = "<div id='chart"+i+"' class='chartDiv'></div>";
        var cccDiv1 = "<div id='openFlag"+i+"' class='chartOpen' onclick='toMainPage(this)'>打开</div>";
        var cccDiv2 = "<div id='deleteFlag"+i+"' class='chartDelete' onclick='deleteChart(this)'>删除</div>";
        var ccDiv3 = "<div class='chartDivBottom'>"+cccDiv1+cccDiv2+"</div>";
        var cDiv = "<div id='chartContentDiv"+i+"' class='chartContentDiv shadow'>" + ccDiv1 + ccDiv2 + ccDiv3 + "</div>";
        $(".main").append(cDiv);
    }
}else{
    //如果用户是学生则只添加打开的按钮
    for(var i in jsonDataArray){
        var ccDiv1 = "<div id='chartName"+i+"' class='chartName'></div>";
        var ccDiv2 = "<div id='chart"+i+"' class='chartDiv'></div>";
        var cccDiv1 = "<div id='openFlag"+i+"' class='chartOpenStu' onclick='toMainPage(this)'>打开</div>";
        var ccDiv3 = "<div class='chartDivBottom'>"+cccDiv1+"</div>";
        var cDiv = "<div id='chartContentDiv"+i+"' class='chartContentDiv shadow'>" + ccDiv1 + ccDiv2 + ccDiv3 + "</div>";
        $(".main").append(cDiv);
    }
}

//将图表显示到对应的方块中
for(var i in jsonDataArray){
    var name = "chart"+i;
    myChartArray[i] = echarts.init(document.getElementById(name));
    showChart(i,jsonDataArray[i]);
    //显示图表的名称
    var chartName = "#chartName"+i;
    $(chartName).append(jsonDataArray[i].name);
}

function showChart(index,data) {
    myChartArray[index].setOption(option = {
        backgroundColor: "white",
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
                symbolSize: 3,      //标记（小圆圈）的大小，默认是7
                initialTreeDepth: 1, //默认：2，树图初始展开的层级（深度）。根节点是第 0 层，然后是第 1 层、第 2 层，... ，直到叶子节点
                label: {             //每个节点对应的标签的样式
                    normal: {
                        position: 'left',           //标签的位置
                        verticalAlign: 'middle',    //文字垂直对齐方式，默认自动。可选：top，middle，bottom
                        align: 'right',             //文字水平对齐方式，默认自动。可选：top，center，bottom
                        fontSize: 5                //标签文字大小
                    }
                },
                leaves: {   //叶子节点的特殊配置
                    label: {
                        normal: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    }
                },
                expandAndCollapse: true,     //子树折叠和展开的交互，默认打开
                animationDuration: 1000,      //初始动画的时长，支持回调函数,默认1000
                animationDurationUpdate: 750 //数据更新动画的时长，默认300
            }
        ]
    });
}

//  post请求跳转到主界面
function toMainPage(beOpenDiv) {
    var beOpenDivId = $(beOpenDiv).attr('id');
    var temp = document.createElement("form");
    temp.name = "tempForm";
    temp.action = URL + "/toMain";
    temp.style.display = "none";
    temp.method = "post";
    var opt = document.createElement("textarea");
    if (beOpenDivId === null || beOpenDivId === undefined) { //发送请求新建一个图表
        opt.name = "jsonData";
        opt.value = null;
        temp.appendChild(opt);
    }else { //发送请求打开一个图表
        var index = beOpenDivId.substring(beOpenDivId.lastIndexOf("g") + 1);
        opt.name = "jsonData";
        opt.value = JSON.stringify(jsonDataArray[index]);
        temp.appendChild(opt);
        var opt2 = document.createElement("textarea");
        opt2.name = "fileName";
        opt2.value = jsonFileNameArray[index];
        var opt3 = document.createElement("textarea");
        opt3.name= "chartPath";
        opt3.value= jsonPathArray[index];
        temp.appendChild(opt2);
        temp.appendChild(opt3);
        if(user === null || user === "" || user === undefined){
            var opt4 = document.createElement("textarea");
            opt4.name = "userId";
            opt4.value = userIdArray[index];
            temp.appendChild(opt4);
        }
    }
    document.body.appendChild(temp);
    temp.submit();
    $("form[name='tempForm']").remove();
}

//删除图表
function deleteChart(d) {
    var yn = confirm("删除课程后，所有课程信息和班级对应的课程信息也将被删除，确认删除此课程吗？");
    if(yn === true){
        var dId = $(d).attr('id');
        var index = dId.substring(dId.lastIndexOf("g")+1);
        $.ajax({
            url: URL + "/chart/delete",
            type: "get",
            data: {"fileName":jsonFileNameArray[index]},
            dataType: "text",
            success: function () {
                var beDelDivId = "#chartContentDiv"+index;
                $(beDelDivId).remove();
            },
            error: function () {
                alert("服务器内部错误");
            }
        })
    }
}

// 跳转到我的班级页面
function toMyClassPage() {
    window.location.href = URL + "/toMyClass";
}

// 打开个人信息对话框，根据角色显示用户的信息
function openMyMsgDiv() {
    $(".fullHide").show();
    $(".personMsgDiv").show();
    $.ajax({
        url: URL + "/getUserMsg",
        type: "get",
        data: {},
        success: function (data) {
            // 如果是教师
            if(user !== null && user !== "" && user !== undefined){
                $(".msg-inner").append('<input type="hidden" name="teacher" value="'+data.userId+'">');
                $(".msg-inner").append('<div class="msg-inner-item">身份： 教师</div>');
                $(".msg-inner").append('<div class="msg-inner-item">姓名： '+data.userName+'</div>');
                $(".msg-inner").append('<div class="msg-inner-item">账号： <input type="text" value="'+data.account+'" disabled></div>');
            }else{// 如果是学生
                $(".msg-inner").append('<input type="hidden" name="student" value="'+data.studentId+'">');
                $(".msg-inner").append('<div class="msg-inner-item">身份： 学生</div>');
                $(".msg-inner").append('<div class="msg-inner-item">姓名： '+data.name+'</div>');
                $(".msg-inner").append('<div class="msg-inner-item">账号： <input type="text" value="'+data.studentId+'" disabled></div>');
            }
            $(".msg-inner").append('<input id="hidePwd" type="hidden" value="'+data.password+'">');
            $(".msg-inner").append('<div class="msg-inner-item">修改密码： <img title="修改密码" src="'+URL+'/static/img/editor.png" width="35px" height="30px" onclick="updatePwd()"></div>');
        }
    });
}

// 修改密码
function updatePwd() {
    if($(".msg-inner").find(".updatePwd_symbol").length > 0){
        $(".msg-inner").find(".updatePwd_symbol").remove();
        $(".add-btn").hide();
    }else{
        $(".msg-inner").append('<div class="msg-inner-item updatePwd_symbol">原密码：<input id="oldPassword" type="password"></div>');
        $(".msg-inner").append('<div class="msg-inner-item updatePwd_symbol">新密码：<input id="newPassword" type="password"></div>');
        $(".add-btn").show();
    }
}

// 保存个人信息的修改
function saveMsgUpdate() {
    var oldPwd = $(".msg-inner").find("#oldPassword").val();
    var newPwd = $(".msg-inner").find("#newPassword").val();
    var pwd = $("#hidePwd").val();
    if(pwd !== oldPwd){
        alert("原始密码错误，请重试");
        return;
    }
    if(oldPwd === newPwd){
        alert("新密码不得与原密码相同");
        return;
    }
    if(newPwd.length < 5){
        alert("密码位数不得小于5位");
        return;
    }
    var identity = $(".msg-inner").find("input[type='hidden']").attr("name");
    var myUrl;
    if(identity === "teacher"){
        myUrl = URL + "/user/updatePwd";
    }else{
        myUrl = URL + "/student/updatePwd";
    }
    var formData = new FormData();
    formData.append("newPwd", newPwd);
    $.ajax({
        url: myUrl,
        type: "post",
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            alert("修改成功");
        }
    });
}

//关闭个人信息对话框
function closeMsgDiv() {
    $(".msg-inner").empty();
    $(".add-btn").hide();
    $(".personMsgDiv").hide();
    $(".fullHide").hide();
}

//退出登录
function logout() {
    if(user === null || user === "" || user === undefined){
        window.location.href = URL + "/student/logout";
    }else{
        window.location.href = URL + "/user/logout";
    }
}

function getMousePos(event) {
    var e = event || window.event;
    var mouse = {'x':e.screenX,'y':screenY};
    return mouse;
}

var mouse_xPos;
var mouse_yPos;

// 桌面助手点击事件
function showOption() {
    alert("操作指南");
}

// 桌面助手拖动
function domReady(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',function(){
            fn&&fn();//处理事情
        },false);
    }else{
        /*监控资源情况，ie8及以下不支持addEventListener*/
        document.onreadystatechange=function(){
            /*dom加载完成的时候*/
            if(document.readyState=='complete'){
                fn&&fn();//处理事情
            }
        };
    }
}
//事件绑定兼容
function addEvent(obj,oEvn,fn){
    if(obj.addEventListener){
        obj.addEventListener(oEvn,fn,false);
    }else{
        obj.attachEvent('on'+oEvn,fn);
    }
}
//解除事件绑定
function removeEvent(obj,oEvn,fn){
    if(obj.removeEventListener){
        obj.removeEventListener(oEvn,fn,false);
    }else{
        obj.detachEvent('on'+oEvn,fn);
    }
}
domReady(function(){
    var oBox = document.getElementById("bidiu");
    function down(ev){
        mouse_xPos = getMousePos(event).x;
        mouse_yPos = getMousePos(event).y;
        timeFlag = false;
        hideBidiuTalk();
        var oEvent = ev || event;
        var disX=oEvent.clientX-oBox.offsetLeft;
        var disY=oEvent.clientY-oBox.offsetTop;
        function move(ev){
            var oEvent=ev||event;
            var l=oEvent.clientX-disX;
            var t=oEvent.clientY-disY;
            if(l<0){
                l=0;
            }
            if(l>document.documentElement.clientWidth-oBox.offsetWidth){
                l=document.documentElement.clientWidth-oBox.offsetWidth;
            }
            if(t<0){
                t=0;
            }
            if(t>document.documentElement.clientHeight-oBox.offsetHeight){
                t=document.documentElement.clientHeight-oBox.offsetHeight;
            }
            oBox.style.left=l+'px';
            oBox.style.top=t+'px';
        }
        function up(){
            if(getMousePos(event).x === mouse_xPos && getMousePos(event).y === mouse_yPos){
                showOptionGuide();
            }
            var bidiu_left = $("#bidiu").css("left").split("px")[0];
            var bidiu_top = $("#bidiu").css("top").split("px")[0];
            bidiu_left = parseInt(bidiu_left) - 75;
            bidiu_top = parseInt(bidiu_top) - 60;
            $("#bidiu_talk").css("left", bidiu_left + "px");
            $("#bidiu_talk").css("top", bidiu_top + "px");
            timeFlag = true;
            removeEvent(document,"mousemove",move);
            removeEvent(document,"mouseup",up);
            //释放捕获
            oBox.releaseCapture && oBox.releaseCapture();
        }
        addEvent(document,"mousemove",move);
        addEvent(document,"mouseup",up);
        //设置捕获
        oBox.setCapture && oBox.setCapture();
        //阻止浏览器默认事件
        oEvent.preventDefault && oEvent.preventDefault();
        return false;
    }
    addEvent(oBox,"mousedown",down);
});


setTimeout("showBidiuTalk()",2000);
var timeFlag = true;
function showBidiuTalk() {
    if(timeFlag){
        $("#bidiu_talk").show();
        setTimeout("hideBidiuTalk()",3000);
    }
}

function hideBidiuTalk() {
    $("#bidiu_talk").hide();
    if(timeFlag){
        var time = Math.floor((Math.random() * 7 + 3) * 1000);
        setTimeout("showBidiuTalk()", time);
        var text = changeTalk();
        $("#bidiu_talk").html(text);
    }
}

function changeTalk() {
    var teacher_text = ["点我查看操作指南哦！", "我是比丢，你的操作助手~", "我可以被拖动哦，试试吧", "Hello World!",
        "删除课程后将会删除关于课程的所有记录，要谨慎哦！", "点击个人信息可以修改密码哦"];
    var techer_index;
    var student_text = ["点我查看操作指南哦！", "我是比丢，你的操作助手~", "我可以被拖动哦，试试吧", "快来学习吧", "Hello World!",
        "课程练习题只能提交一次，要仔细确认再提交哦！", "点击个人信息可以修改密码哦"];
    var student_index;
    var text;
    if(user !== null && user !== "" && user !== undefined){
        techer_index = Math.round(Math.random() * 6);
        text = teacher_text[techer_index];
    }else{
        student_index = Math.round(Math.random() * 7);
        text = student_text[student_index];
    }
    return text;
}

function showOptionGuide(){
    // 如果角色是教师，则显示教师端的操作指南
    if(user !== null && user !== "" && user !== undefined){
        var content = "<p>1.点击+号创建新的课程（思维导图），可以通过上传excel文件创建，也可以在页面右击begin节点来创建。</p>" +
            "<p>2.excel文件的文件名将作为思维导图的根节点，而内容必须按照如下示例格式，否则无法生成正确的思维导图。</p>" +
            "<a href='"+URL+"/static/img/example.png' target='_blank'><img width='350' height='200px' src='"+URL+"/static/img/example.png'></a>" +
            "<p>3.完成了思维导图后记得点击保存按钮，再返回。返回到“我的课程中”可以查看所有创建的课程。</p>" +
            "<p>4.可以在思维导图的任何一个节点添加练习题和学习资料，添加练习题也需要保存。</p>" +
            "<p>5.有练习题的节点会显示为蓝色，有学习资料的节点会显示为黄色，两者都有则会显示为绿色。</p>" +
            "<p>6.在知识点下创建了练习题后学生即可在线答题，学生的答题记录可以通过点击练习题对话框的“学生答题情况”按钮查看。</p>" +
            "<p>7.课程导航栏中的搜索框可以搜索关键字，匹配到关键字会展开对应的节点并高亮显示。</p>" +
            "<p>8.还原按钮是将以展开的思维导图还原到两层的状态，不会修改思维导图的内容。</p>" +
            "<p>9.删除思维导图中的节点将会删除该节点下所有的习题和学习资料，不可撤回。</p>" +
            "<p>10.在首页中删除一门课程会删除关于课程的所有相关信息，不可撤回。</p>" +
            "<p>11.首页“个人信息”按钮可以查看自己的个人信息，或者修改密码。</p>" +
            "<p>12.首页“我的班级”按钮可以查看管理员分配给你的班级，点击“课程”小按钮可以为班级分配自己创建的课程，勾选后需要保存，可以随时修改。点击“评价”小按钮可以查看该班级学生对于某一门课程的学习情况。</p>"
    }else{
        var content = "<p>1.点击首页中的课程下的“打开”小按钮即可进入课程。</p>" +
            "<p>2.首页“个人信息”按钮可以查看自己的个人信息，或者修改密码。</p>" +
            "<p>3.进入课程后，课程以思维导图的形式呈现，每个实心圆点都可以展开查看子节点，每个节点都是一个知识点，右击知识点可以查看该知识点下的学习资料和练习题。</p>" +
            "<p>4.有练习题的节点会显示为蓝色，有学习资料的节点会显示为黄色，两者都有则会显示为绿色。</p>" +
            "<p>5.课程导航栏中的搜索框可以搜索关键字，匹配到关键字会展开对应的节点并高亮显示。</p>" +
            "<p>6.还原按钮是将以展开的思维导图还原到两层的状态，不会修改思维导图的内容。</p>" +
            "<p>7.右击知识点——习题后会打开该知识点的练习题对话框，你可以根据该知识点的学习资料和自己所掌握的知识进行在线答题</p>" +
            "<p>8.每个知识点的练习题只有一次答题机会，要确认好答案再提交哦！</p>" +
            "<p>9.点击“课程评价”按钮打开该课程评价页面，查看自己的学习情况。</p>"
    }
    $(".og-content").append(content);
    $(".fullHide").show();
    $(".option-guide").show();
}

function closeOptionGuide() {
    $(".option-guide").hide();
    $(".fullHide").hide();
}