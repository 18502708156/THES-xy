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
var MainCityView = (function (_super) {
    __extends(MainCityView, _super);
    function MainCityView() {
        var _this = _super.call(this) || this;
        _this.initMap();
        return _this;
    }
    MainCityView.prototype.initMap = function () {
        var ConfigKing = GameGlobal.Config.KingCityConfig;
        var ConfigBase = GameGlobal.Config.KingBaseConfig;
        var arry = ["citypos", "rcitypos", "xcitypos", "mcitypos"];
        for (var i = 0; i < 4; i++) {
            this["city" + i] = new MapCity();
            this["city" + i].citySrc(ConfigKing[i + 1][10].icon);
            this["city" + i].x = ConfigBase[arry[i]][0];
            this["city" + i].y = ConfigBase[arry[i]][1];
            this.addChild(this["city" + i]);
            this["city" + i]["cityName"].pixelHitTest = true;
            this["city" + i]["cityName"].addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    MainCityView.prototype.setRoleHead = function (i, data) {
        this["city" + i].cityHead(data);
    };
    MainCityView.prototype.click = function (e) {
        var index = 0;
        switch (e.currentTarget) {
            case this.city0["cityName"]:
                index = CityType.MINCITY;
                break;
            case this.city1["cityName"]:
                index = CityType.PERCITY;
                break;
            case this.city3["cityName"]:
                index = CityType.MOCITY;
                break;
            case this.city2["cityName"]:
                index = CityType.XIANCITY;
                break;
        }
        if (GameGlobal.CrossBattleModel.status == 1) {
            return UserTips.InfoTip("活动还未开始");
        }
        GameGlobal.CrossBattleModel.sendKingCityData(index);
    };
    return MainCityView;
}(egret.DisplayObjectContainer));
__reflect(MainCityView.prototype, "MainCityView");
var CityType;
(function (CityType) {
    CityType[CityType["MINCITY"] = 0] = "MINCITY";
    CityType[CityType["PERCITY"] = 1] = "PERCITY";
    CityType[CityType["XIANCITY"] = 2] = "XIANCITY";
    CityType[CityType["MOCITY"] = 3] = "MOCITY";
})(CityType || (CityType = {}));
//# sourceMappingURL=MainCityView.js.map