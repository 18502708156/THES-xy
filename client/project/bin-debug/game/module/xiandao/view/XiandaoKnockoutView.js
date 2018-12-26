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
var XiandaoKnockoutView = (function (_super) {
    __extends(XiandaoKnockoutView, _super);
    function XiandaoKnockoutView() {
        var _this = _super.call(this) || this;
        _this.headList = [];
        // 8强，4强，2强，冠军
        _this.groupList = [];
        _this.skinName = "XiandaoKnockoutSkin";
        UIHelper.SetLinkStyleLabel(_this.goLabel);
        for (var i = 0; i <= 3; i++) {
            _this.groupList.push([]);
        }
        _this.GetGroup(_this.group, 3);
        for (var _i = 0, _a = _this.groupList; _i < _a.length; _i++) {
            var list1 = _a[_i];
            for (var i = 0; i < list1.length; i++) {
                list1[i].index = i;
            }
        }
        _this.GetHeadComps(_this.headGroup);
        return _this;
    }
    XiandaoKnockoutView.prototype.OnOpen = function () {
        this.myTimeGroup.visible = false;
        this.observe(MessageDef.XIANDAO_UPDATE, this.UpdateContent);
        this.AddClick(this.goLabel, this.OnClick);
        this.UpdateHeadList();
        this.UpdateContent();
    };
    XiandaoKnockoutView.prototype.OnClick = function (e) {
        switch (e.currentTarget) {
            case this.goLabel:
                if (GameGlobal.XiandaoModel.mMyTime && GameGlobal.XiandaoModel.mMyTime.ret) {
                    if (UserFb.CheckFighting()) {
                        GameGlobal.XiandaoModel.SendEnterKnockout();
                    }
                }
                break;
        }
    };
    XiandaoKnockoutView.prototype.UpdateRankType = function () {
        this.rankLabel.text = GameGlobal.XiandaoModel.GetGroupTypeStr();
        this.rankTypeLabel.text = XiandaoKnockoutView.RANK_PRO_STR[GameGlobal.XiandaoModel.GetKnockoutId()];
        this.startTimeLabel.text = "（晚上21点进行）";
    };
    XiandaoKnockoutView.prototype.UpdateMyTime = function () {
        var timeData = GameGlobal.XiandaoModel.mMyTime;
        if (!timeData || !timeData.ret) {
            this.myTimeGroup.visible = false;
            TimerManager.ins().remove(this.UpdateTime, this);
            return;
        }
        if (!this.myTimeGroup.visible) {
            this.myTimeGroup.visible = true;
            this.AddTimer(1000, 0, this.UpdateTime);
        }
    };
    XiandaoKnockoutView.prototype.UpdateTime = function () {
        if (GameGlobal.XiandaoModel.mMyTime) {
            this.nextTime.text = DateUtils.format_5(Math.max(GameGlobal.XiandaoModel.mMyTime.timeout - GameServer.serverTime, 0) * 1000, 3);
        }
        else {
            this.nextTime.text = "";
        }
    };
    XiandaoKnockoutView.prototype.UpdateContent = function () {
        this.UpdateRankType();
        this.UpdateMyTime();
        var data = GameGlobal.XiandaoModel.GetKnockoutData();
        var turnList = data.turnDatas;
        for (var i = 0; i < this.groupList.length; i++) {
            for (var _i = 0, _a = this.groupList[i]; _i < _a.length; _i++) {
                var data_1 = _a[_i];
                data_1.SetEmpty();
            }
        }
        var knockoutId = GameGlobal.XiandaoModel.GetKnockoutId();
        for (var i = 0, len = knockoutId; i <= len; i++) {
            var list = this.groupList[i];
            var turnDataList = turnList[i];
            if (!turnDataList) {
                continue;
            }
            var type = void 0;
            if (i == len) {
                if (GameGlobal.XiandaoModel.IsGame()) {
                    type = 1;
                }
                else {
                    type = 2;
                }
            }
            else {
                type = 3;
            }
            var j = 0;
            for (var _b = 0, list_1 = list; _b < list_1.length; _b++) {
                var data_2 = list_1[_b];
                var turnData = turnDataList[j];
                if (turnData) {
                    data_2.SetType(type, turnData.winPart);
                }
                ++j;
            }
        }
        var roleIds = data ? (data.roleNoList || []) : [];
        var groupListRole = this.groupList[0];
        for (var i = 0; i < 8; i++) {
            var index = i * 2;
            var data1 = roleIds[index];
            var data2 = roleIds[index + 1];
            groupListRole[i].noA = data1;
            groupListRole[i].noB = data2;
        }
        if (GameGlobal.XiandaoModel.GetKnockoutId() == 3) {
            this.unHead1.visible = false;
            this.unHead2.visible = false;
            var turnDataList = turnList[3][0];
            if (turnDataList) {
                var role1 = GameGlobal.XiandaoModel.GetRoleData(turnDataList.noA);
                var role2 = GameGlobal.XiandaoModel.GetRoleData(turnDataList.noB);
                if (role1) {
                    UIHelper.SetHead(this.head1, role1.shows.job, role1.shows.sex);
                }
                if (role2) {
                    UIHelper.SetHead(this.head2, role2.shows.job, role2.shows.sex);
                }
            }
        }
        else {
            this.unHead1.visible = true;
            this.unHead2.visible = true;
        }
    };
    XiandaoKnockoutView.prototype.UpdateHeadList = function () {
        var data = GameGlobal.XiandaoModel.GetKnockoutData();
        var roleIds = data ? (data.roleNoList || []) : [];
        for (var i = 0, len = this.headList.length; i < len; i++) {
            var head = this.headList[i];
            var roleId = roleIds[i];
            var data_3 = GameGlobal.XiandaoModel.GetRoleData(roleId);
            if (data_3) {
                UIHelper.SetHead(head.head, data_3.shows.job, data_3.shows.sex);
                head.nameLabel.text = GameString.GetSerAndName(data_3.serverId, data_3.roleName);
            }
            else {
                UIHelper.SetHead(head.head, null, null);
                head.nameLabel.text = "暂无";
            }
        }
    };
    XiandaoKnockoutView.prototype.GetHeadComps = function (group) {
        for (var i = 0; i < group.numChildren; i++) {
            var child = group.getChildAt(i);
            if (egret.is(child, "eui.Group")) {
                this.GetHeadComps(child);
            }
            else {
                this.headList.push(child);
            }
        }
    };
    XiandaoKnockoutView.prototype.GetGroup = function (group, turnId) {
        if (!group || turnId < 0) {
            return;
        }
        var upline = group.getChildByName("upLine");
        var downline = group.getChildByName("downLine");
        var video = group.getChildByName("video");
        var ya = group.getChildByName("ya");
        var up = this.GetGroup(upline, turnId - 1);
        var down = this.GetGroup(downline, turnId - 1);
        if (upline && downline) {
            var item = new XiandaoKnockoutItem;
            item.turnId = turnId;
            item.upLine = upline;
            item.downLine = downline;
            item.video = video;
            if (video) {
                video.itemData = item;
            }
            item.yaBtn = ya;
            if (ya) {
                ya.itemData = item;
            }
            this._AddClick(video, this._OnClickVideo);
            this._AddClick(ya, this._OnClickYa);
            item.Init();
            this.groupList[turnId].push(item);
        }
    };
    XiandaoKnockoutView.prototype._OnClickYa = function (e) {
        var data = e.currentTarget.itemData;
        ViewManager.ins().open(XiandaoBetPanel, data.turnId, data.index);
    };
    XiandaoKnockoutView.prototype._OnClickVideo = function (e) {
        var data = e.currentTarget.itemData;
        ViewManager.ins().open(XiandaoVideoPanel, data.turnId, data.index);
    };
    /////////////////////////////////////////////////////////////////////////////
    XiandaoKnockoutView.RANK_TYPE_STR = (_a = {},
        _a[1] = "帝王榜",
        _a[2] = "神道榜",
        _a[3] = "守护榜",
        _a[4] = "地界榜",
        _a);
    XiandaoKnockoutView.RANK_PRO_STR = (_b = {},
        _b[0] = "16进8强赛",
        _b[1] = "8进4强赛",
        _b[2] = "4进2强赛",
        _b[3] = "决赛",
        _b);
    return XiandaoKnockoutView;
}(BaseView));
__reflect(XiandaoKnockoutView.prototype, "XiandaoKnockoutView", ["ICommonWindowTitle"]);
var XiandaoKnockoutItem = (function () {
    function XiandaoKnockoutItem() {
        this.img1 = [];
        this.img2 = [];
    }
    XiandaoKnockoutItem.prototype.GetImg = function (g) {
        if (!g) {
            return [];
        }
        var list = [];
        for (var i = 0; i < g.numChildren; i++) {
            var child = g.getChildAt(i);
            if (egret.is(child, "eui.Image")) {
                list.push(child);
            }
        }
        return list;
    };
    XiandaoKnockoutItem.prototype.Init = function () {
        this.SetEmpty();
        this.img1 = this.GetImg(this.upLine);
        this.img2 = this.GetImg(this.downLine);
    };
    XiandaoKnockoutItem.prototype.SetVis = function (list, vis) {
        for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
            var data = list_2[_i];
            [
                data.visible = vis
            ];
        }
    };
    XiandaoKnockoutItem.prototype.SetWin = function (winState) {
        this.SetVis(this.img1, winState == 1);
        this.SetVis(this.img2, winState == 2);
        if (this.video) {
            this.video.visible = true;
        }
        if (this.yaBtn) {
            this.yaBtn.visible = false;
        }
    };
    XiandaoKnockoutItem.prototype.SetEmpty = function () {
        this.SetVis(this.img1, false);
        this.SetVis(this.img2, false);
        if (this.video) {
            this.video.visible = false;
        }
        if (this.yaBtn) {
            this.yaBtn.visible = false;
        }
    };
    /**
     * 1、比赛
     * 2、未开始
     * 3、结束
     */
    XiandaoKnockoutItem.prototype.SetType = function (type, args) {
        if (args === void 0) { args = null; }
        if (type == 3) {
            this.SetVis(this.img1, args == 1);
            this.SetVis(this.img2, args == 2);
        }
        else {
            this.SetVis(this.img1, false);
            this.SetVis(this.img2, false);
        }
        if (this.video) {
            this.video.visible = type != 2;
        }
        if (this.yaBtn) {
            if (this.yaBtn.visible = type == 2) {
                this.yaBtn.iconDisplay.filters = GameGlobal.XiandaoModel.GetBetData(this.index) ? Color.GetFilter() : null;
            }
        }
    };
    return XiandaoKnockoutItem;
}());
__reflect(XiandaoKnockoutItem.prototype, "XiandaoKnockoutItem");
var _a, _b;
//# sourceMappingURL=XiandaoKnockoutView.js.map