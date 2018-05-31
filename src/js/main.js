class watch3D {
    //参数配置
    constructor(opts){

        this.auto = opts.auto === false ? false : true; //是否自动完成后续生成

        this.box = opts.wrapper || "body"; //插件容器

        this.start = opts.start || this.start || function () {}; //触摸开始

        this.move = opts.move || this.move || function(){}; //滑动中

        this.end = opts.end || this.end || function(){}; //触摸结束

        this.loadstart = opts.loadstart || this.loadstart || function(){}; //加载开始

        this.loading = opts.loading || this.loading || function(){}; //资源加载中

        this.loadend = opts.loadend || this.loadend || function(){}; //资源加载完成

        this.error = opts.error || this.error || function(){}; //资源加载失败

        this.autoplay = opts.autoplay || false; //是否自动播放

        this.changeData(opts);

        this.init();

        return this;
    }
    //自动播放
    play(){
        this.autoplay = true;

        let speed = 0.1;

        let rev = this.reverse ? 1 : -1;

        this._loop(speed,rev);

    }
    pause(){
        this.autoplay = false;
    }
    _loop(speed,rev){
        if(!this.autoplay) return false;

        let rx = this.rotateAngle.x || -180;
        let ry = this.rotateAngle.y || 0;

        this.rotateAngle = { x : rx + speed * rev , y : ry };

        this._move({x:0,y:0});

        let _self = this;

        requestAnimationFrame(function(){
            _self._loop(speed,rev);
        });
    }
    //检查传入的资源类型（element或src）
    _checkType(target){
        return Object.prototype.toString.call(target) === '[object String]' ? "string" : "element";
    }
    //计算数据
    _count(opts){
        this.tips = opts.tips || this.tips || {}; //放置tips

        this.stage = null; //场景元素

        this.rotateBox = null; //旋转效果元素

        this.lists = null; //区块包裹元素

        this.rotateAngle = { x : 0, y : 0 }; //已经旋转的角度记录

        this.eleList = {}; //独立区域元素集合

        this.prevListEle = null; //上一个显示TIP元素

        this.unit = this.width / this.num; //每块区域宽度

        this.translateZ = ( this.unit / 2 ) / ( Math.tan( Math.PI / 180 * 360 / this.num / 2 ) ) - 5; //每块区域在Z轴上的距离
    }
    //修改数据
    changeData(opts,doInit){

        opts = opts || {};

        this.num = ( opts.num >= 4 ? opts.num : 18 ) || this.num; //分隔区块数量

        this.reverse = (opts.reverse === false ? false : true) || this.reverse; //是否反向镜头，默认反向

        this.resource = opts.resource || this.resource || ""; //图片链接（字符串或数组）

        this.width = opts.width || this.width || 100; //全景图宽度

        this.height = opts.height || this.height || 100; //全景图高度

        this.maxY = opts.maxY || this.maxY || 15; //仰俯角最大角度

        this.auto = true;

        this._count(opts);

        doInit && this.init();

    }
    //判断处于焦点位置的部分
    _checkWhichId(rx){

        let uAng = 360 / this.num;
        let leftAng = rx % 360;
        let trx = leftAng < 0 ? leftAng + 360 : leftAng;

        let id = this.num - Math.round( trx / uAng );

        if( this.eleList[id] === this.prevListEle ) return false;

        this.prevListEle && this.prevListEle.classList.remove("watch3D-check");

        this.eleList[id] && this.eleList[id].classList.add("watch3D-check");

        this.prevListEle = this.eleList[id];
    }
    //生成单元列表
    _createList(i,src,id){

        let list = document.createElement("div");

        this.eleList[id] = list;

        list.className += "watch3D-list list-"+(id+1);
        list.style.backgroundImage = "url("+src+")";
        list.style.backgroundRepeat = "no-repeat";
        list.style.backgroundPosition = -this.unit * i +"px 0px";
        list.style.backgroundSize = "cover";
        list.style.height = this.height + "px";
        list.style.width = this.unit+"px";
        list.style.webkitTransform = "translate(-50%,-50%) rotateY("+(id*360/this.num)+"deg) rotateZ(0deg) translateZ("+this.translateZ+"px)";
        list.style.transform = "translate(-50%,-50%) rotateY("+(id*360/this.num)+"deg) rotateZ(0deg) translateZ("+this.translateZ+"px)";

        let tip = this._createTip(id,{});

        if( tip ) {
            list.appendChild(tip);
        }

        return list;
    }
    //生成tip
    _createTip(id,data){

        let tip = this.tips[id];

        if(!tip) return null;

        let styles = tip.styles;

        let str = "";

        for( let [key,item] of Object.entries(styles) ){
            str += ( key + ":" + item + ";" );
        }

        let callback = tip.callback || function(){};

        let tpl = document.createElement("div");

        tpl.className = "watch3D-tip";

        tpl.onclick = callback;

        tpl.innerHTML = '<div class="watch3D-tip-wrapper" style="'+str+'">\
                            <div class="watch3D-tip-point"></div>\
                            <div class="watch3D-tpl-content">'+tip.content+'</div>\
                        </div>';

        return tpl;

    }
    //初始化组件
    init(auto){

        this.box = this._checkType(this.box) === "string" ? document.querySelector(this.box) : this.box;

        this.eleList = {};

        this._template();

        if(this.auto || auto)
        this.loadResources();

        if(this.autoplay)
        this.play();
    }
    //加载资源
    loadResources(){

        if( !this.resource ) return false;

        this._loadstart();

        if( typeof this.resource === "string" )
        this._loadSingle();
        else
        this._loadMulti();

    }
    //加载单张图片
    _loadSingle(){
        let img = new Image();
        let _self = this;
        let fg = document.createDocumentFragment();

        img.onload = function(){

            for( let i = 0; i < _self.num; i++ ){
                let list = _self._createList(i,_self.resource,i);
                fg.appendChild(list);
            }

            _self._loading( { loaded : 1, total : 1 } );
            _self._loadend( {
                fg,
                success : { num : 1, list : [_self.resource] },
                fail : { num : 0, list : [] }
            } );
        };
        img.onerror = function(){
            _self._loading( { loaded : 1, total : 1 } );
            _self._loadend( {
                fg,
                success : { num : 0, list : [] },
                fail : { num : 1, list : [_self.resource] }
            } );
        };
        img.src = this.resource;
    }
    //加载图片数组
    _loadMulti(){
        let _self = this;
        let len = _self.resource.length;
        let loaded = {
            num : 0,
            list : []
        };
        let failed = {
            num : 0,
            list : []
        };
        let fg = document.createDocumentFragment();

        for( let i = 0,item; item = this.resource[i++]; ){
            (function(i,item){
                let img = new Image();
                img.onload = function () {
                    loaded.num++;
                    loadCheck();
                };
                img.onerror = function () {
                    failed.num++;
                    loadCheck();
                };

                function loadCheck(){
                    _self._loading( { loaded: loaded.num + failed.num, total : len } );

                    let list = _self._createList( 0, item, i - 1 );

                    fg.appendChild(list);

                    if( loaded.num === len - failed.num )
                    _self._loadend( {
                        fg,
                        success : loaded,
                        fail : failed
                    } );
                }

                img.src = item;
            }(i,item));
        }
    }
    //加载开始
    _loadstart(){
        this.loadstart();
    }
    //加载中的事件处理
    _loading(data){
        this.loading(data);
    }
    //加载完成的事件处理
    _loadend(data){
        this.lists.appendChild(data.fg);
        this.lists.style.height = this.height + "px";
        this.loadend(data.success,data.fail);
    }
    //触摸开始
    _start(point){
        this.start(point);
    }
    //触摸中
    _move(point){
        this._rotate();

        this.move(point);
    }
    //旋转
    _rotate(){
        let angle = this.rotateAngle;

        this._checkWhichId(-180 + angle.x);

        this.rotateBox.style.cssText = "-webkit-transform: translateZ("+(1050 - this.translateZ)+"px) rotateX("+angle.y+"deg) rotateY("+angle.x+"deg);\
                                        transform: translateZ("+(1050 - this.translateZ)+"px) rotateX("+angle.y+"deg) rotateY("+angle.x+"deg);"
    }
    //触摸结束
    _end(point){
        this.end(point);
    }
    //更新模板
    _template(){

        this.box.innerHTML = "";

        let tpl = '<div class="watch3D">\
                    <div class="watch3D-container">\
                        <div class="watch3D-bg"></div>\
                        <div class="watch3D-wrapper">\
                            <div class="watch3D-lists"></div>\
                       </div>\
                   </div>\
                </div>';

        this.box.innerHTML = tpl;

        this.stage = this.box.querySelector(".watch3D");

        this.container = this.box.querySelector(".watch3D-container");

        this.rotateBox = this.box.querySelector(".watch3D-wrapper");

        this.rotateBox.style.cssText = "-webkit-transform: translateZ("+(1050 - this.translateZ)+"px) rotateY(-180deg);\
                                        transform: translateZ("+(1050 - this.translateZ)+"px) rotateY(-180deg)";

        this.lists = this.box.querySelector(".watch3D-lists");

        this._eventBind();
    }
    //事件绑定
    _eventBind(){

        let start = "ontouchstart" in document ? "touchstart" : "mousedown";
        let move = "ontouchmove" in document ? "touchmove" : "mousemove";
        let end = "ontouchend" in document ? "touchend" : "mouseup";

        let ele = this.stage;

        let draging = false;

        let prevPoint = { x : 0, y : 0 };

        let _self = this;

        let rx = this.rotateAngle.x;
        let ry = this.rotateAngle.y;

        let rev = this.reverse ? 1 : -1;

        ele["on"+start] = function (e) {
            draging = true;
            let x = e.screenX || e.touches[0].screenX;
            let y = e.screenY || e.touches[0].screenY;

            prevPoint = { x , y };

            _self._start(prevPoint);
        };

        ele["on"+move] = function (e) {
            e.stopPropagation();
            e.preventDefault();

            if(!draging) return false;

            let x = e.screenX || (e.touches && e.touches[0].screenX) || (e.changeTouches && e.changeTouches[0].screenX) || 0;
            let y = e.screenY || (e.touches && e.touches[0].screenY) || (e.changeTouches && e.changeTouches[0].screenY) || 0;

            rx += (x - prevPoint.x)/2;
            ry += (y - prevPoint.y)/2;

            prevPoint.x = x;
            prevPoint.y = y;

            if( ry > _self.maxY ) ry = _self.maxY;
            else if( ry < -_self.maxY ) ry = -_self.maxY;

            _self.rotateAngle = { x : -180 + rx * rev , y : ry * rev };

            _self._move(prevPoint);
        };

        ele["on"+end] = function (e) {
          draging = false;
          _self._end(prevPoint);
        };

        ele.onmouseleave = function () {
          draging = false;
          _self._end();
        };

    }
}

export default watch3D;