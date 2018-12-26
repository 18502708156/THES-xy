class GameGlobal {
	public static PlotModel: PlotModel
	public static GuideUtil: GuideUtil
	public static Notice: Notice
	public static MessageCenter: MessageCenter
	public static GameServer: GameServer
	public static ViewManager: ViewManager
	public static ViewManagerImpl: ViewManagerImpl
	public static EntityEffMgr: EntityEffMgr
	public static RoleMgr: RoleMgr;
	public static StageUtils: StageUtils;
	public static Chat: Chat
	public static UserTips: UserTips;
	public static UserFb: UserFb;
	public static GameLogic: GameLogic
	public static RaidMgr: RaidMgr;
	public static MailModel: MailModel
	public static SubRoles: SubRoles;
	public static UserTask: UserTask
	public static actorModel: ActorModel;
	public static RaidModel: RaidModel
	public static UserEquip: UserEquip
	public static PetModel: PetModel
	public static PetShouhModel: PetShouhModel
	public static PetTonglModel: PetTonglModel
	public static HavingHuanModel: HavingHuanModel
	public static HavingLingqModel: HavingLingqModel
	public static HavingMagicModel: HavingMagicModel
	public static HavingModel: HavingModel
	public static XianlvModel: XianlvModel
	public static XianlvFzModel: XianlvFzModel
	public static XianlvXwModel: XianlvXwModel
	public static UserRole: UserRole
	public static ForgeModel: ForgeModel
	public static UserBag: UserBag
	public static ShopController: ShopController//商店
	public static ShopManage: ShopManage//商店
	public static UserSkill: UserSkill
	public static UserRide: UserRide
	public static UserWing: UserWing
	public static UserTitle: UserTitle
	public static TeacherController: TeacherController
	public static TeacherManage: TeacherManage
	public static UserSkin: UserSkin
	public static DestinyController: DestinyController
	public static DestinyManage: DestinyManage
	public static TreasureModel: TreasureModel
	public static UserElixir: UserElixir
	public static TianxModel: TianxModel
	public static SwordModel: SwordModel
	public static BossModel: BossModel
	public static Arena: Arena;
	public static JingMaiData: JingMaiData;
	public static TsumKoBaseModel: TsumKoBaseModel;
	public static FuliModel: FuliModel
	public static AnswerController: AnswerController;
	public static AnswerManage: AnswerManage;
	public static TreasureHuntModel: TreasureHuntModel;

	public static FormationModel: FormationModel;
	public static GangModel: GangModel;
	public static GangMapModel: GangMapModel;
	public static GangBossModel: GangBossModel;
	public static QujingModel: QujingModel;
	public static YuanfenModel: YuanfenModel;
	public static RechargeModel: RechargeModel;
	public static RankingModel: RankingModel;
	public static DailyModel: DailyModel;
	public static GangBattleModel: GangBattleModel;
	public static GangBattleTeamModel: GangBattleTeamModel;
	public static GodPetActiveModel: GodPetActiveModel;
	public static GodLotteryModel: GodLotteryModel;
	public static GodPieModel: GodPieModel;

	public static TianShenModel: TianShenModel;
	public static TianShenBaoQiModel: TianShenBaoQiModel;
	public static TianShenBreachModel: TianShenBreachModel;

	public static PlayerInfoModel: PlayerInfoModel;
	public static VipModel: VipModel;
	// public static MaterialFbModel: MaterialFbModel
	// public static TianshilianModel: TianshilianModel

	public static GuildTeamModel: GuildTeamModel
	public static CrossTeamModel: CrossTeamModel
	public static GangMineTeamModel: GangMineTeamModel
	public static CrossBattleTeamModel: CrossBattleTeamModel

	public static XiandaoModel: XiandaoModel
	public static CommonRaidModel: CommonRaidModel


	public static ActivityModel: ActivityModel
	public static ActivityKaiFuModel: ActivityKaiFuModel
	public static GangMineModel: GangMineModel

	public static CrossBattleModel: CrossBattleModel
	public static CloudNineModel: CloudNineModel
	public static AcrossBossManage: AcrossBossManage
	public static AcrossBossController: AcrossBossController

	public static TsumKoModel: TsumKoModel

	public static FriendModel: FriendModel;

	public static ExchangeModel: ExchangeModel;
	public static GrowUpModel: GrowUpModel;
	public static AuctionModel: AuctionModel;

	public static CatchPetModel: CatchPetModel;
	public static LingtongModel: LingtongModel
	public static LingtongAttrModel: LingtongAttrModel
	public static YingYuanModel: YingYuanModel;

	public static TotemsModel:TotemsModel;

	public static UpLvWayModel:UpLvWayModel;

	public static SoundManager: SoundManager

	public static OpenDayGifModel:OpenDayGifModel
	public static Ladder: Ladder

	public static AllModule: BaseSystem[] = []

	public static PositionForeshowModel: PositionForeshowModel

	public static OnDayTimer() {
		for (let data of this.AllModule) {
			data.OnDayTimer()
		}
	}

	public static OnSocketClose() {
		for (let data of this.AllModule) {
			data.OnSocketClose()
		}
	}

	public static InitConfig() {
		// console.profile("-----------InitConfig-------------")
		for (let data of this.AllModule) {
			if (data.InitConfig) {
				data.InitConfig()
			}
		}
		// console.profileEnd()
	}

	public static initModule() {
		this.TreasureHuntModel = new TreasureHuntModel
		this.GuideUtil = new GuideUtil
		this.PlotModel = new PlotModel
		this.Notice = new Notice
		this.MessageCenter = MessageCenter.ins()
		this.GameServer = new GameServer
		this.ViewManager = ViewManager.ins()
		this.ViewManagerImpl = new ViewManagerImpl(this.ViewManager)
		this.ViewManager.mViewImpl = this.ViewManagerImpl
		this.Chat = new Chat
		this.actorModel = GameLogic.ins().actorModel
		this.SubRoles = SubRoles.ins()
		this.RoleMgr = RoleMgr.ins()
		this.StageUtils = new StageUtils
		this.UserFb = new UserFb
		this.UserTips = UserTips.ins();
		this.GameLogic = GameLogic.ins()
		this.RaidModel = new RaidModel
		this.RaidMgr = new RaidMgr
		this.UserTask = UserTask.ins()
		this.MailModel = MailModel.ins()
		this.UserEquip = UserEquip.ins()
		this.XianlvModel = new XianlvModel
		this.PetModel = PetModel.ins()
		this.PetShouhModel = new PetShouhModel
		this.PetTonglModel = new PetTonglModel
		this.HavingHuanModel = new HavingHuanModel
		this.HavingLingqModel = new HavingLingqModel
		this.HavingMagicModel = new HavingMagicModel
		this.HavingModel = new HavingModel
		this.EntityEffMgr = new EntityEffMgr
		this.UserRole = new UserRole
		this.ForgeModel = ForgeModel.ins()
		this.UserBag = UserBag.ins()
		this.ShopController = ShopController.ins()
		this.ShopManage = ShopManage.ins()
		this.UserSkill = UserSkill.ins()
		this.UserRide = new UserRide
		this.UserWing = new UserWing
		this.AcrossBossManage = new AcrossBossManage
		this.AcrossBossController = new AcrossBossController
		this.UserTitle = new UserTitle
		this.TeacherController = new TeacherController
		this.TeacherManage = new TeacherManage
		this.DestinyManage = new DestinyManage
		this.DestinyController = new DestinyController
		this.TreasureModel = new TreasureModel
		this.TsumKoBaseModel = new TsumKoBaseModel
		this.FuliModel = new FuliModel
		this.UserSkin = new UserSkin
		this.UserElixir = new UserElixir
		this.XianlvFzModel = new XianlvFzModel
		this.XianlvXwModel = new XianlvXwModel
		this.TianxModel = new TianxModel
		this.SwordModel = new SwordModel
		this.BossModel = new BossModel
		this.Arena = new Arena
		this.JingMaiData = new JingMaiData
		this.AnswerController = new AnswerController
		this.AnswerManage = new AnswerManage
		this.FormationModel = new FormationModel
		this.RechargeModel = new RechargeModel
		this.RankingModel = new RankingModel
		this.GangModel = new GangModel
		this.GangMapModel = new GangMapModel
		this.GangBossModel = new GangBossModel
		this.QujingModel = new QujingModel
		this.DailyModel = new DailyModel
		this.GangBattleModel = new GangBattleModel
		this.GangBattleTeamModel = new GangBattleTeamModel
		this.GodPetActiveModel = new GodPetActiveModel
		this.GodLotteryModel = new GodLotteryModel
		this.GodPieModel = new GodPieModel
		this.TianShenModel = new TianShenModel
		this.TianShenBaoQiModel = new TianShenBaoQiModel
		this.TianShenBreachModel = new TianShenBreachModel
		this.PlayerInfoModel = new PlayerInfoModel
		this.VipModel = new VipModel
		this.YuanfenModel = new YuanfenModel

		this.GuildTeamModel = new GuildTeamModel
		this.CrossTeamModel = new CrossTeamModel
		this.GangMineTeamModel = new GangMineTeamModel
		this.CrossBattleTeamModel = new CrossBattleTeamModel

		this.XiandaoModel = new XiandaoModel
		this.CommonRaidModel = new CommonRaidModel

		this.ActivityModel = new ActivityModel
		this.ActivityKaiFuModel = new ActivityKaiFuModel
		this.GangMineModel = new GangMineModel

		this.CrossBattleModel = new CrossBattleModel
		this.CloudNineModel = new CloudNineModel

		this.TsumKoModel = new TsumKoModel

		this.FriendModel = new FriendModel

		this.ExchangeModel = new ExchangeModel
		this.GrowUpModel = new GrowUpModel;
		this.AuctionModel = new AuctionModel;

		this.CatchPetModel = new CatchPetModel

		this.YingYuanModel = new YingYuanModel
		this.LingtongModel = new LingtongModel
		this.LingtongAttrModel = new LingtongAttrModel

		this.OpenDayGifModel = new OpenDayGifModel

		this.TotemsModel=new TotemsModel;

		this.UpLvWayModel=new UpLvWayModel;
		this.Ladder = new Ladder
		this.SoundManager = new SoundManager

		this.PositionForeshowModel =new PositionForeshowModel
	};

	static get Config() {
		return GlobalConfig.ins()
	}

	public static GetItemName(itemId: number): string {
		let config = GameGlobal.Config.ItemConfig[itemId]
		if (!config) {
			return " "
		}
		return config.name
	}
}