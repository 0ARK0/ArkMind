var jsonData2 = {"children":[{"children":[{"children":[{"children":[],"name":"1.1.1"},{"children":[{"name":"1.1.2.1"}],"name":"1.1.2"},{"children":[],"name":"1.1.3"}],"name":"1.1"},{"children":[{"children":[],"name":"1.2.1"},{"children":[],"name":"1.2.2"},{"children":[],"name":"1.2.3"}],"name":"1.2"},{"children":[{"children":[{"name":"1.3.1.1"},{"name":"1.3.1.2"}],"name":"1.3.1"}],"name":"1.3"}],"name":"第一章"},{"children":[{"children":[{"children":[],"name":"2.1.1"},{"children":[{"name":"2.1.2.1"},{"name":"2.1.2.2"}],"name":"2.1.2"},{"children":[{"name":"2.1.3.1"}],"name":"2.1.3"},{"children":[],"name":"2.1.4"}],"name":"2.1"},{"children":[],"name":"2.2"}],"name":"第二章"},{"children":[{"children":[{"children":[],"name":"3.1.1"},{"children":[],"name":"3.1.2"}],"name":"3.1"},{"children":[],"name":"3.2"},{"children":[],"name":"3.3"},{"children":[],"name":"3.4"}],"name":"第三章"}],"name":"test"}
var jsonData3 = {"children":[{"children":[{"children":[{"children":[],"name":"1.1.1"},{"children":[{"name":"1.1.2.1"},{"name":"1.1.2.2"}],"name":"1.1.2"},{"children":[{"name":"1.1.3.1"},{"name":"1.1.3.2"},{"name":"1.1.3.3"}],"name":"1.1.3"},{"children":[],"name":"1.1.4"}],"name":"1.1"},{"children":[{"children":[],"name":"1.2.1"},{"children":[],"name":"1.2.2"},{"children":[{"name":"1.2.3.1"},{"name":"1.2.3.2"}],"name":"1.2.3"}],"name":"1.2"},{"children":[{"children":[],"name":"1.3.1"},{"children":[],"name":"1.3.2"},{"children":[{"name":"1.3.3.1"}],"name":"1.3.3"}],"name":"1.3"}],"name":"第一章"},{"children":[{"children":[{"children":[],"name":"2.1.1"},{"children":[{"name":"2.1.2.1"},{"name":"2.1.2.2"},{"name":"2.1.2.3"}],"name":"2.1.2"},{"children":[],"name":"2.1.3"}],"name":"2.1"},{"children":[],"name":"2.2"},{"children":[],"name":"2.3"},{"children":[],"name":"2.4"}],"name":"第二章"},{"children":[{"children":[{"children":[],"name":"3.1.1"}],"name":"3.1"},{"children":[],"name":"3.2"},{"children":[],"name":"3.3"},{"children":[{"children":[],"name":"3.4.1"}],"name":"3.4"},{"children":[],"name":"3.5"}],"name":"第三章"}],"name":"test2"}
var jsonData = {
    "name": "TCP/IP详解",
    "children":
        [
            {
                "name": "第1章 概述",
                "children":
                    [
                        { "name": "1.1 引言", "children":[]},
                        { "name": "1.2 分层", "children":[]},
                        { "name": "1.3 TCP/IP的分层", "children":[]},
                        { "name": "1.4 互联网的地址", "children":[]},
                        { "name": "1.5 域名系统", "children":[]},
                        { "name": "1.6 封装", "children":[]},
                        { "name": "1.7 分用", "children":[]},
                        { "name": "1.8 客户-服务器模型", "children":[]},
                        { "name": "1.9 端口号", "children":[]},
                        { "name": "1.10 标准化过程", "children":[]},
                        { "name": "1.11 RFC", "children":[]},
                        { "name": "1.12 标准的简单服务", "children":[]},
                        { "name": "1.13 互联网", "children":[]},
                        { "name": "1.14 实现", "children":[]},
                        { "name": "1.15 应用编程接口", "children":[],},
                        { "name": "1.16 测试网络", "children":[]},
                        { "name": "1.17 小结", "children":[]}
                    ]
            },
            {
                "name": "第2章 链路层",
                "children":
                    [
                        { "name": "2.1 引言", "children":[]},
                        { "name": "2.2 以太网和IEEE 802封装", "children":[], "value": 1316 },
                        { "name": "2.3 尾部封装", "children":[], "value": 3151 },
                        { "name": "2.4 SLIP:串行线路IP", "children":[], "value": 3770 },
                        { "name": "2.5 压缩的SLIP", "children":[], "value": 2435 },
                        { "name": "2.6 PPP：点对点协议", "children":[], "value": 4839 },
                        { "name": "2.7 还回接口", "children":[], "value": 1756 },
                        { "name": "2.8 最大传输单元MTU", "children":[], "value": 1756 },
                        { "name": "2.9 路径MTU", "children":[], "value": 1756 },
                        { "name": "2.10 串行线路吞吐量计算", "children":[], "value": 1756 },
                        { "name": "2.11 小结", "children":[], "value": 1756 }
                    ]
            },
            {
                "name": "第3章 IP：网际协议",
                "children":
                    [
                        { "name": "3.1 引言", "children":[], "value": 8833 },
                        { "name": "3.2 IP首部", "children":[], "value": 2105 },
                        { "name": "3.3 IP路由选择", "children":[], "value": 1316 },
                        { "name": "3.4 子网寻址", "children":[], "value": 3151 },
                        { "name": "3.5 子网掩码", "children":[], "value": 3770 },
                        { "name": "3.6 特殊情况的IP地址", "children":[], "value": 2435 },
                        { "name": "3.7 一个子网的例子", "children":[], "value": 4839 },
                        { "name": "3.8 ifconfig命令", "children":[], "value": 1756 },
                        { "name": "3.9 netstate命令", "children":[], "value": 4268 },
                        { "name": "3.10 IP的未来", "children":[], "value": 1821 },
                        { "name": "3.11 小结", "children":[], "value": 5833 }
                    ]
            },
            {
                "name": "第4章 ARP：地址解析协议",
                "children":
                    [
                        { "name": "4.1 引言", "children":[], "value": 2105 },
                        { "name": "4.2 一个例子", "children":[], "value": 1316 },
                        { "name": "4.3 ARP高速缓存", "children":[], "value": 3151 },
                        { "name": "4.4 ARP的分组格式", "children":[], "value": 3770 },
                        { "name": "4.5 ARP的举例",
                            "children":
                                [
                                    {"name":"4.5.1 一般的例子", "children":[], "value":32165},
                                    {"name":"4.5.2 对不存在的主机的ARP请求", "children":[], "value":32165},
                                    {"name":"4.5.3 ARP高速缓存超时设置", "children":[], "value":32165}
                                ]
                        },
                        { "name": "4.6 ARP代理", "children":[], "value": 4839 },
                        { "name": "4.7 免费ARP", "children":[], "value": 1756 },
                        { "name": "4.8 arp命令", "children":[], "value": 4268 },
                        { "name": "4.9 小结", "children":[], "value": 1821 }
                    ]
            },
            {
                "name": "第5章 RARP：逆向地址解析协议",
                "children":
                    [
                        {"name":"5.1 引言", "children":[]},
                        {"name":"5.2 RARP的分组格式", "children":[]},
                        {"name":"5.3 RARP的举例", "children":[]},
                        {"name":"5.4 RARP的服务器的设计",
                            "children":
                                [
                                    {"name":"5.4.1 作为应用进程的RARP服务器", "children":[]},
                                    {"name":"5.4.2 每个网络有多少个RARP服务器", "children":[]}
                                ]
                        },
                        {"name":"5.5 小结", "children":[]}
                    ]
            }
        ]
};
