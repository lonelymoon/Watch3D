import commonCss from "./src/css/style.css";
import mainCss from "./src/css/main.css";
import watch3D from "./src/js/main";

(function (root, factory) {
    
    if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
    else if(typeof define === 'function' && define.amd)
    define("watch3D",factory);
    else if(typeof exports === 'object')
    exports["watch3D"] = factory();
    else
    root["watch3D"] = factory();

})( typeof self !== 'undefined' ? self : this, function () {
    return watch3D;
});