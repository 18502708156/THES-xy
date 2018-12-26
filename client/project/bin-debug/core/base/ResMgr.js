var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ResMgr = (function () {
    function ResMgr() {
    }
    ResMgr.GetNoneList = function () {
        if (!this.NONE_LIST) {
            this.NONE_LIST = (_a = {},
                _a[ResDataPath.GetUIEffePath("eff_ui_zb_001") + ".png"] = 1,
                _a[ResDataPath.GetUIEffePath("eff_ui_zb_002") + ".png"] = 1,
                _a[ResDataPath.GetUIEffePath("eff_ui_zb_003") + ".png"] = 1,
                _a);
        }
        return this.NONE_LIST;
        var _a;
    };
    ResMgr.GetName = function (name) {
        var rName = this.m_ResConfig.getName(name);
        if (rName) {
            return rName;
        }
        return name;
    };
    ResMgr.ins = function () {
        if (!this.m_Instance) {
            this.m_Instance = new ResMgr();
        }
        return this.m_Instance;
    };
    ResMgr.Init = function () {
        this.m_ResConfig = RES["configInstance"];
    };
    ResMgr.GmInit = function () {
        // if (ActorModel.IsSimpleGM()) {
        // 	this.LOG = true
        // }
        // if (DEBUG) {
        // this.LIFE_TIME = 10 * 1000
        // this.LOOP_TIME = 5 * 1000
        // }
    };
    ResMgr._DoUpdate = function () {
        var hasCount = 0;
        var opCount = 0;
        var timer = egret.getTimer();
        for (var key in this.m_Wait) {
            ++hasCount;
            // 如果释放对象过多，则终止当前循环
            if (opCount >= this.MAX_OP_COUNT) {
                break;
            }
            if (timer >= this.m_Wait[key]) {
                if (this.DestroyRes(key)) {
                    if (this.LOG) {
                        // console.log(`curtime => ${timer}; name => ${key}; objtime => ${this.m_Wait[key]}`)
                        console.log("destroy name => " + key);
                    }
                    ++opCount;
                }
                delete this.m_Wait[key];
                --hasCount;
            }
        }
        if (hasCount < 1) {
            TimerManager.ins().remove(this._DoUpdate, this);
            this.m_IsUpdate = false;
        }
    };
    ResMgr.Ref = function (name) {
        if (!name) {
            return;
        }
        if (ResMgr.GetNoneList()[name]) {
            return;
        }
        // 如果存在等待回收的队列中，则移除它
        if (this.m_Wait[name]) {
            delete this.m_Wait[name];
        }
        if (this.m_Ref[name]) {
            ++this.m_Ref[name];
        }
        else {
            this.m_Ref[name] = 1;
        }
    };
    ResMgr.Unref = function (name, lifeTime) {
        if (lifeTime === void 0) { lifeTime = null; }
        if (!name) {
            return false;
        }
        if (ResMgr.GetNoneList()[name]) {
            return false;
        }
        // 不存在该资源
        if (!this.m_Ref[name]) {
            return false;
        }
        // 如果计数为空
        if (--this.m_Ref[name] <= 0) {
            delete this.m_Ref[name];
            // 加入待回收列表
            this.m_Wait[name] = egret.getTimer() + (lifeTime || this.LIFE_TIME);
            if (!this.m_IsUpdate) {
                this.m_IsUpdate = true;
                TimerManager.ins().doTimer(this.LOOP_TIME, 0, this._DoUpdate, this);
            }
            return true;
        }
        return false;
    };
    // 强行释放资源
    ResMgr.ForceUnref = function (name) {
        if (this.m_Ref[name]) {
            delete this.m_Ref[name];
        }
        this.m_Wait[name] = egret.getTimer() + 5;
    };
    ResMgr.RefSkin = function (skinName) {
        if (!skinName) {
            return;
        }
        var list = RES_REF ? RES_REF[skinName] : null;
        if (list) {
            // console.log("Skin => " +skinName+ " Ref -----> ")
            for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                var data = list_1[_i];
                ResMgr.Ref(data);
                // console.log("           " + data)
            }
        }
    };
    ResMgr.UnrefSkin = function (skinName) {
        if (!skinName) {
            return;
        }
        var list = RES_REF ? RES_REF[skinName] : null;
        if (list) {
            // console.log("Skin => " +skinName+ " Unref -----> ")
            for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                var data = list_2[_i];
                ResMgr.Unref(data, ResMgr.IMG_LIFT_TIME);
                // console.log("           " + data)
            }
        }
    };
    ResMgr.DestroyRes = function (url) {
        return RES.destroyRes(url);
    };
    ResMgr.DebugPrint = function () {
        var list = [];
        for (var key in this.m_Ref) {
            list.push("key => " + key + " => " + this.m_Ref[key]);
        }
        console.log("ref ======================");
        console.log(list.join("\n"));
        list.length = 0;
        var et = egret.getTimer();
        console.log("wait ======================", et);
        for (var key in this.m_Wait) {
            var t = this.m_Wait[key];
            list.push("key => " + key + "; time => " + t + "; left => " + (t - et));
        }
        console.log(list.join("\n"));
    };
    ResMgr.getRefCount = function (name) {
        if (!this.m_Ref[name])
            return 0;
        return this.m_Ref[name];
    };
    ResMgr.NONE_LIST = null;
    ResMgr.IMG_LIFT_TIME = 30 * 1000;
    ResMgr.LIFE_TIME = 3 * 1000;
    ResMgr.LOOP_TIME = 3 * 1000;
    ResMgr.MAX_OP_COUNT = 40;
    ResMgr.LOG = false;
    ResMgr.m_Ref = {};
    ResMgr.m_Wait = {};
    ResMgr.m_IsUpdate = false;
    return ResMgr;
}());
__reflect(ResMgr.prototype, "ResMgr");
//# sourceMappingURL=ResMgr.js.map