var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BaseClass = (function () {
    function BaseClass() {
        Util.GetClass(this)._instance = this;
    }
    BaseClass.ins = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var cls = this;
        if (!cls._instance) {
            var argsLen = args.length;
            if (argsLen == 0) {
                cls._instance = new cls();
            }
            else if (argsLen == 1) {
                cls._instance = new cls(args[0]);
            }
            else if (argsLen == 2) {
                cls._instance = new cls(args[0], args[1]);
            }
            else if (argsLen == 3) {
                cls._instance = new cls(args[0], args[1], args[2]);
            }
            else if (argsLen == 4) {
                cls._instance = new cls(args[0], args[1], args[2], args[3]);
            }
            else if (argsLen == 5) {
                cls._instance = new cls(args[0], args[1], args[2], args[3], args[4]);
            }
        }
        return cls._instance;
    };
    return BaseClass;
}());
__reflect(BaseClass.prototype, "BaseClass");
//# sourceMappingURL=BaseClass.js.map