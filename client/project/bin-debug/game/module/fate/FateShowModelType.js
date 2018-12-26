var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 系統預告_怪物顯示類型
 */
var FateShowModelType;
(function (FateShowModelType) {
    /**図片 */
    FateShowModelType[FateShowModelType["LogoImg"] = 0] = "LogoImg";
    /**角色 */
    FateShowModelType[FateShowModelType["Role"] = 1] = "Role";
    /**寵物 */
    FateShowModelType[FateShowModelType["Pet"] = 2] = "Pet";
    /**仙侶 */
    FateShowModelType[FateShowModelType["FairyTale"] = 3] = "FairyTale";
    /**玄女 */
    FateShowModelType[FateShowModelType["FemaleDeva"] = 4] = "FemaleDeva";
    /**天神 */
    FateShowModelType[FateShowModelType["GodOfHeaven"] = 5] = "GodOfHeaven";
    /**靈童 */
    FateShowModelType[FateShowModelType["SpiritualChild"] = 8] = "SpiritualChild";
    /**坐騎 */
    FateShowModelType[FateShowModelType["Mounts"] = 10] = "Mounts";
    /**翅膀 */
    FateShowModelType[FateShowModelType["Wing"] = 11] = "Wing";
    /**守护 */
    FateShowModelType[FateShowModelType["TheFairy"] = 12] = "TheFairy";
    /**神兵 */
    FateShowModelType[FateShowModelType["DivineTroops"] = 13] = "DivineTroops";
    /**時裝 */
    FateShowModelType[FateShowModelType["Fashion"] = 14] = "Fashion";
    /**稱號 */
    FateShowModelType[FateShowModelType["Title"] = 15] = "Title";
    /**寵物通靈 */
    FateShowModelType[FateShowModelType["PetPsyche"] = 20] = "PetPsyche";
    /**寵物獸魂 */
    FateShowModelType[FateShowModelType["PetAnimalSoul"] = 21] = "PetAnimalSoul";
    /**仙侶法陣 */
    FateShowModelType[FateShowModelType["FairyTaleNormalArray"] = 30] = "FairyTaleNormalArray";
    /**仙侶仙位 */
    FateShowModelType[FateShowModelType["FairyTaleImmortalPosition"] = 31] = "FairyTaleImmortalPosition";
    /**玄女法器 */
    FateShowModelType[FateShowModelType["FemaleDevaWeapons"] = 40] = "FemaleDevaWeapons";
    /**玄女花X */
    FateShowModelType[FateShowModelType["FemaleDevaFlower"] = 41] = "FemaleDevaFlower";
    /**玄女靈氣 */
    FateShowModelType[FateShowModelType["FemaleDevaO2"] = 42] = "FemaleDevaO2";
    /**法寶 */
    FateShowModelType[FateShowModelType["MagicProps"] = 16] = "MagicProps";
})(FateShowModelType || (FateShowModelType = {}));
/**
 * 功能預告 特效
 */
var FateEff = (function () {
    function FateEff() {
    }
    FateEff.isShowEff = function (thisObj) {
        if (FateEff.IDED2 != 0) {
            switch (GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type) {
                case FateShowModelType.Mounts:
                case FateShowModelType.Title:
                case FateShowModelType.Fashion:
                case FateShowModelType.TheFairy:
                case FateShowModelType.DivineTroops:
                case FateShowModelType.Wing:
                case FateShowModelType.MagicProps:
                    //this.effArr.push(this.addEff(thisObj["roleBtn"],"ui_zhy001"));
                    var btn = thisObj["roleBtn"];
                    UIHelper.SetBtnEffe(btn, "ui_zhy001", true, 1, 1, 55, 55);
                    break;
                case FateShowModelType.FairyTale:
                case FateShowModelType.FairyTaleNormalArray:
                case FateShowModelType.FairyTaleImmortalPosition:
                case FateShowModelType.FemaleDeva:
                case FateShowModelType.FemaleDevaFlower:
                case FateShowModelType.FemaleDevaWeapons:
                case FateShowModelType.FemaleDevaO2:
                    var btn2 = thisObj["xiannvBtn"];
                    UIHelper.SetBtnEffe(btn2, "ui_zhy001", true, 1, 1, 55, 55);
                    break;
                case FateShowModelType.Pet:
                case FateShowModelType.PetPsyche:
                case FateShowModelType.PetAnimalSoul:
                    var btn3 = thisObj["petBtn"];
                    UIHelper.SetBtnEffe(btn3, "ui_zhy001", true, 1, 1, 55, 55);
                    break;
            }
        }
    };
    FateEff.isShowEff2 = function (thisObj) {
        if (FateEff.isShow == true) {
            if (FateEff.IDED2 != 0) {
                switch (GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type) {
                    case FateShowModelType.Title:
                        UIHelper.SetBtnEffe(thisObj["roleTitle"], "ui_yhy002", true, 1.2, 1.2, 47, 45);
                        break;
                    case FateShowModelType.Fashion:
                        UIHelper.SetBtnEffe(thisObj["dressBtn"], "ui_yhy002", true, 1.2, 1.2, 47, 45);
                        break;
                    case FateShowModelType.TheFairy:
                        UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0), "ui_yhy002", true, 1.2, 1.2, 47, 45);
                        break;
                    case FateShowModelType.DivineTroops:
                        UIHelper.SetBtnEffe(thisObj["list"].getChildAt(0), "ui_yhy002", true, 1.2, 1.2, 47, 45);
                        break;
                    case FateShowModelType.MagicProps:
                        UIHelper.SetBtnEffe(thisObj["bless"], "ui_yhy002", true, 1.2, 1.2, 47, 45);
                        break;
                }
            }
            FateEff.isShow = false;
        }
    };
    FateEff.isShowEff3 = function (thisObj) {
        if (FateEff.isShow3 == true) {
            if (FateEff.IDED2 != 0) {
                switch (GameGlobal.Config.FuncNoticeConfig[FateEff.IDED2].type) {
                    case FateShowModelType.Mounts://this.commonWindowBg.tabBar.getChildAt(0)
                        UIHelper.SetBtnEffe(thisObj["commonWindowBg"].tabBar.getChildAt(2), "ui_fhy002", true, 1, 1, 70, 45);
                        break;
                    case FateShowModelType.Wing:
                        UIHelper.SetBtnEffe(thisObj["commonWindowBg"].tabBar.getChildAt(3), "ui_fhy002", true, 1, 1, 70, 45);
                        break;
                }
            }
            FateEff.isShow3 = false;
        }
    };
    // public static isShow=false;
    FateEff.IDED2 = 0;
    FateEff.isShow = false;
    FateEff.isShow3 = false;
    return FateEff;
}());
__reflect(FateEff.prototype, "FateEff");
//# sourceMappingURL=FateShowModelType.js.map