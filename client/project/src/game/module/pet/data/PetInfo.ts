class PetInfo {

	public mPetId: number
	public mExp: number
	public mLevel: number
	public mZizhiExp: number = 0
	public mZizhiLevel: number = 0
	public mFeisLevel: number = 0

	public mPower: number = 0

	public mBuffSkill: number[] = []
	public mXilian: number = 0
	public mXilianSkill: number[] = []
	public mName: string

	public UpdateInfo(info: Sproto.pet_info) {
		this.mExp = info.exp
		this.mLevel = info.level
		this.mName = info.name || GameGlobal.Config.petBiographyConfig[this.mPetId].name
		this.mBuffSkill = info.buffs || []
		this.mZizhiExp = info.giftexp
		this.mZizhiLevel = info.giftlv
		this.mXilian = info.xilian
		this.mXilianSkill = info.xilianSkills || []
	}

	public Active() {
		this.mLevel = 1
		this.mZizhiLevel = 1
		let config = GameGlobal.Config.petBiographyConfig[this.mPetId] 
		let skill = config.buffskill
		this.mName = config.name
		this.mBuffSkill = []
		for (let data of skill) {
			this.mBuffSkill.push(data.id)
		}
	}

	public GetXilianStar(): number {
		let config = GameGlobal.Config.petbaseConfig.polishStar
		let star = config.length
		let xilian = this.mXilian
		for (let i = 0; i < config.length; i++) {
			let val = config[i]
			if (xilian <= val) {
				star = i + 1
				break
			}
		}
		return star
	}

	public GetSkin(): string {
		return PetConst.GetSkin(this.mPetId)
	}

	public GetSkillPower(): number {
		let power = 0
		let skillId = GameGlobal.Config.petBiographyConfig[this.mPetId].skill[0]
		if (GameGlobal.Config.SkillsConfig[skillId]) {
			power += GameGlobal.Config.SkillsConfig[skillId][GameGlobal.Config.SkillsConfig_keys.skillpower] || 0
		}
		let config = GameGlobal.Config.EffectsConfig
		for (let id of this.mBuffSkill) {
			if (config[id]) {
				power += config[id][GameGlobal.Config.EffectsConfig_keys.skillpower] || 0
			}
		}
		return power
	}

	public GetPower(): number {
		let power = 0
		power += ItemConfig.CalcAttrScoreValue(this.GetShowAttrs())
		power += ItemConfig.CalcAttrScoreValue(this.GetShowZizhiAttrs())
		power += ItemConfig.CalcAttrScoreValue(this.GetShowFeisAttrs())

		return power
	}

	public GetZizhiPower(): number {
		// let config = GameGlobal.Config.petGiftproConfig[this.mPetId][this.mZizhiLevel - 1]
		// if (config) {
		// 	return ItemConfig.CalcAttrScoreValue(config.attrs)
		// }
		// return 0
		let attr =  this.GetZizhiAttrs()
		if (attr) {
			return ItemConfig.CalcAttrScoreValue(attr)
		}
		return 0
	}
	
	public GetAttrs(): AttributeData[] {
		let config = this.GetLevelConfig()
		if (config) {
			return AttributeData.AttrAddition(GameGlobal.Config.petBiographyConfig[this.mPetId].attrs, config.attrs)
		}
		return []
	}

	public GetShowAttrs(): AttributeData[] {
		let attrs = this.GetAttrs()
		if (attrs) {
			return attrs
		}
		return PetConst.GetBaseAttrs()
	}

	public GetZizhiAttrs(): AttributeData[] {
		let config = GameGlobal.Config.petGiftproConfig[this.mPetId][0]
		var initAttrArr = new Array()
		config.attrs.forEach(elem => {
			let attrInfo = {type:elem.type, value:0}
			initAttrArr.push(attrInfo)
		})

		let getValue = (props, attrType) =>
		{
			for (let elem of props) 
			{
				if (elem.type == attrType)
					return elem.value
			}

			return 0
		}

		let level = this.mZizhiLevel
		let zizhiExp = this.mZizhiExp
		for (var i=1; i<=level; ++i)
		{
			let giftProConf = GameGlobal.Config.petGiftproConfig[this.mPetId][i-1]
			let attrs = giftProConf.attrs
			
			let multiple = (i == level ? zizhiExp : giftProConf.proexp / giftProConf.exp)
			initAttrArr.forEach(elem => {	
				elem.value = elem.value + getValue(attrs, elem.type) * multiple	
			})
		}

		return initAttrArr
	}

	public GetShowZizhiAttrs(): AttributeData[] {
		let attrs = this.GetZizhiAttrs()
		if (attrs) {
			return attrs
		}
		return PetConst.GetZizhiBaseAttrs()
	}

	public GetShowFeisAttrs(): AttributeData[] {
		let attrs = this.GetFeisAttrs()
		if (attrs) {
			return attrs
		}
		return PetConst.GetFeisBaseAttrs()
	}

	public GetFeisAttrs(): AttributeData[] {
		let config = GameGlobal.Config.petFlyproConfig[this.mPetId]
		if (config) {
			if (config[this.mFeisLevel - 1]) {
				return config[this.mFeisLevel - 1].attrs
			}
		}
	}

	public GetLevelConfig() {
		let rarity = GameGlobal.Config.petBiographyConfig[this.mPetId].rarity
		return GameGlobal.Config.petLvproConfig[rarity][this.mLevel - 1]
	}

	public GetSkillId() {
		let config = GameGlobal.Config.petBiographyConfig[this.mPetId]
		if (config) {
			return config.skill[0]
		}
		return 0
	}
}
