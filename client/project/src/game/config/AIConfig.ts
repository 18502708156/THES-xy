class AIConfig {
	// 技能飘字动画持续时间
	public static WORD_EFF_TIME = 300

	// 开始回合动画需要等待的时间
	public static START_TURN_WAIT_TIME = 1200

	public static ANIM_TIME = 400

	public static BODY_OFFSET = 50

	public static GetEffTime(effId: number): number {
		return 2000
	}

	public static GetDamageDelay(skillId: number): number {
		return 300
	}

	// 受击时间点
	public static HIT_TIME = 300
	public static HIT_RESET_TIME = 430

	public static PLAY_ANIM_TIME = AIConfig.HIT_TIME + AIConfig.HIT_RESET_TIME
}