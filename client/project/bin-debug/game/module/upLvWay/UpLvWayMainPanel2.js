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
var UpLvWayMainPanel2 = (function (_super) {
    __extends(UpLvWayMainPanel2, _super);
    function UpLvWayMainPanel2() {
        var _this = _super.call(this) || this;
        _this.Type = 0;
        //盒子数量
        _this.boxCount = 4;
        _this.TabID = 0;
        _this.effArr = [];
        _this.skinName = "UpLvWayViewSkin";
        _this.MethodConfig = GameGlobal.Config.BianQiangMethodConfig;
        _this.BaseConfig = GameGlobal.Config.BianQiangBaseConfig;
        _this.RewardConfig = GameGlobal.Config.BianQiangRewardConfig;
        _this._AddClick(_this.item0, _this._onclick);
        _this._AddClick(_this.item1, _this._onclick);
        _this._AddClick(_this.item2, _this._onclick);
        _this._AddClick(_this.item3, _this._onclick);
        return _this;
    }
    UpLvWayMainPanel2.prototype.UpdateContent = function () {
    };
    UpLvWayMainPanel2.prototype.childrenCreated = function () {
        this.list.itemRenderer = UpLvWayItem;
        this.list.dataProvider = new eui.ArrayCollection([]);
        this.itemEffShow();
    };
    UpLvWayMainPanel2.prototype.OnOpen = function () {
        this.rewardBar.slideDuration = 0;
        // GameGlobal.BossModel.sendCallVipBossList()
        // GameGlobal.BossModel.sendCallFieldBossList()
        // this.observe(MessageDef.PUBLIC_BOSS_UPDATE, this.UpdateList)
        // this.observe(MessageDef.VIP_BOSS_UPDATE, this.UpdateList)
        this.observe(MessageDef.UPLVWAY_ACQUIRE_ITEM, this.changeBar);
        var list = [];
        list = this.tabConfigList(this.MethodConfig);
        this.list.dataProvider = new eui.ArrayCollection(list);
        for (var i = 0; i < this.boxCount; i++) {
            //this["receiveImg"+i].visible=false;
            this["item" + i].setItemData(this.RewardConfig[i + 1].rewards[0]);
        }
        this.changeBar();
        //this.updateScore();
        this.isShowEff();
    };
    UpLvWayMainPanel2.prototype._onclick = function (e) {
        switch (e.currentTarget) {
            case this.item0:
                this.TabID = 1;
                if (GameGlobal.UpLvWayModel.score >= this.RewardConfig[this.TabID].points) {
                    if (this.effArr[0] != undefined) {
                        this.effArr[0].visible = false;
                        this["group" + 0].removeChild(this.effArr[0]);
                        this.effArr[0] = null;
                    }
                    GameGlobal.UpLvWayModel._Reward(this.TabID);
                }
                break;
            case this.item1:
                this.TabID = 2;
                if (GameGlobal.UpLvWayModel.score >= this.RewardConfig[this.TabID].points) {
                    if (this.effArr[1] != undefined) {
                        this.effArr[1].visible = false;
                        this["group" + 1].removeChild(this.effArr[1]);
                        this.effArr[1] = null;
                    }
                    GameGlobal.UpLvWayModel._Reward(this.TabID);
                }
                break;
            case this.item2:
                this.TabID = 3;
                if (GameGlobal.UpLvWayModel.score >= this.RewardConfig[this.TabID].points) {
                    if (this.effArr[2] != undefined) {
                        this.effArr[2].visible = false;
                        this["group" + 2].removeChild(this.effArr[2]);
                        this.effArr[2] = null;
                    }
                    GameGlobal.UpLvWayModel._Reward(this.TabID);
                }
                break;
            case this.item3:
                this.TabID = 4;
                if (GameGlobal.UpLvWayModel.score >= this.RewardConfig[this.TabID].points) {
                    if (this.effArr[3] != undefined) {
                        this.effArr[3].visible = false;
                        this["group" + 3].removeChild(this.effArr[3]);
                        this.effArr[3] = null;
                    }
                    GameGlobal.UpLvWayModel._Reward(this.TabID);
                }
                break;
        }
    };
    //设置进度条
    UpLvWayMainPanel2.prototype.changeBar = function () {
        this.rewardBar.maximum = this.BaseConfig.maxvalue;
        var score = GameGlobal.UpLvWayModel.score;
        this.rewardBar.value = score;
        for (var i = 1; i <= this.boxCount; i++) {
            var img = this["img0" + i];
            if (img) {
                img.source = score >= (i * 25) ? "ui_fb_bm_xiaodian01" : "ui_fb_bm_xiaodian02";
            }
        }
        for (var i = 0; i < this.boxCount; i++) {
            this["receiveImg" + i].visible = false;
            // if(GameGlobal.UpLvWayModel.rewards[i]!=undefined)
            // {
            // 	if(GameGlobal.UpLvWayModel.rewards[i]==i+1)
            // 	{
            // 		this["receiveImg"+i].visible=true;
            // 	}
            // }
            if (GameGlobal.UpLvWayModel.rewards.indexOf(i + 1) != -1) {
                this["receiveImg" + i].visible = true;
            }
        }
        this.updateScore();
    };
    //积分
    UpLvWayMainPanel2.prototype.updateScore = function () {
        this.scoreLabel.text = GameGlobal.UpLvWayModel.score.toString();
    };
    //获取列表
    UpLvWayMainPanel2.prototype.tabConfigList = function (tab) {
        var list = [];
        var arr = [];
        for (var key in tab) {
            if (this.Type == tab[key].type) {
                var openid = tab[key].openid;
                if (Deblocking.Check(openid, true))
                    arr.push(tab[key]);
            }
        }
        return arr;
    };
    //展示道具特效
    UpLvWayMainPanel2.prototype.itemEffShow = function () {
        // let score=GameGlobal.UpLvWayModel.score;
        for (var i = this.boxCount; i > 0; i--) {
            // if(score>=this.RewardConfig[i].points && GameGlobal.UpLvWayModel.rewards.indexOf(i)==-1)
            // {
            var itemNum = i - 1;
            var eff = this.showEff(this["item" + itemNum], itemNum);
            // this.effArr.push(eff);
            //break;
            // }
        }
    };
    // private eff:MovieClip;
    UpLvWayMainPanel2.prototype.showEff = function (item, itemNum) {
        // if(!this.eff)
        var eff = new MovieClip;
        eff.loadUrl(ResDataPath.GetUIEffePath2("eff_ui_jlui_005"), true, 0);
        // this.eff.x = item.x-27;
        // this.eff.y = item.y+113;
        eff.x = item.x + 40;
        eff.y = item.y + 38;
        eff.scaleX = 1.2;
        eff.scaleY = 1.2;
        //this["group"+itemNum].addChild(eff);
        eff.visible = false;
        this.effArr.push(eff);
        return eff;
    };
    UpLvWayMainPanel2.prototype.isShowEff = function () {
        for (var i = this.boxCount; i > 0; i--) {
            // if(GameGlobal.UpLvWayModel.rewards.indexOf(i)!=-1)
            // {
            // if(this.effArr[i-1]!=undefined)
            // {
            // 	this.effArr[i-1].visible=false;
            // }
            // }
            var score = GameGlobal.UpLvWayModel.score;
            if (score >= this.RewardConfig[i].points && GameGlobal.UpLvWayModel.rewards.indexOf(i) == -1) {
                if (this.effArr[i - 1] != undefined) {
                    var num = i - 1;
                    this.effArr[num].visible = true;
                    this["group" + num].addChild(this.effArr[num]);
                }
            }
            else {
                if (this.effArr[i - 1] != undefined)
                    this.effArr[i - 1].visible = false;
            }
        }
    };
    UpLvWayMainPanel2.prototype.UpdateList = function () {
        UIHelper.ListRefresh(this.list);
    };
    return UpLvWayMainPanel2;
}(BaseView));
__reflect(UpLvWayMainPanel2.prototype, "UpLvWayMainPanel2", ["ICommonWindowTitle"]);
var X1Panel = (function (_super) {
    __extends(X1Panel, _super);
    function X1Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 0;
        return _this;
    }
    X1Panel.NAME = "我要变强";
    return X1Panel;
}(UpLvWayMainPanel2));
__reflect(X1Panel.prototype, "X1Panel");
var X2Panel = (function (_super) {
    __extends(X2Panel, _super);
    function X2Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 0;
        return _this;
    }
    X2Panel.NAME = "我要升级";
    return X2Panel;
}(UpLvWayMainPanel2));
__reflect(X2Panel.prototype, "X2Panel");
var X3Panel = (function (_super) {
    __extends(X3Panel, _super);
    function X3Panel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.Type = 0;
        return _this;
    }
    X3Panel.NAME = "我要材料";
    return X3Panel;
}(UpLvWayMainPanel2));
__reflect(X3Panel.prototype, "X3Panel");
//# sourceMappingURL=UpLvWayMainPanel2.js.map