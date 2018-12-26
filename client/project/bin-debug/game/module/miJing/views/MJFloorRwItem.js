var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MJFloorRwItem = (function () {
    function MJFloorRwItem(item, bg) {
        this.item = item;
        this.bg = bg;
    }
    MJFloorRwItem.prototype.createChildren = function () {
        // super.createChildren();
        this.initData(this._id, this._startFloor, this._endFloor);
        // this.boxGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this._click, this)
    };
    MJFloorRwItem.prototype.initData = function (id, startFloor, endFloor) {
        this._id = id;
        this._startFloor = startFloor;
        this._endFloor = endFloor;
        if (!this.item.level_txt)
            return;
        this.item.level_txt.text = endFloor + "层";
        // this.updateDisplayList(this.width,this.height);
        this.update();
    };
    MJFloorRwItem.prototype.update = function () {
        var p;
        var mjModel = GameGlobal.MiJingModel;
        var hasAward = false;
        if (mjModel.floor >= this._endFloor || mjModel.floor == mjModel.maxFloor) {
            this.item.getImage.visible = mjModel.GetFloorAwardState(this._id) == BitRewardState.Gotten;
            this.item.redPoint.visible = !this.item.getImage.visible;
            hasAward = !this.item.getImage.visible;
            this.bg.visible = true;
            p = 1;
        }
        else {
            this.item.redPoint.visible = this.item.getImage.visible = false;
            p = (mjModel.floor - this._startFloor) / (this._endFloor - this._startFloor);
            if (p < 0)
                p = 0;
            if (p > 1)
                p = 1;
            this.bg.visible = false;
        }
        // this.thumb_mask.width = this.thumb.width * p;
        if (hasAward) {
            // if(!this.mc)
            // {
            // 	this.mc =  new MovieClip();
            // 	this.mc.x = this.boxGroup.x + 32
            // 	this.mc.y = this.boxGroup.y + 25
            // 	this.mc.touchEnabled = false;
            // 	this.mc.loadFile(ResDataPath.GetUIEffePath("taskBox"), true)
            // 	this.mc.scaleX = this.mc.scaleY = 1.5
            // }
            // if(this.mc.parent==null) this.addChild(this.mc);
        }
        else {
            // if(this.mc)
            // {
            // 	DisplayUtils.removeFromParent(this.mc);
            // }
        }
    };
    MJFloorRwItem.prototype.canHasAward = function () {
        var mjModel = GameGlobal.MiJingModel;
        return (mjModel.GetFloorAwardState(this._id) == BitRewardState.CanGet) || mjModel.floor < this._endFloor;
    };
    return MJFloorRwItem;
}());
__reflect(MJFloorRwItem.prototype, "MJFloorRwItem");
//# sourceMappingURL=MJFloorRwItem.js.map