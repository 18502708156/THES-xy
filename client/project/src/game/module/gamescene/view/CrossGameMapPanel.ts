class CrossGameMapPanel extends GameMapPanel {
    public OnClickExitRaid() {
        WarnWin.show(this.leaveDlgStr, function () {
            GameGlobal.CommonRaidModel.MapLeave()
            
        }, this);
    }
}