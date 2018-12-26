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
 * 组队_ 选择关卡列表 Com
 */
var TeamItemCom = (function (_super) {
    __extends(TeamItemCom, _super);
    function TeamItemCom() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TeamItemCom.prototype.childrenCreated = function () {
    };
    TeamItemCom.prototype.dataChanged = function () {
        var data = this.data;
        if (data != undefined) {
            // this.title.text = data.name;
            this.itemList.itemRenderer = ItemBase;
            this.m_Model = data.model;
            var index = data.index;
            this.itemList.dataProvider = new eui.ArrayCollection([]);
            var configList = this.m_Model.GetConfig();
            var configData2 = this.m_Model.GetConfigData(configList[index]);
            if (!configData2) {
                return;
            }
            this.notAdoptLabel.visible = false;
            this.recordLabel.visible = true;
            var bossId = configData2.GetBossId();
            this.extraPanel.SetBodyId(MonstersConfig.GetAppId(bossId));
            this.title.text = configData2.GetUititle();
            var notEnter = this.m_Model.IsNotEnter(configData2.GetKey());
            this.notAdoptLabel.text = notEnter;
            if (this.m_Model.IsFirst(configData2.GetKey())) {
                this.recordLabel.text = "首通奖励";
                this.itemList.dataProvider = new eui.ArrayCollection(configData2.GetFirstDropShow());
            }
            else {
                this.recordLabel.text = "通关奖励";
                this.itemList.dataProvider = new eui.ArrayCollection(configData2.GetDropShow());
            }
            if (this.notAdoptLabel.text != "") {
                this.notAdoptLabel.visible = true;
                this.recordLabel.visible = false;
            }
        }
    };
    TeamItemCom.prototype.IsNotEnter = function (id) {
        // let config;
        // //if(id>999)
        // if(GameGlobal.Config.GuildFubenConfig[id]!=undefined)
        // {
        // 	config = GameGlobal.Config.GuildFubenConfig[id]
        // 	if (!config) {
        // 		return ""
        // 	}
        // 	if (GameGlobal.GangModel.myGangInfo.mLevel < config.needlv) {
        // 		return "帮会等级"+"\n"+"达到" + config.needlv + "级开启"
        // 	}
        // }
        // else
        // {
        // 	let level=id;
        // 	config = GameGlobal.Config.CrossTeamFbConfig[level]
        // 	if (!config) {
        // 		return ""
        // 	}
        // 	if (GameGlobal.actorModel.level < config.level) {
        // 		return "等级达到"+"\n" + config.level + "级开启"
        // 	}
        // }
        return "";
    };
    return TeamItemCom;
}(eui.ItemRenderer));
__reflect(TeamItemCom.prototype, "TeamItemCom");
//# sourceMappingURL=TeamItemCom.js.map