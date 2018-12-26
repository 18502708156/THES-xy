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
var ItemData = (function (_super) {
    __extends(ItemData, _super);
    function ItemData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 是否是新增加的物品（暂时兵法物品使用）
        _this.mIsNewItem = false;
        return _this;
    }
    ItemData.prototype.parser = function (data) {
        _super.prototype.parser.call(this, data);
        if (data) {
            this.invalidtime = data.invalidtime || 0;
        }
    };
    ItemData.prototype.UpdateConfigId = function (value) {
        _super.prototype.UpdateConfigId.call(this, value);
        if (value) {
            this.setCanbeUsed();
        }
    };
    /**
     * 设置道具可使用的红点提示
     */
    ItemData.prototype.setCanbeUsed = function () {
        if (!this.itemConfig)
            return;
        if (this.itemConfig.useType == 1 || this.itemConfig.useType == 2) {
            if (GameLogic.ins().actorModel.level < this.itemConfig.level) {
                this.canbeUsed = false;
            }
            else {
                //屏蔽召唤令的红点提示
                var id = this.itemConfig.id;
                if (id == 230001 || id == 230002 || id == 230003) {
                    this.canbeUsed = false;
                }
                else {
                    var xianlvId = XianlvModel.MATERIAL_ID[id];
                    if (xianlvId) {
                        if (GameGlobal.XianlvModel.HasXianlv(xianlvId)) {
                            this.canbeUsed = true;
                        }
                        else {
                            this.canbeUsed = false;
                        }
                    }
                    else {
                        this.canbeUsed = true;
                    }
                }
            }
        }
        else {
            this.canbeUsed = false;
        }
    };
    ItemData.prototype.getCanbeUsed = function () {
        if (this.canbeUsed) {
            return ItemData.IsNotTimeLimitUse(this.itemConfig);
        }
        return false;
    };
    ItemData.IsNotTimeLimitUse = function (config) {
        if (config.useType == ItemUseType.TYPE01 && config.useArg != null && config.useArg.timelimit != null) {
            try {
                var date = DateUtils.StrToDate(config.useArg.timelimit);
                if (date) {
                    if (date.getTime() * 0.001 >= GameServer.serverTime) {
                        return false;
                    }
                }
            }
            catch (e) {
            }
        }
        var xianlvId = XianlvModel.MATERIAL_ID[config.id];
        if (xianlvId) {
            if (!GameGlobal.XianlvModel.HasXianlv(xianlvId)) {
                return false;
            }
        }
        return true;
    };
    return ItemData;
}(ItemBaseData));
__reflect(ItemData.prototype, "ItemData");
//# sourceMappingURL=ItemData.js.map