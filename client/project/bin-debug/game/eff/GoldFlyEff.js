var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GoldFlyEff = (function () {
    function GoldFlyEff() {
        this.mCount = 10;
        this.mMax = 10;
        this.mGap = 50;
        this.m_Pool = [];
        this.m_Play = [];
        this.create = 0;
        this.pCreate = 0;
    }
    GoldFlyEff.prototype.Play = function (rect, tx, ty) {
        this.mRect = rect;
        this.mTx = tx;
        this.mTy = ty;
        this.StartTween();
    };
    GoldFlyEff.prototype.StartTween = function () {
        if (this.play) {
            return;
        }
        this.play = true;
        this.pt = egret.getTimer();
        egret.startTick(this.Update, this);
        this.m_Pool = [];
        this.m_Play = [];
    };
    GoldFlyEff.prototype.StopTween = function () {
        if (!this.play) {
            return;
        }
        this.play = false;
        egret.stopTick(this.Update, this);
    };
    GoldFlyEff.prototype.Update = function (t) {
        var dt = t - this.pt;
        this.pt = t;
        for (var i = this.m_Play.length - 1; i >= 0; --i) {
            var item = this.m_Play[i];
            if (!item.Update(dt)) {
                DisplayUtils.removeFromParent(item.mItem);
                this.m_Play.splice(i, 1);
                this.m_Pool.push(item);
            }
        }
        if (this.create < this.mCount && this.m_Play.length < this.mMax && egret.getTimer() - this.pCreate > this.mGap) {
            ++this.create;
            this.pCreate = egret.getTimer();
            var item = this.m_Pool.pop() || new GoldFlyEffItem;
            item.Init(this.mSource, MathUtils.limitInteger(this.mRect.left, this.mRect.right), MathUtils.limitInteger(this.mRect.top, this.mRect.bottom), this.mTx, this.mTy, MathUtils.limitInteger(20, 200), MathUtils.limitInteger(20, 200), 0.25, 0.55, Math.random() > 0.5 ? 1 : -1, 1, egret.Ease.sineOut);
            LayerManager.UI_Tips.addChild(item.mItem);
            this.m_Play.push(item);
        }
        if (!this.m_Play.length && this.create >= this.mCount) {
            this.StopTween();
        }
        return false;
    };
    return GoldFlyEff;
}());
__reflect(GoldFlyEff.prototype, "GoldFlyEff");
var GoldFlyEffItem = (function () {
    function GoldFlyEffItem() {
        this.m_Time = 0;
        this.m_Delay = 0;
    }
    GoldFlyEffItem.prototype.Init = function (src, sx, sy, ex, ey, h1, h2, p1, p2, way, speed, ease) {
        if (ease === void 0) { ease = null; }
        if (!this.mItem) {
            this.mItem = new eui.Image;
        }
        this.mItem.source = src;
        var dx = ex - sx;
        var dy = ey - sy;
        // let h1 = 100
        // let h2 = 100
        // let p1 = 0.25
        // let p2 = 0.75
        this.m_Ease = ease;
        this.m_Duration = Math.ceil(Math.sqrt(dx * dx + dy * dy) / speed);
        var pos = egret.$TempPoint;
        MathUtils.Normalize(dx, dy, pos);
        var v2 = {
            x: way * pos.y,
            y: -1 * way * pos.x
        };
        var arr = [
            { x: sx, y: sy },
            { x: sx + dx * p1, y: sy + dy * p1 },
            { x: sx + dx * p2, y: sy + dy * p2 },
            { x: ex, y: ey },
        ];
        arr[1].x += v2.x * h1;
        arr[1].y += v2.y * h1;
        arr[2].x += v2.x * h2;
        arr[2].y += v2.y * h2;
        this.bezier = new Bezier(arr);
        this.mItem.scaleX = this.mItem.scaleY = 0;
        this.mItem.x = sx;
        this.mItem.y = sy + 80;
        var tween = egret.Tween.get(this.mItem);
        this.m_Delay = 600;
        tween.to({
            scaleX: 1,
            scaleY: 1,
            y: sy,
        }, this.m_Delay, egret.Ease.elasticOut);
    };
    GoldFlyEffItem.prototype.Update = function (delta) {
        if (this.m_Delay > 0) {
            if ((this.m_Delay -= delta) > 0) {
                return true;
            }
        }
        this.m_Time += delta;
        var t = this.m_Time / this.m_Duration;
        if (t >= 1) {
            t = 1;
        }
        if (this.m_Ease) {
            t = this.m_Ease(t);
        }
        var pos = egret.$TempPoint;
        this.bezier.Get(t, pos);
        this.mItem.x = pos.x;
        this.mItem.y = pos.y;
        return t < 1;
    };
    return GoldFlyEffItem;
}());
__reflect(GoldFlyEffItem.prototype, "GoldFlyEffItem");
//# sourceMappingURL=GoldFlyEff.js.map