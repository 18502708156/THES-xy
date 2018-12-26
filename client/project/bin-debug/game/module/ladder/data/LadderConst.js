var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var LadderConst = (function () {
    function LadderConst() {
    }
    LadderConst.GetMiniIcon = function (level) {
        return this.GRADE_MINI_ICON[level] || "";
    };
    LadderConst.SetGradeInfo = function (comp, grade) {
        var target = comp;
        var config = GameGlobal.Config.KingSportsConfig[grade];
        var configData = LadderConst.GRADE_LIST[config.showType];
        if (!configData) {
            return;
        }
        target.img1.source = configData.icon;
        target.img2.source = configData.level[config.showLevel] || "";
    };
    LadderConst.GetMiddleIcon = function (level) {
        return LadderConst.GRADE_ICON[level] || "";
    };
    LadderConst.GetRankIconTwo = function (level) {
        switch (level) {
            case 1: return "青铜";
            case 2: return "白银";
            case 3: return "黄金";
            case 4: return "钻石";
            case 5: return "王者";
        }
        return "青铜";
    };
    // I
    // II
    // III
    // IV
    // V
    // public static GRADE_NAME_BIG_IMG = {
    // 	[1]: "font_kfwz_jjqt",
    // 	[2]: "font_kfwz_zxby",
    // 	[3]: "font_kfwz_yyhj",
    // 	[4]: "font_kfwz_yhzs",
    // 	[5]: "font_kfwz_zqwz",
    // }
    LadderConst.GetGradeInfo = function (grade) {
        return LadderConst.STR[grade] || "";
    };
    LadderConst.GRADE_LIST = (_a = {},
        _a[5] = { icon: "font_kfwz_zqwz02", level: ["", "font_kfwz_zqwz001", "font_kfwz_zqwz002", "font_kfwz_zqwz003", "font_kfwz_zqwz004", "font_kfwz_zqwz005"] },
        _a[4] = { icon: "font_kfwz_yhzs02", level: ["", "font_kfwz_yhzs001", "font_kfwz_yhzs002", "font_kfwz_yhzs003", "font_kfwz_yhzs004", "font_kfwz_yhzs005"] },
        _a[3] = { icon: "font_kfwz_ryhj02", level: ["", "font_kfwz_ryhj001", "font_kfwz_ryhj002", "font_kfwz_ryhj003", "font_kfwz_ryhj004", "font_kfwz_ryhj005"] },
        _a[2] = { icon: "font_kfwz_zxby02", level: ["", "font_kfwz_zxby001", "font_kfwz_zxby002", "font_kfwz_zxby003", "font_kfwz_zxby004", "font_kfwz_zxby005"] },
        _a[1] = { icon: "font_kfwz_jjqt02", level: ["", "font_kfwz_jjqt001", "font_kfwz_jjqt002", "font_kfwz_jjqt003", "font_kfwz_jjqt004", "font_kfwz_jjqt005"] },
        _a);
    LadderConst.GRADE_ICON = (_b = {},
        _b[5] = "ui_kfwz_hz_zqwz01",
        _b[4] = "ui_kfwz_hz_yhzs01",
        _b[3] = "ui_kfwz_hz_ryhj01",
        _b[2] = "ui_kfwz_hz_zxby01",
        _b[1] = "ui_kfwz_hz_jjqt01",
        _b);
    LadderConst.GRADE_MINI_ICON = (_c = {},
        _c[1] = "ui_kfwz_hz_jjqt02",
        _c[2] = "ui_kfwz_hz_zxby02",
        _c[3] = "ui_kfwz_hz_ryhj02",
        _c[4] = "ui_kfwz_hz_yhzs02",
        _c[5] = "ui_kfwz_hz_zqwz02",
        _c);
    LadderConst.STR = (_d = {},
        _d[1] = "倔\n强\n青\n铜\nIII",
        _d[2] = "倔\n强\n青\n铜\nII",
        _d[3] = "倔\n强\n青\n铜\nI",
        _d[4] = "秩\n序\n白\n银\nIV",
        _d[5] = "秩\n序\n白\n银\nIII",
        _d[6] = "秩\n序\n白\n银\nII",
        _d[7] = "秩\n序\n白\n银\nI",
        _d[8] = "荣\n耀\n黄\n金\nV",
        _d[9] = "荣\n耀\n黄\n金\nIV",
        _d[10] = "荣\n耀\n黄\n金\nIII",
        _d[11] = "荣\n耀\n黄\n金\nII",
        _d[12] = "荣\n耀\n黄\n金\nI",
        _d[13] = "永\n恒\n钻\n石\nV",
        _d[14] = "永\n恒\n钻\n石\nIV",
        _d[15] = "永\n恒\n钻\n石\nIII",
        _d[16] = "永\n恒\n钻\n石\nII",
        _d[17] = "永\n恒\n钻\n石\nI",
        _d[18] = "最\n强\n王\n者\nV",
        _d[19] = "最\n强\n王\n者\nIV",
        _d[20] = "最\n强\n王\n者\nIII",
        _d[21] = "最\n强\n王\n者\nII",
        _d[22] = "最\n强\n王\n者\nI",
        _d);
    return LadderConst;
}());
__reflect(LadderConst.prototype, "LadderConst");
var _a, _b, _c, _d;
//# sourceMappingURL=LadderConst.js.map