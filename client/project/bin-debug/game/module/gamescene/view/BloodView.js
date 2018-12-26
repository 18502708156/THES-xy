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
var BloodView = (function (_super) {
    __extends(BloodView, _super);
    function BloodView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_Cache = {};
        _this.m_ImgList = [];
        return _this;
    }
    BloodView.prototype._GetBitmapLabel = function (typeData) {
        var label = null;
        var cacheList = this.m_Cache[typeData["__name__"]];
        if (cacheList) {
            label = cacheList.pop();
        }
        if (!label) {
            label = new BloodItem(typeData);
        }
        label.visible = true;
        this.addChild(label);
        return label;
    };
    BloodView.prototype.BuffBitmapLabel = function (typeData, fnt) {
        var label = null;
        typeData[0] = fnt;
        var cacheList = this.m_Cache[typeData["__name__"]];
        if (cacheList) {
            label = cacheList.pop();
        }
        if (!label) {
            label = new BloodItem(typeData);
        }
        label.visible = true;
        this.addChild(label);
        return label;
    };
    BloodView.prototype._CacheBitmapLabel = function (bloodItem) {
        if (!bloodItem) {
            return;
        }
        var type = bloodItem.name;
        var cacheList = this.m_Cache[type];
        if (!cacheList) {
            cacheList = this.m_Cache[type] = [];
        }
        bloodItem.visible = false;
        bloodItem.alpha = 1;
        cacheList.push(bloodItem);
        if (bloodItem.parent == this) {
            this.removeChild(bloodItem);
        }
        // console.log("cache bitmap label type = ", type)
    };
    BloodView.prototype.Clear = function () {
        for (var i = this.numChildren - 1; i >= 0; --i) {
            var child = this.getChildAt(i);
            egret.Tween.removeTweens(child);
            if (egret.is(child, "BloodItem")) {
                this._CacheBitmapLabel(child);
            }
            else if (egret.is(child, "eui.Image")) {
                DisplayUtils.removeFromParent(child);
                this.m_ImgList.push(child);
            }
            else {
                console.log("not bloodview type");
            }
        }
        this.removeChildren();
    };
    BloodView.prototype.Show = function (tx, ty, typeData, type, text, tweenFunc) {
        text = typeData[2] ? typeData[2](type, text) : text;
        if (!text) {
            return;
        }
        var blood = this._GetBitmapLabel(typeData);
        if (!blood) {
            return;
        }
        blood.text = text;
        blood.x = tx;
        blood.y = ty - 90;
        var tween = egret.Tween.get(blood);
        tweenFunc(tween);
        tween.call(this._CacheBitmapLabel, this, [blood]);
    };
    BloodView.prototype.ShowBuffEffText = function (tx, ty, type, value) {
        var typeData;
        var blood;
        if (type) {
            typeData = BloodView.Type.OTHER_BUFF_TEXT;
            blood = this.BuffBitmapLabel(typeData, type + "_fnt");
        }
        else {
            typeData = BloodView.Type.BUFF_TEXT;
            blood = this._GetBitmapLabel(typeData);
        }
        if (!blood) {
            return;
        }
        blood.text = value;
        blood.x = tx;
        blood.y = ty - 50;
        var tween = egret.Tween.get(blood);
        BloodView.TweenType1(tween);
        tween.call(this._CacheBitmapLabel, this, [blood]);
    };
    BloodView.prototype.ShowWord = function (tx, ty, type) {
        var typeData;
        if (type == 0) {
            typeData = BloodView.Type.JINHUA;
        }
        else {
            console.warn("not ShowWord type => " + type);
        }
        if (typeData) {
            this.Show(tx, ty, typeData, 0, "", BloodView.TweenType1);
        }
    };
    BloodView.prototype.ShowBuffAct = function (tx, ty, type, value) {
        var typeData = BloodView.SHOW_BUFF_ACT[type] || BloodView.Type.EFFE3; // BloodView.Type.EFFE3
        this.Show(tx, ty, typeData, type, value, BloodView.TweenType1);
    };
    BloodView.prototype.ShowBuffHp = function (tx, ty, type, value) {
        var typeData = BloodView.Type.NORMAL;
        var str;
        if (value < 0) {
            str = (-1 * value) + "";
        }
        else {
            str = value + "";
        }
        if (type) {
            if (type == BuffType.TYPE_11) {
                typeData = BloodView.Type.HUIXUE;
            }
            else {
                typeData = (type == BuffType.TYPE_8 || type == BuffType.TYPE_6) ? BloodView.Type.EFFE2 : BloodView.Type.EFFE1;
                str = value;
            }
        }
        else {
            if (value < 0) {
                typeData = BloodView.Type.NORMAL;
            }
            else {
                typeData = BloodView.Type.BUFF_HP;
            }
        }
        this.Show(tx, ty, typeData, type, str, BloodView.TweenType1);
    };
    BloodView.prototype.ShowSkillName = function (tx, ty, text) {
        var typeData = BloodView.Type.SKILL_NAME;
        this.Show(tx, ty, typeData, 0, text, BloodView.TweenType2);
    };
    BloodView.prototype.ShowBlood = function (targetTeam, tx, ty, type, value) {
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_GAME_BLOOD_VIEW)) {
            return;
        }
        var sv = value < 0 ? (-1 * value) : value;
        var typeData;
        if (type == DamageTypes.HIT) {
            typeData = BloodView.Type.NORMAL;
            if (!value) {
                return;
            }
        }
        else if (type == DamageTypes.CRIT) {
            typeData = BloodView.Type.CRIT;
            if (!value) {
                return;
            }
        }
        else if (type == DamageTypes.Evade) {
            typeData = BloodView.Type.EVADE;
        }
        else if (type == DamageTypes.BUFF_TYPE_10 || type == DamageTypes.BUFF_TYPE_5) {
            typeData = BloodView.Type.LIAN_JI;
        }
        else {
            typeData = BloodView.Type.NORMAL;
        }
        var blood = this._GetBitmapLabel(typeData);
        if (!blood) {
            return;
        }
        blood.text = typeData[2] ? typeData[2](type, sv) : sv;
        blood.x = tx;
        blood.y = ty - 90;
        var tween = egret.Tween.get(blood);
        BloodView.TweenType1(tween);
        tween.call(this._CacheBitmapLabel, this, [blood]);
    };
    BloodView.prototype.ShowBuffImg = function (targetEff, args, x, y) {
        var _this = this;
        var image = this.m_ImgList.pop() || new eui.Image;
        image.scaleX = image.scaleY = 1;
        image.x = x;
        image.y = y;
        image.alpha = 1;
        image.source = targetEff;
        this.addChild(image);
        var tween = egret.Tween.get(image);
        image.x = x - 23;
        if (args == 0) {
            tween.to({ y: y - 100 }, 1000);
        }
        else {
            BloodView.TweenType1(tween);
        }
        tween.call(function () {
            DisplayUtils.removeFromParent(image);
            _this.m_ImgList.push(image);
        });
    };
    BloodView.prototype.repositionNumPic = function (container) {
        var index = 1;
        var temp;
        for (index; index < container.numChildren; index++) {
            temp = container.getChildAt(index);
            temp.y = 20;
        }
    };
    ;
    BloodView.TweenType1 = function (tween) {
        var target = tween._target;
        tween.to({
            y: target.y - 20,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: .9
        }, 100, egret.Ease.sineIn).wait(200).to({
            y: target.y - 20,
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 200, egret.Ease.sineIn).to({
            y: target.y - 60,
            alpha: .3
        }, 350, egret.Ease.sineIn);
    };
    BloodView.TweenType2 = function (tween) {
        var target = tween._target;
        target.scaleX = 1.5;
        target.scaleY = 1.5;
        target.y = target.y - 20;
        target.alpha = 0.3;
        tween.to({
            y: target.y + 20,
            scaleX: 1,
            scaleY: 1,
            alpha: 1
        }, 100, egret.Ease.sineIn).wait(350).to({
            y: target.y - 20,
            alpha: .3
        }, 300, egret.Ease.sineIn);
    };
    BloodView.SetFont = function (label, fontName) {
        var font = this.GetFont(fontName);
        if (font) {
            label.font = font;
        }
        else {
            if (this.m_Callback == null) {
                this.m_Callback = [];
            }
            this.m_Callback.push([label, fontName]);
        }
    };
    BloodView.GetFont = function (fontName) {
        if (!fontName) {
            return;
        }
        if (this.m_Load) {
            var data = this.m_Data;
            if (!data.mTex || !data.mJson) {
                return null;
            }
            if (!data.mFnt[fontName]) {
                data.mFnt[fontName] = new egret.BitmapFont(data.mTex, data.mJson[fontName]);
            }
            return data.mFnt[fontName];
        }
        this.m_Load = true;
        RES.getResByUrl("resource/assets/image/font/shanghai.json", this._CreateByUrl, this, RES.ResourceItem.TYPE_JSON);
        RES.getResByUrl("resource/assets/image/font/shanghai.png", this._CreateByUrl, this, RES.ResourceItem.TYPE_IMAGE);
    };
    BloodView._CreateByUrl = function (data, url) {
        if (!data) {
            return;
        }
        if (egret.is(data, "egret.Texture")) {
            this.m_Data.mTex = data;
        }
        else {
            this.m_Data.mJson = data;
        }
        if (!this.m_Data.mTex || !this.m_Data.mJson) {
            return null;
        }
        var list = this.m_Callback;
        this.m_Callback = null;
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var data_1 = list_1[_i];
            var font = this.GetFont(data_1[1]);
            if (!font) {
                continue;
            }
            data_1[0].font = font;
        }
    };
    BloodView.BUFF_TYPE = (_a = {},
        _a["6"] = "反伤",
        _a["8"] = "吸血",
        _a["10"] = "连击",
        _a["11"] = "回血",
        _a["12"] = "中毒",
        _a["17"] = "破防",
        _a);
    BloodView.BUFF_TYPE2 = (_b = {},
        _b["9"] = "",
        _b["13"] = "净化",
        _b);
    BloodView.BUFF_TYPE3 = (_c = {},
        _c["1"] = "昏迷",
        _c["2"] = "封印",
        _c["3"] = "冰冻",
        _c["4"] = "沉睡",
        _c["14"] = "复仇",
        _c);
    BloodView.Type = {
        // 字体、字体背景、文本更新方法、字体间距
        NORMAL: ["font_pth_fnt", "", function (t, x) { return x; }, -5],
        // buff加血
        BUFF_HP: ["font_ui_gongjizhe01_fnt", ""],
        // 暴击
        CRIT: ["font_ui_baoji_fnt", "", function (t, x) { return "暴击" + x; }, -10],
        // 闪避
        EVADE: ["font_ui_gongjizhe02_fnt", "", function (t, x) { return "闪避"; }],
        // 回血
        HUIXUE: ["font_ui_gongjizhe01_fnt", "", function (t, x) {
                return "回血+" + x;
            }, -5],
        // 净化
        JINHUA: ["font_ui_gongjizhe01_fnt", "", function (t, x) {
                return "净化";
            }, -5],
        // 5反击 6反伤 8吸血 10连击 12中毒 17破防
        EFFE1: ["font_ui_gongjizhe02_fnt", "ui_zd_bm_hongseBG", function (type, x) {
                return BloodView.BUFF_TYPE[type] || "";
            }],
        // buff连击,反击
        LIAN_JI: ["font_ui_gongjizhe02_fnt", "", function (t, x) {
                if (t == DamageTypes.BUFF_TYPE_10) {
                    return "连击" + x;
                }
                else if (t == DamageTypes.BUFF_TYPE_5) {
                    return "反击" + x;
                }
                return x;
            }],
        // 6反伤 8吸血
        EFFE2: ["font_ui_gongjizhe02_fnt", "", function (type, x) {
                var v = BloodView.BUFF_TYPE[type] || "";
                if (x > 0) {
                    return v += "+" + x;
                }
                return v += x;
            }],
        // 9吸收伤害 13净化
        EFFE3: ["font_ui_gongjizhe01_fnt", "", function (type, x) {
                return BloodView.BUFF_TYPE2[type] || "";
            }, -5],
        // 1昏迷 2封印 3冰冻 4沉睡 14复仇
        EFFE4: ["font_ui_beigongjizhe_fnt", "", function (type, x) {
                return BloodView.BUFF_TYPE3[type] || "";
            }, -5],
        SKILL_NAME: ["font_ui_jinengmingcheng_fnt", "ui_zd_bm_jinengmingBG"],
        BUFF_TEXT: ["font_ui_putongshanghai_fnt", "", function (type, x) {
                return x;
            }],
        OTHER_BUFF_TEXT: ["", "", function (type, x) {
                return x;
            }],
    };
    BloodView.SHOW_BUFF_ACT = (_d = {},
        _d["9"] = BloodView.Type.EFFE3,
        _d["13"] = BloodView.Type.EFFE3,
        _d["1"] = BloodView.Type.EFFE4,
        _d["2"] = BloodView.Type.EFFE4,
        _d["3"] = BloodView.Type.EFFE4,
        _d["4"] = BloodView.Type.EFFE4,
        _d["14"] = BloodView.Type.EFFE4,
        _d);
    BloodView.OFFSET = 60;
    BloodView.m_Load = false;
    BloodView.m_Data = {
        mTex: null,
        mJson: null,
        mFnt: {}
    };
    return BloodView;
}(egret.DisplayObjectContainer));
__reflect(BloodView.prototype, "BloodView");
{
    for (var k in BloodView.Type) {
        BloodView.Type[k]["__name__"] = k;
    }
}
var BloodItem = (function (_super) {
    __extends(BloodItem, _super);
    function BloodItem(typeFont) {
        var _this = _super.call(this) || this;
        _this.type = 0;
        _this.width = 0;
        _this.height = 0;
        var g = new eui.Group;
        g.width = 0;
        g.height = 0;
        _this.addChild(g);
        _this.name = typeFont["__name__"];
        if (typeFont[1]) {
            _this.image = new eui.Image;
            g.addChild(_this.image);
            _this.image.verticalCenter = 0;
            _this.image.horizontalCenter = 0;
            _this.image.source = typeFont[1];
        }
        var label = new eui.BitmapLabel;
        label.verticalCenter = 0;
        label.horizontalCenter = 0;
        // let font = BloodView.GetFont(typeFont[0])
        // if (font) {
        // 	label.font = font
        // } else {
        // }
        BloodView.SetFont(label, typeFont[0]);
        if (typeFont[3]) {
            label.letterSpacing = typeFont[3];
        }
        _this.label = label;
        g.addChild(label);
        return _this;
    }
    Object.defineProperty(BloodItem.prototype, "text", {
        set: function (value) {
            this.label.text = value;
        },
        enumerable: true,
        configurable: true
    });
    return BloodItem;
}(egret.DisplayObjectContainer));
__reflect(BloodItem.prototype, "BloodItem");
var _a, _b, _c, _d;
//# sourceMappingURL=BloodView.js.map