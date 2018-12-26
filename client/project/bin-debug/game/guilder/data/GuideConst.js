var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GuideConst = (function () {
    function GuideConst() {
    }
    GuideConst.GetViewList = function () {
        if (!this.m_ViewList) {
            this.m_ViewList = (_a = {},
                _a[1] = { cls: PlayFunView, subCls: null },
                _a[2] = { cls: GameSceneView, subCls: null },
                _a[3] = { cls: MainBottomPanel, subCls: null },
                _a[4] = { cls: GameCityPanel, subCls: null },
                _a[100] = { cls: FbLayer, subCls: null },
                _a[10010] = { cls: RoleWin, subCls: RoleInfoPanel },
                _a[20010] = { cls: RoleWin, subCls: RoleSkillPanel },
                _a[30010] = { cls: GuanQiaRewardWin, subCls: GuanQiaRewardPanel },
                _a[40010] = { cls: PetMainPanel, subCls: PetUpLevelPanel },
                _a[10030] = { cls: ForgeWin, subCls: ForgeqhPanel },
                _a[50010] = { cls: RoleWin, subCls: RoleRidePanel },
                _a[10020] = { cls: SmeltEquipTotalWin, subCls: SmeltEquipNormalPanel },
                _a[30020] = { cls: WorldMapPanel, subCls: null },
                _a[60050] = { cls: FbLayer, subCls: CaiLiaoFbPanel },
                _a[60081] = { cls: FbLayer, subCls: LingLongTaPanel },
                _a[60060] = { cls: FbLayer, subCls: FbCbtPanel },
                _a[60020] = { cls: BossMainPanel, subCls: PersonBossPanel },
                _a[60040] = { cls: ArenaWin, subCls: ArenaInfoPanel },
                _a[60090] = { cls: DailyMainWin, subCls: DailyFomalhautMainPanel },
                _a[6009001] = { cls: DailyFomalhautTaskPanel, subCls: null },
                _a);
        }
        return this.m_ViewList;
        var _a;
    };
    GuideConst.GetView = function (cls, subCls) {
        if (subCls === void 0) { subCls = null; }
        var view = ViewManager.ins().getView(cls);
        if (subCls && view) {
            if (view.mCommonWindowBg) {
                var subView = view.mCommonWindowBg.GetViewByClassType(subCls);
                return subView;
            }
        }
        return view;
    };
    GuideConst.GetTarget = function (panelId, targetId) {
        var panelData = this.GetViewList()[panelId];
        if (panelData) {
            var view = this.GetView(panelData.cls, panelData.subCls);
            if (view) {
                if (targetId == 100) {
                    var euiView = Util.GetParentByType(view, BaseEuiView);
                    if (euiView && euiView.mCommonWindowBg && euiView.mCommonWindowBg.returnBtn) {
                        return [euiView, euiView.mCommonWindowBg.returnBtn];
                    }
                    else {
                        console.warn("view not close btn => " + egret.getQualifiedClassName(view));
                    }
                }
                else {
                    if (view.GetGuideTarget) {
                        var targetList = view.GetGuideTarget();
                        var target = targetList[targetId];
                        if (!target) {
                            console.error("not find target => " + egret.getQualifiedClassName(view) + "; targetId => " + targetId);
                        }
                        return [view, target];
                    }
                    else {
                        console.error("not GetGuideTarget func => " + egret.getQualifiedClassName(view));
                    }
                }
            }
            else {
                console.warn("not open view => " + egret.getQualifiedClassName(panelData.cls));
            }
        }
        else {
            console.error("not def panelId => " + panelId);
        }
        return null;
    };
    GuideConst.m_ViewList = null;
    return GuideConst;
}());
__reflect(GuideConst.prototype, "GuideConst");
//# sourceMappingURL=GuideConst.js.map