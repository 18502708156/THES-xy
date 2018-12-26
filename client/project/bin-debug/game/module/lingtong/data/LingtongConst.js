var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LingtongConst = (function () {
    function LingtongConst() {
    }
    LingtongConst.GetName = function (id) {
        var config = GameGlobal.Config.BabyActivationConfig[id];
        if (!config) {
            return;
        }
        return config.name;
    };
    LingtongConst.GetHeadIcon = function (id) {
        if (!id) {
            return "";
        }
        return "resource/assets/image/head/ltong/" + id + ".png";
    };
    LingtongConst.GetLingAttr = function (petId, index, level) {
        var data = GameGlobal.Config.BabyLingConfig[petId][level - 1];
        if (!data) {
            return {};
        }
        return data[LingtongConst.LING_INDEX_NAME[index - 1]];
    };
    LingtongConst.GetHunAttr = function (suitConfigId, index, level) {
        var data = GameGlobal.Config.BabyHunLvConfig[suitConfigId][level - 1];
        if (!data) {
            return {};
        }
        return data[LingtongConst.LING_HUN_INDEX_NAME[index - 1]];
    };
    LingtongConst.GetActiveItemId = function (petId) {
        return GameGlobal.Config.BabyActivationConfig[petId].material.id;
    };
    LingtongConst.GetYulQuality = function (lingLv) {
        return this.LING_LING_INDEX_NAME[lingLv] || "";
    };
    LingtongConst.GetSuitName = function (suitid) {
        return this.suitName[suitid];
    };
    LingtongConst.SetPetHunIcon = function (item, suit, index, hunLv) {
        if (hunLv) {
            // let iconStr = this.GetSuitIcon(suit, index)
            // item.icon.setItemImg(ResDataPath.GetItemFullPath(iconStr))
            if (!item.mv) {
                item.mv = new MovieBaseObject;
                item.effGroup.addChild(item.mv);
            }
            item.mv.LoadByUrl(ResDataPath.GetUIEffePath("ui_eff_yuhun_00" + index));
            item.addImg.visible = false;
        }
        else {
            // item.icon.setItemImg("")
            item.addImg.visible = true;
            if (item.mv) {
                item.mv.ClearCache();
            }
        }
    };
    LingtongConst.LING_INDEX_NAME = (_a = {},
        _a[0] = "one",
        _a[1] = "two",
        _a[2] = "three",
        _a[3] = "four",
        _a[4] = "five",
        _a);
    LingtongConst.LING_HUN_INDEX_NAME = (_b = {},
        _b[0] = "yuhone",
        _b[1] = "yuhtwo",
        _b[2] = "yuhthree",
        _b[3] = "yuhfour",
        _b[4] = "yuhfive",
        _b[5] = "yuhsix",
        _b);
    LingtongConst.LING_LING_INDEX_NAME = (_c = {},
        _c[0] = "绿品",
        _c[1] = "绿品",
        _c[2] = "蓝品",
        _c[3] = "紫品",
        _c[4] = "橙品",
        _c[5] = "红品",
        _c);
    LingtongConst.suitName = (_d = {}, _d[1] = "天空之翼", _d[2] = "秘境之力", _d[3] = "森林守护", _d[4] = "天帝宝库", _d);
    return LingtongConst;
}());
__reflect(LingtongConst.prototype, "LingtongConst");
var _a, _b, _c, _d;
//# sourceMappingURL=LingtongConst.js.map