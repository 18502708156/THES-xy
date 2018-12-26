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
 * 师门任务-领取任务界面
 */
var DailyFomalhautTaskPanel = (function (_super) {
    __extends(DailyFomalhautTaskPanel, _super);
    function DailyFomalhautTaskPanel() {
        var _this = _super.call(this) || this;
        _this.index = 0;
        _this.id = 1;
        _this.skinName = "DailyFomalhautTaskSkin";
        _this.dailyExpDungeonStarTab = GameGlobal.Config.DailyExpDungeonStar;
        return _this;
    }
    // 引导对象
    DailyFomalhautTaskPanel.prototype.GetGuideTarget = function () {
        return _a = {},
            _a[1] = this.challengeBtn,
            _a;
        var _a;
    };
    DailyFomalhautTaskPanel.prototype.childrenCreated = function () {
        this.itemList.itemRenderer = ItemBase;
        this.itemList.dataProvider = new eui.ArrayCollection([]);
        this._AddClick(this.addBtn, this._OnClick);
        this._AddClick(this.challengeBtn, this._OnClick);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.GetStar);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateItemList);
        this.observe(MessageDef.DAILY_FOMALHAUT_MONSTERID, this.updateMonster);
    };
    DailyFomalhautTaskPanel.prototype.OnOpen = function (index) {
        this.index = index;
        this.id = GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyExpDungeonStarTab[this.id].reward);
        this.commonWindowBg.OnAdded(this);
        this.commonWindowBg.SetTitle("师门任务");
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(this.dailyExpDungeonStarTab[this.id].showid)); //显示怪物
        //位置
        var name = this.GetPosName();
        this.positionLaber.text = name;
        this.GetStar();
        if (this.dailyExpDungeonStarTab[this.id].star < 7)
            this.refreshcost = this.dailyExpDungeonStarTab[this.id].refreshcost[0];
    };
    DailyFomalhautTaskPanel.prototype.UpdateContent = function () {
    };
    DailyFomalhautTaskPanel.prototype._OnClick = function (e) {
        var _this = this;
        switch (e.currentTarget) {
            case this.addBtn:
                if (this.dailyExpDungeonStarTab[this.id].star < 7) {
                    WarnWin.show("是否花费" + this.refreshcost.count + "绑元提升到满星？", function () {
                        if (Checker.Money(_this.refreshcost.id, _this.refreshcost.count) == true) {
                            GameGlobal.DailyModel.SendUpStar(_this.index + 1);
                        }
                    }, this);
                }
                else {
                    UserTips.ins().showTips("无法继续升星");
                }
                break;
            case this.challengeBtn:
                if (UserFb.CheckFighting())
                    GameGlobal.DailyModel.SendKoMonster(this.index + 1);
                break;
        }
    };
    DailyFomalhautTaskPanel.prototype.OnClose = function () {
        this.commonWindowBg.OnRemoved();
    };
    /**获取章节名字 */
    DailyFomalhautTaskPanel.prototype.GetPosName = function () {
        var name = "";
        var userFb = GameGlobal.UserFb;
        userFb.chapterId;
        var id = GameGlobal.Config.ChaptersRewardConfig[userFb.chapterId].mapid;
        name = GameGlobal.Config.ChaptersMapConfig[id].name;
        return name;
    };
    /**获得回合数 */
    DailyFomalhautTaskPanel.prototype.Getround = function (id) {
        var tround = 0;
        var fbid = GameGlobal.Config.ChaptersRewardConfig[id].dungeon;
        tround = GameGlobal.Config.ChaptersRewardConfig[fbid].totalTime;
        return tround;
    };
    //星星
    DailyFomalhautTaskPanel.prototype.GetStar = function () {
        this.id = GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        var starCount = this.dailyExpDungeonStarTab[this.id].star;
        for (var i = 0; i < this.starGroup.numChildren; i++) {
            var item = this.starGroup.getChildAt(i);
            item.source = starCount > i ? "ui_bm_star022" : "ui_bm_star021";
        }
    };
    //刷新道具
    DailyFomalhautTaskPanel.prototype.updateItemList = function () {
        //this.monsterInfo.monsterList[0]
        var monsterIndex = GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.itemList.dataProvider = new eui.ArrayCollection(this.dailyExpDungeonStarTab[monsterIndex].reward);
    };
    //刷新怪物
    DailyFomalhautTaskPanel.prototype.updateMonster = function () {
        this.id = GameGlobal.DailyModel.monsterInfo.monsterList[this.index];
        this.extraPanel.SetBodyId(MonstersConfig.GetAppId(this.dailyExpDungeonStarTab[this.id].showid)); //显示怪物
    };
    //SkinName
    //
    //DailyFomalhautTaskSkin.exml
    //
    DailyFomalhautTaskPanel.LAYER_LEVEL = LayerManager.UI_Main;
    return DailyFomalhautTaskPanel;
}(BaseEuiView));
__reflect(DailyFomalhautTaskPanel.prototype, "DailyFomalhautTaskPanel", ["ICommonWindow"]);
//# sourceMappingURL=DailyFomalhautTaskPanel.js.map