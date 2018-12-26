class GangConst {
	public static OFFICE_TO_TEXT = 
	{
		[0]: "成员",
		[1]: "副帮主",
		[2]: "帮主",
	}

	public static MASTER_OFFICE = 2
	public static DEPUTY_OFFICE = 1
	public static MEMBER_OFFICE = 0

	public static GetMaxMemberCount(level: number) {
		let config = GameGlobal.Config.GuildLevelConfig[level]
		if (!config)
			return 0

		return config.people || 0
	}

	public static GetMaxCapital(level: number) {
		let config = GameGlobal.Config.GuildLevelConfig[level]
		if (!config)
			return 0

		return config.upExp || 0
	}

	public static GetAuditingRight(office: number) {
		return GameGlobal.Config.GuildConfig.examine[office] != 0
	}

	public static GetKickOutRight(office: number) {
		return GameGlobal.Config.GuildConfig.expel[office] != 0
	}

	public static GetModifyNoticeRight(office: number) {
		return GameGlobal.Config.GuildConfig.notice[office] != 0
	}

	public static sortSkill(a,b){
		if(a.posId > b.posId)
		{
			return 1;
		}
		else if(a.posId < b.posId)
		{
			return -1
		}else{
			return 0;
		}
	}

	public static GetFuBenBossSkin(fuBenId: number): string {
		return AppearanceConfig.GetUIPath(fuBenId)
	}

	public static GetSkillIcon(skillPosId, level = 0) {
		let config = GameGlobal.Config.GuildCommonSkillConfig[level][skillPosId]
		if (!config)
			return

		return ResDataPath.GetItemFullPath(config.icon)
	}

	public static GetProtectorUpgradeExp(level) {
		let config = GameGlobal.Config.GuildActiveConfig[level]
		if (!config)
			return -1

		return config.exp
	}

	public static IsGangMapAssembledTIme() {
		if (!GameGlobal.GangModel.HasGang())
			return false

		let date = new Date(GameServer.serverTime * 1000)
		let hour = date.getHours()
		let minutes = date.getMinutes()

		let doudleTime = GameGlobal.Config.GuideConfig.doubletime
		if (!doudleTime)
			return false
			
		let strArr = doudleTime.star.split(":")
		let startHour = parseInt(strArr[0])
		let startMinutes = parseInt(strArr[1])

		strArr = doudleTime.ends.split(":")
		let endHour = parseInt(strArr[0])
		let endMinutes = parseInt(strArr[1])

		if (hour == startHour) {
			return minutes >= startMinutes
		}

		if (hour == endHour) {
			return minutes <= endMinutes
		}

		if (hour > startHour && hour < endHour)
		{
			return true
		}

		return false
	}
}

