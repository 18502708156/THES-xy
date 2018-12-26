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
var TianShenBaoQiModel = (function (_super) {
    __extends(TianShenBaoQiModel, _super);
    function TianShenBaoQiModel() {
        var _this = _super.call(this) || this;
        /**可升级至多少级 */
        _this.MAX_LEVEL = 10;
        _this.MAX_GM_LEVEL = 10;
        _this.mTianShenBaoQiDatas = {};
        _this.regNetMsg(S2cProtocol.sc_tianshen_spells_info, _this._DoTianShenSpellsInfo);
        return _this;
    }
    /**
    * 获取宝器配置
    */
    TianShenBaoQiModel.prototype.getConfig = function () {
        return GameGlobal.Config.AirMarshalTreasureConfig;
    };
    TianShenBaoQiModel.prototype.getLevelsConfig = function (id) {
        return GameGlobal.Config.AirMarshalTreasureAttrsConfig[id];
    };
    /**
     * 获取突破等级对应战力属性
     */
    TianShenBaoQiModel.prototype.getPower = function (id, level) {
        var lvConfig = this.getLevelsConfig(id)[level];
        if (lvConfig.attrs) {
            return ItemConfig.CalcAttrScoreValue(lvConfig.attrs);
        }
        return 0;
    };
    TianShenBaoQiModel.prototype.Init = function () {
        for (var k in GameGlobal.Config.AirMarshalTreasureConfig) {
            var info = new TianShenBaoQiInfo;
            info.mPos = parseInt(k);
            this.mTianShenBaoQiDatas[k] = info;
        }
        for (var k in GameGlobal.Config.AirMarshalTreasureAttrsConfig) {
            this.MAX_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.AirMarshalTreasureAttrsConfig[k]);
            break;
        }
        this.MAX_GM_LEVEL = CommonUtils.getObjectLength(GameGlobal.Config.AirMarshalResonateConfig);
    };
    TianShenBaoQiModel.prototype.GetAllLevel = function () {
        var count = 0;
        for (var k in this.mTianShenBaoQiDatas) {
            var petInfo = this.mTianShenBaoQiDatas[k];
            if (petInfo.mLevel) {
                count += petInfo.mLevel;
            }
        }
        return count;
    };
    /**
     * 天神宝器数据
     */
    TianShenBaoQiModel.prototype._DoTianShenSpellsInfo = function (rsp) {
        for (var i = 0; i < rsp.data.length; i++) {
            var info = this.mTianShenBaoQiDatas[i + 1];
            if (info) {
                info.UpdateInfo(rsp.data[i]);
            }
        }
    };
    /**
     * 宝器升级
     * @param pos 第几个宝器
     * @param autoBuy 自动购买
     */
    TianShenBaoQiModel.prototype.sendUpLevel = function (pos, autoBuy) {
        var _this = this;
        var req = new Sproto.cs_tianshen_spells_request;
        req.pos = pos;
        req.autoBuy = autoBuy;
        this.Rpc(C2sProtocol.cs_tianshen_spells, req, function (rsp) {
            if (rsp.ret) {
                var info = _this.mTianShenBaoQiDatas[rsp.pos];
                if (info) {
                    info.mLevel = rsp.lv;
                    info.mExpUpNum = rsp.upNum;
                    GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BAOQI_UPDATE_INFO);
                    GameGlobal.MessageCenter.dispatch(MessageDef.TIANSHEN_BAOQI_UPDATE_EXP);
                }
            }
        }, this);
    };
    return TianShenBaoQiModel;
}(BaseSystem));
__reflect(TianShenBaoQiModel.prototype, "TianShenBaoQiModel");
//# sourceMappingURL=TianShenBaoQiModel.js.map