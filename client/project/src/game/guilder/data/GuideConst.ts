class GuideConst {

	private static m_ViewList = null

	public static GetViewList() {
		if (!this.m_ViewList) {
			this.m_ViewList = {
				[1]: {cls: PlayFunView, subCls: null},
				[2]: {cls: GameSceneView, subCls: null},
				[3]: {cls: MainBottomPanel, subCls: null},
				[4]: {cls: GameCityPanel, subCls: null},
				[100]: {cls: FbLayer, subCls: null},
				[10010]: {cls: RoleWin, subCls: RoleInfoPanel},
				[20010]: {cls: RoleWin, subCls: RoleSkillPanel},
				[30010]: {cls: GuanQiaRewardWin, subCls: GuanQiaRewardPanel},
				[40010]: {cls: PetMainPanel, subCls: PetUpLevelPanel},
				[10030]: {cls: ForgeWin, subCls: ForgeqhPanel},
				[50010]: {cls: RoleWin, subCls: RoleRidePanel},
				[10020]: {cls: SmeltEquipTotalWin, subCls: SmeltEquipNormalPanel},
				[30020]: {cls: WorldMapPanel, subCls: null},
				[60050]: {cls: FbLayer, subCls: CaiLiaoFbPanel},
				[60081]: {cls: FbLayer, subCls: LingLongTaPanel},
				[60060]: {cls: FbLayer, subCls: FbCbtPanel},
				[60020]: {cls: BossMainPanel, subCls: PersonBossPanel},
				[60040]: {cls: ArenaWin, subCls: ArenaInfoPanel},
				[60090]: {cls: DailyMainWin, subCls: DailyFomalhautMainPanel},
				[6009001]: {cls: DailyFomalhautTaskPanel, subCls: null},
			}
		}
		return this.m_ViewList
	}

	private static GetView(cls: any, subCls: any = null): any {
		let view = ViewManager.ins().getView(cls)
		if (subCls && view) {
			if (view.mCommonWindowBg) {
				let subView = view.mCommonWindowBg.GetViewByClassType(subCls)
				return <BaseView>subView
			}
		}
		return view
	}

	public static GetTarget(panelId: number, targetId: number): any[] {
		let panelData = this.GetViewList()[panelId]
		if (panelData) {
			let view = this.GetView(panelData.cls, panelData.subCls)
			if (view) {
				if (targetId == 100) {
					let euiView= Util.GetParentByType(view, BaseEuiView) as BaseEuiView
					if (euiView && euiView.mCommonWindowBg && euiView.mCommonWindowBg.returnBtn) {
						return [euiView, euiView.mCommonWindowBg.returnBtn]
					} else {
						console.warn("view not close btn => " + egret.getQualifiedClassName(view))
					}
				} else {
					if (view.GetGuideTarget) {
						let targetList = view.GetGuideTarget()
						let target = targetList[targetId]
						if (!target) {
							console.error("not find target => " + egret.getQualifiedClassName(view) + "; targetId => " + targetId)
						}
						return [view, target]
					} else {
						console.error("not GetGuideTarget func => " + egret.getQualifiedClassName(view))
					}
				}
			} else {
				console.warn("not open view => " + egret.getQualifiedClassName(panelData.cls))
			}
		} else {
			console.error("not def panelId => " + panelId)
		}
		return null
 	}
}