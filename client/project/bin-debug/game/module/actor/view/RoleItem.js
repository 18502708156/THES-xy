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
var RoleItem = (function (_super) {
    __extends(RoleItem, _super);
    function RoleItem() {
        var _this = _super.call(this) || this;
        _this.mQuality = -1;
        return _this;
    }
    RoleItem.prototype.childrenCreated = function () {
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.openEquipsTips, this);
    };
    ;
    RoleItem.prototype.setItemImg = function (data) {
        this.itemBase.setItemImg(data);
    };
    RoleItem.prototype.setItemBg = function (data) {
        this.itemBase.setItemBg(data);
    };
    RoleItem.prototype.IsShowRedPoint = function (data) {
        this.itemBase.IsShowRedPoint(data);
    };
    RoleItem.prototype.IsShowUp = function (bool) {
        this.upImage.visible = bool;
    };
    Object.defineProperty(RoleItem.prototype, "nameTxt", {
        get: function () {
            if (this.itemBase) {
                return this.itemBase.nameTxt;
            }
            return null;
        },
        set: function (v) {
            if (this.itemBase) {
                this.itemBase.nameTxt = v;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "count", {
        get: function () {
            if (this.itemBase) {
                return this.itemBase.getCount();
            }
            return null;
        },
        set: function (v) {
            if (this.itemBase) {
                this.itemBase.setCount(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    RoleItem.prototype.dataChanged = function () {
        this.itemBase.data = this.data;
        this.playEff();
        _super.prototype.dataChanged.call(this);
        var itemConfig = this.data.itemConfig;
        if (itemConfig) {
            var equipsDatas = this.model.equipsData;
            var equipsData = void 0;
            for (var i = 0; i < equipsDatas.length; i++) {
                if (this.data.handle == equipsDatas[i].item.handle) {
                    equipsData = equipsDatas[i];
                    break;
                }
            }
        }
        this._lastData = this.data;
        this._lastModel = this._model;
    };
    ;
    RoleItem.prototype.clear = function () {
        this.itemBase.clear();
        this.playEff();
    };
    ;
    RoleItem.prototype.openEquipsTips = function () {
        if (this.itemBase.itemConfig == null) {
            return;
        }
        ViewManager.ins().open(EquipUserDetailedWin, this.data.handle, this.itemBase.itemConfig.id, this.data, this._model);
    };
    ;
    Object.defineProperty(RoleItem.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (value) {
            this._model = value;
        },
        enumerable: true,
        configurable: true
    });
    RoleItem.prototype.playEff = function () {
        if (this._lastData) {
            if (this._lastData != this.data && this.model == this._lastModel) {
                UIHelper.PlayUpEff(this);
            }
        }
    };
    return RoleItem;
}(eui.ItemRenderer));
__reflect(RoleItem.prototype, "RoleItem");
//# sourceMappingURL=RoleItem.js.map