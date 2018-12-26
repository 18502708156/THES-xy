var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameGlobal = (function () {
    function GameGlobal() {
    }
    GameGlobal.OnDayTimer = function () {
        for (var _i = 0, _a = this.AllModule; _i < _a.length; _i++) {
            var data = _a[_i];
            data.OnDayTimer();
        }
    };
    GameGlobal.OnSocketClose = function () {
        for (var _i = 0, _a = this.AllModule; _i < _a.length; _i++) {
            var data = _a[_i];
            data.OnSocketClose();
        }
    };
    GameGlobal.InitConfig = function () {
        // console.profile("-----------InitConfig-------------")
        for (var _i = 0, _a = this.AllModule; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.InitConfig) {
                data.InitConfig();
            }
        }
        // console.profileEnd()
    };
    GameGlobal.initModule = function () {
        this.TreasureHuntModel = new TreasureHuntModel;
        this.GuideUtil = new GuideUtil;
        this.PlotModel = new PlotModel;
        this.Notice = new Notice;
        this.MessageCenter = MessageCenter.ins();
        this.GameServer = new GameServer;
        this.ViewManager = ViewManager.ins();
        this.ViewManagerImpl = new ViewManagerImpl(this.ViewManager);
        this.ViewManager.mViewImpl = this.ViewManagerImpl;
        this.Chat = new Chat;
        this.actorModel = GameLogic.ins().actorModel;
        this.SubRoles = SubRoles.ins();
        this.RoleMgr = RoleMgr.ins();
        this.StageUtils = new StageUtils;
        this.UserFb = new UserFb;
        this.UserTips = UserTips.ins();
        this.GameLogic = GameLogic.ins();
        this.RaidModel = new RaidModel;
        this.RaidMgr = new RaidMgr;
        this.UserTask = UserTask.ins();
        this.MailModel = MailModel.ins();
        this.UserEquip = UserEquip.ins();
        this.XianlvModel = new XianlvModel;
        this.PetModel = new PetModel;
        this.PetShouhModel = new PetShouhModel;
        this.PetTonglModel = new PetTonglModel;
        this.HavingHuanModel = new HavingHuanModel;
        this.HavingLingqModel = new HavingLingqModel;
        this.HavingMagicModel = new HavingMagicModel;
        this.HavingModel = new HavingModel;
        this.EntityEffMgr = new EntityEffMgr;
        this.UserRole = new UserRole;
        this.ForgeModel = ForgeModel.ins();
        this.UserBag = UserBag.ins();
        this.ShopController = ShopController.ins();
        this.ShopManage = ShopManage.ins();
        this.UserSkill = UserSkill.ins();
        this.UserRide = new UserRide;
        this.UserWing = new UserWing;
        this.AcrossBossManage = new AcrossBossManage;
        this.AcrossBossController = new AcrossBossController;
        this.UserTitle = new UserTitle;
        this.TeacherController = new TeacherController;
        this.TeacherManage = new TeacherManage;
        this.DestinyManage = new DestinyManage;
        this.DestinyController = new DestinyController;
        this.TreasureModel = new TreasureModel;
        this.TsumKoBaseModel = new TsumKoBaseModel;
        this.FuliModel = new FuliModel;
        this.UserSkin = new UserSkin;
        this.UserElixir = new UserElixir;
        this.XianlvFzModel = new XianlvFzModel;
        this.XianlvXwModel = new XianlvXwModel;
        this.TianxModel = new TianxModel;
        this.SwordModel = new SwordModel;
        this.BossModel = new BossModel;
        this.Arena = new Arena;
        this.JingMaiData = new JingMaiData;
        this.AnswerController = new AnswerController;
        this.AnswerManage = new AnswerManage;
        this.FormationModel = new FormationModel;
        this.RechargeModel = new RechargeModel;
        this.RankingModel = new RankingModel;
        this.GangModel = new GangModel;
        this.GangMapModel = new GangMapModel;
        this.GangBossModel = new GangBossModel;
        this.QujingModel = new QujingModel;
        this.DailyModel = new DailyModel;
        this.GangBattleModel = new GangBattleModel;
        this.GangBattleTeamModel = new GangBattleTeamModel;
        this.GodPetActiveModel = new GodPetActiveModel;
        this.GodLotteryModel = new GodLotteryModel;
        this.GodPieModel = new GodPieModel;
        this.TianShenModel = new TianShenModel;
        this.TianShenBaoQiModel = new TianShenBaoQiModel;
        this.TianShenBreachModel = new TianShenBreachModel;
        this.PlayerInfoModel = new PlayerInfoModel;
        this.VipModel = new VipModel;
        this.YuanfenModel = new YuanfenModel;
        this.GuildTeamModel = new GuildTeamModel;
        this.CrossTeamModel = new CrossTeamModel;
        this.GangMineTeamModel = new GangMineTeamModel;
        this.CrossBattleTeamModel = new CrossBattleTeamModel;
        this.XiandaoModel = new XiandaoModel;
        this.CommonRaidModel = new CommonRaidModel;
        this.ActivityModel = new ActivityModel;
        this.ActivityKaiFuModel = new ActivityKaiFuModel;
        this.GangMineModel = new GangMineModel;
        this.CrossBattleModel = new CrossBattleModel;
        this.CloudNineModel = new CloudNineModel;
        this.TsumKoModel = new TsumKoModel;
        this.FriendModel = new FriendModel;
        this.ExchangeModel = new ExchangeModel;
        this.GrowUpModel = new GrowUpModel;
        this.AuctionModel = new AuctionModel;
        this.ExpeditionModel = new ExpeditionModel;
        this.CatchPetModel = new CatchPetModel;
        this.YingYuanModel = new YingYuanModel;
        this.LingtongModel = new LingtongModel;
        this.LingtongPetModel = new LingtongPetModel;
        this.LingtongAttrModel = new LingtongAttrModel;
        this.OpenDayGifModel = new OpenDayGifModel;
        this.TotemsModel = new TotemsModel;
        this.MiJingModel = new MiJingModel;
        this.UpLvWayModel = new UpLvWayModel;
        this.Ladder = new Ladder;
        this.SoundManager = new SoundManager;
        this.PositionForeshowModel = new PositionForeshowModel;
    };
    ;
    Object.defineProperty(GameGlobal, "Config", {
        get: function () {
            return GlobalConfig.ins();
        },
        enumerable: true,
        configurable: true
    });
    GameGlobal.GetItemName = function (itemId) {
        var config = GameGlobal.Config.ItemConfig[itemId];
        if (!config) {
            return " ";
        }
        return config.name;
    };
    GameGlobal.AllModule = [];
    return GameGlobal;
}());
__reflect(GameGlobal.prototype, "GameGlobal");
//# sourceMappingURL=GameGlobal.js.map