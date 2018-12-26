var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RuleIconBase = (function () {
    function RuleIconBase(t) {
        this.effX = 34;
        this.effY = 31;
        this.layerCount = 0;
        this.tar = t;
        this.m_Parent = this.tar.parent;
        t["__c_index__"] = this.layerCount = this.m_Parent.getChildIndex(this.tar);
        this.time_txt = t.getChildByName("time_txt");
        this.iconDisplay = this.tar["iconDisplay"];
    }
    RuleIconBase.prototype.setTime = function (endTime) {
        this._endTime = endTime;
        if (this._endTime - GameServer.serverTimeMilli > 0) {
            if (!TimerManager.ins().isExists(this.updateTime, this)) {
                TimerManager.ins().doTimer(1000, 0, this.updateTime, this);
            }
            this.updateTime();
            if (this.time_txt)
                this.time_txt.visible = true;
        }
        else {
            TimerManager.ins().remove(this.updateTime, this);
            if (this.time_txt)
                this.time_txt.visible = false;
        }
    };
    RuleIconBase.prototype.updateTime = function () {
        if (this._endTime - GameServer.serverTimeMilli <= 0) {
            TimerManager.ins().remove(this.updateTime, this);
            if (this.time_txt)
                this.time_txt.visible = false;
            return;
        }
        var t = this._endTime - GameServer.serverTimeMilli;
        var time = DateUtils.format_16(t);
        if (this.time_txt)
            this.time_txt.text = time;
    };
    RuleIconBase.prototype.DoShow = function () {
        if (this.tar.parent || !this.m_Parent) {
            return;
        }
        var addIndex = null;
        for (var i = 0; i < this.m_Parent.numChildren; ++i) {
            var index = this.m_Parent.getChildAt(i)["__c_index__"] || 0;
            if (this.layerCount < index) {
                addIndex = i;
                break;
            }
        }
        if (addIndex != null) {
            this.m_Parent.addChildAt(this.tar, addIndex);
        }
        else {
            this.m_Parent.addChild(this.tar);
        }
        this.tar.visible = true;
        this.tar.includeInLayout = true;
    };
    RuleIconBase.prototype.DoHide = function () {
        DisplayUtils.removeFromParent(this.tar);
        this.tar.visible = false;
        this.tar.includeInLayout = false;
    };
    RuleIconBase.prototype.checkShowIcon = function () {
        return true;
    };
    RuleIconBase.prototype.checkShowRedPoint = function () {
        return null;
    };
    RuleIconBase.prototype.getEffName = function (redPointNum) {
        return null;
    };
    /** 执行 */
    RuleIconBase.prototype.tapExecute = function (tapTarget) {
    };
    RuleIconBase.prototype.update = function () {
        var tar = this.tar;
        var isShow = this.checkShowIcon();
        var effName;
        var mc;
        var count;
        if (isShow) {
            // 显示图标
            this.DoShow();
            if (tar['redPoint']) {
                count = this.checkShowRedPoint();
                UIHelper.ShowRedPoint(tar, count);
            }
            effName = this.getEffName(count);
            if (effName) {
                if (!this.ruleEff) {
                    mc = new MovieClip();
                    mc.loadUrl(ResDataPath.GetUIEffePath2(effName), true, -1);
                    this.ruleEff = mc;
                }
                if (!this.ruleEff.parent) {
                    this.ruleEff.x = this.effX;
                    this.ruleEff.y = this.effY;
                    tar.addChild(this.ruleEff);
                }
                else {
                    this.ruleEff.play(-1);
                }
            }
            else {
                if (this.ruleEff)
                    DisplayUtils.removeFromParent(this.ruleEff);
            }
        }
        else {
            this.DoHide();
        }
    };
    RuleIconBase.prototype.addEvent = function () {
        if (!this.updateMessage) {
            return;
        }
        for (var _i = 0, _a = this.updateMessage; _i < _a.length; _i++) {
            var data = _a[_i];
            GameGlobal.MessageCenter.addListener(data, this.update, this);
        }
    };
    RuleIconBase.prototype.removeEvent = function () {
        GameGlobal.MessageCenter.removeAll(this);
    };
    RuleIconBase.prototype.DefEffe = function (e) {
        return this.firstTap || e ? ("ui_yhy002") : void 0;
    };
    RuleIconBase.POS1_X = 44;
    RuleIconBase.POS1_Y = 44;
    return RuleIconBase;
}());
__reflect(RuleIconBase.prototype, "RuleIconBase");
//# sourceMappingURL=RuleIconBase.js.map