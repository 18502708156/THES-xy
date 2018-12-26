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
var TipsView = (function (_super) {
    __extends(TipsView, _super);
    function TipsView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labCount = 0;
        _this.list = [];
        _this.goodEquipList = [];
        _this.m_StrList = [];
        _this.m_CacheList = [];
        _this.m_IsUpadte = false;
        _this.m_PreTime = 0;
        return _this;
    }
    TipsView.prototype.initUI = function () {
        _super.prototype.initUI.call(this);
        this.touchChildren = false;
        this.touchEnabled = false;
        this.m_Group = new eui.Group;
        this.m_Group.horizontalCenter = 0;
        this.m_Group.width = 0;
        this.addChild(this.m_Group);
        this.equipTip1 = new TipsGoodEquip();
        this.equipTip2 = new TipsGoodEquip();
    };
    ;
    /**
     * 显示tips
     * @param str
     */
    TipsView.prototype.showTips = function (str) {
        this.m_StrList.push([str]);
        this._StartUpdate();
    };
    TipsView.prototype.showIconTips = function (str, src) {
        this.m_StrList.push([str, src]);
        this._StartUpdate();
    };
    TipsView.prototype._Cache = function (index) {
        var item = this.list[index];
        if (!item) {
            return;
        }
        this.m_Group.removeChild(item);
        this.list.splice(index, 1);
        if (this.m_CacheList.length < 25) {
            this.m_CacheList.push(item);
        }
    };
    TipsView.prototype.CreateTips = function () {
        if (this.m_StrList.length < 1) {
            return;
        }
        var time = egret.getTimer();
        var str = this.m_StrList.shift();
        var tips = this.m_CacheList.pop() || new TipsItem;
        tips.labelText = str[0];
        tips.iconName = str[1];
        this.m_Group.addChild(tips);
        this.list.unshift(tips);
        var center = GameGlobal.StageUtils.GetHeight() >> 1;
        tips.y = center;
        for (var i = this.list.length - 1; i >= 0; --i) {
            var item = this.list[i];
            if (item.y < 0) {
                this._Cache(i);
                continue;
            }
            item.endPos = center - i * item.height;
            item.speed = (item.y - item.endPos) / 500;
        }
    };
    TipsView.prototype._StartUpdate = function () {
        if (this.m_IsUpadte) {
            return;
        }
        this.m_IsUpadte = true;
        this.m_PreTime = egret.getTimer();
        egret.startTick(this.Update, this);
    };
    TipsView.prototype._StopUpdate = function () {
        if (!this.m_IsUpadte) {
            return;
        }
        this.m_IsUpadte = false;
        egret.stopTick(this.Update, this);
    };
    TipsView.prototype.Update = function (timeStamp) {
        var delta = timeStamp - this.m_PreTime;
        this.m_PreTime = timeStamp;
        for (var i = this.list.length - 1; i >= 0; --i) {
            var item = this.list[i];
            var y = item.y - delta * item.speed;
            item.y = Math.max(item.endPos, y);
            if (!item.Update(delta)) {
                this._Cache(i);
            }
        }
        this.CreateTips();
        if (this.m_StrList.length < 1 && this.list.length < 1) {
            this._StopUpdate();
        }
        return false;
    };
    TipsView.prototype.showGoodEquipTip = function (item) {
        this.goodEquipList.push(item);
        if (TimerManager.ins().isExists(this.goodEquipTimer, this)) {
        }
        else {
            TimerManager.ins().doTimer(16, 0, this.goodEquipTimer, this);
        }
    };
    ;
    TipsView.prototype.goodEquipTimer = function () {
        var _this = this;
        if (this.goodEquipList.length == 0 || this.isWait) {
            return;
        }
        var equipTip = undefined;
        if (!this.equipTip1.isUsing) {
            equipTip = this.equipTip1;
        }
        if (!this.equipTip2.isUsing) {
            equipTip = this.equipTip2;
        }
        if (equipTip == undefined) {
            return;
        }
        equipTip.x = -235;
        equipTip.y = 1000;
        equipTip.alpha = 1;
        this.m_Group.addChild(equipTip);
        equipTip.isUsing = true;
        this.isWait = true;
        var itemData = this.goodEquipList.pop();
        equipTip.data = itemData;
        var t = egret.Tween.get(equipTip);
        t.to({ "y": 850 }, 500).call(function () {
            _this.isWait = false;
        }).wait(1000).to({ "alpha": 0 }, 1000).call(function () {
            // equipTip.visible = false;
            equipTip.isUsing = false;
            _this.m_Group.removeChild(equipTip);
        });
        var otherEquipTip;
        if (equipTip == this.equipTip1) {
            otherEquipTip = this.equipTip2;
        }
        else {
            otherEquipTip = this.equipTip1;
        }
        if (otherEquipTip.isUsing) {
            egret.Tween.removeTweens(otherEquipTip);
            var tt = egret.Tween.get(otherEquipTip);
            tt.to({ "y": 700, "alpha": 0 }, 1000).wait(300).call(function () {
                // otherEquipTip.visible = false;
                otherEquipTip.isUsing = false;
                _this.m_Group.removeChild(otherEquipTip);
            });
        }
    };
    ;
    TipsView.LAYER_LEVEL = LayerManager.UI_Tips;
    TipsView.START_Y = 640;
    TipsView.END_Y_OFFSET = 60;
    TipsView.MAX_ITEMS = 15;
    return TipsView;
}(BaseEuiView));
__reflect(TipsView.prototype, "TipsView");
//# sourceMappingURL=TipsView.js.map