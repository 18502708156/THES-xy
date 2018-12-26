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
var TianShenBaoQiPanel = (function (_super) {
    __extends(TianShenBaoQiPanel, _super);
    function TianShenBaoQiPanel() {
        var _this = _super.call(this) || this;
        /////////////////////////////////////////////////////////////////////////////
        _this.mModel = GameGlobal.TianShenBaoQiModel;
        _this.mBaoQiPlots = [];
        _this.pos = 1;
        _this.mRoleAutoSendData = new RoleAutoSendData(function () {
            if (!_this._SendUp()) {
                _this.mRoleAutoSendData.Stop();
            }
        }, function () {
            if (_this.mRoleAutoSendData.mIsAuto) {
                _this.btnAuto.label = "停止";
            }
            else {
                _this.btnAuto.label = "自动进阶";
            }
        }, 200);
        _this.mRoleSendCheckData = new RoleSendCheckData(function (type) {
            if (_this.mModel) {
                _this.mModel.sendUpLevel(_this.pos, type);
            }
        }, function () {
            var info = _this.mModel.mTianShenBaoQiDatas[_this.pos];
            var levelConfig = info.GetLevelConfig();
            if (!levelConfig) {
                return [null];
            }
            var cost = levelConfig.cost;
            return [cost[0].id, cost[0].count, cost[1].id, cost[1].count];
        }, function () {
            return _this.checkBox.selected;
        }, function () {
            _this.mRoleAutoSendData.Toggle();
        });
        return _this;
    }
    TianShenBaoQiPanel.prototype.childrenCreated = function () {
        this.mBaoQiPlots.push(this.baoQiItem1);
        this.mBaoQiPlots.push(this.baoQiItem2);
        this.mBaoQiPlots.push(this.baoQiItem3);
        this.mBaoQiPlots.push(this.baoQiItem4);
        this.mBaoQiList = CommonUtils.GetArray(GameGlobal.Config.AirMarshalTreasureConfig, "id");
        for (var i = 0; i < 4; i++) {
            this.mBaoQiPlots[i].setData(this.mBaoQiList[i]);
        }
        this._AddClick(this.baoQiItem1, this._OnClick);
        this._AddClick(this.baoQiItem2, this._OnClick);
        this._AddClick(this.baoQiItem3, this._OnClick);
        this._AddClick(this.baoQiItem4, this._OnClick);
        this._AddClick(this.btnGM, this._OnClick);
        this._AddClick(this.btnCulture, this._OnClick);
        this._AddClick(this.btnAuto, this._OnClick);
    };
    /**
    * 面板开启执行函数，用于子类继承
    * @param param 参数
    */
    TianShenBaoQiPanel.prototype.OnOpen = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.observe(MessageDef.TIANSHEN_BAOQI_UPDATE_INFO, this.UpdateContent);
        this.observe(MessageDef.TIANSHEN_BAOQI_UPDATE_EXP, this._DoUpdateExp);
    };
    /**
     * 面板关闭执行函数，用于子类继承
     * @param param 参数
     */
    TianShenBaoQiPanel.prototype.OnClose = function () {
        var param = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            param[_i] = arguments[_i];
        }
        this.removeObserve();
        this.mRoleAutoSendData.Stop();
    };
    TianShenBaoQiPanel.prototype._OnClick = function (e) {
        switch (e.currentTarget) {
            case this.baoQiItem1:
            case this.baoQiItem2:
            case this.baoQiItem3:
            case this.baoQiItem4:
                var item = e.currentTarget;
                if (item.isopen) {
                    this.setState(item.pos);
                    this.pos = item.pos;
                }
                else {
                    var config = GameGlobal.Config.AirMarshalTreasureConfig[item.pos];
                    if (config) {
                        UserTips.ins().showTips(config.des);
                    }
                }
                break;
            case this.btnCulture:
                this._SendUp();
                break;
            case this.btnAuto:
                this.mRoleAutoSendData.Toggle();
                break;
            case this.btnGM:
                ViewManager.ins().open(TianShenGmPanel);
                break;
        }
    };
    TianShenBaoQiPanel.prototype.setState = function (index) {
        var i = 0, len = this.mBaoQiPlots.length;
        for (i; i < len; i++) {
            this.mBaoQiPlots[i].currentState = 'up';
        }
        this['baoQiItem' + index].currentState = 'down';
    };
    TianShenBaoQiPanel.prototype.UpdateContent = function () {
        var info = this.mModel.mTianShenBaoQiDatas[this.pos];
        //选中
        this.setState(this.pos);
        this.mBaoQiPlots[this.pos - 1].updateLevel(info.mLevel);
        var config = GameGlobal.TianShenBaoQiModel.getConfig();
        this.lbLev.text = info.mLevel + "\n阶";
        this.powerLabel.text = ItemConfig.CalcAttrScoreValue(config[this.pos].attrs) + GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel - 1);
        this.showImg.source = config[this.pos].icon; //+ '_s';
        var levelsConfig = GameGlobal.Config.AirMarshalTreasureAttrsConfig[this.pos];
        var curConfig = levelsConfig[info.mLevel - 1];
        var nextConfig = levelsConfig[info.mLevel];
        if (!nextConfig) {
            this.currentState = 'full';
            this.tcurName.text = this.mBaoQiList[this.pos - 1].name + ' ' + info.mLevel + '阶';
            this.showCurAttrs(curConfig);
            return;
        }
        else {
            this.currentState = 'normal';
        }
        //显示属性
        this.tcurName.text = this.mBaoQiList[this.pos - 1].name + ' ' + info.mLevel + '阶';
        this.tnextName.text = this.mBaoQiList[this.pos - 1].name + ' ' + (info.mLevel + 1) + '阶';
        this.showCurAttrs(curConfig);
        this.showNextAttrs(nextConfig);
        this.tpower.text = '战力+' + (GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel) - GameGlobal.TianShenBaoQiModel.getPower(this.pos, info.mLevel - 1));
        this._UpdateExp();
    };
    TianShenBaoQiPanel.prototype.showCurAttrs = function (config) {
        if (!config) {
            this.curProLabel0.text = '0';
            this.curProLabel1.text = '0';
            this.curProLabel2.text = '0';
            return;
        }
        this.curProLabel0.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.curProLabel1.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.curProLabel2.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    };
    TianShenBaoQiPanel.prototype.showNextAttrs = function (config) {
        if (!config)
            return;
        this.nextProLabel0.text = AttributeData.getAttStrByType(config.attrs[0], 0, '+', false, '#ffffff');
        this.nextProLabel1.text = AttributeData.getAttStrByType(config.attrs[1], 0, '+', false, '#ffffff');
        this.nextProLabel2.text = AttributeData.getAttStrByType(config.attrs[2], 0, '+', false, '#ffffff');
    };
    TianShenBaoQiPanel.prototype._DoUpdateExp = function () {
        this.mRoleAutoSendData.Continue();
        this._UpdateExp();
    };
    TianShenBaoQiPanel.prototype._UpdateExp = function () {
        var info = this.mModel.mTianShenBaoQiDatas[this.pos];
        var levelConfig = info.GetLevelConfig();
        if (!levelConfig) {
            return;
        }
        this.bar.maximum = levelConfig.proexp;
        this.bar.value = info.mExpUpNum * levelConfig.exp;
        this.consumeLabel.Set(levelConfig.cost);
    };
    TianShenBaoQiPanel.prototype._SendUp = function () {
        return this.mRoleSendCheckData.SendUp();
    };
    TianShenBaoQiPanel.NAME = "宝器";
    return TianShenBaoQiPanel;
}(BaseView));
__reflect(TianShenBaoQiPanel.prototype, "TianShenBaoQiPanel", ["ICommonWindowTitle"]);
var TianShenBaoQiHeadItem = (function (_super) {
    __extends(TianShenBaoQiHeadItem, _super);
    function TianShenBaoQiHeadItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isopen = false;
        return _this;
    }
    TianShenBaoQiHeadItem.prototype.setData = function (config) {
        if (config) {
            this.pos = config.id;
            this.lbName.text = config.name;
            this.lbName.textColor = ItemBase.GetColorByQuality(3);
            var info = GameGlobal.TianShenBaoQiModel.mTianShenBaoQiDatas[config.id];
            this.lbLev.text = "";
            this.lbLev2.text = info.mLevel > 0 ? info.mLevel + "阶" : "";
            this.item.SetQuality(3); //(config.quality)
            this.item.setItemImg(config.icon + '');
            this.isopen = info.mLevel > 0;
            this.item.setGray(info.mLevel == 0);
        }
    };
    TianShenBaoQiHeadItem.prototype.updateLevel = function (lv) {
        this.lbLev2.text = lv + "阶";
    };
    return TianShenBaoQiHeadItem;
}(eui.Component));
__reflect(TianShenBaoQiHeadItem.prototype, "TianShenBaoQiHeadItem");
//# sourceMappingURL=TianShenBaoQiPanel.js.map