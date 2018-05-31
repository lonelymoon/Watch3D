# Watch3D V1.0.0
本插件是一个简单的360度全景展示插件。通过css3来实现360度全景展示，相比webgl可以更简单的添加元素来完成一些交互，使用更简单。

版本从1.0.0开始，看心情更新，目前只包含了一些相对基本的功能。源代码没有进行重构，但不难看懂，如果有什么重大BUG（影响使用的）和强烈要求加上的功能，可以留言或者将反馈提交到本邮箱：454236029@qq.com || z454236029@gmail.com

# 兼容性

所有支持css3的现代浏览器

# 调用方法

标准的插件调用方法，支持AMD和CMD接口调用。

演示地址：[demo](http://lonelymoon.linux2.jiuhost.com/demo/watch3D/demo/index.html)

var w3d = new watch3D( opts );

#### 参数：

wrapper : [String|HTMLNode] (必填) 插件容器, **请不要挂载到"body"节点下面**

auto : [Boolean] (选填,默认为true) 是否让插件自动完成后续生成，如果填false，则需要初始化后手动调用 “loadResources”函数

autoplay : [Boolean] (选填，默认为false) 是否自动播放

num : [Number] (必填，默认为18) 图片被分割的区块数量

reverse : [Boolean] (选填，默认为true) 是否反向镜头

resource : [String|Array] (必填) 需要进行全景处理的整张全景图或用来进行拼接的图片集合，**如果值为数组时，请保证数组的长度与num参数值相等**

width : [Number] (必填) 全景图片缩放后的总宽度，**如：目标图片尺寸为 2500 * 1250，放大一倍后为 5000 * 2500 ，这里width需要填5000，下面的height填2500**

height : [Number] (必填) 全景图片缩放后的总高度

tips : [Object] (选填) 插入到对应区块的tip，用来完成一些处于全景图内部的交互。数据格式如下：

```
tips : {
    0 : {
        //styles，同css的写法一致
        styles : {
            "height" : "100px",
            "width" : "100px",
            "background-color" : "#6cf",
            "text-align" : "center",
            "margin-right" : "10px",
            "color" : "#fff",
            "cursor" : "pointer"
        },
        //tip的文本内容
        content : "风景1",
        //点击事件触发时的函数处理
        callback : function(e){
            w3d.pause();
            w3d.changeData({
                num : 10,
                resource : "sources/4.jpg"
            },true);
        }
    }
}

//tips内部的key值需要是区块的id，一般范围在0~num-1，按顺序对应相应的区块。
```


maxY : [Number] (选填，默认为15)
图片仰俯角最大角度

start : [Function] (选填) 触摸事件开始时调用，传入触点坐标

move : [Function] (选填)
触摸事件滑动时调用，传入触点坐标

end : [Function] (选填)
触摸事件结束时调用，传入触点坐标

loadstart : [Function] (选填)
图片资源加载前调用

loading : [Function] (选填)
图片资源加载时调用，传入一个资源对象

loadend : [Function] (选填)
图片资源加载完成后调用，传入一个资源对象

# API

init(auto : @Boolean) : 初始化插件，auto值表示是否自动完成后续操作

loadResources() : 加载图片资源，并完成后续操作，当初始化插件时没有设置auto为true的情况下需要手动调用本方法

changeData(opts : @Object, doInit : @Boolean) : 修改插件数据，doInit表示是否自动调用init()函数,目前可以被修改的有

```
{
    num,
    width,
    height,
    resource,
    reverse,
    maxY,
    tips,
}
```

play() : 进行自动播放

pause() : 暂停自动播放

### 完整调用代码演示

自动完成时：
```
let w3d = new watch3D({
    wrapper : ".wrapper", //容器元素为.wrapper
    autoplay : true, //自动播放
    width: 5000, //宽度为5000
    height : 2500, //高度为2500
    num : 12, //分成12块
    maxY : 25, //最大仰俯角为25度
    reverse : false, //反向为false
    tips : { //tip数据
        0 : {
            styles : {
                "height" : "100px",
                "width" : "100px",
                "background-color" : "#6cf",
                "text-align" : "center",
                "margin-right" : "10px",
                "color" : "#fff",
                "cursor" : "pointer"
            },
            content : "风景1",
            callback : function(e){
                w3d.pause();
                w3d.changeData({
                    num : 10,
                    resource : "sources/4.jpg"
                },true);
            }
        }
    },
    resource : "sources/5.jpg", //图片资源地址
    loadstart : function(){
        //加载开始时
    },
    loading : function(data){
        //加载中
    },
    loadend : function(data){
        //加载结束后
    },
    start : function(point){
        //触摸开始
    },
    move : function(point){
        //触摸移动中
    },
    end : function(point){
        //触摸结束
    }
});
```
非自动完成时：

```
let w3d = new watch3D({
    auto : false, //不自动完成
    wrapper : ".wrapper",
    autoplay : true,
    width: 5000,
    height : 2500,
    num : 12,
    maxY : 25,
    resource : "sources/5.jpg"
});
//后续调用
w3d.loadResources();
```
变更数据时：

```
w3d.changeData({
    num : 15
},true);
//或者
w3d.changeData({
    num : 15
});
w3d.init();
```

# 最后的话

由于插件没有监听手机端的deviceorientation事件，所以就一个全景插件来讲还是不完整的。因为本人在测试的时候发现在beta处于90度和-90度时，alpha和gamma值会发生跳转，导致效果不完美，查了很多资料也没找到解决办法，所以就放在那里了，如果有人知道怎么解决这个的话欢迎发消息和邮件告诉我，到时候继续补上。

