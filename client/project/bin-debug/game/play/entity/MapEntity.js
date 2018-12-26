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
var MapEntity = (function (_super) {
    __extends(MapEntity, _super);
    function MapEntity() {
        var _this = _super.call(this) || this;
        _this.m_IsMyTeam = false;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        _this.mPart = new MapEntityPart(_this);
        var img = new eui.Image;
        img.source = "jiaodi";
        img.x = -36;
        img.y = -22;
        _this.addChild(img);
        return _this;
    }
    MapEntity.prototype.GetHandle = function () {
        if (this.m_Info) {
            return this.m_Info.handle;
        }
        return -1;
    };
    MapEntity.prototype.GetInfo = function () {
        return this.m_Info;
    };
    MapEntity.prototype.GetTeam = function () {
        if (this.m_Info) {
            return this.m_Info.team;
        }
        return Team.WillEntity;
    };
    MapEntity.prototype.AddEff = function () {
    };
    MapEntity.prototype.addBattleBuff = function (mc) {
        if (!this.mBattleBuff) {
            this.mBattleBuff = new egret.DisplayObjectContainer;
            this.mBattleBuff.x = 2006;
            this.mBattleBuff.y = 0;
            this.addChild(this.mBattleBuff);
        }
        this.mBattleBuff.addChild(mc);
    };
    MapEntity.prototype.removeBattleBuff = function (mcName) {
        if (!this.mBattleBuff) {
            return;
        }
        var mc = this.mBattleBuff.getChildByName(mcName + "");
        if (!mc) {
            return;
        }
        DisplayUtils.removeFromParent(mc);
        if (this.mBattleBuff.$children.length == 0) {
            DisplayUtils.removeFromParent(this.mBattleBuff);
            this.mBattleBuff = null;
        }
    };
    MapEntity.prototype.UpdateSetting = function (settingId) {
        var info = this.m_Info;
        if (!info) {
            return;
        }
        var model = this.m_Model;
        if (!model) {
            return;
        }
        if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CH) {
            if (FuncOpenModel.HasSaveData(FuncOpenModel.SAVE_SYSTEM_SETTING_CH)) {
                model.ClearTitle();
            }
            else {
                model.UpdateTitle(this.m_Info);
            }
        }
        else {
            if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_CB
                || settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TX) {
                if (info.type == EntityType.Role) {
                    model.UpdateSetting(settingId);
                }
            }
            else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_XW
                || settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_FZ) {
                if (info.type == EntityType.Xianlv) {
                    model.UpdateSetting(settingId);
                }
            }
            else if (settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_TL
                || settingId == FuncOpenModel.SAVE_SYSTEM_SETTING_SH) {
                if (info.type == EntityType.Pet) {
                    model.UpdateSetting(settingId);
                }
            }
        }
    };
    MapEntity.prototype.SetFootRing = function (type) {
    };
    MapEntity.prototype.GetBar = function () {
        if (this.m_Bar == null) {
            var skin = new eui.Skin;
            skin.skinParts = ["thumb"];
            skin.width = 54;
            var bg = new eui.Image;
            bg.percentWidth = 100;
            bg.source = "ui_hpback";
            bg.scale9Grid = new egret.Rectangle(5, 5, 1, 1);
            var thumb = new eui.Image;
            thumb.left = 2;
            thumb.right = 2;
            thumb.top = 1;
            thumb.source = "ui_hpbar";
            thumb.scale9Grid = new egret.Rectangle(4, 5, 1, 1);
            skin["thumb"] = thumb;
            skin.elementsContent = [bg, thumb];
            var bar = new eui.ProgressBar;
            bar.skinName = skin;
            bar.x = -27;
            this.m_Bar = bar;
        }
        return this.m_Bar;
    };
    MapEntity.prototype.GetDir = function () {
        if (this.m_Model) {
            return this.m_Model.GetDir();
        }
        return 3;
    };
    MapEntity.prototype.Init = function (raid, entity) {
        this.mTeamHandle = null;
        this.scaleX = 1;
        this.alpha = 1;
        this.mAI = null;
        this.mRaid = raid;
        this.visible = true;
        this.touchEnabled = false;
        this.touchChildren = false;
        this.m_Info = entity;
        this.m_IsMyTeam = entity.IsSide();
        if (entity.type == EntityType.Role || entity.type == EntityType.FriendlyRole) {
            this.m_Model = ObjectPool.pop("RoleBattleEntity");
        }
        else if (entity.type == EntityType.Pet) {
            this.m_Model = ObjectPool.pop("PetBattleEntity");
        }
        else if (entity.type == EntityType.Xianlv) {
            this.m_Model = ObjectPool.pop("XianlvBattleEntity");
        }
        else if (entity.type == EntityType.Tiannv) {
            this.m_Model = ObjectPool.pop("TiannvBattleEntity");
        }
        else {
            this.m_Model = ObjectPool.pop("BattleEntity");
        }
        if (this.m_Bar) {
            DisplayUtils.removeFromParent(this.m_Bar);
        }
        this.addChildAt(this.m_Model, 1);
        this.m_Model.Init(entity);
        this.UpateName();
        this.UpdateBloodPos(this.m_Model.GetTopPos());
    };
    MapEntity.prototype.SetPlot = function (msg) {
        this.mPart.SetPlot(msg);
    };
    MapEntity.prototype.SetAI = function (ai) {
        this.mAI = ai;
        this.mAI.Init(this);
    };
    MapEntity.prototype.ShowBloodBar = function () {
        this.addChildAt(this.GetBar(), this.numChildren);
        this.SetBarValue(100, 100);
        this.UpdateBloodPos(this.m_Model.GetTopPos());
    };
    MapEntity.prototype.UpdateBloodPos = function (pos) {
        if (this.m_Bar) {
            this.m_Bar.y = pos - 10;
        }
    };
    MapEntity.prototype.SetBarValue = function (value, max) {
        if (!this.m_Bar) {
            return;
        }
        this.m_Bar.maximum = max;
        this.m_Bar.value = value;
    };
    MapEntity.prototype.Dispose = function () {
        this.alpha = 1;
        if (this.m_Model) {
            this.m_Model.Dispose();
            ObjectPool.push(this.m_Model);
            DisplayUtils.removeFromParent(this.m_Model);
            this.m_Model = null;
        }
        if (egret.is(this.mRaid, "MapRaid")) {
            var raid = this.mRaid;
            raid.ClearSelectEntity(this.GetHandle());
        }
        this.mPart.Dispose();
        DisplayUtils.removeFromParent(this);
        if (this.m_NameTxt) {
            DisplayUtils.removeFromParent(this.m_NameTxt);
        }
        if (this.mIsClick) {
            this.touchEnabled = false;
            this.touchChildren = false;
            this.mIsClick = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
        }
        if (this.mBattleBuff) {
            DisplayUtils.removeFromParent(this.mBattleBuff);
            this.mBattleBuff = null;
        }
        this.m_Info = null;
        this.mAI = null;
        this.mRaid = null;
    };
    MapEntity.prototype.LookPos = function (x, y) {
        var x1 = this.x;
        var y1 = this.y;
        if (Math.abs(x1 - x) < 0.5 && Math.abs(y1 - y) < 0.5) {
            return;
        }
        this.SetDir(DirUtil.GetDir(this.x, this.y, x, y));
    };
    MapEntity.prototype.SetDir = function (dir) {
        if (this.m_Model)
            this.m_Model.SetDir(dir);
    };
    MapEntity.prototype.UpdateAction = function (animState, once) {
        if (this.m_Model)
            this.m_Model.UpdateAction(animState, once);
    };
    MapEntity.prototype.ReplayAction = function (animState, once) {
        if (this.m_Model)
            this.m_Model.ReplayAction(animState, once);
    };
    MapEntity.prototype.UpateName = function () {
        if (!this.mRaid) {
            return;
        }
        var str = this.mRaid.GetEntityNameStyle(this.m_Info);
        var guildName = "";
        if (this.mRaid && this.mRaid.mIsShowGuild) {
            guildName = this.m_Info.guildName;
        }
        if (this.m_Info)
            if (!str) {
                if (this.m_NameTxt) {
                    this.m_NameTxt.visible = false;
                }
                return;
            }
        if (!this.m_NameTxt) {
            this.m_NameTxt = new MapEntityTxt;
        }
        else {
            this.m_NameTxt.visible = true;
        }
        this.addChild(this.m_NameTxt);
        // this.m_NameTxt.textFlow = TextFlowMaker.generateTextFlow(str)
        this.m_NameTxt.text = str;
        this.m_NameTxt.SetNextText(guildName);
        var enemy = false;
        if (guildName) {
            if (GameGlobal.actorModel.guildID) {
                if (this.m_Info.guildID != GameGlobal.actorModel.guildID) {
                    enemy = true;
                }
            }
        }
        this.m_NameTxt.SetNameColor(enemy);
    };
    MapEntity.prototype.UpdateInfo = function (infoModel) {
        if (infoModel === void 0) { infoModel = null; }
        if (infoModel) {
            if (this.m_Info.handle != infoModel.handle) {
                console.error("update info error handle");
                return;
            }
            this.m_Info = infoModel;
        }
        this.m_Model.UpdateInfo(this.m_Info);
        this.UpateName();
        this.UpdateBloodPos(this.m_Model.GetTopPos());
    };
    MapEntity.prototype.SetPos = function (x, y) {
        this.x = x;
        this.y = y;
    };
    /**
     * 添加点击事件
     * @param showView 是否显示点击确认的界面
     **/
    MapEntity.prototype.SetClick = function (showView) {
        if (showView === void 0) { showView = true; }
        if (GameGlobal.GameLogic.actorModel.actorID == this.m_Info.handle) {
            return; //本身角色不点击
        }
        this.mIsShowZdView = showView;
        if (!this.mIsClick) {
            this.touchEnabled = true;
            this.touchChildren = true;
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.OnClick, this);
            this.mIsClick = true;
        }
    };
    MapEntity.prototype.ChageStatus = function (status) {
        this.mPart.ChageStatus(status);
    };
    MapEntity.prototype.SetType = function (src) {
        this.mPart.SetType(src);
    };
    MapEntity.prototype.$hitTest = function (stageX, stageY) {
        if (!this.$visible) {
            return null;
        }
        var m = this.$getInvertedConcatenatedMatrix();
        var localX = m.a * stageX + m.c * stageY + m.tx;
        var localY = m.b * stageX + m.d * stageY + m.ty;
        if (localX > 80 || localX < -80 || localY > 100 || localY < -100) {
            return;
        }
        var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
        if (rect && !rect.contains(localX, localY)) {
            return null;
        }
        if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
            return null;
        }
        var children = this.$children;
        var found = false;
        var target = null;
        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            if (child.$maskedObject) {
                continue;
            }
            target = child.$hitTest(stageX, stageY);
            if (target) {
                found = true;
                if (target.$touchEnabled) {
                    break;
                }
                else {
                    target = null;
                }
            }
        }
        if (target) {
            if (this.$touchChildren) {
                return target;
            }
            return this;
        }
        if (found) {
            return this;
        }
        return _super.prototype.$hitTest.call(this, stageX, stageY);
    };
    MapEntity.prototype.OnClick = function (e) {
        if (e.localX > 80 || e.localX < -80 || e.localY > 100 || e.localY < -100) {
            return;
        }
        var mapRaid = null;
        if (egret.is(this.mRaid, "MapRaid")) {
            mapRaid = this.mRaid;
        }
        if (!mapRaid) {
            return;
        }
        if (!mapRaid.OnPreEntityClick(this.GetHandle())) {
            return;
        }
        if (!this.mIsShowZdView) {
            mapRaid.OnEntityClick(this.GetHandle());
            return;
        }
        mapRaid.SetSelectEntity(this.GetHandle());
    };
    return MapEntity;
}(egret.DisplayObjectContainer));
__reflect(MapEntity.prototype, "MapEntity");
var MapEntityTxt = (function (_super) {
    __extends(MapEntityTxt, _super);
    function MapEntityTxt() {
        var _this = _super.call(this) || this;
        _this.y = 18;
        _this.width = 0;
        _this.height = 25;
        _this.touchEnabled = false;
        _this.touchChildren = false;
        var img = _this.img = new eui.Image;
        img.source = "ui_cm_black";
        img.alpha = 0.5;
        img.height = 25;
        img.horizontalCenter = 0;
        _this.addChild(img);
        var nameTxt = _this.txt = new eui.Label;
        nameTxt.y = 3;
        nameTxt.horizontalCenter = 0;
        nameTxt.size = 18;
        nameTxt.textColor = 0x00f01c;
        nameTxt.bold = true;
        // nameTxt.textAlign = egret.HorizontalAlign.CENTER
        // nameTxt.lineSpacing = 5
        _this.addChild(nameTxt);
        _this.cacheAsBitmap = true;
        return _this;
    }
    MapEntityTxt.prototype.SetNameColor = function (enemy) {
        this.txt.textColor = enemy ? Color.Red : 0x00f01c;
    };
    Object.defineProperty(MapEntityTxt.prototype, "text", {
        set: function (value) {
            this.txt.text = value;
            this.img.width = this.txt.width + 12;
            if (this.nextText) {
                DisplayUtils.removeFromParent(this.nextText);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapEntityTxt.prototype, "textFlow", {
        set: function (value) {
            this.txt.textFlow = value;
            this.img.width = this.txt.width + 12;
            if (this.nextText) {
                DisplayUtils.removeFromParent(this.nextText);
            }
        },
        enumerable: true,
        configurable: true
    });
    MapEntityTxt.prototype.SetNextText = function (value) {
        if (!value) {
            if (this.nextText) {
                DisplayUtils.removeFromParent(this.nextText);
            }
            return;
        }
        var txt = this.nextText;
        if (!txt) {
            txt = this.nextText = new eui.Label;
            txt.y = 30;
            txt.horizontalCenter = 0;
            txt.size = 18;
            txt.textColor = Color.White;
            txt.bold = true;
        }
        this.addChild(txt);
        txt.text = "帮：" + value;
    };
    return MapEntityTxt;
}(eui.Group));
__reflect(MapEntityTxt.prototype, "MapEntityTxt");
//# sourceMappingURL=MapEntity.js.map