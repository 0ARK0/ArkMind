var URL = window.location.protocol + "//" + window.location.host + "/" + "ArkMind";

//跳转到我的班级页面
function toMyClassPage() {
    window.location.href = URL + "/toMyClass";
}

//返回管理员界面(只对管理员可见)
function goBackAdminPage() {
    window.location.href = URL + "/admin/toAdminPage";
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

//  调用ajax请求对应页的数据
function requestPage(page, currentA) {
    var classId = $("#classIdInput").val();
    var formData = new FormData();
    formData.append("pageNum", page);
    formData.append("pageSize", 10);
    formData.append("classId", classId);
    $.ajax({
        url: URL + "/student/findByPage",
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
            //  清空表格数据，重新渲染表格
            cleanTable();
            var stuList = data.list;
            for(var i in stuList){
                var sex = stuList[i].sex;
                if(sex == null){
                    sex = "";
                }
                var tr = "<tr class='stu-tr'>" +
                    "<td></td>" +
                    "<td>" + stuList[i].grade + "</td>" +
                    "<td>"+stuList[i].studentId+"</td>" +
                    "<td>"+stuList[i].name+"</td>" +
                    "<td>"+sex+"</td>" +
                    "<td><input type='checkbox'></td>" +
                    "</tr>";
                $(".zebra").append(tr);
            }
            //  重新渲染页码栏
            $(".active").removeClass("active");
            $(currentA).addClass("active");
        }
    })
}

//清空表格内容
function cleanTable() {
    $(".zebra").find(".stu-tr").remove();
}