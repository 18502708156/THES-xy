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
var MiniMap = (function (_super) {
    __extends(MiniMap, _super);
    function MiniMap() {
        var _this = _super.call(this) || this;
        _this.imgList = [];
        return _this;
    }
    MiniMap.prototype._setBg = function (str) {
        this.bg.source = str;
    };
    MiniMap.prototype._setRole = function (handle) {
        var mem = handle.mMember[0];
        if (!mem) {
            console.warn("not found mem => ");
            return;
        }
        var img = this.imgList.pop() || new eui.Image;
        img.visible = true;
        img.x = mem.mTarget.x / 15;
        img.y = mem.mTarget.y / 15;
        var color = GameGlobal.CrossBattleModel.TYPECOLOR[GameGlobal.CrossBattleModel.getPlayerCamp(handle.mMasterHandle)];
        img.source = color;
        img.name = handle.mMasterHandle.toString();
        this.all.addChild(img);
    };
    MiniMap.prototype._removeRole = function (handle) {
        DisplayUtils.removeFromParent(this.getChildByName(handle.mMasterHandle.toString()));
    };
    MiniMap.prototype._removeAll = function () {
        for (var _i = 0, _a = this.all.$children; _i < _a.length; _i++) {
            var data = _a[_i];
            data.visible = false;
            this.imgList.push(data);
        }
        this.all.removeChildren();
    };
    MiniMap.prototype.citySet = function (num) {
        for (var i = 0; i < 4; i++) {
            var city = this["city" + i];
            city.citySet(i);
        }
    };
    return MiniMap;
}(eui.Component));
__reflect(MiniMap.prototype, "MiniMap", ["eui.UIComponent", "egret.DisplayObject"]);
var MiniMapCityInfoItem = (function (_super) {
    __extends(MiniMapCityInfoItem, _super);
    function MiniMapCityInfoItem() {
        var _this = _super.call(this) || this;
        _this.skinName = "MiniMapCityInfoSkin";
        return _this;
    }
    MiniMapCityInfoItem.prototype.childrenCreated = function () {
        this.pro.labelDisplay.visible = false;
    };
    MiniMapCityInfoItem.prototype.citySet = function (num) {
        var data = GameGlobal.CrossBattleModel.getCitysInfo(num);
        if (!data) {
            return;
        }
        this.typeImg.source = GameGlobal.CrossBattleModel.ZHENGTYPE[data.currcamp];
        this.pro.maximum = data.maxhp;
        this.pro.value = data.currhp;
    };
    return MiniMapCityInfoItem;
}(eui.Component));
__reflect(MiniMapCityInfoItem.prototype, "MiniMapCityInfoItem", ["eui.UIComponent", "egret.DisplayObject"]);
var MapCity = (function (_super) {
    __extends(MapCity, _super);
    function MapCity() {
        var _this = _super.call(this) || this;
        _this.skinName = "MapCitySkin";
        _this.list.itemRenderer = HeadItem;
        return _this;
    }
    MapCity.prototype.citySrc = function (src) {
        this.cityName.source = src;
    };
    MapCity.prototype.cityHead = function (data) {
        this.list.dataProvider = new eui.ArrayCollection(data);
    };
    return MapCity;
}(eui.Component));
__reflect(MapCity.prototype, "MapCity", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=MiniMap.js.map