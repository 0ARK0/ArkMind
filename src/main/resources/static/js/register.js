var jsonData = {"children":[{"children":[{"children":[{"children":[],"name":"1.1.1"},{"children":[{"name":"1.1.2.1"}],"name":"1.1.2"},{"children":[],"name":"1.1.3"}],"name":"1.1"},{"children":[{"children":[],"name":"1.2.1"},{"children":[],"name":"1.2.2"},{"children":[],"name":"1.2.3"}],"name":"1.2"},{"children":[{"children":[{"name":"1.3.1.1"},{"name":"1.3.1.2"}],"name":"1.3.1"}],"name":"1.3"}],"name":"第一章"},{"children":[{"children":[{"children":[],"name":"2.1.1"},{"children":[{"name":"2.1.2.1"},{"name":"2.1.2.2"}],"name":"2.1.2"},{"children":[{"name":"2.1.3.1"}],"name":"2.1.3"},{"children":[],"name":"2.1.4"}],"name":"2.1"},{"children":[],"name":"2.2"}],"name":"第二章"},{"children":[{"children":[{"children":[],"name":"3.1.1"},{"children":[],"name":"3.1.2"}],"name":"3.1"},{"children":[],"name":"3.2"},{"children":[],"name":"3.3"},{"children":[],"name":"3.4"}],"name":"第三章"}],"name":"test"}
var myChart = echarts.init(document.getElementById("mainContent"));
myChart.setOption(option = {
    tooltip: {
        trigger: 'item',  //触发类型，默认：item（数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用）。可选：'axis'：坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。'none':什么都不触发。
        triggerOn: 'mousemove' //提示框触发的条件，默认mousemove|click（鼠标点击和移动时触发）。可选mousemove：鼠标移动时，click：鼠标点击时，none：无
    },
    series: [ //系列列表
        {
            type: 'tree',        //图表种类为树图
            data: [jsonData],        //数据数组
            top: '1%',           //与顶部的距离
            left: '7%',          //与左边的距离
            bottom: '1%',        //与底部的距离
            right: '20%',        //与右边的距离
            roam: false,          //允许缩放和平移
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
                    fontSize: 26                //标签文字大小
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