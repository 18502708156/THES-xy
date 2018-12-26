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
var MoveTeam = (function () {
    function MoveTeam() {
        this.mMasterHandle = 0;
        this.mMember = [];
    }
    MoveTeam.prototype.GetInfo = function () {
        if (!this.mMember[0]) {
            return null;
        }
        var info = this.mMember[0].mTarget.GetInfo();
        if (!info) {
            return null;
        }
        return info;
    };
    MoveTeam.prototype.GetX = function () {
        var info = this.GetInfo();
        if (!info) {
            return 0;
        }
        return info.x;
    };
    MoveTeam.prototype.GetY = function () {
        var info = this.GetInfo();
        if (!info) {
            return 0;
        }
        return info.y;
    };
    MoveTeam.prototype.Init = function (member) {
        var list = [];
        var pre = null;
        for (var _i = 0, member_1 = member; _i < member_1.length; _i++) {
            var m = member_1[_i];
            m.mTeamHandle = this.mMasterHandle;
            m.UpdateAction(EntityClipType.STAND, false);
            var mem = new MoveMember();
            mem.mTarget = m;
            list.push(mem);
            if (pre) {
                m.SetPos(m.x, m.y);
                mem.mPre = pre;
            }
            pre = mem;
        }
        this.mMember = list;
    };
    MoveTeam.prototype.Clear = function () {
        for (var _i = 0, _a = this.mMember; _i < _a.length; _i++) {
            var data = _a[_i];
            if (data.mTarget) {
                data.mTarget.mTeamHandle = null;
            }
        }
        this.mMember = [];
        this.mOrderId = null;
    };
    MoveTeam.prototype.AddEntity = function (m) {
        if (!m) {
            return;
        }
        m.mTeamHandle = this.mMasterHandle;
        m.UpdateAction(EntityClipType.STAND, false);
        var mem = new MoveMember();
        mem.mTarget = m;
        var pre = this.mMember[this.mMember.length - 1];
        if (pre) {
            m.SetPos(pre.mTarget.x, pre.mTarget.y);
            mem.mPre = pre;
        }
        this.mMember.push(mem);
    };
    MoveTeam.prototype.RemoveMem = function (handle) {
        for (var i = 0; i < this.mMember.length; i++) {
            var entity = this.mMember[i].mTarget;
            if (entity && entity.GetHandle() == handle) {
                var pre = this.mMember[i].mPre;
                var next = this.mMember[i + 1];
                if (next) {
                    next.mPre = pre;
                }
                this.mMember.splice(i, 1);
                entity.mTeamHandle = null;
                break;
            }
        }
    };
    MoveTeam.prototype.GetMember = function () {
        var list = [];
        for (var _i = 0, _a = this.mMember; _i < _a.length; _i++) {
            var m = _a[_i];
            var target = m.mTarget;
            if (target) {
                var info = target.GetInfo();
                info.x = target.x;
                info.y = target.y;
                list.push(info);
            }
        }
        return list;
    };
    MoveTeam.prototype.MoveTo = function (id, x, y, offset, isBack) {
        if (this.mMember.length) {
            this.mOrderId = id;
            var mem = this.mMember[0];
            if (mem && mem.mTarget) {
                if (isBack) {
                    mem.MoveTo(x, y, offset);
                }
                else {
                    var astar = GameMap.aStar.getPatch(mem.mTarget.x, mem.mTarget.y, x, y);
                    if (astar && astar.length) {
                        mem.MoveToByAStar(astar, offset);
                    }
                    else {
                        mem.MoveTo(x, y, offset);
                    }
                }
            }
        }
    };
    MoveTeam.prototype.FlyTo = function (x, y) {
        if (this.mMember.length) {
            this.mOrderId = null;
            this.mMember[0].FlyTo(x, y);
        }
    };
    MoveTeam.prototype.Update = function (delta) {
        if (this.mMember.length) {
            var ret = this.mMember[0].Update(delta);
            for (var i = this.mMember.length - 1; i >= 1; --i) {
                this.mMember[i].Update(delta);
            }
            if (this.mOrderId != null && this.mOrderId != -1 && ret == AIUnitMoveData.STATE_FINISH) {
                var id = this.mOrderId;
                this.mOrderId = null;
                var target = this.mMember[0].mTarget;
                GameGlobal.RaidMgr.mMapRaid.OnMoveLeval(id, target.GetHandle(), target.x, target.y);
            }
            return ret;
        }
        return AIUnitMoveData.STATE_FINISH;
    };
    MoveTeam.NONE_ORDER = -1;
    MoveTeam.MOVE_SPEED = 140;
    return MoveTeam;
}());
__reflect(MoveTeam.prototype, "MoveTeam");
var NormalMoveTeam = (function (_super) {
    __extends(NormalMoveTeam, _super);
    function NormalMoveTeam() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.INDEX = 0;
        _this.WAY = 1;
        _this.pathIndex = 0;
        return _this;
    }
    NormalMoveTeam.prototype.GetNextPos = function () {
        var pathData = GameMap.mPath[this.pathIndex];
        if (!pathData) {
            return null;
        }
        var points = pathData.points;
        var data = points[this.INDEX];
        if (!data) {
            if (this.INDEX >= points.length - 1) {
                data = points[0];
            }
            else if (this.INDEX <= 0) {
                data = points[points.length - 1];
            }
        }
        this.INDEX += this.WAY;
        if (this.INDEX >= points.length - 1) {
            this.WAY = -1;
        }
        else if (this.INDEX <= 0) {
            this.WAY = 1;
        }
        return [Const.PosToPixel(pathData.x + data.x), Const.PosToPixel(pathData.y + data.y)];
    };
    NormalMoveTeam.prototype.SetRanStartPos = function (entity) {
        if (!entity || !entity.length) {
            return;
        }
        var pathData = GameMap.mPath[this.pathIndex];
        if (!pathData) {
            return;
        }
        var points = pathData.points;
        this.INDEX = MathUtils.limitInteger(0, points.length - 1);
        var pos = points[this.INDEX];
        if (pos) {
            entity[0].SetPos(Const.PosToPixel(pathData.x + pos.x), Const.PosToPixel(pathData.y + pos.y));
        }
        else {
            entity[0].SetPos(Const.PosToPixel(pathData.x + 4), Const.PosToPixel(pathData.y + 4));
        }
        // 偏移坐标
        for (var i = 1; i < entity.length; i++) {
            entity[i].x = entity[i - 1].x - 50;
            entity[i].y = entity[i - 1].y;
        }
    };
    NormalMoveTeam.prototype.Init = function (member) {
        if (GameMap.mPath && GameMap.mPath.length) {
            NormalMoveTeam.PATH_INDEX++;
            if (NormalMoveTeam.PATH_INDEX >= GameMap.mPath.length) {
                NormalMoveTeam.PATH_INDEX = 0;
            }
            else if (NormalMoveTeam.PATH_INDEX < 0) {
                NormalMoveTeam.PATH_INDEX = 0;
            }
            this.pathIndex = NormalMoveTeam.PATH_INDEX;
            // this.pathIndex = MathUtils.limitInteger(0, GameMap.mPath.length - 1)
        }
        if (member.length) {
            if (member[0].GetInfo().x == 0 && member[0].GetInfo().y == 0) {
                this.SetRanStartPos(member);
            }
        }
        _super.prototype.Init.call(this, member);
        var data = this.GetNextPos();
        if (data) {
            this.MoveTo(MoveTeam.NONE_ORDER, data[0], data[1], 0, true);
        }
    };
    NormalMoveTeam.prototype.Update = function (delta) {
        var ret = _super.prototype.Update.call(this, delta);
        if (ret == 2) {
            var data = this.GetNextPos();
            if (data) {
                this.MoveTo(MoveTeam.NONE_ORDER, data[0], data[1], 0, true);
            }
        }
        return ret;
    };
    NormalMoveTeam.PATH_INDEX = -1;
    return NormalMoveTeam;
}(MoveTeam));
__reflect(NormalMoveTeam.prototype, "NormalMoveTeam");
var MoveMember = (function () {
    function MoveMember() {
        this.mIsMove = false;
        this.m_MoveData = new AIUnitMoveData;
    }
    MoveMember.prototype.MoveToByAStar = function (aStar, offset) {
        if (!offset) {
            offset = this.mPre ? 20 : 0;
        }
        if (this.m_MoveData.InitByAStar(this.mTarget.x, this.mTarget.y, aStar, MoveTeam.MOVE_SPEED, offset)) {
            this.mTarget.SetDir(this.m_MoveData.mDir);
            this.mIsMove = true;
        }
        if (this.mIsMove) {
            this.mTarget.UpdateAction(EntityClipType.RUN, false);
        }
    };
    MoveMember.prototype.MoveTo = function (x, y, offset) {
        if (!offset) {
            offset = this.mPre ? 20 : 0;
        }
        if (this.m_MoveData.Init(this.mTarget.x, this.mTarget.y, x, y, MoveTeam.MOVE_SPEED, offset)) {
            this.mTarget.SetDir(this.m_MoveData.mDir);
            this.mIsMove = true;
        }
        if (this.mIsMove) {
            this.mTarget.UpdateAction(EntityClipType.RUN, false);
        }
    };
    MoveMember.prototype.FlyTo = function (x, y) {
        if (this.m_MoveData) {
            this.m_MoveData.Stop();
        }
        this.mTarget.SetPos(x, y);
    };
    MoveMember.prototype.Update = function (delta) {
        if (!this.mIsMove) {
            this.CheckRun();
            return AIUnitMoveData.STATE_FINISH;
        }
        var taget = this.mTarget;
        var ret = this.m_MoveData.Update(delta, taget);
        this.mTarget.SetDir(this.m_MoveData.mDir);
        this.mTarget.alpha = GameMap.checkAlpha(Const.PixelToPos(taget.x), Const.PixelToPos(taget.y)) ? 0.5 : 1;
        if (ret == AIUnitMoveData.STATE_FINISH) {
            if (!this.CheckRun()) {
                this.mTarget.UpdateAction(EntityClipType.STAND, false);
                this.mIsMove = false;
            }
        }
        return ret;
    };
    MoveMember.prototype.CheckRun = function () {
        if (this.mPre) {
            var x1 = this.mTarget.x;
            var y1 = this.mTarget.y;
            var x2 = this.mPre.mTarget.x;
            var y2 = this.mPre.mTarget.y;
            var disX = x2 - x1;
            var disY = y2 - y1;
            var dis = disX * disX + disY * disY;
            if (dis >= 6000) {
                this.MoveTo(x2, y2, 0);
                return true;
            }
        }
        return false;
    };
    return MoveMember;
}());
__reflect(MoveMember.prototype, "MoveMember");
//# sourceMappingURL=MoveTeam.js.map