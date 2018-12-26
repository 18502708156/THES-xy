var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Util = (function () {
    function Util() {
    }
    Util.GetClass = function (obj) {
        if (!obj) {
            return null;
        }
        var clsName = obj.__class__;
        if (!clsName) {
            return null;
        }
        return egret.getDefinitionByName(clsName);
    };
    Util.CopyProtoData = function (obj) {
        if (obj == null) {
            return null;
        }
        var newObj = {};
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            if (key == "se" || key == "de") {
                continue;
            }
            newObj[key] = obj[key];
        }
    };
    Util.GetParentByType = function (obj, cls) {
        if (obj == null) {
            return null;
        }
        var parentName = egret.getQualifiedClassName(cls);
        var parent = obj;
        if (egret.is(parent, parentName)) {
            return parent;
        }
        for (var i = 0; i < 10; ++i) {
            parent = parent.parent;
            if (parent == null) {
                return null;
            }
            if (egret.is(parent, parentName)) {
                return parent;
            }
        }
        return null;
    };
    Util.Copy = function (text) {
        try {
            var t = document.createElement("input");
            t.value = text;
            document.body.appendChild(t);
            t.select();
            t.setSelectionRange(0, t.value.length);
            document.execCommand("Copy");
            document.body.removeChild(t);
            return true;
        }
        catch (e) {
            console.error("Copy => " + e);
        }
        return false;
    };
    return Util;
}());
__reflect(Util.prototype, "Util");
//# sourceMappingURL=Util.js.map