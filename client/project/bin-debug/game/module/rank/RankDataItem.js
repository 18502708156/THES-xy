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
var RankDataItem = (function (_super) {
    __extends(RankDataItem, _super);
    function RankDataItem() {
        var _this = _super.call(this) || this;
        _this.currentState = "four";
        _this.rewardList = [];
        return _this;
    }
    RankDataItem.prototype.showContent = function (rank) {
        var config = GameGlobal.Arena.getRankRewards(rank);
        if (config) {
            var i = 0, len = config.length;
            var rewardCon = void 0;
            for (i; i < len; i++) {
                rewardCon = this.rewardList[i];
                if (!rewardCon) {
                    rewardCon = new IconWithText();
                    rewardCon.x = 0;
                    this.con.addChild(rewardCon);
                    this.rewardList.push(rewardCon);
                }
                rewardCon.setIcon(config[i].id);
                rewardCon.setCount(config[i].count + '');
                rewardCon.y = rewardCon.height * i >> 0;
            }
        }
    };
    RankDataItem.prototype.setPower = function (str) {
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            str = wNum / 10 + "万";
        }
        this.tpower.text = str;
    };
    RankDataItem.prototype.dataChanged = function () {
        if (!this.data) {
            return;
        }
        var data = this.data;
        this.setTxtColorByRank(data.rank);
        this.trank.text = data.rank + '';
        this.tname.text = data.name;
        this.setPower(data.value + '');
        this.showContent(data.rank);
        this.imgBg.visible = data.rank % 2 ? true : false;
    };
    RankDataItem.prototype.setTxtColorByRank = function (rank) {
        var color = 0x6E330B;
        switch (rank) {
            case 1:
                color = 0xd27701;
                break;
            case 2:
                color = 0xc400fd;
                break;
            case 3:
                color = 0x2F6FF6;
                break;
        }
        this.trank.textColor = this.tname.textColor = color;
    };
    return RankDataItem;
}(eui.ItemRenderer));
__reflect(RankDataItem.prototype, "RankDataItem");
var IconWithText = (function (_super) {
    __extends(IconWithText, _super);
    function IconWithText() {
        var _this = _super.call(this) || this;
        _this.icon = new eui.Image();
        _this.icon.x = 0, _this.icon.y = 0;
        _this.addChild(_this.icon);
        _this.count = new eui.Label();
        _this.count.textColor = 0xd27701;
        _this.count.size = 24;
        _this.count.x = 32;
        _this.count.y = 0;
        _this.addChild(_this.count);
        return _this;
    }
    IconWithText.prototype.setIcon = function (type) {
        this.icon.source = RewardData.GetCurrencyMiniRes(type);
        this.icon.y = MoneyConst.yuanbao == type ? 6 : 0;
    };
    IconWithText.prototype.setCount = function (str) {
        if (str.length > 4) {
            var wNum = Math.floor(Number(str) / 1000);
            str = wNum / 10 + "万";
        }
        this.count.text = str;
    };
    return IconWithText;
}(eui.Component));
__reflect(IconWithText.prototype, "IconWithText");
//# sourceMappingURL=RankDataItem.js.map