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
var TianshilianPanel = (function (_super) {
    __extends(TianshilianPanel, _super);
    function TianshilianPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.tViewData = []; //天庭部分数据
        _this.tReward = []; //奖励列表
        _this.tNowLyData = []; //当前层级数据
        _this.tSpReward = []; //特别奖励内容
        _this.nSpLv = -1; //特别奖励层数
        _this.tRewardItem = []; //奖励item列表
        _this.tLayoutItem = []; //关卡item
        _this.tBoxObj = []; //宝箱奖励列表
        _this.nRewardPage = 0; //奖励列表页数
        _this.DOWNTIME = GameGlobal.Config.HeavenFbBaseConfig.time;
        _this.nDownTime = 10; //倒计时发送
        _this.nReward = 1; //当前点击的宝箱
        _this.skinName = "TianshilianSkin";
        _this._AddClick(_this.oneKeyBtn, _this._OnClick);
        _this._AddClick(_this.challageBtn, _this._OnClick);
        _this._AddClick(_this.prevBtn, _this._OnClick);
        _this._AddClick(_this.nextBtn, _this._OnClick);
        _this.showReward.scaleX = 0.7;
        _this.showReward.scaleY = 0.7;
        return _this;
    }
    TianshilianPanel.prototype.childrenCreated = function () {
        for (var i = 0; i <= 2; i++) {
            var item = this["pItemReward" + (i + 1)];
            this.tRewardItem[i] = item;
            this._AddClick(item, this.onClickRw);
        }
        for (var i = 0; i <= 2; i++) {
            var item = this["pLayout" + (i + 1)];
            this.tLayoutItem[i] = item;
            this._AddClick(item, this.onClickLy);
        }
    };
    TianshilianPanel.prototype.OnOpen = function () {
        var _this = this;
        GameGlobal.UserFb.rankType = RankingModel.RANK_TYPE_TT;
        GameGlobal.RankingModel.sendRank(RankingModel.RANK_TYPE_TT);
        this.observe(MessageDef.UPDATE_PAIHANGBANG_DATA, function () {
            _this.item0.onUpdate();
        });
        this.observe(MessageDef.FB_TIANTING_UPDATE, this.UpdateContent); //天庭试炼数据变化更新
        this.checkBox.addEventListener(egret.Event.CHANGE, this.chage, this);
        this.AddTimer(1000, 0, this.startUpdateTime); //时间更新函数
        //初始化选择自动挖宝 
        this.checkBox.selected = GameGlobal.UserFb.bTianTingAutoFight;
        this.nDownTime = this.DOWNTIME;
        this.checkBox.labelDisplay.text = "自动挑战关卡";
        this.item0.onUpdate(); //排行榜数据更新
    };
    //点击选择框改变内容
    TianshilianPanel.prototype.chage = function () {
        this.nDownTime = this.DOWNTIME;
        if (!this.checkBox.selected) {
            this.checkBox.labelDisplay.text = "自动挑战关卡";
        }
        GameGlobal.UserFb.bTianTingAutoFight = this.checkBox.selected;
    };
    //更新选择框内容
    TianshilianPanel.prototype.upDataSelectRect = function () {
        var str = "自动挑战关卡";
        if (this.nDownTime >= this.DOWNTIME || this.nDownTime < 0) {
            str = "自动挑战关卡";
        }
        else {
            str = this.nDownTime + "S后自动挑战关卡";
        }
        this.checkBox.labelDisplay.text = str;
    };
    TianshilianPanel.prototype.startUpdateTime = function () {
        if (this.checkBox.selected) {
            // 
            if (this.nDownTime > 0) {
                this.nDownTime = this.nDownTime - 1;
            }
            else if (this.nDownTime === 0) {
                //挑战
                GameGlobal.UserFb.sendfbJoin(4);
                this.nDownTime = this.nDownTime - 1;
            }
            else {
            }
            this.upDataSelectRect();
        }
    };
    TianshilianPanel.prototype.setData = function () {
        this.tReward = GameGlobal.UserFb.getTianTingRewardList();
        this.tServer = GameGlobal.UserFb.tFbTiantingServerData;
        this.tViewData = GameGlobal.UserFb.getTianTingLvData();
        //初始化奖励内容
        this.tSpReward = [];
        this.nSpLv = -1;
        this.tNowLyData = []; //当前层级显示数据
        var nMinLy = Math.floor((this.tServer.todayLayer) / 3) * 3; //今天当前关卡
        var page = Math.floor(this.tServer.rewardNo.length / 3);
        this.nRewardPage = page;
        if (nMinLy < 1)
            nMinLy = 0;
        // firstAward 宝箱内容
        for (var item in this.tViewData) {
            if (this.tViewData[item].uishow) {
                var obj = { lv: this.tViewData[item].id, boss: this.tViewData[item].uishow, caption1: this.tViewData[item].caption1, caption2: this.tViewData[item].caption2 };
                this.tSpReward.push(obj);
            }
        }
        for (var i = nMinLy; i <= nMinLy + 3; i++) {
            if (this.tViewData[i]) {
                this.tNowLyData.push(this.tViewData[i]);
            }
        }
        this.tBoxObj = []; //宝箱奖励列表
        var tBoxList = [];
        //宝箱奖励列表
        for (var item in this.tViewData) {
            var pLvData = this.tViewData[item];
            var pRewarBox = { firstAward: [], id: 0 };
            if (pLvData.firstAward && pLvData.firstAward.length > 0) {
                pRewarBox.firstAward = pLvData.firstAward;
                pRewarBox.id = pLvData.id;
                tBoxList.push(pRewarBox);
            }
        }
        //整理成一个列表
        for (var i = 0; i < tBoxList.length; i++) {
            var nNums = Math.floor(i / 3);
            if (!this.tBoxObj[nNums]) {
                this.tBoxObj[nNums] = [];
            }
            this.tBoxObj[nNums].push(tBoxList[i]);
        }
    };
    TianshilianPanel.prototype.UpdateContent = function () {
        UIHelper.ShowRedPoint(this.oneKeyBtn, GameGlobal.UserFb.IsTianshilianNotice());
        this.setData();
        for (var item in this.tLayoutItem) {
            this.upDataLyCn(this.tLayoutItem[item], item);
        }
        this.updateRewardItem();
        this.upDateInfo();
        this.showLeftArrow();
        this.showRightArrow();
    };
    //更新奖励内容
    TianshilianPanel.prototype.updateRewardItem = function () {
        for (var item in this.tRewardItem) {
            this.updateRewardCn(this.tRewardItem[item], item);
        }
    };
    //左边箭头
    TianshilianPanel.prototype.showLeftArrow = function () {
        if (this.tBoxObj[this.nRewardPage - 1]) {
            this.prevBtn.visible = true;
        }
        else {
            this.prevBtn.visible = false;
        }
    };
    //右边箭头
    TianshilianPanel.prototype.showRightArrow = function () {
        if (this.tBoxObj[this.nRewardPage + 1]) {
            this.nextBtn.visible = true;
        }
        else {
            this.nextBtn.visible = false;
        }
    };
    TianshilianPanel.prototype.upDateInfo = function () {
        var pData;
        for (var item in this.tSpReward) {
            if (this.tSpReward[item].lv > this.tServer.layer) {
                pData = this.tSpReward[item];
                break;
            }
        }
        if (pData) {
            this.pGroupRewar.visible = true;
            this.showReward.SetBody(AppearanceConfig.GetUIPath(pData.boss));
            this.lbPassLvReward.text = pData.caption1;
            this.lbReName.text = pData.caption2;
        }
        else {
            this.pGroupRewar.visible = false;
        }
        if (this.tServer.layer > 0) {
            var strPassLv = "|C:0x6E330B&T:\u6700\u5927\u901A\u5173: |C:0x019704&T:" + this.tServer.layer + "|C:0x6E330B&T: \u5C42|";
            //显示当前最大通关关数
            this.maxLabel.textFlow = TextFlowMaker.generateTextFlow(strPassLv);
        }
        //进度条
        var tBarValue = [0, 5, 10, 15, 22, 35, 50, 65, 78, 85, 90, 95, 100];
        var nStarValue = (this.tServer.layer - this.nRewardPage * 9);
        if (nStarValue > 12)
            nStarValue = 12;
        this.bar.value = tBarValue[nStarValue] || 0;
        this.bar.labelDisplay.visible = false;
    };
    //更新层级内容
    TianshilianPanel.prototype.upDataLyCn = function (_item, _index) {
        var nNowLv = -1;
        for (var item in this.tNowLyData) {
            if (item === _index) {
                nNowLv = this.tNowLyData[item].id;
                _item.layerLabel.text = "第" + nNowLv + "层";
                if (this.tNowLyData[item].bossId) {
                    _item.showPanel.SetBody(AppearanceConfig.GetUIPath(MonstersConfig.GetAppId(this.tNowLyData[item].bossId))); //boss
                }
            }
        }
        if (nNowLv > 0) {
            if (nNowLv <= this.tServer.todayLayer) {
                _item.arrowImg.visible = false;
                _item.goImg.visible = true;
            }
            else if (nNowLv === (this.tServer.todayLayer + 1)) {
                _item.arrowImg.visible = true;
                _item.goImg.visible = false;
            }
            else if (nNowLv > (this.tServer.todayLayer + 1)) {
                _item.goImg.visible = false;
                _item.arrowImg.visible = false;
            }
        }
        else {
            _item.goImg.visible = false;
            _item.arrowImg.visible = false;
        }
    };
    //更新奖励内容
    TianshilianPanel.prototype.updateRewardCn = function (_item, _index) {
        var pRewardData = this.tBoxObj[this.nRewardPage];
        if (pRewardData[_index]) {
            _item.visible = true;
            _item.layerLabel.text = pRewardData[_index].id + "层";
            if (this.tServer.layer >= pRewardData[_index].id) {
                _item.stateImg.filters = null;
                // if(this.tServer.rewardNo>=pRewardData[_index].id)//已领取
                var bGet = GameGlobal.UserFb.getTiantingStarReward(pRewardData[_index].id);
                if (bGet) {
                    _item.redImg.visible = false;
                    _item.getImg.visible = true;
                }
                else {
                    _item.redImg.visible = true;
                    _item.getImg.visible = false;
                }
            }
            else {
                _item.stateImg.filters = Color.GetFilter(); //变灰
                _item.redImg.visible = false;
                _item.getImg.visible = false;
            }
        }
        else {
            _item.visible = false;
        }
    };
    TianshilianPanel.prototype.OnClose = function () {
    };
    TianshilianPanel.prototype.onClickRw = function (e) {
        var pData;
        switch (e.currentTarget) {
            case this.pItemReward1:
                pData = this.tBoxObj[this.nRewardPage][0];
                break;
            case this.pItemReward2:
                pData = this.tBoxObj[this.nRewardPage][1];
                break;
            case this.pItemReward3:
                pData = this.tBoxObj[this.nRewardPage][2];
                break;
        }
        if (pData) {
            var strIndex = "第" + pData.id + "层";
            this.nReward = pData.id;
            var bGet = GameGlobal.UserFb.getTiantingStarReward(this.nReward);
            var bHaveGet = false;
            if (this.tServer.layer >= pData.id && (!bGet)) {
                bHaveGet = true;
            }
            WarnWin.showReward("|C:0x6E330B&T: \u901A\u5173\u52C7\u95EF\u5929\u5EAD|C:0x4fcd4c&T:" + strIndex + "|C:0x6E330B&T:\u5956\u52B1|", this.getRewrd, this, null, null, "reward", { title: '通关奖励', reward: pData.firstAward, btnName: "领取奖励", bHideSureBtn: !bHaveGet });
        }
    };
    //领取宝箱奖励
    TianshilianPanel.prototype.getRewrd = function () {
        GameGlobal.UserFb.getTianTingReward(this.nReward);
    };
    TianshilianPanel.prototype.onClickLy = function (e) {
    };
    TianshilianPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.oneKeyBtn:
                if (UserVip.ins().lv < GameGlobal.Config.HeavenFbBaseConfig.viplv) {
                    UserTips.ins().showTips("Vip" + GameGlobal.Config.HeavenFbBaseConfig.viplv + "可扫荡");
                }
                else {
                    if (this.tServer.todayLayer < this.tServer.layer) {
                        GameGlobal.UserFb.sendfbSweep(2);
                    }
                    else {
                        UserTips.ins().showTips("无法扫荡");
                    }
                }
                break;
            case this.challageBtn:
                if (UserFb.FinishAndCheckFighting2()) {
                    GameGlobal.UserFb.sendfbJoin(4);
                }
                break;
            case this.prevBtn:
                if (this.nRewardPage > 0) {
                    this.nRewardPage = this.nRewardPage - 1;
                }
                this.updateRewardItem();
                this.showLeftArrow();
                this.showRightArrow();
                this.upDateInfo();
                break;
            case this.nextBtn:
                if (this.nRewardPage < this.tBoxObj.length - 1) {
                    this.nRewardPage = this.nRewardPage + 1;
                }
                this.updateRewardItem();
                this.showLeftArrow();
                this.showRightArrow();
                this.upDateInfo();
                break;
        }
    };
    TianshilianPanel.NAME = "勇闯天庭";
    return TianshilianPanel;
}(BaseEuiView));
__reflect(TianshilianPanel.prototype, "TianshilianPanel", ["ICommonWindow", "ICommonWindowTitle"]);
//# sourceMappingURL=TianshilianPanel.js.map