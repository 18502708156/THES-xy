var __ref_field__: any = EquipPos

class ResDataPath {

	public static readonly ROOT = "resource/assets/"
	public static ROOT_MOVIE = ResDataPath.ROOT + "movie/"
	public static ROOT_ICON = ResDataPath.ROOT + "image/item_single/"

	public static RES_MOVIE_MONSTER = "monster"
	public static RES_MOVIE_BODY = "body"

	public static EMPTY_STR = ""

	// 默认的衣服名称
	public static DEFAULT_BODY_NAME = "body000"

	// 矿工资源名
	public static MINER = ResDataPath.ROOT_MOVIE + "eff/" + "kuanggong"
	// 矿可掠夺
	public static MINE_ROB_EFFE = ResDataPath.ROOT_MOVIE + "uiEffe/" + "kelveduo"

	public static GetMineNameByType(level: number) {
		return "kuangyuan_" + level
	}

	public static GetMapThumbnailPath(name: string) {
		return "resource/assets/map/" + name + "/small.jpg";
	}

	public static GetMapPreviewPath(name: string) {
		return "resource/assets/map/" + name + "/pk_preview.jpg";
	}

	// zz包相对路径
	public static GetMapData(name: string) {
		return "map/" + name + "/mdata.txt"
	}

	// 获取地图资源路径
	public static GetMapPath(name: string, x: number, y: number): string {
		return "resource/assets/map/" + name + "/image/" + y + "_" + x + ".jpg";
	}

	// 获取身体资源名称
	public static GetBodyName01(appearance: string, sex: number) {
		return appearance + "_" + sex
	}

	public static GetWeaponName01(appearance: string, sex: number) {
		return appearance + "_" + sex;
	}

	// 获取物品的完整名称
	public static GetItemFullName(itemName: string) {
		// if (itemName == null) {
		// 	return ""
		// }
		// return itemName + "_png"
		return this.GetItemFullPath(itemName)
	}

	public static GetItemFullPath(itemName: string): string {
		return this.ROOT_ICON + itemName + ".png"
	}

	public static GetLvName(zsLevel: number, level: number) {
		return GameString.GetLvName(zsLevel, level)
	}
	//icon框
	static ITEM_BG_QUALITY = [
		"ui_bm_icon001",		// 白
		"ui_bm_icon002",		// 绿
		"ui_bm_icon003",		// 蓝
		"ui_bm_icon004",		// 紫
		"ui_bm_icon005",		// 橙
		"ui_bm_icon006",		// 红
	]

	//tip框
	static ITEM_TIp_QUALITY = [
		"ui_bm_putong",		// 白
		"ui_bm_lv",		// 绿
		"ui_bm_blue",		// 蓝
		"ui_bm_zi",		// 紫
		"ui_bm_orange",		// 橙
		"ui_bm_red",		// 红
	]


	public static DEFAULT_QUALITY = ResDataPath.ITEM_BG_QUALITY[0]

	// 获取物品品质图片名称
	public static GetItemQualityName(quality: number) {
		return ResDataPath.ITEM_BG_QUALITY[quality]
		// return "Common_Quality_00" + quality
	}

	// 获取物品品质特效名称
	public static GetItemQualityEffeName(quality: number) {
		return 'quality_0' + quality
	}

	// 获取头像图片名称
	public static GetHeadMiniImgName(job: number, sex: number = null) {
		if (sex == null) {
			sex = job % 10
			job = Math.floor(job / 10)
		}
		return `ui_head_mini_icon_${job || 1}${sex || 0}`
	}

	// 获取头像外框名称
	public static GetHeadFrameImgName(headframe: number) {
		return `ui_kfwz_bm_touxiangkuang0${headframe}`
	}

	public static GetLadderHead(job: number, sex: number) {
		return `ui_pp_tx_${job || 1}${sex || 0}`
	}

	public static GetHeadMiniImgNameById(headId: number): string {
		// return this.GetHeadMiniImgName(Math.floor((headId % 100) * 0.1), headId % 10)
		return this.GetHeadImgName(Math.floor((headId % 100) * 0.1), headId % 10)
	}

	public static GetHeadImgName(job: number, sex: number) {
		return `ui_head_icon_${job}${sex}`
	}
	public static GetHeadCircleImgName(job: number, sex?: number) {
		if (sex == null || sex == undefined) {
			if (job == JobConst.DaoShi) {
				sex = 1
			} else {
				sex = 0
			}
		}
		if (job == null || sex == null) {
			return ""
		}
		return `ui_head_ymini_icon_${job}${sex}`
	}
	public static GetHeadCircleImgNameById(headId: number): string {
		// return this.GetHeadCircleImgName(Math.floor((headId % 100) * 0.1), headId % 10)
		return this.GetHeadImgName(Math.floor((headId % 100) * 0.1), headId % 10)
	}

	public static GetEquipDefaultGreyIcon(type: number) {
		return "ui_icon_grey_equip_" + (type + 1)
	}

	public static GetEquipDefaultIcon(type: number) {
		return "ui_icon_eqiup_" + (type + 1)
	}

	static _HeroEquipDefaultIcon = {
		[HeroEquipPos.WEAPON]: "ui_role_icon_wuqi",
		[HeroEquipPos.CUISH]: "ui_role_icon_toubu",
		[HeroEquipPos.CLOTHES]: "ui_role_icon_hujia",
		[HeroEquipPos.SHOE]: "ui_role_icon_hushou",
	}
	public static GetHeroEquipDefaultIcon(type: number) {
		return ResDataPath._HeroEquipDefaultIcon[type];
	}

	////////////////////////////////////////////// 路径 ////////////////////////////////////////////////////////////
	public static GetAssets(name: string) {
		return ResDataPath.ROOT + name + ".png"
	}

	public static GetMoviePath(name: string, type: string = null): string {
		if (type) {
			return ResDataPath.ROOT_MOVIE + type + "/" + name
		}
		return ResDataPath.ROOT_MOVIE + name
	}

	public static GetMovieStandPath(name: string): string {
		return this.GetMoviePath(name)
	}

	public static GetRingPath(effeName: string): string {
		return ResDataPath.ROOT_MOVIE + "ring/" + effeName
	}

	public static GetMonsterBodyPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "monster/" + name
	}

	public static GetRoleBodyPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "body/" + name
	}

	public static GetShinvBodyPath(shinvId: number): string {
		return ""
	}

	public static GetShinvShowPath(shinvId: number): string {
		return ""
	}

	public static GetSkillPathByID(id: string): string {
		return ResDataPath.ROOT_MOVIE + "skillEff/" + id
	}

	public static GetSkillPath(skillEffName: string): string {
		return ResDataPath.ROOT_MOVIE + "skillEff/" + skillEffName
	}

	public static GetUIEffePath(effeName: string): string {
		return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName
	}

	public static GetUIEffePath2(effeName: string): string {
		return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName
	}

	public static GetRoleBodyPath2(effeName: string): string {
		return ResDataPath.ROOT_MOVIE + "uiEffe/" + effeName
	}

	public static GetRoleShowPath(name: string): string {
		if (!name) {
			return ""
		}
		return ResDataPath.ROOT_MOVIE + "role_show/" + name
	}

	public static GetVIPImgPath(name: string): string {
		return ResDataPath.ROOT + "image/img/vip_show/" + name + ".png"
	}

	public static GetHeroImgPath(name: string): string {
		return ResDataPath.ROOT_MOVIE + "role_show/" + name
	}
	public static GetPetImgPath(name: string): string {
		return ResDataPath.ROOT + "image/img/pet_show/" + name + ".png"
	}

	//获取藏经阁书籍图标
	public static GetBookIcon(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_tyjs_bai"
			case 2: return "ui_cjg_tyjs_lan"
			case 3: return "xyy"
			case 4: return "ui_cjg_tyjs_huang"
			case 5: return "ui_cjg_tyjs_hong"
		}
	}

	//获取藏经阁武学名称(竖)
	public static GetGonfuName(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_tyjs_hhjf"
			case 2: return "ui_cjg_tyjs_tqjf"
			case 3: return "xxdf"
			case 4: return "ui_cjg_tyjs_jysg"
			case 5: return "ui_cjg_tyjs_khbd"
		}
	}

	//获取藏经阁武学名称(横)
	public static GetGonfuName1(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_hhjf"
			case 2: return "ui_cjg_tqjf"
			case 3: return "ui_cjg_xxdf"
			case 4: return "ui_cjg_jysg"
			case 5: return "ui_cjg_kfbd"
		}
	}

	//获取藏经阁人物图标
	public static GetCjgRoleIcon(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_dzn1"
			case 2: return "ui_cjg_dzn1"
			case 3: return "ui_cjg_dzn1"
			case 4: return "ui_cjg_dzn2"
			case 5: return "ui_cjg_dzn3"
		}
	}

	//获取藏经阁人物书籍
	public static GetRoleBookIcon(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_huise"
			case 2: return "ui_cjg_lan"
			case 3: return "ui_cjg_zi"
			case 4: return "ui_cjg_huang"
			case 5: return "ui_cjg_hong"
		}
	}

	//获取藏经阁典籍图标(带字)
	public static GetCjgBookIcon(level: number): string {
		switch (level) {
			case 1: return "ui_cjg_hhjf2"
			case 2: return "ui_cjg_tqjf2"
			case 3: return "ui_cjg_xxdf2"
			case 4: return "ui_cjg_jysg2"
			case 5: return "ui_cjg_khbd2"
		}
	}

	//排行榜前三名称
	public static GetRankingImg(value: number): string {
		switch (value) {
			case 1: return "ui_phb_p_ks1"		//魁首
			case 2: return "ui_phb_p_by2"		//榜眼
			case 3: return "ui_phb_p_th3"		//探花
		}
	}

	//排行榜前三名称
	public static GetRankingBg2(pos: number): string {
		switch (pos) {
			case 1: return "ui_ctg_p_no1"			//榜首
			case 2: return "ui_ctg_p_no2"			//榜眼
			case 3: return "ui_ctg_p_no3"			//探花
			default: return "";
		}
	}
	public static GetRankingBigImg(value: number): string {
		switch (value) {
			case 1: return "ui_ctg_zi_kuis"			//魁首
			case 2: return "ui_ctg_zi_bangyan"		//榜眼
			case 3: return "ui_ctg_zi_tanhua"		//探花
		}
	}

	//排行前三名背景图
	public static GetRankingBg(value: number): string {
		switch (value) {
			case 1: return "ui_phb_p_1"
			case 2: return "ui_phb_p_2"
			case 3: return "ui_phb_p_3"
		}
	}

	//获取帮会等级美术字
	public static GetGuildLevelImg(level: number): string {
		switch (level) {
			case 1: return "ui_bh_cjbh_1"
			case 2: return "ui_bh_cjbh_2"
			case 3: return "ui_bh_cjbh_3"
			case 4: return "ui_bh_cjbh_4"
			case 5: return "ui_bh_cjbh_5"
		}
	}

	//获取帮会等级图片
	public static GetGuildLvImg(level: number): string {
		switch (level) {
			case 1: return "ui_bhjc_p_1"
			case 2: return "ui_bhjc_p_2"
			case 3: return "ui_bhjc_p_3"
			case 4: return "ui_bhjc_p_4"
			case 5: return "ui_bhjc_p_5"
			case 6: return "ui_bhjc_p_6"
		}
	}

	//获取帮会全民福利天数图标
	public static GetGuildDayIcon(day: number): string {
		switch (day) {
			case 1: return "ui_bh_fl_1"
			case 2: return "ui_bh_fl_2"
			case 3: return "ui_bh_fl_3"
			case 4: return "ui_bh_fl_4"
			case 5: return "ui_bh_fl_5"
			case 6: return "ui_bh_fl_6"
			case 7: return "ui_bh_fl_7"
		}
	}
}