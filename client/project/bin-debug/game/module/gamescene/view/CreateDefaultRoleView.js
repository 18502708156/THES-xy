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
var CreateDefaultRoleView = (function (_super) {
    __extends(CreateDefaultRoleView, _super);
    function CreateDefaultRoleView() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.timeNum = 60;
        _this.m_RoleImg = [
            ["ui_cjjs_bm_juese", "ui_cjjs_bm_nvjuese"],
            ["ui_cjjs_xianzhu_nan", "ui_cjjs_xianzhu_nv"],
            ["ui_cjjs_mozhu_nan", "ui_cjjs_mozhu_nv"],
        ];
        _this.m_CurImgIndex = 1;
        _this.m_Index = -1;
        _this.m_Job = 1;
        _this.m_Sex = 0;
        _this.m_IsRandom = true;
        _this.mSelImg = [];
        _this.m_Count = 0;
        _this.m_TexList = [];
        _this.skinName = "CreateRolSkin";
        _this.nameLabel.type = egret.TextFieldType.INPUT;
        _this.nameLabel.addEventListener(egret.TouchEvent.FOCUS_IN, _this._DoFocus, _this);
        _this.sel1.visible = true;
        _this.sel2.visible = false;
        _this.m_Job = 1;
        _this.m_Sex = 0;
        return _this;
    }
    CreateDefaultRoleView.prototype._DoFocus = function () {
        this.m_IsRandom = false;
    };
    CreateDefaultRoleView.prototype.OnOpen = function () {
        this.AddClick(this.leftBtn, this.OnClick);
        this.AddClick(this.rightBtn, this.OnClick);
        this.AddClick(this.sex1, this.OnClick);
        this.AddClick(this.sex2, this.OnClick);
        this.AddClick(this.randomName, this.OnClick);
        this.AddClick(this.gotBtn, this.OnClick);
        for (var i = 0; i < this.selGroup.numChildren; ++i) {
            this.AddClick(this.selGroup.getChildAt(i), this.OnSelect);
        }
        this.mSelImg = this.selGroupImg.$children;
        this.Select(1);
        this.AddTimer(1000, 0, this.timeShow);
        var list = ["_ui_xzjs_h1", "_ui_xzjs_h2", "_ui_xzjs_h3", , "_ui_xzjs_h4"];
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var t = list_1[_i];
            RES.getResAsync(t, this._Load, this);
        }
    };
    CreateDefaultRoleView.prototype._Load = function (obj) {
        if (!this.m_TexList) {
            return;
        }
        if (obj) {
            this.m_TexList.push(obj);
        }
        if (++this.m_Count >= 4) {
            WeatherFactory.getFlower().playWeather(this.m_TexList);
        }
    };
    CreateDefaultRoleView.prototype.timeShow = function () {
        if (this.timeNum == 0) {
            TimerManager.ins().remove(this.timeShow, this);
            var name_1 = this.nameLabel.text;
            if (name_1 == null || name_1 == "") {
                alert("名称不能为空");
                return;
            }
            RoleMgr.ins().sendCreateRole(name_1, this.GetSex(), this.GetJob());
            this.time.text = "";
            return;
        }
        this.time.text = this.timeNum + "s后自动进入服务器";
        this.timeNum--;
    };
    CreateDefaultRoleView.prototype.OnClose = function () {
        WeatherFactory.getFlower().stopWeather();
        this.removeObserve();
        this.removeEvents();
        TimerManager.ins().removeAll(this);
        this.m_TexList = null;
    };
    CreateDefaultRoleView.prototype.OnSelect = function (e) {
        this.Select(this.selGroup.getChildIndex(e.target));
    };
    CreateDefaultRoleView.prototype.Select = function (index) {
        this.m_Job = index + 1;
        this.UpdateSel();
    };
    CreateDefaultRoleView.prototype.UpdateSel = function () {
        var oldIndex = this.m_Index;
        this.m_Index = (this.m_Job - 1) * 2 + this.m_Sex;
        var jobIndex = this.m_Job - 1;
        for (var i = 0; i < this.mSelImg.length; i++) {
            this.mSelImg[i].visible = i == jobIndex;
        }
        this.sel1.visible = this.m_Sex == 0;
        this.sel2.visible = this.m_Sex == 1;
        var curImg = this["roleImg" + this.m_CurImgIndex];
        var curGroup = this["roleGroup" + this.m_CurImgIndex];
        if (oldIndex != this.m_Index) {
            var isRight = this.m_Index > oldIndex ? -1 : 1;
            var pos = 600;
            egret.Tween.removeTweens(curGroup);
            egret.Tween.get(curGroup).to({
                x: isRight * pos,
                alpha: 0
            }, 350, egret.Ease.circOut);
            this.m_CurImgIndex = (this.m_CurImgIndex + 1) % 2;
            var nextImg = this["roleImg" + this.m_CurImgIndex];
            var nextGroup = this["roleGroup" + this.m_CurImgIndex];
            nextImg.source = this.m_RoleImg[this.m_Job - 1][this.m_Sex];
            nextGroup.x = -1 * isRight * pos;
            nextGroup.alpha = 0;
            egret.Tween.removeTweens(nextGroup);
            egret.Tween.get(nextGroup).wait(150).to({
                x: 0,
                alpha: 1,
            }, 350, egret.Ease.circOut);
            if (this.m_IsRandom) {
                this.GetRandomName();
            }
        }
    };
    CreateDefaultRoleView.prototype.GetSex = function () {
        return this.m_Sex;
    };
    CreateDefaultRoleView.prototype.GetJob = function () {
        return this.m_Job;
    };
    CreateDefaultRoleView.prototype.doRandom = function (rsp) {
        if (rsp.result == 0) {
            this.nameLabel.text = rsp.actorname;
        }
    };
    CreateDefaultRoleView.prototype.GetRandomName = function () {
        var RandName = new Sproto.RandName_request();
        RandName.sex = this.GetSex();
        GameSocket.ins().Rpc(C2sProtocol.RandName, RandName, this.doRandom, this);
    };
    CreateDefaultRoleView.prototype.OnClick = function (e) {
        switch (e.currentTarget) {
            case this.sex1:
                this.m_Sex = 0;
                this.UpdateSel();
                break;
            case this.sex2:
                this.m_Sex = 1;
                this.UpdateSel();
                break;
            case this.randomName:
                this.m_IsRandom = false;
                this.GetRandomName();
                break;
            case this.gotBtn:
                var name_2 = this.nameLabel.text;
                if (name_2 == null || name_2 == "") {
                    alert("名称不能为空");
                    return;
                }
                RoleMgr.ins().sendCreateRole(name_2, this.GetSex(), this.GetJob());
                break;
            case this.leftBtn:
                this.UpdateIndex(this.m_Index - 1);
                break;
            case this.rightBtn:
                this.UpdateIndex(this.m_Index + 1);
                break;
        }
    };
    CreateDefaultRoleView.prototype.UpdateIndex = function (value) {
        if (value < 0) {
            value = 5;
        }
        if (value > 5) {
            value = 0;
        }
        this.m_Sex = value % 2;
        this.m_Job = Math.floor(value / 2) + 1;
        this.UpdateSel();
    };
    CreateDefaultRoleView.LAYER_LEVEL = LayerManager.UI_Main_2;
    return CreateDefaultRoleView;
}(BaseEuiView));
__reflect(CreateDefaultRoleView.prototype, "CreateDefaultRoleView");
//# sourceMappingURL=CreateDefaultRoleView.js.map