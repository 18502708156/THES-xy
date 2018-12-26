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
var BattleEntity = (function (_super) {
    __extends(BattleEntity, _super);
    function BattleEntity() {
        var _this = _super.call(this) || this;
        _this.mPosY = BattleEntity.POS;
        // 超过最大显示数量
        _this.mIsMaxCountState = false;
        _this.mBody = new BattleMvData(_this);
        _this.m_Scale = 1;
        _this.m_Dir = 3;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        _this.m_Container = new egret.DisplayObjectContainer;
        _this.addChildAt(_this.m_Container, CharMcOrder.CONTAINER_TYPE);
        _this.mBody.SetParent(_this.m_Container, 0);
        _this.mBody.Create();
        _this.m_Container.addChild(_this.mBody.mv);
        _this.mBody.mv.addEventListener(egret.Event.CHANGE, _this._BodyLoaded, _this);
        return _this;
    }
    BattleEntity.prototype.SetMaxCountState = function (state) {
        if (this.mIsMaxCountState == state) {
            return;
        }
        this.mIsMaxCountState = state;
        if (state) {
            if (this.m_Container.parent) {
                DisplayUtils.removeFromParent(this.m_Container);
            }
        }
        else {
            if (!this.m_Container.parent) {
                this.addChildAt(this.m_Container, CharMcOrder.CONTAINER_TYPE);
            }
        }
        this.DoMaxCountState();
    };
    BattleEntity.prototype.DoMaxCountState = function () {
    };
    // 子类实现
    BattleEntity.prototype.UpdateSetting = function (settingId) {
    };
    BattleEntity.prototype.GetClipType = function () {
        return this.m_AnimState;
    };
    BattleEntity.prototype.SetMvState = function (mvData, isShow) {
        if (!mvData) {
            return;
        }
        mvData.SetShowState(isShow);
    };
    BattleEntity.prototype.SetModelShow = function (state) {
        this.SetMvState(this.mBody, state);
    };
    BattleEntity.prototype.GetDir = function () {
        return this.m_Dir;
    };
    // 替身显示状态
    BattleEntity.prototype.IsReplaceShow = function (show) {
    };
    BattleEntity.prototype.Init = function (entity) {
        this.alpha = 1;
        this.mPosY = BattleEntity.POS;
        this.touchEnabled = false;
        this.touchChildren = false;
        this.mIsMaxCountState = false;
        this.m_Scale = entity.scale || 1;
        this.m_Container.scaleX = this.m_Container.scaleY = this.m_Scale;
        this.addChildAt(this.m_Container, CharMcOrder.CONTAINER_TYPE);
        this.m_Dir = entity.dir || 3;
        this.m_AnimState = null;
        this.mBody.Init();
        this.UpdateInfo(entity);
    };
    BattleEntity.prototype.Dispose = function () {
        if (this.m_Call) {
            TimerManager.ins().remove(this._PlayClip2, this);
            this.m_Call = false;
        }
        this.mBody.ClearCache();
        if (this._title) {
            this._title.source = "";
            DisplayUtils.removeFromParent(this._title);
        }
        if (this.mBodyImage) {
            this.mBodyImage.source = "";
            DisplayUtils.removeFromParent(this.mBodyImage);
        }
    };
    BattleEntity.prototype.SetDir = function (dir) {
        if (this.m_Dir == dir) {
            return;
        }
        this.m_Dir = dir;
        this.PlayClip();
    };
    /**
     *  替身名称
     * 	bodyName == null 还原显示的模型
     */
    BattleEntity.prototype.SetReplaceBody = function (bodyName) {
        if (this.mBody.replaceName == bodyName) {
            return;
        }
        this.mBody.replaceName = bodyName;
        this.IsReplaceShow(bodyName != null);
        this.PlayClip();
    };
    BattleEntity.prototype.UpdateAction = function (animState, once) {
        if (this.m_AnimState == animState) {
            return;
        }
        this.m_PlayOnce = once;
        this.m_AnimState = animState;
        this.PlayClip();
    };
    BattleEntity.prototype.ReplayAction = function (animState, once) {
        this.m_PlayOnce = once;
        this.m_AnimState = animState;
        this.PlayClip();
    };
    BattleEntity.prototype.UpdateInfo = function (entity) {
        this.mBody.name = entity.GetBodyResPath();
        this.UpdateTitle(entity);
        this.PlayClip();
    };
    BattleEntity.prototype.PlayClip = function () {
        if (this.m_Call || !this.$stage) {
            return;
        }
        this.m_Call = true;
        TimerManager.ins().doNext(this._PlayClip2, this);
    };
    BattleEntity.prototype._PlayClip2 = function () {
        this.m_Call = false;
        if (this.m_AnimState == null) {
            return;
        }
        if (!this.mIsMaxCountState) {
            this.LoadMcAnim(this.mBody.mv, this.mBody.GetName(), this.GetDir(), this.mBody.GetClipName(), this.GetPlayCount(), true);
        }
        else {
            if (this.mBodyImage == null) {
                this.mBodyImage = new eui.Image;
                this.mBodyImage.x = -25;
                this.mBodyImage.y = -100;
            }
            if (!this.mBodyImage.parent) {
                this.mBodyImage.source = "shadow";
                this.addChildAt(this.mBodyImage, CharMcOrder.CONTAINER_TYPE);
            }
        }
    };
    BattleEntity.prototype.GetPlayCount = function () {
        return this.m_PlayOnce ? 1 : -1;
    };
    BattleEntity.prototype._BodyLoaded = function () {
    };
    BattleEntity.prototype.LoadMc = function (mc, name, count, autoPlay) {
        if (count === void 0) { count = 1; }
        if (autoPlay === void 0) { autoPlay = false; }
        this.LoadMcAnim(mc, name, this.m_Dir, this.m_AnimState, count, autoPlay);
    };
    BattleEntity.prototype.LoadMcAnim = function (mc, name, dir, anim, count, autoPlay) {
        if (count === void 0) { count = 1; }
        if (autoPlay === void 0) { autoPlay = false; }
        // if (!mc || anim == null) {
        // 	return
        // }
        if (!mc) {
            return;
        }
        if (dir != null) {
            if (dir > 4) {
                this.m_Container.scaleX = -1 * this.m_Scale;
                dir = 8 - dir;
            }
            else {
                this.m_Container.scaleX = this.m_Scale;
            }
        }
        if (!mc.parent) {
            return;
        }
        if (!this.$stage) {
            return;
        }
        var data = null;
        var stateName = "";
        var frameName = null;
        if (dir != null) {
            if (anim == null) {
                return;
            }
            dir = dir <= 2 ? 1 : 3;
            data = EntityClipTypeToName[anim];
            stateName = dir + data[0];
            frameName = data[1];
        }
        var mul = 1;
        if (egret.is(this.parent, "MapEntity")) {
            var mapEntity = this.parent;
            mul = mapEntity.mRaid ? mapEntity.mRaid.GetSpeed() : 1;
        }
        mc.SetFrameRate(mul);
        mc.LoadByUrl(ResDataPath.ROOT_MOVIE + name, stateName, frameName, this.GetPlayCount(), autoPlay);
    };
    BattleEntity.prototype.UpdateTitle = function (entity) {
        if (!entity) {
            return;
        }
        if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)) {
            return;
        }
        var title = entity.GetTitle();
        if (this._title) {
            this._title.source = "";
        }
        if (title > 0) {
            var cfg = GlobalConfig.ins().TitleConf[title];
            var titleResName = cfg ? cfg.icon : "";
            if (this._title == null) {
                this._title = new eui.Image;
                this._title.addEventListener(egret.Event.COMPLETE, this._CompleteTitle, this);
            }
            this.addChildAt(this._title, CharMcOrder.TITLE_TYPE);
            this._title.source = titleResName;
        }
    };
    BattleEntity.prototype._CompleteTitle = function () {
        if (!this._title.parent) {
            return;
        }
        var img = this._title.texture;
        if (!img || !img.textureWidth || !img.textureHeight) {
            return;
        }
        this._title.x = -(img.textureWidth >> 1);
        this._title.y = -img.textureHeight + this.GetTopPos();
    };
    BattleEntity.prototype.GetTopPos = function () {
        return this.mPosY;
    };
    BattleEntity.prototype.ClearTitle = function () {
        if (this._title) {
            this._title.source = "";
        }
    };
    BattleEntity.prototype.$onAddToStage = function (stage, nestLevel) {
        _super.prototype.$onAddToStage.call(this, stage, nestLevel);
        this.PlayClip();
    };
    BattleEntity.POS = -125;
    return BattleEntity;
}(egret.DisplayObjectContainer));
__reflect(BattleEntity.prototype, "BattleEntity");
//# sourceMappingURL=BattleEntity.js.map