var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __ref_field__ = EquipPos;
var ResDataPath = (function () {
    function ResDataPath() {
    }
    ResDataPath.GetMineNameByType = function (level) {
        return "kuangyuan_" + level;
    };
    ResDataPath.GetMapThumbnailPath = function (name) {
        return "resource/assets/map/" + name + "/small.jpg";
    };
    ResDataPath.GetMapPreviewPath = function (name) {
        return "resource/assets/map/" + name + "/pk_preview.jpg";
    };
    // zz包相对路径
    ResDataPath.GetMapData = function (name) {
        return "map/" + name + "/mdata.txt";
    };
    // 获取地图资源路径
    ResDataPath.GetMapPath = function (name, x, y) {
        return "resource/assets/map/" + name + "/image/" + y + "_" + x + ".jpg";
    };
    // 获取身体资源名称
    ResDataPath.GetBodyName01 = function (appearance, sex) {
        return appearance + "_" + sex;
    };
    ResDataPath.GetWeaponName01 = function (appearance, sex) {
        return appearance + "_" + sex;
    };
    // 获取物品的完整名称
    ResDataPath.GetItemFullName = function (itemName) {
        // if (itemName == null) {
        // 	return ""
        // }
        // return itemName + "_png"
        return this.GetItemFullPath(itemName);
    };
    ResDataPath.GetItemFullPath = function (itemName) {
        return this.ROOT_ICON + itemName + ".png";
    };
    ResDataPath.GetLvName = function (zsLevel, level) {
        return GameString.GetLvName(zsLevel, level);
    };
    // 获取物品品质图片名称
    ResDataPath.GetItemQualityName = function (quality) {
        return ResDataPath.ITEM_BG_QUALITY[quality];
        // return "Common_Quality_00" + quality
    };
    // 获取物品品质特效名称
    ResDataPath.GetItemQualityEffeName = function (quality) {
        return 'quality_0' + quality;
    };
    // 获取头像图片名称
    ResDataPath.GetHeadMiniImgName = function (job, sex) {
        if (sex === void 0) { sex = null; }
        if (sex == null) {
            sex = job % 10;
            job = Math.floor(job / 10);
        }
        return "ui_head_mini_icon_" + (job || 1) + (sex || 0);
    };
    // 获取头像外框名称
    ResDataPath.GetHeadFrameImgName = function (headframe) {
        return "ui_kfwz_bm_touxiangkuang0" + headframe;
    };
    ResDataPath.GetLadderHead = function (job, sex) {
        return "ui_pp_tx_" + (job || 1) + (sex || 0);
    };
    ResDataPath.GetHeadMiniImgNameById = function (headId) {
        // return this.GetHeadMiniImgName(Math.floor((headId % 100) * 0.1), headId % 10)
        return this.GetHeadImgName(Math.floor((headId % 100) * 0.1), headId % 10);
    };
    ResDataPath.GetHeadImgName = function (job, sex) {
        return "ui_head_icon_" + job + sex;
    };
    ResDataPath.GetHeadCircleImgName = function (job, sex) {
        if (sex == null || sex == undefined) {
            if (job == JobConst.DaoShi) {
                sex = 1;
            }
            else {
                sex = 0;
            }
        }
        if (job == null || sex == null) {
            return "";
        }
        return "ui_head_ymini_icon_" + job + sex;
    };
    ResDataPath.GetHeadCircleImgNameById = function (headId) {
        // return this.GetHeadCircleImgName(Math.floor((headId % 100) * 0.1), headId % 10)
        return this.GetHeadImgName(Math.floor((headId % 100) * 0.1), headId % 10);
    };
    ResDataPath.GetEquipDefaultGreyIcon = function (type) {
        return "ui_icon_grey_equip_" + (type + 1);
    };
    ResDataPath.GetEquipDefaultIcon = function (type) {
        return "ui_icon_eqiup_" + (type + 1);
    };
    ResDataPath.GetHeroEquipDefaultIcon = function (type) {
        return ResDataPath._HeroEquipDefaultIcon[type];
    };
    ////////////////////////////////////////////// 路径 ////////////////////////////////////////////////////////////
    ResDataPath.GetAssets = function (name) {
        return ResDataPath.ROOT + name + ".png";
    };
    ResDataPath.GetMoviePath = function (name, type) {
        if (type === void 0) { type = null; }
        if (type) {
            return ResDataPath.ROOT_MOVIE + type + "/" + name;
        }
        return ResDataPath.ROOT_MOVIE + name;
    };
    ResDataPath.GetMovieStandPath = function (name) {
        return this.GetMoviePath(name);
    };
    ResDataPath.GetRingPath = function (effeName) {
        return ResDataPath.ROOT_MOVIE + "ring/" + effeName;
    };
    ResDataPath.GetMonsterBodyPath = function (name) {
        return ResDataPath.ROOT_MOVIE + "monster/" + name;
    };
    ResDataPath.GetRoleBodyPath = function (name) {
        return ResDataPath.ROOT_MOVIE + "body/" + name;
    };
    ResDataPath.GetShinvBodyPath = function (shinvId) {
        return "";
    };
    ResDataPath.GetShinvShowPath = function (shinvId) {
        return "";
    };
    ResDataPath.GetSkillPathByID = function (id) {
        return ResDataPath.ROOT_MOVIE + "skillEff/" + id;
    };
    ResDataPath.GetSkillPath = function (skillEffName) {
        return ResDataPath.ROOT_MOVIE + "skillEff/" + skillEffName;
    };
    ResDataPath.GetUIEffePath = function (effeName) {
        return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName;
    };
    ResDataPath.GetUIEffePath2 = function (effeName) {
        return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName;
    };
    ResDataPath.GetRoleBodyPath2 = function (effeName) {
        return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName;
    };
    ResDataPath.GetRoleShowPath = function (name) {
        if (!name) {
            return "";
        }
        return ResDataPath.ROOT_MOVIE + "role_show/" + name;
    };
    ResDataPath.GetVIPImgPath = function (name) {
        return ResDataPath.ROOT + "image/img/vip_show/" + name + ".png";
    };
    ResDataPath.GetHeroImgPath = function (name) {
        return ResDataPath.ROOT_MOVIE + "role_show/" + name;
    };
    ResDataPath.GetPetImgPath = function (name) {
        return ResDataPath.ROOT + "image/img/pet_show/" + name + ".png";
    };
    //获取藏经阁书籍图标
    ResDataPath.GetBookIcon = function (level) {
        switch (level) {
            case 1: return "ui_cjg_tyjs_bai";
            case 2: return "ui_cjg_tyjs_lan";
            case 3: return "xyy";
            case 4: return "ui_cjg_tyjs_huang";
            case 5: return "ui_cjg_tyjs_hong";
        }
    };
    //获取藏经阁武学名称(竖)
    ResDataPath.GetGonfuName = function (level) {
        switch (level) {
            case 1: return "ui_cjg_tyjs_hhjf";
            case 2: return "ui_cjg_tyjs_tqjf";
            case 3: return "xxdf";
            case 4: return "ui_cjg_tyjs_jysg";
            case 5: return "ui_cjg_tyjs_khbd";
        }
    };
    //获取藏经阁武学名称(横)
    ResDataPath.GetGonfuName1 = function (level) {
        switch (level) {
            case 1: return "ui_cjg_hhjf";
            case 2: return "ui_cjg_tqjf";
            case 3: return "ui_cjg_xxdf";
            case 4: return "ui_cjg_jysg";
            case 5: return "ui_cjg_kfbd";
        }
    };
    //获取藏经阁人物图标
    ResDataPath.GetCjgRoleIcon = function (level) {
        switch (level) {
            case 1: return "ui_cjg_dzn1";
            case 2: return "ui_cjg_dzn1";
            case 3: return "ui_cjg_dzn1";
            case 4: return "ui_cjg_dzn2";
            case 5: return "ui_cjg_dzn3";
        }
    };
    //获取藏经阁人物书籍
    ResDataPath.GetRoleBookIcon = function (level) {
        switch (level) {
            case 1: return "ui_cjg_huise";
            case 2: return "ui_cjg_lan";
            case 3: return "ui_cjg_zi";
            case 4: return "ui_cjg_huang";
            case 5: return "ui_cjg_hong";
        }
    };
    //获取藏经阁典籍图标(带字)
    ResDataPath.GetCjgBookIcon = function (level) {
        switch (level) {
            case 1: return "ui_cjg_hhjf2";
            case 2: return "ui_cjg_tqjf2";
            case 3: return "ui_cjg_xxdf2";
            case 4: return "ui_cjg_jysg2";
            case 5: return "ui_cjg_khbd2";
        }
    };
    //排行榜前三名称
    ResDataPath.GetRankingImg = function (value) {
        switch (value) {
            case 1: return "ui_phb_p_ks1"; //魁首
            case 2: return "ui_phb_p_by2"; //榜眼
            case 3: return "ui_phb_p_th3"; //探花
        }
    };
    //排行榜前三名称
    ResDataPath.GetRankingBg2 = function (pos) {
        switch (pos) {
            case 1: return "ui_ctg_p_no1"; //榜首
            case 2: return "ui_ctg_p_no2"; //榜眼
            case 3: return "ui_ctg_p_no3"; //探花
            default: return "";
        }
    };
    ResDataPath.GetRankingBigImg = function (value) {
        switch (value) {
            case 1: return "ui_ctg_zi_kuis"; //魁首
            case 2: return "ui_ctg_zi_bangyan"; //榜眼
            case 3: return "ui_ctg_zi_tanhua"; //探花
        }
    };
    //排行前三名背景图
    ResDataPath.GetRankingBg = function (value) {
        switch (value) {
            case 1: return "ui_phb_p_1";
            case 2: return "ui_phb_p_2";
            case 3: return "ui_phb_p_3";
        }
    };
    //获取帮会等级美术字
    ResDataPath.GetGuildLevelImg = function (level) {
        switch (level) {
            case 1: return "ui_bh_cjbh_1";
            case 2: return "ui_bh_cjbh_2";
            case 3: return "ui_bh_cjbh_3";
            case 4: return "ui_bh_cjbh_4";
            case 5: return "ui_bh_cjbh_5";
        }
    };
    //获取帮会等级图片
    ResDataPath.GetGuildLvImg = function (level) {
        switch (level) {
            case 1: return "ui_bhjc_p_1";
            case 2: return "ui_bhjc_p_2";
            case 3: return "ui_bhjc_p_3";
            case 4: return "ui_bhjc_p_4";
            case 5: return "ui_bhjc_p_5";
            case 6: return "ui_bhjc_p_6";
        }
    };
    //获取帮会全民福利天数图标
    ResDataPath.GetGuildDayIcon = function (day) {
        switch (day) {
            case 1: return "ui_bh_fl_1";
            case 2: return "ui_bh_fl_2";
            case 3: return "ui_bh_fl_3";
            case 4: return "ui_bh_fl_4";
            case 5: return "ui_bh_fl_5";
            case 6: return "ui_bh_fl_6";
            case 7: return "ui_bh_fl_7";
        }
    };
    ResDataPath.ROOT = "resource/assets/";
    ResDataPath.ROOT_MOVIE = ResDataPath.ROOT + "movie/";
    ResDataPath.ROOT_ICON = ResDataPath.ROOT + "image/item_single/";
    ResDataPath.RES_MOVIE_MONSTER = "monster";
    ResDataPath.RES_MOVIE_BODY = "body";
    ResDataPath.EMPTY_STR = "";
    // 默认的衣服名称
    ResDataPath.DEFAULT_BODY_NAME = "body000";
    // 矿工资源名
    ResDataPath.MINER = ResDataPath.ROOT_MOVIE + "eff/" + "kuanggong";
    // 矿可掠夺
    ResDataPath.MINE_ROB_EFFE = ResDataPath.ROOT_MOVIE + "uiEffe/" + "kelveduo";
    //icon框
    ResDataPath.ITEM_BG_QUALITY = [
        "ui_bm_icon001",
        "ui_bm_icon002",
        "ui_bm_icon003",
        "ui_bm_icon004",
        "ui_bm_icon005",
        "ui_bm_icon006",
    ];
    //tip框
    ResDataPath.ITEM_TIp_QUALITY = [
        "ui_bm_putong",
        "ui_bm_lv",
        "ui_bm_blue",
        "ui_bm_zi",
        "ui_bm_orange",
        "ui_bm_red",
    ];
    ResDataPath.DEFAULT_QUALITY = ResDataPath.ITEM_BG_QUALITY[0];
    ResDataPath._HeroEquipDefaultIcon = (_a = {},
        _a[HeroEquipPos.WEAPON] = "ui_role_icon_wuqi",
        _a[HeroEquipPos.CUISH] = "ui_role_icon_toubu",
        _a[HeroEquipPos.CLOTHES] = "ui_role_icon_hujia",
        _a[HeroEquipPos.SHOE] = "ui_role_icon_hushou",
        _a);
    return ResDataPath;
}());
__reflect(ResDataPath.prototype, "ResDataPath");
var _a;
//# sourceMappingURL=ResDataPath.js.map