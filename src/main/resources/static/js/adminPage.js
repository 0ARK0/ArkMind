var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";

//  显示班级管理的div
function showClassDiv(){
    if($(".main").hasClass("classManager")){
        return;
    }else{
        $(".main").removeClass("teacherManager");
        $(".main").empty();
    }
    $(".main").addClass("classManager");
    var addClassDiv = "<div class='addClassDiv'><img src='"+URL+"/static/img/plus.png' width='100px' height='100px'>" +
        "<input id='fileUploader' class='file' type='file' accept='.xls, .xlsx' onchange='uploadClassFile()'>" +
        "</div>";
    var classContentDiv = "<div class='classContentDiv shadow'>"+addClassDiv
        + "<p>上传Excel花名册创建班级</p>"
        + "</div>";
    $(".main").append(classContentDiv);
    //  ajax请求所有班级信息并显示
    $.ajax({
        url: URL + '/myClass/findAllClass',
        type: 'POST',
        data: {},
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            var classList = data;
            for(var i in classList){
                var inner1 = "<div class='className' id='"+classList[i].classId+"' name='"+classList[i].name+"' onclick='toClassPage(this)'>"+classList[i].name+"</div>";
                var inner2 = "<div class='classDel' onclick='deleteClass(this)'>删除</div>";
                var outDiv = "<div class='classContentDiv shadow'>" + inner1 + inner2 + "</div>";
                $(".main").append(outDiv);
            }
        }
    });
}

//  上传excel文件创建班级信息
function uploadClassFile() {
    var f = $('#fileUploader').get(0).files[0];
    if("" === f || null === f || f === undefined){
        alert("请选择文件！");
        return;
    }
    var formData = new FormData();
    formData.append("file", f);
    $.ajax({
        url: URL + '/file/excelToClass',
        type: 'POST',
        data: formData,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            var classDiv = "<div class='classContentDiv shadow'>" +
                "<div class='className' id='"+data.classId+"' name='"+data.name+"' onclick='toClassPage(this)'>"+data.name+"</div>" +
                "<div class='classDel' onclick='deleteClass(this)'>删除</div>" +
                "</div>";
            $(".main").append(classDiv);
        },
        error: function () {
            alert('上传的文件不符合规定的格式！表头必须包含"姓名"、"学号"、"年级"三列。');
        }
    });
}

//get请求跳转到班级信息界面
function toClassPage(classDiv) {
    var classId = $(classDiv).attr("id");
    var className = $(classDiv).attr("name");
    window.location.href = URL + "/toClassMsg?classId=" + classId + "&className=" + className+ "&pageNum=" + 0 + "&pageSize=" + 10;
}


//删除班级
function deleteClass(child) {
    var classId = $(child).prev().attr("id");
    var yn = confirm("班级删除后该班级的学生信息和课程信息将被一并删除，确认删除该班级吗？");
    if(yn === false){
        return;
    }
    var formData = new FormData();
    formData.append("classId", classId);
    $.ajax({
        url: URL + '/myClass/deleteById',
        type: 'POST',
        data: formData,
        dataType: "text",
        contentType: false,
        processData: false,
        success: function () {
            $(child).parent().remove();
        },
        error: function () {
            alert("删除失败，服务器内部出错！");
        }
    });
}

//显示教师管理的div
function showTeacherDiv() {
    if($(".main").hasClass("teacherManager")){
        return;
    }else{
        $(".main").removeClass("classManager");
        $(".main").empty();
    }
    $(".main").addClass("teacherManager");
    $(".main").append("<div class='operateDiv'></div>");
    $(".operateDiv").append("<div class='operate' onclick='deleteUser()'><img width='35px' height='35px' src='/ArkMind/static/img/deleteUser.png' title='删除'></div>");
    $(".operateDiv").append("<div class='operate' onclick='updateUser()'><img width='35px' height='35px' src='/ArkMind/static/img/editor.png' title='修改'></div>");
    $(".operateDiv").append("<div class='operate' onclick='addNewUser()'><img width='35px' height='35px' src='/ArkMind/static/img/addUser.png' title='新增'></div>");
    $(".operateDiv").append("<div class='operate' onclick='addClassForUser()'><img width='35px' height='35px' src='/ArkMind/static/img/class.png' title='添加班级'></div>");
    $(".operateDiv").append("<div class='operate' onclick='flushTable()'><img width='35px' height='35px' src='/ArkMind/static/img/flush.png' title='刷新表格'></div>");
    //以表格的形式显示教师信息
    var tTable = "<table class='zebra'>" +
        "<thead>" + "<tr>" +
        "<th>#</th>" + "<th>教工号</th>" + "<th>姓名</th>" + "<th>性别</th>" + "<th>选择</th>" +
        "</tr>" + "</thead>" +
        "<tfoot><td></td><td></td><td></td><td></td><td></td></tfoot>" +
        "</table>";
    $(".main").append(tTable);
    var formData = new FormData();
    formData.append("pageNum", 1);
    formData.append("pageSize", 10);
    $.ajax({
        url: URL + "/user/findAllByPage",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            var userList = data.list;
            for(var i in userList){
                var sex = userList[i].sex;
                if(sex == null){
                    sex = "";
                }
                var tr = "<tr class='stu-tr'>" +
                    "<td></td>" +
                    "<td>"+userList[i].account+"</td>" +
                    "<td>"+userList[i].userName+"</td>" +
                    "<td>"+sex+"</td>" +
                    "<td><input name='userCheckBox' type='checkbox' value='"+userList[i].userId+"'></td>" +
                    "</tr>";
                $(".zebra").append(tr);
            }
            //显示分页
            var mainBottomDiv = "<div id='main-bottom'>" +
                "<ul class='pagination'>" + "<li id='li-prev'><a href='javascript:void(0);' onclick='toSomePage(\"prev\")'>«</a></li>" +
                "</div>"
            $('.main').append(mainBottomDiv);
            for(var i=1; i<=data.pages; i++){
                if(parseInt(i) === 1){
                    $(".pagination").append("<li class='li-num'><a class='active' href='javascript:void(0);' onclick='toSomePage(this)'>"+i+"</a></li>");
                }else{
                    $(".pagination").append("<li class='li-num'><a href='javascript:void(0);' onclick='toSomePage(this)'>"+i+"</a></li>");
                }
            }
            $(".pagination").append("<li id='li-next'><a href='javascript:void(0);' onclick='toSomePage(\"next\")'>»</a></li>");
        }
    })
}

//翻页
function toSomePage(a) {
    if(a === "prev"){
        var page = $(".active").text();
        if(page-1 <=0 ){
            return;
        }
        var prevA = $(".active").prev();
        requestPage(page-1, prevA);
    }else if(a === "next"){
        var page = $(".active").text();
        var pageNum = $("#li-num").find("a").length;
        if(parseInt(page)+1 > pageNum){
            return;
        }
        var nextA = $(".active").next();
        requestPage(parseInt(page)+1, nextA);
    }else{
        var page = $(a).text();
        requestPage(page, a);
    }
}

function addNewUser() {
    $("#addUserBlock").show();
}

function saveNewUser() {
    var account = $("#newUserAccount").val();
    var userName = $("#newUserName").val();
    var sex = $('input[name="newUserSex"]:checked').val();
    if(account==="" || userName===""){
        alert("教师工号和姓名不能为空！");
        return;
    }
    var formData = new FormData();
    formData.append("account", account);
    formData.append("userName", userName);
    formData.append("sex", sex);
    $.ajax({
        url: URL + "/user/addNewUser",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function () {
            alert("添加成功！");
            $(".userBlock").find("input[type='text']").val("");
            $(".userBlock").hide();
        },
        error: function () {
            alert("添加失败，教工号重复！");
        }
    })
}

function deleteUser() {
    var checkedBoxes = $('input[name="userCheckBox"]:checked');
    if(checkedBoxes.length === 0){
        alert("请选择需要删除信息的教师！");
        return;
    }
    var yn = confirm("确认删除吗？");
    if(yn === false){
        return;
    }
    var userIdList = [];
    for(var i=0; i<checkedBoxes.length; i++){
        userIdList[i] = $(checkedBoxes[i]).val();
    }
    $.ajax({
        url: URL + "/user/deleteUserBatch",
        type: 'post',
        data: {userIdList:userIdList},
        async: false,
        success: function () {
            alert("删除成功！");
        },
        error: function () {
            alert("删除失败，服务器内部出错");
        }
    });
}

function updateUser() {
    //找到被勾选的行，将userid填入
    var checkedBoxes = $('input[name="userCheckBox"]:checked');
    if(checkedBoxes.length === 0){
        alert("请选择一名教师！");
        return;
    }else if(checkedBoxes.length > 1){
        alert("只能选择一名教师的信息进行修改");
        return;
    }
    var userId = $(checkedBoxes[0]).val();
    //查询数据库，将该教师信息显示在框中
    var formData = new FormData();
    formData.append("userId", userId);
    $.ajax({
        url: URL + "/user/findUserById",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            $("#updateUserId").val(data.userId);
            $("#updateUserAccount").val(data.account);
            $("#updateUserName").val(data.userName);
            //显示性别
            if(data.sex === "男"){
                $("#sex-male").prop("checked", "checked");
            }else{
                $("#sex-female").prop("checked", "checked");
            }
        }
    });
    $("#updateUserBlock").show();
}

function submitUpdateUser() {
    var userId = $("#updateUserId").val();
    var account = $("#updateUserAccount").val();
    var userName = $("#updateUserName").val();
    var sex = $('input[name="updateUserSex"]:checked').val();
    if(account === "" || userName === ""){
        alert("教师工号和姓名不能为空！");
        return;
    }
    var formData = new FormData();
    formData.append("userId", userId);
    formData.append("account", account);
    formData.append("userName", userName);
    formData.append("sex", sex);
    $.ajax({
        url: URL + "/user/updateUser",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function () {
            alert("修改成功！");
            $(".userBlock").hide();
        },
        error: function () {
            alert("修改失败，服务器内部错误");
        }
    });
}

function addClassForUser() {
    //先将所有班级信息展示到框中
    //找到被勾选的行，将userid填入
    var checkedBoxes = $('input[name="userCheckBox"]:checked');
    if(checkedBoxes.length === 0){
        alert("请选择一名教师！");
        return;
    }else if(checkedBoxes.length > 1){
        alert("只能选择一名教师的信息进行修改");
        return;
    }
    var userId = $(checkedBoxes[0]).val();
    $("#addCB-userId").val(userId);
    $(".block-classNames").empty();
    var formData = new FormData();
    formData.append("userId", userId);
    $.ajax({
        url: URL + "/myClass/findAllClassForUser",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            var classList = data.classList;
            var selectedClassList = data.selectedClassList;
            for(var i in classList){
                var flag = false;
                for(var j in selectedClassList){
                    if(classList[i].classId === selectedClassList[j].classId){
                        flag = true;
                        break;
                    }
                }
                var checkBox;
                if(flag === true){
                    checkBox = "<input name='classCheckBox' type='checkbox' value='"+classList[i].classId+"' checked>";
                }else{
                    checkBox = "<input name='classCheckBox' type='checkbox' value='"+classList[i].classId+"'>";
                }
                var classNameItem = "<div class='block-classNames-item'>" + checkBox + "<span>"+classList[i].name+"</span>" + "</div>";
                $(".block-classNames").append(classNameItem);
            }
        }
    });
    $("#addClassBlock").show();
}

function saveClassForUser() {
    //保存修改
    var classBoxes = document.getElementsByName("classCheckBox");
    var tranData = [];
    for(var i=0; i<classBoxes.length; i++){
        if(classBoxes[i].checked){
            tranData.push(classBoxes[i].value);
        }
    }
    var userId = $("#addCB-userId").val();
    if(tranData.length === 0){
        tranData.push("");
    }
    $.ajax({
        url: URL + '/user/addClassForUser',
        type: 'POST',
        data: {classIdList:tranData, userId:userId},
        async:false,
        success: function () {
            alert("保存成功！");
        },
        error: function () {
            alert("服务器内部出错！");
        }
    });
}

function flushTable() {
    //刷新表格
    $(".zebra").remove();
    $("#main-bottom").remove();
    var tTable = "<table class='zebra'>" +
        "<thead>" + "<tr>" +
        "<th>#</th>" + "<th>教工号</th>" + "<th>姓名</th>" + "<th>性别</th>" + "<th>选择</th>" +
        "</tr>" + "</thead>" +
        "<tfoot><td></td><td></td><td></td><td></td><td></td></tfoot>" +
        "</table>";
    $(".main").append(tTable);
    var formData = new FormData();
    formData.append("pageNum", 1);
    formData.append("pageSize", 10);
    $.ajax({
        url: URL + "/user/findAllByPage",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            var userList = data.list;
            for(var i in userList){
                var sex = userList[i].sex;
                if(sex == null){
                    sex = "";
                }
                var tr = "<tr class='stu-tr'>" +
                    "<td></td>" +
                    "<td>"+userList[i].account+"</td>" +
                    "<td>"+userList[i].userName+"</td>" +
                    "<td>"+sex+"</td>" +
                    "<td><input name='userCheckBox' type='checkbox' value='"+userList[i].userId+"'></td>" +
                    "</tr>";
                $(".zebra").append(tr);
            }
            //显示分页
            var mainBottomDiv = "<div id='main-bottom'>" +
                "<ul class='pagination'>" + "<li id='li-prev'><a href='javascript:void(0);' onclick='toSomePage(\"prev\")'>«</a></li>" +
                "</div>"
            $('.main').append(mainBottomDiv);
            for(var i=1; i<=data.pages; i++){
                if(parseInt(i) === 1){
                    $(".pagination").append("<li class='li-num'><a class='active' href='javascript:void(0);' onclick='toSomePage(this)'>"+i+"</a></li>");
                }else{
                    $(".pagination").append("<li class='li-num'><a href='javascript:void(0);' onclick='toSomePage(this)'>"+i+"</a></li>");
                }
            }
            $(".pagination").append("<li id='li-next'><a href='javascript:void(0);' onclick='toSomePage(\"next\")'>»</a></li>");
        }
    })
}

function closeUserBlock() {
    $(".userBlock").hide();
}

//  退出登录
function logout() {
    window.location.href = URL + "/admin/logout";
}