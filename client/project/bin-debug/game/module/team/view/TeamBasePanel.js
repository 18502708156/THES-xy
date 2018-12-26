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
var TeamBasePanel = (function (_super) {
    __extends(TeamBasePanel, _super);
    function TeamBasePanel() {
        var _this = _super.call(this) || this;
        _this.m_CurIndex = 0;
        _this.Listindex = 0;
        _this.isShowList = true;
        _this.skinName = "TeamBaseSkin";
        return _this;
    }
    TeamBasePanel.prototype.childrenCreated = function () {
        this.teamBaseMemberView.mModel = this.m_Model;
        this.teamCheckItemView.m_Model = this.m_Model;
        // this.teamBaseMemberView.mNotAutoJoint=true;
        // this._AddClick(this.btnPrev, this._OnClick)
        // this._AddClick(this.btnNext, this._OnClick)
        this._AddClick(this.teamCheckItemView, this._OnClick);
        // this.list1.itemRenderer = ItemBase;
        // this.list1.dataProvider = new eui.ArrayCollection([]);
        this.list2.itemRenderer = ItemBase;
        this.list2.dataProvider = new eui.ArrayCollection([]);
    };
    TeamBasePanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateContent);
        this.observe(MessageDef.UPDATE_TEAM_MYINFO, this.UpdateList);
        this.observe(MessageDef.TEAM_FUBEN_INFO, this.UpdateCurModel);
        this.InitInfo();
        this.teamBaseMemberView.DoOpen(null);
    };
    TeamBasePanel.prototype.OnClose = function () {
        this.teamBaseMemberView.DoClose();
    };
    TeamBasePanel.prototype.OnResume = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.teamBaseMemberView.OnResume();
        var curIndex = 0;
        var selKey = param[0] || null;
        if (!selKey) {
            if (this.m_Model.mTeamInfo.HasTeam()) {
                selKey = this.m_Model.mTeamInfo.level;
            }
            else {
                if (this.m_Model.mSelectKey) {
                    selKey = this.m_Model.mSelectKey;
                }
                if (!selKey) {
                    selKey = this.GetFirstShowKey();
                }
            }
        }
        if (selKey) {
            var i = 0;
            for (var _a = 0, _b = this.m_Model.GetConfig(); _a < _b.length; _a++) {
                var data = _b[_a];
                var configData = this.m_Model.GetConfigData(data);
                if (configData.GetKey() == selKey) {
                    curIndex = i;
                    break;
                }
                ++i;
            }
        }
        this.Listindex = curIndex;
        //if(this.m_Model.index!=-1)
        this.UpdateModel(curIndex);
    };
    TeamBasePanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            // case this.btnPrev:
            //     this.UpdateModel(this.m_CurIndex - 1)
            // break
            // case this.btnNext:
            //     this.UpdateModel(this.m_CurIndex + 1)
            // break 
            case this.teamCheckItemView:
                this.UpdateModel(this.m_Model.index);
                break;
        }
    };
    TeamBasePanel.prototype.UpdateCurModel = function () {
        this.UpdateModel(this.m_CurIndex);
    };
    TeamBasePanel.prototype.UpdateList = function () {
        this.teamCheckItemView.showCheckItemList(this.Listindex);
    };
    TeamBasePanel.prototype.UpdateModel = function (index) {
        var configList = this.m_Model.GetConfig();
        //
        this.teamCheckItemView.index = this.m_CurIndex;
        var configData = this.m_Model.GetConfigData(configList[index]);
        if (!configData) {
            return;
        }
        this.m_CurIndex = index;
        // if(this.isShowList==true)
        // {
        // 	this.teamCheckItemView.showCheckItemList(this.m_Model,index)
        // 	this.isShowList=false;
        // }
        // if (this.m_Model.IsFirst(configData.GetKey())) {
        // 	this.title1Label.text = "首通奖励"
        // 	this.list1.dataProvider = new eui.ArrayCollection(configData.GetFirstDropShow())
        // } else {
        // 	this.title1Label.text = "通关奖励"
        // 	this.list1.dataProvider = new eui.ArrayCollection(configData.GetDropShow())
        // }
        this.list2.dataProvider = new eui.ArrayCollection(configData.GetShowItem());
        var suggest = configData.GetSuggest();
        if (suggest) {
            this.power_label.text = suggest + "";
        }
        else {
            this.powerGroup.visible = false;
        }
        var bossId = configData.GetBossId();
        // this.petShowPanel.SetBodyId(MonstersConfig.GetAppId(bossId))
        // this.lbName.text = configData.GetUititle()//MonstersConfig.GetName(bossId)
        if (this.m_Model.mTeamInfo.HasTeam() == false) {
            this.lbAlert.text = configData.GetUititle();
        }
        var hasTeam = this.m_Model.mTeamInfo.HasTeam();
        var notEnter = this.m_Model.IsNotEnter(configData.GetKey()); // this.IsNotEnter(configData.GetKey())
        var showTeam = hasTeam || !notEnter;
        // this.teamInfoGroup.visible = showTeam
        this.teamBaseMemberView.visible = showTeam;
        if (this.noneInfoLabel.visible = !showTeam) {
            this.noneInfoLabel.text = notEnter;
        }
        // this.btnPrev.enabled = configList[index - 1] ? true : false
        // if (configList[index + 1])	{
        // 	this.btnNext.enabled = notEnter ? false : true
        // } else {
        // 	this.btnNext.enabled = false
        // }
        var data = this.m_Model.GetConfig()[this.m_CurIndex];
        this.teamBaseMemberView.UpdateKey(this.m_Model.GetConfigData(data).GetKey());
    };
    TeamBasePanel.prototype.UpdateContent = function () {
    };
    // protected IsNotEnter(id: number): string {
    // 	return ""
    // }
    TeamBasePanel.prototype.InitInfo = function () {
    };
    TeamBasePanel.prototype.GetFirstShowKey = function () {
        return null;
    };
    return TeamBasePanel;
}(BaseView));
__reflect(TeamBasePanel.prototype, "TeamBasePanel", ["ICommonWindowTitle"]);
//# sourceMappingURL=TeamBasePanel.js.map