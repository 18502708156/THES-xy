/**
 *
 * @Author: liangzhaowei
 * @Date: 2018/5/7 15:01
 * @meaning: 法宝打造详情
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
var TreasureMakePanel = (function (_super) {
    __extends(TreasureMakePanel, _super);
    /////////////////////////////////////////////////////////////////////////////
    function TreasureMakePanel() {
        var _this = _super.call(this) || this;
        _this.tPanelData = []; //界面总体数据数据
        _this.tMakeRect = []; //打造框数组
        _this.tHave = []; //持有列表
        _this.skinName = "TreasureMakePanelSkin";
        _this.listView.itemRenderer = TreasureHoldIcon;
        return _this;
    }
    TreasureMakePanel.prototype.childrenCreated = function () {
        this.tMakeRect.push(this.pMakeRect0);
        this.tMakeRect.push(this.pMakeRect1);
        //UIHelper.SetLinkStyleLabel(this.logo, "法宝图鉴")
    };
    TreasureMakePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        var nIndex = param[0] || 0;
        this.observe(MessageDef.TREASURE_CHANGE, this.UpdateContent); //法宝数据变化
        this.observe(MessageDef.ITEM_COUNT_CHANGE, this.UpdateContent); //物品变化的时候也刷新一下内容
        this.observe(MessageDef.TREASURE_LOCK, this.upList); //上锁变化
        this._AddClick(this.logo, this.onClick);
    };
    TreasureMakePanel.prototype.upList = function () {
        this.setData();
        this.listView.dataProvider.replaceAll(this.tHave);
    };
    TreasureMakePanel.prototype.UpdateContent = function () {
        this.setData();
        // (this.listView.dataProvider as eui.ArrayCollection).replaceAll(this.tHave);
        this.listView.dataProvider = new eui.ArrayCollection(this.tHave);
        //更新
        for (var i = 1; i <= 2; i++) {
            this.tMakeRect[i - 1].onUpdate(i);
        }
        //let strSkillLv =  `|C:0x682f00&T:累计20次完美打造,必出完美法宝|C:0xdb0000&T: (完美法宝有特技)|`
        var strSkillLv = "|C:0x682f00&T:\u7D2F\u8BA120\u6B21\u5B8C\u7F8E\u6253\u9020,\u5FC5\u51FA\u7EA2\u8272\u6CD5\u5B9D|C:0xdb0000&T: (\u7EA2\u8272\u6CD5\u5B9D\u968F\u673A\u4EA7\u51FA0-3\u4E2A\u6280\u80FD)|";
        this.lbAccount1.textFlow = TextFlowMaker.generateTextFlow(strSkillLv); //    skillLevel + "级"//技能等级
    };
    TreasureMakePanel.prototype.setData = function () {
        this.tHave = GameGlobal.TreasureModel.getHaveList();
    };
    TreasureMakePanel.prototype.onClick = function (e) {
        switch (e.target) {
            case this.logo:
                ViewManager.ins().open(TreasureShowWin);
                break;
        }
    };
    TreasureMakePanel.RedPointCheck = function () {
        return GameGlobal.TreasureModel.mRedPoint.Get(TreasureRedPoint.INDEX_MAKE_TREASURE);
    };
    TreasureMakePanel.NAME = "打造";
    return TreasureMakePanel;
}(BaseView));
__reflect(TreasureMakePanel.prototype, "TreasureMakePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=TreasureMakePanel.js.map