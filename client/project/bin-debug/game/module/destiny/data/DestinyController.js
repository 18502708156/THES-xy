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
/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/6/26 21:10
 * @meaning: 命格控制类
 *
 **/
var DestinyController = (function (_super) {
    __extends(DestinyController, _super);
    function DestinyController() {
        var _this = _super.call(this) || this;
        //
        _this.tUseDestinyData = []; //装备的
        _this.tDestinyBagData = []; //持有的
        _this.tSelectList = { 1: true, 2: false, 3: false, 4: false, 5: false };
        _this.bShowResolveTip = true; //是否二次确认提示分级重要命格
        // private tLocatData;
        // private nNum = 0;//数量,持有上限300
        // private nPerfectNum = 0;//integer #完美打造次数
        _this.mRedPoint = new DestinyRedPoint;
        return _this;
    }
    DestinyController.prototype.Init = function () {
        _super.prototype.Init.call(this);
        GameGlobal.UserBag.AddListenerItem(GameGlobal.Config.DestinyBaseConfig.uplevelitemid, MessageDef.DESTINY_UP_ITEM);
        // this.tLocatData = GameG
    };
    //命格列表
    DestinyController.prototype.getUseDestinyData = function () {
        return this.tUseDestinyData;
    };
    DestinyController.prototype.GetCount = function () {
        var count = 0;
        for (var key in this.tUseDestinyData) {
            var data = this.tUseDestinyData[key];
            if (data && data.level) {
                ++count;
            }
        }
        return count;
    };
    //命格物品列表
    DestinyController.prototype.getDestBagList = function () {
        return this.tDestinyBagData;
    };
    //获取藏宝图分页数据
    DestinyController.prototype.getShowDestinyData = function () {
        var tPataData = {};
        var config = GlobalConfig.ins().DestinyAttrsConfig;
        for (var item in config) {
            var sort = config[item].sort;
            if (!tPataData[sort]) {
                tPataData[sort] = [];
                tPataData[sort].push(config[item]); //暂时只显示一个
            }
            // if (sort) {
            //     tPataData[sort].push(config[item]);//根据标签插入
            // }
        }
        return tPataData;
    };
    //获得服务器基础数据
    DestinyController.prototype.getServerInfo = function () {
        return this.tDestinyServerInfo;
    };
    //逆命返回
    DestinyController.prototype.babyStarGet = function (_data) {
        this.tDestinyServerInfo.star = _data.star;
        this.tDestinyServerInfo.msgData = _data.msgData;
    };
    //点亮混元返回
    DestinyController.prototype.babyStartLight = function (_data) {
        this.tDestinyServerInfo.star = 5;
    };
    //使用
    DestinyController.prototype.babyStartUse = function (_data) {
        this.updateDestinyData(_data.pos, _data.no);
    };
    DestinyController.prototype.babyStartUpLv = function (_data) {
        this.updateDestinyData(_data.pos, _data.no);
    };
    //更新命格数据
    DestinyController.prototype.updateDestinyData = function (_pos, _num) {
        var data = this.tUseDestinyData[_pos - 1];
        if (data && _num) {
            var local = GlobalConfig.ins().DestinyAttrsConfig[_num];
            if (data.item) {
                data.initLocalData(local);
            }
            else {
                data = new DestinyData();
                data.initLocalData(local);
                this.tUseDestinyData[_pos - 1] = data;
            }
        }
    };
    DestinyController.prototype.doBabyStar = function (_data) {
        this.tDestinyServerInfo = _data;
        //命格数据
        this.tUseDestinyData = [];
        for (var item in _data.data) {
            var data = {};
            if (_data.data[item]) {
                var local = GlobalConfig.ins().DestinyAttrsConfig[_data.data[item]];
                var deData = new DestinyData();
                deData.initLocalData(local);
                data = deData;
            }
            this.tUseDestinyData.push(data);
        }
    };
    DestinyController.prototype.GetPower = function () {
        //所有命格战力
        var allAttr = 0;
        var list = this.tUseDestinyData || [];
        for (var item in list) {
            var data = list[item];
            if (data.attars) {
                allAttr = allAttr + ItemConfig.CalcAttrScoreValue(data.attars);
            }
        }
        return allAttr;
    };
    return DestinyController;
}(BaseSystem));
__reflect(DestinyController.prototype, "DestinyController");
//# sourceMappingURL=DestinyController.js.map