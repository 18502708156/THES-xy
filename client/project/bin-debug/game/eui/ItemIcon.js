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
var ItemIcon = (function (_super) {
    __extends(ItemIcon, _super);
    function ItemIcon() {
        var _this = _super.call(this) || this;
        _this.skinName = "ItemIconSkin";
        return _this;
    }
    ItemIcon.AddEff = function (icon, effectData) {
        var mc = effectData.mc;
        if (!mc) {
            mc = effectData.mc = this.EFF_LIST.pop() || new MovieBaseObject;
            mc.touchEnabled = false;
        }
        mc.scaleX = effectData.scaleX;
        mc.scaleY = effectData.scaleY;
        mc.x = effectData.x;
        mc.y = effectData.y;
        mc.Play(effectData.url, null, -1, true, null, null, 2);
        icon.addChild(mc);
    };
    ItemIcon.CacheEff = function (effectData) {
        var mc = effectData.mc;
        if (!mc) {
            return;
        }
        this.EFF_LIST.push(mc);
        mc.stop();
        DisplayUtils.removeFromParent(mc);
        effectData.mc = null;
    };
    ItemIcon.prototype.GetImgCorner = function () {
        if (!this.m_ImgCorner) {
            var img = this.m_ImgCorner = new eui.Image;
            img.left = 2;
            img.top = 2;
            this.addChild(img);
        }
        return this.m_ImgCorner;
    };
    ItemIcon.prototype.ResetScale = function () {
        if (this.imgIcon) {
            this.imgIcon.scaleX = this.imgIcon.scaleY = 1;
        }
    };
    ItemIcon.prototype.setItemImg = function (imgName) {
        this.imgIcon.source = imgName;
    };
    ItemIcon.prototype.setGray = function (isGray) {
        if (isGray) {
            if (this.imgIcon.filters) {
                return;
            }
            this.imgIcon.filters = Color.GetFilter();
        }
        else {
            if (!this.imgIcon.filters) {
                return;
            }
            this.imgIcon.filters = null;
        }
    };
    ItemIcon.prototype.setItemBg = function (imgName) {
        this.imgBg.source = imgName;
    };
    ItemIcon.prototype.SetQuality = function (quality) {
        this.setItemBg(ResDataPath.GetItemQualityName(quality));
    };
    ItemIcon.prototype.SetCornerImg = function (imgName) {
        if (imgName) {
            var imgCorner = this.GetImgCorner();
            imgCorner.source = imgName;
            imgCorner.visible = true;
        }
    };
    ItemIcon.prototype.SetCornerType = function (type) {
        var img = ItemIcon.CornerType[type];
        if (img) {
            this.SetCornerImg(img);
        }
        else {
            if (this.m_ImgCorner) {
                this.m_ImgCorner.visible = false;
            }
        }
    };
    ItemIcon.prototype.isShowLCorner = function (visible) {
        if (this.m_ImgCorner) {
            this.m_ImgCorner.visible = visible;
        }
    };
    ItemIcon.prototype.setData = function (config) {
        if (config != null) {
            var imgName = ResDataPath.GetItemFullPath(config.icon);
            if (RES.hasRes(imgName)) {
                this.imgIcon.source = imgName;
            }
            else {
                this.imgIcon.source = ResDataPath.GetItemFullPath(config.icon);
            }
            this.imgBg.source = ResDataPath.GetItemQualityName(config.quality);
            var addEff = null;
            if (config.itemeff) {
                if (config.quality == 3) {
                    addEff = "eff_ui_zb_001";
                }
                else if (config.quality == 4) {
                    addEff = "eff_ui_zb_002";
                }
                else if (config.quality == 5) {
                    addEff = "eff_ui_zb_003";
                }
            }
            if (addEff) {
                var data = this.effectData;
                if (!data) {
                    data = this.effectData = {};
                }
                data.scaleX = this.width / 96;
                data.scaleY = this.height / 96;
                data.x = this.width >> 1;
                data.y = this.height >> 1;
                data.url = ResDataPath.GetUIEffePath(addEff);
                ItemIcon.AddEff(this, this.effectData);
            }
            else {
                if (this.effectData) {
                    ItemIcon.CacheEff(this.effectData);
                    this.effectData = null;
                }
            }
        }
        else {
            this.imgIcon.source = ResDataPath.EMPTY_STR;
            this.imgBg.source = ResDataPath.DEFAULT_QUALITY;
            if (this.m_ImgCorner) {
                this.m_ImgCorner.source = "";
                this.m_ImgCorner.visible = false;
            }
            if (this.effectData) {
                ItemIcon.CacheEff(this.effectData);
                this.effectData = null;
            }
        }
    };
    ItemIcon.prototype.SetItemId = function (itemId) {
        this.setData(GameGlobal.Config.ItemConfig[itemId]);
    };
    // private m_IsSetClick = false
    // public SetClickEvent() {
    // 	if (this.m_IsSetClick) {
    // 		return
    // 	}
    // 	this.m_IsSetClick = true
    // 	this.addEventListener(egret.TouchEvent.TOUCH_END, this._DoOnClick, this);
    // }
    // private _DoOnClick() {
    // }
    ItemIcon.SetItemName = function (label, itemId) {
        var config = GameGlobal.Config.ItemConfig[itemId];
        if (!config || !label) {
            return;
        }
        label.text = config.name;
        if (config.type != 0) {
            label.textColor = ItemBase.QUALITY_COLOR[config.quality];
        }
    };
    ItemIcon.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        if (this.effectData) {
            ItemIcon.AddEff(this, this.effectData);
        }
    };
    ItemIcon.prototype.$onRemoveFromStage = function () {
        _super.prototype.$onRemoveFromStage.call(this);
        if (this.effectData) {
            ItemIcon.CacheEff(this.effectData);
        }
    };
    ItemIcon.EFF_LIST = [];
    ItemIcon.CornerType = (_a = {},
        _a[1] = "ui_jchd_bm_zhenxi",
        _a[2] = "ui_xb_bm_jiaobiao",
        _a[3] = "ui_jchd_bm_zhenping",
        _a);
    return ItemIcon;
}(eui.Component));
__reflect(ItemIcon.prototype, "ItemIcon");
var _a;
//# sourceMappingURL=ItemIcon.js.map