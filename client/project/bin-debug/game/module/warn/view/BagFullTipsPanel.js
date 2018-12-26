var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var BagFullTipsPanel = (function () {
    function BagFullTipsPanel() {
    }
    BagFullTipsPanel.CheckOpen = function (count) {
        if (UserBag.ins().getSurplusCount() < count) {
            BagFullTipsPanel.Open();
            return false;
        }
        return true;
    };
    BagFullTipsPanel.Open = function () {
        this.strText = this.strText.replace(/Num/, UserBag.BAG_ENOUGH + "个");
        WarnWin.show(this.strText, function () {
            ViewManager.ins().open(SmeltEquipTotalWin);
        }, this, null, null, "sure", {
            btnName: "前往熔炼"
        });
    };
    //打开熔炼界面，但不关闭自己原来的界面，寻宝功能需要用到
    BagFullTipsPanel.OpenNoCloseMe = function () {
        this.strText = this.strText.replace(/Num/, UserBag.BAG_ENOUGH + "个");
        WarnWin.show(this.strText, function () {
            ViewManager.ins().openEasy(SmeltEquipTotalWin);
        }, this, null, null, "sure", {
            btnName: "前往熔炼"
        });
    };
    BagFullTipsPanel.strText = "空余背包不足<font color=0xdb0000>Num</font>";
    return BagFullTipsPanel;
}());
__reflect(BagFullTipsPanel.prototype, "BagFullTipsPanel");
//# sourceMappingURL=BagFullTipsPanel.js.map