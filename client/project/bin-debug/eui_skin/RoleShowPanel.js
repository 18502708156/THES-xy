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
var RoleShowPanel = (function (_super) {
    __extends(RoleShowPanel, _super);
    function RoleShowPanel() {
        var _this = _super.call(this) || this;
        _this.mScale = 1;
        // 是否显示守护
        _this.mShowTianx = true;
        _this.m_Offset = null;
        return _this;
    }
    //服务器下发的数据 显示玩家形象
    RoleShowPanel.prototype.SetShowImage = function (playerInfo) {
        var roleShowData = new RoleShowData;
        roleShowData.job = playerInfo.job;
        roleShowData.sex = playerInfo.sex;
        roleShowData.shows = playerInfo.shows;
        this.SetAll(roleShowData);
    };
    RoleShowPanel.prototype.SetShowMarry = function (playerInfo) {
        var roleShowData = new RoleShowData;
        roleShowData.job = playerInfo.job;
        roleShowData.sex = playerInfo.sex;
        roleShowData.shows = playerInfo.shows;
        this.SetAll(roleShowData);
    };
    RoleShowPanel.prototype.ResetData = function () {
        this.m_Weapon = null;
        this.m_Body = null;
        this.m_Wing = null;
        this.m_Ride = null;
        this.m_Tianx = null;
    };
    RoleShowPanel.prototype.SetWeapon = function (value) {
        if (value) {
            this.m_Weapon = value;
        }
        else {
            this.m_Weapon = null;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetBody = function (value) {
        if (value != null) {
            this.m_Body = value;
        }
        else {
            this.m_Body = null;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetWing = function (value) {
        if (value != null) {
            this.m_Wing = value;
        }
        else {
            this.m_Wing = null;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetRide = function (value) {
        if (value != null) {
            this.m_Ride = value;
        }
        else {
            this.m_Ride = null;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetTianx = function (value) {
        if (!this.mShowTianx) {
            return;
        }
        if (value != null) {
            this.m_Tianx = value;
        }
        else {
            this.m_Tianx = null;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetTitle = function (value) {
        this.m_Title = value || "";
        if (!this.imgTitle) {
            return;
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetTianxPos = function (x, y) {
        if (!this.tianx)
            return;
        if (x != null)
            this.tianx.x = x;
        if (y != null)
            this.tianx.y = y;
    };
    RoleShowPanel.prototype._SetSource = function (img, newPath, autoPlay) {
        if (!img) {
            return;
        }
        if (!newPath) {
            img.LoadByUrl(null);
        }
        else {
            if (autoPlay) {
                if (img.name) {
                    img.Play(newPath, img.name || null, -1, true);
                }
                else {
                    img.LoadByUrl(newPath, -1, true);
                }
            }
            else {
                img.once(egret.Event.CHANGE, this.SyncFrame, this);
                img.LoadByUrl(newPath, -1, false);
            }
        }
    };
    RoleShowPanel.prototype._NewMovieObject = function (index) {
        var obj = new MovieObject;
        obj["__temp_index__"] = index;
        var scale = this.mScale || 1.5;
        obj.scaleX = obj.scaleY = scale;
        obj.x = (this.width * scale) >> 1;
        obj.y = (this.height * scale) >> 1;
        this.addChild(obj);
        this.$children.sort(RoleShowPanel.SORT);
        return obj;
    };
    RoleShowPanel.SORT = function (lhs, rhs) {
        return (lhs["__temp_index__"] || 0) - (rhs["__temp_index__"] || 0);
    };
    RoleShowPanel.prototype._Update = function () {
        if (!this.$stage) {
            return;
        }
        TimerManager.ins().doNext(this._DoUpdate, this);
    };
    RoleShowPanel.prototype._DoUpdate = function () {
        if (!this.$stage) {
            return;
        }
        this.rideMv = this._InitMv(this.m_Ride, this.rideMv, 0);
        this.wingMv = this._InitMv(this.m_Wing, this.wingMv, 1);
        this.bodyMv = this._InitMv(this.m_Body, this.bodyMv, 2);
        this.weaponMv = this._InitMv(this.m_Weapon, this.weaponMv, 3);
        this.tianx = this._InitMv(this.m_Tianx, this.tianx, 4);
        this.rideHeadMv = this._InitMv(this.m_RideHead, this.rideHeadMv, 5);
        this._SetImgTitle(this.m_Title);
        if (!StringUtils.IsNullOrEmpty(this.m_Body)) {
            this.bodyMv.once(egret.Event.CHANGE, this._LoadBodyEnd, this);
            this._SetSource(this.bodyMv, this.m_Body, true);
        }
        else {
            this._LoadBodyEnd();
        }
        var offset = this.m_Offset;
        this.SetOffset(this.wingMv, offset);
        this.SetOffset(this.bodyMv, offset);
        this.SetOffset(this.weaponMv, offset);
        if (this.imgTitle && this.m_Title) {
            this.imgTitle.y = -270 + (-60) + (offset ? offset.y : 0);
        }
    };
    RoleShowPanel.prototype._InitMv = function (resName, mvObj, index) {
        if (resName) {
            if (!mvObj) {
                mvObj = this._NewMovieObject(index);
                if (index == 4) {
                    mvObj.x = -150;
                    mvObj.y = -210;
                }
            }
        }
        else {
            if (mvObj) {
                mvObj.LoadByUrl(null);
            }
        }
        return mvObj;
    };
    RoleShowPanel.prototype._SetImgTitle = function (sourcePath) {
        if (!this.imgTitle && !sourcePath)
            return;
        if (!this.imgTitle) {
            this.imgTitle = new eui.Image;
            this.imgTitle.horizontalCenter = 0;
            this.imgTitle.y = -270;
            this.addChildAt(this.imgTitle, this.numChildren);
        }
        this.imgTitle.source = sourcePath || "";
    };
    RoleShowPanel.prototype._LoadBodyEnd = function () {
        this._SetSource(this.wingMv, this.m_Wing, false);
        this._SetSource(this.rideMv, this.m_Ride, false);
        this._SetSource(this.rideHeadMv, this.m_RideHead, false);
        this._SetSource(this.weaponMv, this.m_Weapon, false);
        this._SetSource(this.tianx, this.m_Tianx, false);
    };
    RoleShowPanel.prototype.SyncFrame = function (e) {
        var mc = e.currentTarget;
        if (this.bodyMv && !StringUtils.IsNullOrEmpty(this.m_Body)) {
            mc.gotoAndPlay(this.bodyMv.currentFrame, -1);
        }
        else {
            mc.gotoAndPlay(1, -1);
        }
    };
    RoleShowPanel.GetPath = function (id, job, sex, ride) {
        if (job === void 0) { job = null; }
        if (sex === void 0) { sex = null; }
        if (ride === void 0) { ride = false; }
        if (!id) {
            return "";
        }
        var appePath = AppearanceConfig.GetUIAppe(id, job, sex, false, ride);
        if (appePath) {
            return ResDataPath.GetMovieStandPath(appePath);
        }
        return "";
    };
    RoleShowPanel.GetHeadPath = function (id) {
        if (!id) {
            return "";
        }
        var appePath = AppearanceConfig.GetUIAppe(id, null, null, true);
        if (appePath) {
            return ResDataPath.GetMovieStandPath(appePath);
        }
        return "";
    };
    RoleShowPanel.prototype.SetAll = function (target) {
        var data;
        if (egret.is(target, "Role")) {
            data = target.GetSubRoleData();
        }
        else {
            data = target;
        }
        if (!data) {
            return;
        }
        var rideId = data.GetRideId();
        var isRide = rideId > 0;
        this.m_Weapon = RoleShowPanel.GetPath(data.GetSwordId(), data.job, data.sex, isRide);
        this.m_Body = RoleShowPanel.GetPath(data.GetBodyId(), data.job, data.sex, isRide);
        this.m_Wing = RoleShowPanel.GetPath(data.GetWingId(), isRide);
        this.m_Ride = RoleShowPanel.GetPath(rideId);
        this.m_RideHead = RoleShowPanel.GetHeadPath(rideId);
        this.m_Title = data.GetTitleId() ? GameGlobal.Config.TitleConf[data.GetTitleId()].icon : "";
        this.m_Offset = AppearanceConfig.GetRideOffset(rideId, true);
        if (this.mShowTianx) {
            this.m_Tianx = RoleShowPanel.GetPath(data.GetTianx());
        }
        this._Update();
    };
    RoleShowPanel.prototype.SetOffset = function (mv, offset) {
        if (!mv) {
            return;
        }
        if (offset) {
            mv.x = offset.x;
            mv.y = offset.y;
        }
        else {
            mv.x = 0;
            mv.y = 0;
        }
    };
    RoleShowPanel.prototype.Set = function (type, target) {
        var data;
        if (egret.is(target, "Role")) {
            data = target.GetSubRoleData();
        }
        else {
            data = target;
        }
        if (type == RoleShowDressType.ARM) {
            this.SetWeapon(RoleShowPanel.GetPath(data.GetSwordId(), data.job, data.sex));
        }
        else if (type == RoleShowDressType.ROLE) {
            this.SetBody(RoleShowPanel.GetPath(data.GetBodyId(), data.job, data.sex));
        }
        else if (type == RoleShowDressType.WING) {
            this.SetWing(RoleShowPanel.GetPath(data.GetWingId()));
        }
        else if (type == RoleShowDressType.RIDE) {
            this.SetRide(RoleShowPanel.GetPath(data.GetRideId()));
        }
        else if (type == RoleShowDressType.TIANX) {
            this.SetTianx(RoleShowPanel.GetPath(data.GetTianx()));
        }
        else {
            console.log("roleshowpanel not type " + type);
        }
    };
    RoleShowPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    RoleShowPanel.prototype.childrenCreated = function () {
        _super.prototype.childrenCreated.call(this);
        this._Update();
    };
    RoleShowPanel.prototype.ClearCache = function () {
        if (this.wingMv) {
            this.wingMv.ClearCache();
        }
        if (this.bodyMv) {
            this.bodyMv.ClearCache();
        }
        if (this.weaponMv) {
            this.weaponMv.ClearCache();
        }
        if (this.tianx) {
            this.tianx.ClearCache();
        }
        if (this.rideMv) {
            this.rideMv.ClearCache();
        }
        if (this.rideHeadMv) {
            this.rideHeadMv.ClearCache();
        }
        this.m_Weapon = null;
        this.m_Body = null;
        this.m_Wing = null;
        this.m_Ride = null;
        this.m_RideHead = null;
        this.m_Tianx = null;
        this.m_Offset = null;
    };
    RoleShowPanel.prototype.Clear = function () {
        if (this.wingMv) {
            this.wingMv.Clear();
        }
        if (this.bodyMv) {
            this.bodyMv.Clear();
        }
        if (this.weaponMv) {
            this.weaponMv.Clear();
        }
        if (this.tianx) {
            this.tianx.Clear();
        }
        if (this.rideMv) {
            this.rideMv.Clear();
        }
        if (this.rideHeadMv) {
            this.rideHeadMv.Clear();
        }
        this.m_Weapon = null;
        this.m_Body = null;
        this.m_Wing = null;
        this.m_Ride = null;
        this.m_RideHead = null;
        this.m_Tianx = null;
    };
    return RoleShowPanel;
}(eui.Component));
__reflect(RoleShowPanel.prototype, "RoleShowPanel", ["eui.UIComponent", "egret.DisplayObject"]);
//# sourceMappingURL=RoleShowPanel.js.map