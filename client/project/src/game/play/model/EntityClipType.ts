// 动画类型
enum EntityClipType {
	ATTACK = 0,
	STAND = 1,
	RUN = 2,
	DIE = 3,
	HIT = 4,
	JUMP = 5,

	RIDE_ATTACK = 100,
	RIDE_STAND = 101,
	RIDE_RUN = 102,
	RIDE_DIE = 103,
	RIDE_HIT = 104,
	RIDE_JUMP = 105,
}

// 类型转动画名称
var EntityClipTypeToName = {
	[EntityClipType.ATTACK]: ["a", "attack"],
	[EntityClipType.STAND]: ["s"],
	[EntityClipType.RUN]: ["r"],
	[EntityClipType.DIE]: ["a", "die"],
	[EntityClipType.HIT]: ["a", "hit"],
	[EntityClipType.JUMP]: ["s"],

	[EntityClipType.RIDE_ATTACK]: ["i", "attack"],
	[EntityClipType.RIDE_STAND]: ["p"],
	[EntityClipType.RIDE_RUN]: ["o"],
	[EntityClipType.RIDE_DIE]: ["p",],
	[EntityClipType.RIDE_HIT]: ["i", "hit"],
	[EntityClipType.RIDE_JUMP]: ["p"],
}