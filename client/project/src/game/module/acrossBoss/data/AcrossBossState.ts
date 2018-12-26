enum AcrossBossState {
	// 0 关闭  1 等待boss  2 boss存在  3 boss被击杀 4 复活中(用于帮会BOSS)
	CLOSE = 0,
	WAIT = 1,
	BOSS = 2,
	KILL = 3,
	REBORNING = 4,
}