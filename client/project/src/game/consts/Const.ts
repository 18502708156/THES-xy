class Const {
    public static MAX_INT = 999999999

    // 默认熔炼个数
	public static SMELT_COUNT = 12 

    //大量熔炼个数
	public static SMELT_LARGE_COUNT = 50
    
    public static CELL_SIZE: number = 64

    // 地图坐标到像素坐标的转换
    public static PosToPixel(val: number): number {
        return val * 64
    }

    public static PixelToPos(val: number): number {
        return Math.floor(val / 64)
    }

	public static GetMoveSpeed() {
		return Math.max(4750 / 1000 * GameMap.CELL_SIZE, 1);
	}
}

enum GuildSkillType {
    NORMAL = 1,
    PRACTICE = 2,
}

enum GuildRobberState {
    NORMAL = 1,
    FIGHT = 2,
    DEAD = 3,
}