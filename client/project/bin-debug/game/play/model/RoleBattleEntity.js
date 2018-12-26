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
var RoleBattleEntity = (function (_super) {
    __extends(RoleBattleEntity, _super);
    function RoleBattleEntity() {
        var _this = _super.call(this) || this;
        _this._weapon = new BattleMvData(_this, false);
        _this._wing = new BattleMvData(_this, false);
        _this._horse = new BattleMvData(_this, false);
        _this._horseHead = new BattleMvData(_this, false);
        _this._ring = new BattleMvData(_this, false);
        _this._disOrder = {};
        _this._horse.SetParent(_this.m_Container, 0);
        _this._weapon.SetParent(_this.m_Container, 2);
        var animType = (_a = {}, _a[EntityClipType.STAND] = true, _a[EntityClipType.RUN] = true, _a);
        _this._horse.mAnimType = animType;
        _this._horseHead.SetParent(_this.m_Container, 4);
        _this._horseHead.mAnimType = animType;
        _this._horseHead.mIsHead = true;
        _this._wing.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_CB;
        _this._wing.SetParent(_this.m_Container, 3);
        _this._ring.mSettingId = FuncOpenModel.SAVE_SYSTEM_SETTING_TX;
        _this._ring.SetParent(_this, 1);
        _this._ring.mAnimType = (_b = {}, _b[EntityClipType.STAND] = true, _b);
        _this._disOrder = {};
        _this._disOrder[_this._horse.hashCode] = CharMcOrder.HORSE;
        _this._disOrder[_this.mBody.hashCode] = CharMcOrder.BODY;
        _this._disOrder[_this._weapon.hashCode] = CharMcOrder.WEAPON;
        _this._disOrder[_this._wing.hashCode] = CharMcOrder.WING;
        _this._disOrder[_this._horseHead.hashCode] = CharMcOrder.HORSE_HEAD;
        return _this;
        var _a, _b;
    }
    RoleBattleEntity.prototype.Init = function (entity) {
        this._horse.Init();
        this._horseHead.Init();
        this._weapon.Init();
        this._wing.Init();
        this._ring.Init();
        _super.prototype.Init.call(this, entity);
    };
    RoleBattleEntity.prototype.UpdateSetting = function (settingId) {
        _super.prototype.UpdateSetting.call(this, settingId);
        if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CB) {
            this._wing.UpdateSetting(settingId);
        }
        else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TX) {
            this._ring.UpdateSetting(settingId);
        }
    };
    // 替身显示状态
    RoleBattleEntity.prototype.IsReplaceShow = function (show) {
        var isShow = !show;
        this.SetMvState(this._horse, isShow);
        this.SetMvState(this._horseHead, isShow);
        this.SetMvState(this._weapon, isShow);
        this.SetMvState(this._wing, isShow);
        this.SetMvState(this._ring, isShow);
        if (isShow) {
            this.UpdateOrder();
        }
    };
    RoleBattleEntity.prototype.Dispose = function () {
        _super.prototype.Dispose.call(this);
        this.mBody.ClearCache();
        this._wing.ClearCache();
        this._weapon.ClearCache();
        this._horse.ClearCache();
        this._horseHead.ClearCache();
        if (this._ring) {
            this._ring.ClearCache();
        }
    };
    RoleBattleEntity.prototype.UpdateInfo = function (model) {
        var rideId = model.GetRideId();
        this._horse.SetId(rideId);
        this._horseHead.SetId(rideId);
        var animType = null;
        if (this.mBody.ride = rideId ? true : false) {
            animType = (_a = {}, _a[EntityClipType.STAND] = true, _a[EntityClipType.ATTACK] = true, _a[EntityClipType.HIT] = true, _a);
        }
        this.mBody.job = model.job;
        this.mBody.sex = model.sex;
        this.mBody.mAnimType = animType;
        this._weapon.ride = rideId ? true : false;
        this._weapon.job = model.job;
        this._weapon.sex = model.sex;
        this._weapon.mAnimType = animType;
        this._weapon.SetId(model.GetWeaponId());
        this._wing.ride = rideId ? true : false;
        this._wing.SetId(model.GetWingId());
        this._wing.mAnimType = animType;
        this._ring.SetId(RoleShowData.GetTianxAppId(model.mTianxianId));
        var offset = AppearanceConfig.GetRideOffset(rideId);
        this.mBody.SetOffset(offset);
        this._weapon.SetOffset(offset);
        this._wing.SetOffset(offset);
        this.mPosY = BattleEntity.POS + (-38) + offset.y;
        _super.prototype.UpdateInfo.call(this, model);
        var _a;
    };
    RoleBattleEntity.prototype.UpdateOrder = function () {
        if (!RoleBattleEntity.FRAME_ODER_DICT) {
            var dict1 = RoleBattleEntity.FRAME_ODER_DICT = {};
            var i = 0;
            for (var _i = 0, _a = RoleBattleEntity.FRAME_ODER; _i < _a.length; _i++) {
                var data1 = _a[_i];
                var dict2 = dict1[i] = {};
                var j = 0;
                for (var _b = 0, data1_1 = data1; _b < data1_1.length; _b++) {
                    var data2 = data1_1[_b];
                    dict2[data2] = j++;
                }
                ++i;
            }
        }
        var order = RoleBattleEntity.FRAME_ODER_DICT[this.m_Dir];
        var disOrder = this._disOrder;
        this.m_Container.$children.sort(function (lhs, rhs) {
            var lhsCode = lhs.hashCode;
            var rhsCode = rhs.hashCode;
            return order[disOrder[lhsCode]] - order[disOrder[rhsCode]];
        });
    };
    RoleBattleEntity.prototype._BodyLoaded = function () {
        _super.prototype._BodyLoaded.call(this);
        this._horse.Load();
        this._horseHead.Load();
        this._weapon.Load();
        this._wing.Load();
        this._ring.Load();
        this.UpdateOrder();
        if (!FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_TX) && this._ring.mv) {
            this._ring.UpdateWayTween();
        }
    };
    /**不同方向的身体显示对象显示顺序 */
    RoleBattleEntity.FRAME_ODER = [
        [CharMcOrder.HORSE, CharMcOrder.WEAPON, CharMcOrder.BODY, CharMcOrder.WING],
        [CharMcOrder.HORSE, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
        [CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],
        [CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
        [CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
        [CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.HORSE_HEAD],
        [CharMcOrder.HORSE, CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON],
        [CharMcOrder.HORSE, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.WING],
    ];
    RoleBattleEntity.FRAME_ODER_DICT = null;
    return RoleBattleEntity;
}(BattleEntity));
__reflect(RoleBattleEntity.prototype, "RoleBattleEntity");
//# sourceMappingURL=RoleBattleEntity.js.map