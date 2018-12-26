/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/4/17 11:51
 * @meaning: 副本藏宝图详情
 *
 **/
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
var FbCbtPanel = (function (_super) {
    __extends(FbCbtPanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function FbCbtPanel() {
        var _this = _super.call(this) || this;
        //奖励内容
        _this.tSpReward = [];
        _this.tGem = []; //宝箱列表
        _this.tReward = []; //宝箱列表
        _this.tItem = []; //宝箱列表
        _this.tCbtData = []; //藏宝图数据
        _this.tStarRewardData = []; //星级奖励数据
        _this.nNewLvNum = 1;
        _this.nIndex = 1; //当前页
        _this.nSelect = 0; //当前选择关卡
        _this.nMaxStar = 1; //当前页最大星数
        _this.tStarList = []; //星星列表
        _this.nNowStar = 0; //当前页星星数量
        _this.nDownTime = 10; //倒计时发送
        _this.nReward = 1; //当前点击的宝箱
        _this.skinName = "CangbaotuSkin";
        _this.bar1.labelDisplay.visible = false;
        _this.bar2.labelDisplay.visible = false;
        _this.bar3.labelDisplay.visible = false;
        _this.bar1.slideDuration = 0;
        _this.bar2.slideDuration = 0;
        _this.bar3.slideDuration = 0;
        return _this;
    }
    /////////////////////////////////////////////////////////////////////////////
    // 引导对象
    FbCbtPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.challageBtn,
            _a;
        var _a;
    };
    FbCbtPanel.prototype.childrenCreated = function () {
        for (var i = 1; i <= 6; i++) {
            var item = this["pPop" + i];
            this.tGem[i] = item;
            this._AddClick(item, this.onClickGem);
        }
        for (var i = 0; i <= 1; i++) {
            var item = this["pReward" + (i + 1)];
            this.tReward[i] = item;
            this.tReward[i].listView.itemRenderer = ItemBase;
            this._AddClick(item, this.onClick);
        }
        for (var i = 0; i <= 2; i++) {
            var item = this["pItem" + (i + 1)];
            this.tItem[i] = item;
            this._AddClick(item, this.onClickItem);
        }
    };
    FbCbtPanel.prototype.OnOpen = function () {
        this.observe(MessageDef.FB_CBT_UPDATE, this.updateServer); //藏宝图变化更新
        this.observe(MessageDef.FB_CBT_UPDATE_REWARD, this.UpdateContent); //藏宝图奖励变化更新
        this._AddClick(this.oneKeyBtn, this.onClick);
        this._AddClick(this.challageBtn, this.onClick);
        this._AddClick(this.prevBtn, this.onClick);
        this._AddClick(this.nextBtn, this.onClick);
        this._AddClick(this.btnHard, this.onClick);
        UIHelper.ShowRedPoint(this.challageBtn, true); //红点常驻
        this.checkBox.addEventListener(egret.Event.CHANGE, this.chage, this);
        this.initStarData(); //初始化星级数据
        //初始化选择自动挖宝 
        this.checkBox.selected = GameGlobal.UserFb.bCbtAutoFight;
        this.nDownTime = 10;
        this.checkBox.labelDisplay.text = "自动挖宝";
        this.AddTimer(1000, 0, this.startUpdateTime); //时间更新函数
        this.updateServer();
        // this.btnHard.visible = GameGlobal.UserFb.CanHardCbt()
    };
    //点击选择框改变内容
    FbCbtPanel.prototype.chage = function () {
        // this.startUpdateTime()
        // if()
        this.nDownTime = 10;
        if (!this.checkBox.selected) {
            this.checkBox.labelDisplay.text = "自动挖宝";
        }
        GameGlobal.UserFb.bCbtAutoFight = this.checkBox.selected;
    };
    //更新选择框内容
    FbCbtPanel.prototype.upDataSelectRect = function () {
        var str = "自动挖宝";
        if (this.nDownTime >= 10 || this.nDownTime < 0) {
            str = "自动挖宝";
        }
        else {
            str = this.nDownTime + "S后自动挖宝";
        }
        this.checkBox.labelDisplay.text = str;
    };
    FbCbtPanel.prototype.startUpdateTime = function () {
        if (this.checkBox.selected) {
            // 
            if (this.nDownTime > 0) {
                this.nDownTime = this.nDownTime - 1;
            }
            else if (this.nDownTime === 0) {
                //挑战
                var pData = this.getNowLvData();
                GameGlobal.UserFb.sendfbJoin(2, pData.id);
                this.nDownTime = this.nDownTime - 1;
            }
            else {
            }
            this.upDataSelectRect();
        }
    };
    FbCbtPanel.prototype.updateServer = function () {
        this.setData();
        this.locateNewLevel();
        this.UpdateContent();
    };
    FbCbtPanel.prototype.initStarData = function () {
        this.tStarRewardData = GameGlobal.Config.TreasureMapStarConfig;
    };
    //定位到最新的宝藏
    FbCbtPanel.prototype.locateNewLevel = function (bUpIndex) {
        if (bUpIndex === void 0) { bUpIndex = true; }
        // this.tCbtData
        for (var item in this.tCbtData) {
            var pLvData = this.tCbtData[item];
            for (var index in pLvData) {
                // if(pLvData[index].star===0) //定位到最新一关
                if (pLvData[index].todayNum === 0) {
                    if (bUpIndex) {
                        this.nIndex = parseInt(item) + 1;
                    }
                    this.nSelect = parseInt(index);
                    return;
                }
            }
        }
    };
    FbCbtPanel.prototype.GetArrowRedPoint = function (index, star) {
        if (star === void 0) { star = null; }
        var reward = GameGlobal.UserFb.getCbtStarRewardPage(index);
        if (reward >= 14) {
            return false;
        }
        if (star == null) {
            star = 0;
            for (var _i = 0, _a = this.tCbtData[index - 1]; _i < _a.length; _i++) {
                var data = _a[_i];
                star = star + data.star;
            }
        }
        for (var i = 0; i < 3; i++) {
            if (!BitUtil.Has(reward, i + 1)) {
                var pData = this.tStarRewardData[this.nIndex][i];
                if (star >= pData.star) {
                    return true;
                }
            }
        }
        return false;
    };
    //左边箭头显示
    FbCbtPanel.prototype.showLeftArrow = function () {
        if (this.prevBtn.visible = this.tStarRewardData[this.nIndex - 1]) {
            var red = false;
            for (var i = this.nIndex - 1; i >= 1; --i) {
                if (this.GetArrowRedPoint(i)) {
                    red = true;
                    break;
                }
            }
            UIHelper.ShowRedPoint(this.prevBtn, red);
        }
    };
    FbCbtPanel.prototype.showRightArrow = function () {
        var tPageData = this.tCbtData[this.nIndex - 1];
        var nStar = 0;
        for (var item in tPageData) {
            nStar = nStar + tPageData[item].star;
        }
        // 当前有星级，下一章有数据
        if (nStar > 0 && this.tCbtData[this.nIndex]) {
            this.nextBtn.visible = true;
            var red = false;
            for (var i = this.nIndex + 1; i <= 99; ++i) {
                var pageData = this.tCbtData[i - 1];
                if (!pageData) {
                    break;
                }
                var star = 0;
                for (var item in pageData) {
                    star = star + pageData[item].star;
                }
                if (!star) {
                    break;
                }
                if (this.GetArrowRedPoint(i, star)) {
                    red = true;
                    break;
                }
            }
            UIHelper.ShowRedPoint(this.nextBtn, red);
        }
        else {
            this.nextBtn.visible = false;
        }
    };
    FbCbtPanel.prototype.setData = function () {
        this.tCbtData = [];
        this.tSpReward = [];
        var config = GameGlobal.UserFb.getCbtPageData(); //获取藏宝图数据
        for (var item in config) {
            this.tCbtData.push(config[item]);
        }
        var locong = GameGlobal.Config.TreasureMapConfig;
        for (var item in locong) {
            //奖励内容
            if (locong[item].item) {
                var obj = { lv: locong[item].id, item: locong[item].item, caption: locong[item].caption };
                this.tSpReward.push(obj);
            }
        }
        this.nNowStar = 0; //重置星数
        var pPage = this.tCbtData[this.nIndex - 1];
        for (var item in pPage) {
            this.nNowStar = this.nNowStar + pPage[item].star; //计算现在拥有星数
        }
        //最新一关id 
        this.nNewLvNum = this.getLastNum();
        this.tStarList = []; //重置一下星星类型
    };
    FbCbtPanel.prototype.getLastNum = function () {
        //最新一关id 
        for (var item in this.tCbtData) {
            var pLvData = this.tCbtData[item];
            for (var index in pLvData) {
                if (pLvData[index].star === 0) {
                    return pLvData[index].id;
                }
            }
        }
        return 1;
    };
    FbCbtPanel.GetLastNum = function () {
        var tCbtData = [];
        var config = GameGlobal.UserFb.getCbtPageData(); //获取藏宝图数据
        for (var item in config) {
            tCbtData.push(config[item]);
        }
        for (var item in tCbtData) {
            var pLvData = tCbtData[item];
            for (var index in pLvData) {
                if (pLvData[index].star === 0) {
                    return pLvData[index].id;
                }
            }
        }
        return 1;
    };
    FbCbtPanel.prototype.onClick = function (e) {
        var pData = this.getNowLvData();
        switch (e.target) {
            case this.oneKeyBtn:
                //需要判断vip
                if (GameGlobal.UserFb.getCbtCanSwap()) {
                    GameGlobal.UserFb.sendfbSweep(1);
                }
                else {
                    UserTips.ins().showTips("无法扫荡");
                }
                break;
            case this.challageBtn:
                if (UserFb.FinishAndCheckFighting2()) {
                    GameGlobal.UserFb.bCbtAcross = pData.star;
                    GameGlobal.UserFb.bCbtAutoFight = true;
                    GameGlobal.UserFb.sendfbJoin(2, pData.id);
                }
                break;
            case this.prevBtn:
                if (this.nIndex >= 1) {
                    this.nIndex = this.nIndex - 1;
                    this.UpdateContent();
                    this.locateNewLevel(false);
                }
                break;
            case this.nextBtn:
                if (this.nIndex < this.tCbtData.length) {
                    this.nIndex = this.nIndex + 1;
                    this.UpdateContent();
                    this.locateNewLevel(false);
                }
                break;
            case this.btnHard:
                break;
        }
    };
    FbCbtPanel.prototype.onClickItem = function (e) {
        var pData;
        switch (e.currentTarget) {
            case this.pItem1:
                pData = this.tStarRewardData[this.nIndex][0];
                this.nReward = 1;
                break;
            case this.pItem2:
                pData = this.tStarRewardData[this.nIndex][1];
                this.nReward = 2;
                break;
            case this.pItem3:
                pData = this.tStarRewardData[this.nIndex][2];
                this.nReward = 3;
                break;
        }
        var strIndex = "第" + this.nIndex + "关";
        var strLv = pData.star + "星";
        var bGet = GameGlobal.UserFb.getCbtStarReward(this.nIndex, this.nReward);
        var bHaveGet = false;
        if (this.nNowStar >= pData.star && (!bGet)) {
            bHaveGet = true;
        }
        WarnWin.showReward("|C:0x6E330B&T: \u901A\u5173\u85CF\u5B9D\u56FE\u7B2C|C:0x4fcd4c&T:" + strIndex + "|C:0x6E330B&T:\u83B7\u5F97|C:0x4fcd4c&T:" + strLv + "|C:0x6E330B&T:\u5956\u52B1|", this.getRewrd, this, null, null, "reward", { title: '通关奖励', reward: pData.starAward, btnName: "领取奖励", bHideSureBtn: !bHaveGet });
    };
    //领取宝箱奖励
    FbCbtPanel.prototype.getRewrd = function () {
        GameGlobal.UserFb.getCbtReward(this.nIndex, this.nReward);
    };
    FbCbtPanel.prototype.onClickGem = function (e) {
        var index = this.tGem.indexOf(e.currentTarget);
        this.nSelect = index - 1;
        this.UpdateContent();
    };
    FbCbtPanel.prototype.UpdateContent = function () {
        this.setData();
        //宝藏信息
        var nGenIndex = 0;
        for (var item in this.tGem) {
            var pGem = this.tGem[item];
            this.upDataGem(pGem, nGenIndex);
            nGenIndex = nGenIndex + 1;
        }
        //奖励信息
        for (var item in this.tReward) {
            this.upDateReward(this.tReward[item], parseInt(item));
        }
        //星数奖励
        for (var item in this.tItem) {
            this.upDateItem(this.tItem[item], parseInt(item));
        }
        this.updateInfo();
    };
    //更新界面信息
    FbCbtPanel.prototype.updateInfo = function () {
        var pData = this.getNowLvData();
        this.lbTitle.text = "藏宝图" + this.nIndex; //页数
        this.lbLv.text = "第" + pData.id + "关"; //关卡
        this.bar1.value = 0;
        this.bar2.value = 0;
        this.bar3.value = 0;
        //星数进度条
        if (this.tStarList.length >= 3) {
            if (this.nNowStar <= this.tStarList[0]) {
                this.bar1.value = (this.nNowStar / this.tStarList[0]) * 100;
            }
            else if (this.nNowStar <= this.tStarList[1]) {
                this.bar1.value = 100;
                var v = this.nNowStar;
                v -= this.tStarList[0];
                this.bar2.value = (v / (this.tStarList[1] - this.tStarList[0])) * 100;
            }
            else {
                this.bar1.value = 100;
                this.bar2.value = 100;
                var v = this.nNowStar;
                v = v - this.tStarList[1];
                this.bar3.value = (v / (this.tStarList[2] - this.tStarList[1])) * 100;
            }
        }
        this.lbVip.text = "vip" + GlobalConfig.ins().TreasureMapBaseConfig.viplevel + "开启";
        //困难模式
        // if (pData.dod === 2) {
        // 	this.btnHard.visible = true
        // }
        // else {
        // 	this.btnHard.visible = false
        // }
        //奖励预览
        var pReData;
        for (var item in this.tSpReward) {
            if (this.tSpReward[item].lv >= this.nNewLvNum) {
                pReData = this.tSpReward[item];
                break;
            }
        }
        if (pReData) {
            this.pGroupRewar.visible = true;
            this.itemBaee.setItemData(pReData.item);
            this.lbPassLvReward.text = pReData.caption;
        }
        else {
            this.pGroupRewar.visible = false;
        }
        this.showLeftArrow();
        this.showRightArrow();
    };
    //获取当前关卡数据
    FbCbtPanel.prototype.getNowLvData = function () {
        var pData;
        pData = this.tCbtData[this.nIndex - 1][this.nSelect];
        return pData;
    };
    //获取当前页奖励数据
    FbCbtPanel.prototype.getNowPageReward = function () {
        //获取星级相关数据
    };
    //_item 节点 _index 下标
    FbCbtPanel.prototype.upDataGem = function (_item, _index) {
        var pData = this.tCbtData[this.nIndex - 1][_index];
        this.nSelect === _index ? _item.imgSelect.visible = true : _item.imgSelect.visible = false;
        if (pData.star > 0) {
            _item.imgReward.source = "ui_fb_bm_baoxiang03";
        }
        else {
            _item.imgReward.source = "ui_fb_bm_baoxiang02";
        }
        _item.imgGet.visible = pData.todayNum > 0;
        switch (pData.star) {
            case 0:
                _item.imgStar1.filters = Color.GetFilter(); //变灰
                _item.imgStar2.filters = Color.GetFilter(); //变灰
                _item.imgStar3.filters = Color.GetFilter(); //变灰
                break;
            case 1:
                _item.imgStar1.filters = null;
                _item.imgStar2.filters = Color.GetFilter(); //变灰
                _item.imgStar3.filters = Color.GetFilter(); //变灰
                break;
            case 2:
                _item.imgStar1.filters = null;
                _item.imgStar2.filters = null;
                _item.imgStar3.filters = Color.GetFilter(); //变灰
                break;
            case 3:
                _item.imgStar1.filters = null;
                _item.imgStar2.filters = null;
                _item.imgStar3.filters = null;
                break;
        }
    };
    //_item 节点 _index 下标
    FbCbtPanel.prototype.upDateItem = function (_item, _index) {
        var pData = this.tStarRewardData[this.nIndex][_index];
        var nStar = pData.star || 1; //设置星数
        _item.lbStar.text = nStar;
        //记录星星列表
        this.tStarList.push(nStar);
        if (_index == 2) {
            this.nMaxStar = nStar; //记录星数
        }
        //红点
        if (this.nNowStar >= nStar) {
            _item.imgRed.visible = true;
        }
        else {
            _item.imgRed.visible = false;
        }
        //需要补充已经领取之后的逻辑 (this.nIndex 下标为1开始,_index下标为0开始 )
        var bGet = GameGlobal.UserFb.getCbtStarReward(this.nIndex, _index + 1);
        if (bGet) {
            _item.imgRed.visible = false;
            _item.imgGet.visible = true;
        }
        else {
            _item.imgGet.visible = false;
        }
    };
    //_item 节点 _index 下标
    FbCbtPanel.prototype.upDateReward = function (_item, _index) {
        var pData = this.getNowLvData();
        var tCtReward = [];
        if (_index === 0) {
            //已领取图片
            if (pData.star > 0) {
                _item.imgGet.visible = true;
            }
            else {
                _item.imgGet.visible = false;
            }
            //首通奖励
            tCtReward = pData.firstAwardSw;
        }
        else {
            _item.lbNe.text = "通关奖励";
            //已领取图片
            if (pData.todayNum > 0) {
                _item.imgGet.visible = true;
            }
            else {
                _item.imgGet.visible = false;
            }
            //通关奖励
            tCtReward = pData.dayAward;
        }
        _item.listView.dataProvider = new eui.ArrayCollection(tCtReward);
    };
    FbCbtPanel.prototype.onListViewClick = function (e) {
        // var pItem = e.item
        // ViewManager.ins().open(BuyWin,pItem)
    };
    FbCbtPanel.NAME = "藏宝图";
    return FbCbtPanel;
}(BaseView));
__reflect(FbCbtPanel.prototype, "FbCbtPanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=FbCbtPanel.js.map