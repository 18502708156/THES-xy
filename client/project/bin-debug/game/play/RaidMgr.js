var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RaidMgr = (function (_super) {
    __extends(RaidMgr, _super);
    function RaidMgr() {
        var _this = _super.call(this) || this;
        _this.m_LastTime = 0;
        _this.mShowType = 0;
        return _this;
    }
    RaidMgr.prototype.GetCurMapId = function () {
        // if (this.mShowType == RaidMgr.TYPE_CITY) {
        // 	if (this.mCityRaid) {
        // 		return this.mCityRaid.GetSceneId()
        // 	}
        // } else {
        if (this.mMapRaid) {
            return this.mMapRaid.GetSceneId();
        }
        // }
        return 0;
    };
    RaidMgr.prototype.UpdateBGM = function () {
        if (this.mShowType == RaidMgr.TYPE_NORMAL) {
            if (this.mBattleRaid && !this.mBattleRaid.mIsExit && !egret.is(this.mBattleRaid, "NormalBattleRaid")) {
                GameGlobal.SoundManager.PlayBg("war_mp3");
            }
            else {
                GameGlobal.SoundManager.PlayBg("guaji_mp3");
            }
        }
        else {
            GameGlobal.SoundManager.PlayBg("city_mp3");
        }
    };
    // public SetShowType(type: number) {
    // 	GameMap.SetShowState(type)
    // 	if (this.mShowType == type) {
    // 		return
    // 	}
    // 	this.mShowType = type
    // 	if (type == RaidMgr.TYPE_NORMAL) {
    // 		if (this.mCityRaid) {
    // 			this.mCityRaid.OnBackground()
    // 		}
    // 		if (this.mMapRaid) {
    // 			this.mMapRaid.OnForeground()
    // 		}
    // 		if (this.mBattleRaid && !this.mBattleRaid.mIsExit) {
    // 			this.mBattleRaid.OnForeground()
    // 		}
    // 	} else {
    // 		if (this.mMapRaid) {
    // 			this.mMapRaid.OnBackground()
    // 		}
    // 		if (this.mBattleRaid && !this.mBattleRaid.mIsExit) {
    // 			this.mBattleRaid.OnBackground()
    // 		}
    // 		if (this.mCityRaid) {
    // 			this.mCityRaid.OnForeground()
    // 		}
    // 	}
    // 	this.UpdateBGM()
    // 	GameGlobal.ViewManagerImpl.DoRaidShowType()
    // 	GameGlobal.MessageCenter.dispatch(MessageDef.MAP_TYPE_CHANGE)
    // }
    RaidMgr.prototype.UpdateSetting = function (settingId) {
        if (this.mMapRaid) {
            this.mMapRaid.UpdateSetting(settingId);
        }
        if (this.mBattleRaid) {
            this.mBattleRaid.UpdateSetting(settingId);
        }
    };
    RaidMgr.prototype.Init = function () {
        GameMap.SetShowState(this.mShowType);
        GameGlobal.MessageCenter.addListener(MessageDef.NAME_CHANGE, this._OnChangeName, this);
        egret.startTick(this.UpdateTime, this);
    };
    RaidMgr.prototype._OnChangeNameRaid = function (raid) {
        if (!raid) {
            return;
        }
        for (var k in raid.mEntityList) {
            var entity = raid.mEntityList[k];
            var handle = entity.GetHandle();
            if (handle == GameGlobal.SubRoles.GetRoleData().handle || handle == GameGlobal.actorModel.actorID) {
                entity.GetInfo().entityName = GameGlobal.actorModel.name;
                entity.UpdateInfo();
                break;
            }
        }
    };
    // 更新场景中的名字
    RaidMgr.prototype._OnChangeName = function () {
        this._OnChangeNameRaid(this.mMapRaid);
        this._OnChangeNameRaid(this.mBattleRaid);
    };
    RaidMgr.prototype.UpdateTime = function (timeStamp) {
        var delta = timeStamp - this.m_LastTime;
        this.m_LastTime = timeStamp;
        if (this.m_NextRaid) {
            if (this.m_CurRaid) {
                this.m_CurRaid.mIsExit = true;
                this.m_CurRaid.OnExit();
            }
            this.m_CurRaid = this.m_NextRaid;
            this.m_NextRaid = null;
            this.m_CurRaid.mIsExit = false;
            this.m_CurRaid.OnEnter();
        }
        var dt = Math.min(delta, 40);
        if (this.m_CurRaid) {
            this.m_CurRaid.DoUpdate(dt);
        }
        // if (this.mCityRaid) {
        // 	this.mCityRaid.DoUpdate(dt)
        // }
        return false;
    };
    RaidMgr.prototype.Clear = function () {
        if (this.mMapRaid) {
            this.mMapRaid.OnExit();
            this.mMapRaid.Clear();
            this.mMapRaid.mFbId = 0;
            this.mMapRaid.mFbType = 0;
        }
        if (this.mBattleRaid) {
            this.mBattleRaid.OnExit();
        }
        // if (this.mCityRaid) {
        // 	this.mCityRaid.OnExit()
        // 	this.mCityRaid.Clear()
        // 	this.mCityRaid = null
        // }
        this.mShowType = RaidMgr.TYPE_NORMAL;
        GameMap.SetShowState(RaidMgr.TYPE_NORMAL);
    };
    RaidMgr.prototype.SetNextRaid = function (raid) {
        this.m_NextRaid = raid;
    };
    RaidMgr.prototype.OnMapClick = function (x, y) {
        // if (this.mShowType == RaidMgr.TYPE_CITY) {
        // 	if (this.mCityRaid) {
        // 		this.mCityRaid.OnMapClick(x, y)
        // 	}
        // } else {
        if (this.mMapRaid) {
            this.mMapRaid.OnMapClick(x, y);
        }
        // }
    };
    // 大地图副本
    // 副本类型，副本id（挂机关卡是章节id）
    RaidMgr.prototype.GetMapRaid = function (fbType, fbId) {
        if (this.mMapRaid) {
            if (this.mMapRaid.mFbType != fbType || this.mMapRaid.mFbId != fbId) {
                this.mMapRaid.Clear();
                this.mMapRaid = null;
            }
        }
        if (!this.mMapRaid) {
            if (fbType) {
                if (fbType == UserFb.FB_TYPE_CLOUD_NINE) {
                    this.mMapRaid = new MapCloudNine;
                }
                else if (fbType == UserFb.FB_TYPE_XIANDAO) {
                    this.mMapRaid = new MapRaidXiandao;
                }
                else if (fbId == 100001) {
                    this.mMapRaid = new MapRaidCrossBattle;
                }
                else if (fbType == UserFb.FB_TYPE_GUILD_WAR) {
                    this.mMapRaid = new MapRaidGangBattle(fbId);
                }
                else if (fbType == UserFb.KF_BOSS) {
                    this.mMapRaid = new MapRaidAcrossBoss;
                }
                else if (fbType == UserFb.FB_TYPE_GANG_BOSS) {
                    this.mMapRaid = new MapRaidGangBoss;
                }
                else if (fbType == UserFb.FB_TYPE_GANGMAP) {
                    this.mMapRaid = new MapRaidGangMap;
                }
                else {
                    console.error("GetMapRaid not def fbtype => " + fbType + ", fbid => " + fbId);
                    this.mMapRaid = new CommonMapRaid;
                }
            }
            else {
                this.mMapRaid = new NormalMapRaid;
            }
            this.mMapRaid.mMapId = fbId;
            this.mMapRaid.mFbType = fbType;
            this.mMapRaid.mFbId = fbId;
            this.mMapRaid.Init();
        }
        return this.mMapRaid;
    };
    RaidMgr.prototype.ExitFbRewardAndEnterMap = function () {
        GameGlobal.RaidModel.SendGetBossReward();
        GameGlobal.RaidMgr.ExitFbAndEnterMap();
    };
    RaidMgr.prototype.ExitFbAndEnterMap = function () {
        GameGlobal.UserFb.sendExitFb();
        GameGlobal.RaidMgr.EnterCurMapRaid();
    };
    // public EnterCityMapRaid(): CommonMapRaid {
    // 	if (!this.mCityRaid) {
    // 		let raid = this.mCityRaid = new MapRaidCity
    // 		raid.mMapId = GameMap.TYPE_ID_CITY
    // 		raid.Init()
    // 		raid.OnEnter()
    // 	}
    // 	return this.mCityRaid
    // }
    /**
     * 进入当前存在的大地图
     */
    RaidMgr.prototype.EnterCurMapRaid = function () {
        var raid = this.mMapRaid;
        if (!raid) {
            raid = this.GetMapRaid(0, 0);
        }
        this.EnterMapRaid(raid);
    };
    /**
     * 进入新的大地图
     */
    RaidMgr.prototype.EnterNewMapRaid = function (mapData, immediately) {
        if (immediately === void 0) { immediately = true; }
        GameMap.parser(mapData);
        var raid = GameGlobal.RaidMgr.GetMapRaid(GameMap.fbType, GameMap.fubenID);
        if (!immediately) {
            return;
        }
        this.EnterMapRaid(raid);
        GameGlobal.ViewManagerImpl.CheckPlayFunviewState();
        GameGlobal.ViewManagerImpl.DoMapChange();
        return raid;
    };
    /**
     * 进入大地图
     */
    RaidMgr.prototype.EnterMapRaid = function (raid) {
        if (BattleMap.Exit()) {
            GameGlobal.ViewManagerImpl.DoBattleChange();
        }
        this.SetNextRaid(raid);
    };
    /**
     * 进入挂机战斗副本
     */
    RaidMgr.prototype.EnterNormalBattle = function () {
        var raid = new NormalBattleRaid();
        raid.Init();
        raid.SetBattleData();
        this.mBattleRaid = raid;
        this.SetNextRaid(raid);
    };
    /**
     * 进入捕捉场景副本
    */
    RaidMgr.prototype.EnterCatchPet = function () {
        var rsp = new BattleMapData;
        rsp.mFbId = UserFb.FB_TYPE_CATCH_PET;
        rsp.mMapId = 0;
        rsp.mFbType = UserFb.FB_TYPE_CATCH_PET;
        rsp.mFbName = "";
        rsp.mFbDesc = "";
        BattleMap.Parse(rsp);
        var raid = new CatchPetRaid();
        raid.Init();
        raid.SetBattleData();
        this.mBattleRaid = raid;
        this.SetNextRaid(raid);
        GameGlobal.ViewManagerImpl.DoBattleChange();
    };
    RaidMgr.prototype.BuZhuoPet = function () {
        var raid = this.mBattleRaid;
        if (!egret.is(raid, "CatchPetRaid")) {
            return;
        }
        raid.Turn(raid.CreatSkill());
    };
    /**
     * 进入战斗副本
     */
    RaidMgr.prototype.EnterBattleRaid = function (mapData) {
        var raid;
        if (mapData.mFbType == UserFb.FB_TYPE_PUBLIC_BOSS) {
            raid = new BattleRaidPubBoss();
        }
        else {
            raid = new BattleRaid();
        }
        raid.Init();
        raid.SetBattleData(mapData.entitys);
        this.mBattleRaid = raid;
        BattleMap.Parse(mapData);
        this.SetNextRaid(raid);
        GameGlobal.ViewManagerImpl.DoBattleChange();
        GameGlobal.MessageCenter.dispatch(MessageDef.FUBEN_CHANGE);
        return raid;
    };
    RaidMgr.prototype.GetRaid = function () {
        return this.m_CurRaid;
    };
    RaidMgr.prototype.CreateEntity = function (entityModel) {
        this.GetRaid().CreateEntity(entityModel);
    };
    RaidMgr.prototype.DoExitFb = function () {
        return this.GetRaid().DoExitFb();
    };
    RaidMgr.prototype.GetNextRaid = function () {
        return this.m_NextRaid;
    };
    RaidMgr.prototype.GetNormalMapRaid = function () {
        if (this.mMapRaid && Util.GetClass(this.mMapRaid) == NormalMapRaid) {
            return this.mMapRaid;
        }
        return null;
    };
    RaidMgr.prototype.UpdateRole = function () {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRole();
        }
        // if (this.mCityRaid) {
        // 	this.mCityRaid.UpdateRole()
        // }
    };
    RaidMgr.prototype.UpdateRolePet = function (petId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRolePet(petId);
        }
    };
    RaidMgr.prototype.UpdateRoleTiannv = function () {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleTiannv();
        }
    };
    RaidMgr.prototype.UpdateRoleXianlv = function (xianlvId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleXianlv(xianlvId);
        }
    };
    RaidMgr.prototype.UpdateRoleXianlvXw = function (xwId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleXianlvXw(xwId);
        }
    };
    RaidMgr.prototype.UpdateRolePetTongl = function (xwId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRolePetTongl(xwId);
        }
    };
    RaidMgr.prototype.UpdateRolePetShouh = function (xwId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRolePetShouh(xwId);
        }
    };
    RaidMgr.prototype.UpdateRoleXianlvFz = function (xwId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleXianlvFz(xwId);
        }
    };
    RaidMgr.prototype.UpdateRoleTiannvLq = function (lqId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleTiannvLq(lqId);
        }
    };
    RaidMgr.prototype.UpdateRoleTiannvHua = function (lqId) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleTiannvHua(lqId);
        }
    };
    RaidMgr.prototype.UpdateRoleTianshen = function (shengj) {
        var raid = this.GetNormalMapRaid();
        if (raid) {
            raid.UpdateRoleTianshen(shengj);
        }
    };
    //获取当前焦点的地图场景对象
    RaidMgr.prototype.GetCurMapRaid = function () {
        // if (this.mShowType == RaidMgr.TYPE_CITY)
        // 	return this.mCityRaid
        return this.mMapRaid;
    };
    // 结算并且领取当前关卡战斗的奖励
    RaidMgr.prototype.FinishRewardChapterBattle = function () {
        if (this.mBattleRaid && BattleMap.mFbType == UserFb.FB_TYPE_GUANQIABOSS) {
            this.mBattleRaid.FinishBattleAndReward();
        }
    };
    RaidMgr.TYPE_NORMAL = 0;
    RaidMgr.TYPE_CITY = 1;
    return RaidMgr;
}(BaseSystem));
__reflect(RaidMgr.prototype, "RaidMgr");
//# sourceMappingURL=RaidMgr.js.map