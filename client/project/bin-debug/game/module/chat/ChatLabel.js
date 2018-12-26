var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ChatLabel = (function (_super) {
    __extends(ChatLabel, _super);
    function ChatLabel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.imgList = [];
        _this.skinName = "ChatLabelSkin";
        return _this;
    }
    Object.defineProperty(ChatLabel.prototype, "textColor", {
        set: function (color) {
            this.label.textColor = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLabel.prototype, "maxWidth", {
        set: function (val) {
            this.label.maxWidth = val;
            egret.superSetter(ChatLabel, this, "maxWidth", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLabel.prototype, "width", {
        set: function (val) {
            this.label.width = val;
            egret.superSetter(ChatLabel, this, "width", val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLabel.prototype, "text", {
        set: function (value) {
            this.SetText(null, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChatLabel.prototype, "textFlow", {
        set: function (val) {
            this.RemoveImg();
            this.label.textFlow = val;
            // this.height = this.label.height
            this.validateNow();
        },
        enumerable: true,
        configurable: true
    });
    ChatLabel.prototype.SetText = function (val, str) {
        // if (!ChatLabel.EMPTY) {
        // 	this.label.text = " "
        // 	ChatLabel.EMPTY = this.label.width
        // 	this.label.text = ""
        // }
        var empty = 10;
        this.label.text = " ";
        empty = this.label.textWidth;
        this.label.text = "";
        this.RemoveImg();
        var datas = this.ReplaceFace(this.label, val, str, empty);
        for (var _i = 0, datas_1 = datas; _i < datas_1.length; _i++) {
            var data = datas_1[_i];
            this.GetImg(data.x, data.y, data.face);
        }
        // this.height = this.label.height
        this.validateNow();
    };
    ChatLabel.prototype.RemoveImg = function () {
        var len = this.group.numChildren;
        if (!len) {
            return;
        }
        for (var i = 0; i < len; i++) {
            this.imgList.push(this.group.getChildAt(i));
        }
        this.group.removeChildren();
    };
    ChatLabel.prototype.childrenCreated = function () {
        this.label.addEventListener(egret.TextEvent.LINK, this.onLinkText, this);
    };
    ChatLabel.prototype.onLinkText = function (e) {
        this.dispatchEvent(e);
    };
    ChatLabel.prototype.ReplaceFace = function (label, textEle, str, empty) {
        var reg = new RegExp("\\[\\d+?\\]", "g");
        var ret = str.match(reg);
        var retData = [];
        if (ret != null) {
            label.text = "";
            var count = Math.ceil(40 / empty);
            var emptyStr = "";
            for (var i = 0; i < count; i++) {
                emptyStr += " ";
            }
            var strArray = str.split(reg);
            var list = [];
            if (textEle) {
                list = list.concat(textEle);
            }
            for (var i = 0; i < ret.length; i++) {
                var num = Number(ret[i].match("\\d+")[0]);
                if (num >= 0 && num <= 25) {
                    if (strArray[i]) {
                        list.push({ text: strArray[i], style: {} });
                    }
                    list.push({ text: emptyStr, style: { faceId: num } });
                }
                else {
                    list.push({ text: strArray[i] + ret[i], style: {} });
                }
            }
            if (strArray[ret.length]) {
                list.push({ text: strArray[ret.length], style: {} });
            }
            label.textFlow = list;
            label.validateNow();
            var y = 0;
            for (var _i = 0, _a = label.$getLinesArr(); _i < _a.length; _i++) {
                var data = _a[_i];
                y += data.height;
                var x = 0;
                for (var _b = 0, _c = data.elements; _b < _c.length; _b++) {
                    var ele = _c[_b];
                    if (ele.style && ele.style["faceId"]) {
                        retData.push({ x: x, y: y, face: ele.style["faceId"] });
                    }
                    x += ele.width;
                }
            }
        }
        else {
            if (textEle) {
                var list = [];
                list = list.concat(textEle);
                list.push({ text: str, style: {} });
                label.textFlow = list;
            }
            else {
                label.text = str;
            }
        }
        return retData;
    };
    ChatLabel.prototype.GetImg = function (x, y, index) {
        var img = this.imgList.pop() || new eui.Image;
        img.source = "ui_fc" + DateUtils.formatTimeNum(index);
        img.x = x;
        img.y = y - 32;
        this.group.addChild(img);
        return img;
    };
    return ChatLabel;
}(eui.Component));
__reflect(ChatLabel.prototype, "ChatLabel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=ChatLabel.js.map