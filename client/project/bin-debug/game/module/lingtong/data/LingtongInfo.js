var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LingtongInfo = (function () {
    function LingtongInfo() {
    }
    LingtongInfo.GetQuality = function (id) {
        var config = GameGlobal.Config.BabyActivationConfig[id];
        if (config) {
            return config.quality;
        }
        return 0;
    };
    LingtongInfo.prototype.UpdateInfo = function (rsp) {
        this.mId = rsp.id;
        this.mName = rsp.name;
        this.mLevel = rsp.lv;
        this.mUpNum = rsp.upNum;
        this.mBuffs = rsp.buffs;
        this.mGiftExp = rsp.giftexp;
        this.mGiftLevel = rsp.giftlv;
        this.mXilian = rsp.xilian;
        this.mXilianSkills = rsp.xilianSkills || [];
        this.mLing = rsp.ling;
        this.mHun = rsp.hun;
        this.mHunShit = rsp.hunsuit;
        this.suitConfigId = GameGlobal.Config.BabyActivationConfig[this.mId].huntype;
    };
    LingtongInfo.prototype.getSuitId = function () {
        if (!this.mHunShit) {
            return 0;
        }
        return LingtongInfo.LEVEL[this.mHunShit] || 1;
    };
    LingtongInfo.prototype.getId = function () {
        return this.mId;
    };
    LingtongInfo.prototype.getQuality = function () {
        var config = GameGlobal.Config.BabyActivationConfig[this.mId];
        if (config) {
            return config.quality;
        }
        return 3;
    };
    LingtongInfo.prototype.getLings = function () {
        return this.mLing || [];
    };
    LingtongInfo.prototype.getLingByIndex = function (index) {
        var ling = this.getLings();
        return ling[index - 1] || 0;
    };
    LingtongInfo.prototype.getHunByIndex = function (index) {
        return this.mHun[index - 1] || 0;
    };
    LingtongInfo.prototype.getActiveHunCount = function (level) {
        var i;
        var len = this.mHun.length;
        var _activeCount = 0;
        for (i = 0; i < len; i++) {
            if (this.mHun[i] >= level) {
                _activeCount++;
            }
        }
        return _activeCount;
    };
    LingtongInfo.GetBasePower = function (id) {
        return ItemConfig.CalcAttrScoreValue(this.GetAttrByLv(id, 1, 0));
    };
    LingtongInfo.prototype.getPower = function () {
        return this.GetDescPower() + this.GetYulPower() + this.GetYuhPower();
    };
    LingtongInfo.prototype.GetDescPower = function () {
        var power = 0;
        power += ItemConfig.CalcAttrScoreValue(this.GetAttr());
        power += ItemConfig.CalcAttrScoreValue(GameGlobal.LingtongAttrModel.getTianFuAllAttr(this.mId, this.mGiftLevel, this.mGiftExp));
        // power += ItemConfig.CalcAttrScoreValue(GameGlobal.LingtongModel.GetCurDrugAttr())
        return power;
    };
    LingtongInfo.prototype.GetAttr = function () {
        return LingtongInfo.GetAttrByLv(this.mId, this.mLevel, this.mUpNum);
    };
    LingtongInfo.GetAttrByLv = function (id, lv, upnum) {
        var config = GameGlobal.Config.BabyProgressConfig[id];
        if (!config) {
            return [];
        }
        config = config[lv - 1];
        if (!config) {
            return [];
        }
        var cfg = GameGlobal.Config.BabyAttrsConfig[lv];
        if (!cfg) {
            return [];
        }
        var upConfig = cfg.attrpower;
        var attr = [];
        var configAttr = config.attrpower;
        for (var k in configAttr) {
            var data = configAttr[k];
            for (var k2 in upConfig) {
                if (upConfig[k2].type == data.type) {
                    attr.push({ type: data.type, value: data.value + upConfig[k2].value * upnum });
                    break;
                }
            }
        }
        return attr;
    };
    LingtongInfo.prototype.GetYulCount = function () {
        var lings = this.mLing || [];
        var count = 0;
        for (var _i = 0, lings_1 = lings; _i < lings_1.length; _i++) {
            var lv = lings_1[_i];
            ++count;
        }
        return count;
    };
    LingtongInfo.prototype.GetYulPower = function () {
        var i;
        var lings = this.mLing || [];
        var len = lings.length;
        var list = [];
        for (i = 0; i < len; i++) {
            if (!lings[i]) {
                continue;
            }
            var attr = LingtongConst.GetLingAttr(this.mId, i + 1, lings[i]);
            list.push(attr);
        }
        return ItemConfig.CalcAttrScoreValue(list);
    };
    LingtongInfo.prototype.GetYuhPower = function () {
        if (!this.mHun || !this.mHun.length) {
            return 0;
        }
        var list = [];
        for (var i = 0; i < this.mHun.length; i++) {
            if (!this.mHun[i]) {
                continue;
            }
            var attr = LingtongConst.GetHunAttr(this.suitConfigId, i + 1, this.mHun[i]);
            list.push(attr);
        }
        return ItemConfig.CalcAttrScoreValue(list);
    };
    LingtongInfo.LEVEL = (_a = {},
        _a[50] = 6,
        _a[40] = 5,
        _a[30] = 4,
        _a[20] = 3,
        _a[10] = 2,
        _a[1] = 1,
        _a);
    return LingtongInfo;
}());
__reflect(LingtongInfo.prototype, "LingtongInfo");
var _a;
//# sourceMappingURL=LingtongInfo.js.map