enum PowerSkillState {
	LOADING = 0,
	USE = 1,
	INIT = 2,
}

class UserSkill extends BaseSystem {

	public static ins(): UserSkill {
		return super.ins();
	}

	public constructor() {
		super();
        this.regNetMsg(S2cProtocol.sc_skill_upgrade_result, this.grewUpSkillResult);
        this.regNetMsg(S2cProtocol.sc_skill_all_upgrade_result, this.grewUpAllSkillResult);
	}

	public Init(): void {
	}

    /**
    * 请求升级技能
    * @param roleId 角色目标唯一标识
    * @param skillID 要升级的技能id
    */
	public sendGrewUpSkill(skillID) {
		var cs_skill_upgrade = new Sproto.cs_skill_upgrade_request();
		cs_skill_upgrade.skillID = skillID;
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade, cs_skill_upgrade);
	};



    /**
    * 调整技能释放顺序
    * @param skillID 要跳转的技能列表
    */
	public sendSkillList(skills) {
		var cs_skill_sort_release = new Sproto.cs_skill_sort_release_request();
		cs_skill_sort_release.skills = skills;
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_sort_release, cs_skill_sort_release);
	};


    /**
    * 技能升级结果
    */
	public grewUpSkillResult(rsp : Sproto.sc_skill_upgrade_result_request) {
		var skillID = rsp.skillID;
		var level = rsp.level;

		var role = SubRoles.ins().GetRoleData()

		var skillsData = role.skillLevels;
		let upLevel = 0
		for (var i in skillsData) {
			if (i == skillID.toString()) {
				upLevel = level - skillsData[i]
				role.setSkillsDataByIndex(i, level);
				break;
			}
		}

		MessageCenter.ins().dispatch(MessageDef.SKILL_UPGRADE, skillID, level, upLevel)
		
	};

	public sendGrewUpAllSkill() {
		GameSocket.ins().Rpc(C2sProtocol.cs_skill_upgrade_all);
	};

    /**
    * 全部技能升级结果
    */
	public grewUpAllSkillResult(rsp : Sproto.sc_skill_all_upgrade_result_request) {
		let role = SubRoles.ins().GetRoleData()
		let skillsData = role.skillLevels;
		var skills = [];
		let upSkills = []
		for (var i = 0; i < rsp.level.length; i++) {
            let lv = rsp.level[i]
			upSkills[i] = lv - skillsData[i]
			role.setSkillsDataByIndex(i, lv);
			skills.push(rsp.level[i]);
		}
		MessageCenter.ins().dispatch(MessageDef.SKILL_GREWUPALL, skills, upSkills);
	};
	
    /**
     * 获取当前技能最高等级限制
     */
	public getSkillLimitLevel() {
		return GameLogic.ins().actorModel.level
	}

    /**
     * 获取单个技能一键升级的消耗
     */
	public getSingleSkillGrewUpCost(skillIndex: number) {
		var limitLevel = this.getSkillLimitLevel();
		var singleSkillLevel = SubRoles.ins().GetRoleData().skillLevels[skillIndex];
		var cost = 0;
		if (singleSkillLevel > 0) {
			for (var i = singleSkillLevel; i < limitLevel; i++) {
				cost += GlobalConfig.ins().SkillsUpgradeConfig[i].cost;
			}
			return cost;
		}
		return 0;
	}

    /** 
     * 获取该角色技能全部升级的总消耗
     */
	public getAllSkillGrewupCost() {
		var skillLimitLevel = UserSkill.ins().getSkillLimitLevel();
		var skillsLevel = SubRoles.ins().GetRoleData().skillLevels;
		var coin = GameLogic.ins().actorModel.gold;
		var cost = 0;
		var skills = [];
		for (var k in skillsLevel) {
			if (skillsLevel[k] > 0) {
				skills.push(skillsLevel[k]);
			}
		}
		while (true) {
			var minK = 0;
			for (var i = 1; i < skills.length; i++) {
				if (skills[minK] > skills[i]) {
					minK = i;
				}
			}
			if (skills[minK] >= skillLimitLevel)
				break;
			var skillCost = GlobalConfig.ins().SkillsUpgradeConfig[skills[minK]].cost;
			if (coin >= skillCost + cost) {
				cost += skillCost;
				skills[minK]++;
			}
			else
				break;
		}
		return cost;
	};
    
    /**
     * 是否可以全部升级技能
     */
	public canGrewupAllSkills() {
		var skillMaxLevel = GameLogic.ins().actorModel.level
		let role = SubRoles.ins().GetRoleData()
		if (!role) {
			return false
		}
		var skillsLevel = SubRoles.ins().GetRoleData().skillLevels;
		for (var k in skillsLevel) {
			if (skillsLevel[k] > 0 && skillsLevel[k] < skillMaxLevel) {
				return true;
			}
		}
		return false;
	};

	public mRedPoint = new UserSkillRedPoint
}

class UserSkillRedPoint extends IRedPoint {

	public static readonly INDEX_UP_SKILL = 0
		
	protected GetCheckFuncList(): {[key: number]: Function} {
		return {
			[UserSkillRedPoint.INDEX_UP_SKILL]: this.GetIndexUpSkill
		}
	}

	public GetMessageDef(): string[] {
		return [
			MessageDef.SKILL_UPGRADE,
			MessageDef.SKILL_GREWUPALL,
			MessageDef.GOLD_CHANGE,
		]
	}

	protected OnChange(index: number): void {
		GameGlobal.MessageCenter.dispatch(MessageDef.RP_SKILL_UPGRADE)
	}

	public GetIndexUpSkill() {
		if (!UserSkill.ins().canGrewupAllSkills()) {
            return false
        }
		var costAllNum = UserSkill.ins().getAllSkillGrewupCost();
        if (costAllNum && costAllNum <= GameLogic.ins().actorModel.gold) {
            return true
        }
		return false
	}
}