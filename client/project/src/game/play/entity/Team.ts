enum Team {
    My = 1 << 1,                        // 自己的对象
    Monster = 1 << 4,                   // 场景中的怪物
    WillEntity = 1 << 6,                // 其它玩家对象

    Neutral = Team.My + Team.Monster + Team.WillEntity
}