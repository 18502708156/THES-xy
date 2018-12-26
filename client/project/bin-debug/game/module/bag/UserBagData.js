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
var UserBagData = (function () {
    function UserBagData() {
        this.mItems = {};
        this.m_Length = 0;
    }
    UserBagData.prototype.Clear = function () {
        this.mItems = {};
        this.m_Length = 0;
    };
    UserBagData.prototype.Add = function (itemData) {
        if (!this.mItems[itemData.handle]) {
            ++this.m_Length;
        }
        this.mItems[itemData.handle] = itemData;
    };
    UserBagData.prototype.Delete = function (handle) {
        var data = this.mItems[handle];
        if (data) {
            --this.m_Length;
            delete this.mItems[handle];
            return data;
        }
        return null;
    };
    UserBagData.prototype.Update = function (handle, count, temp) {
        var data = this.mItems[handle];
        if (data) {
            var addNum = count - data.count;
            data.count = count;
            temp.itemData = data;
            return addNum;
        }
        return null;
    };
    UserBagData.prototype.GetById = function (configId) {
        for (var key in this.mItems) {
            if (this.mItems[key].configID == configId) {
                return this.mItems[key];
            }
        }
        return null;
    };
    UserBagData.prototype.GetByIds = function (configId) {
        var list = [];
        for (var key in this.mItems) {
            if (this.mItems[key].configID == configId) {
                list.push(this.mItems[key]);
            }
        }
        return list;
    };
    UserBagData.prototype.GetByHandle = function (handle) {
        return this.mItems[handle];
    };
    UserBagData.prototype.GetLength = function () {
        return this.m_Length;
    };
    return UserBagData;
}());
__reflect(UserBagData.prototype, "UserBagData");
var UserBagData02 = (function (_super) {
    __extends(UserBagData02, _super);
    function UserBagData02() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_ConfigIds = {};
        return _this;
    }
    UserBagData02.prototype.Clear = function () {
        _super.prototype.Clear.call(this);
        this.m_ConfigIds = {};
    };
    UserBagData02.prototype.Add = function (itemData) {
        _super.prototype.Add.call(this, itemData);
        this.m_ConfigIds[itemData.configID] = itemData.handle;
    };
    UserBagData02.prototype.GetById = function (configId) {
        return this.GetByHandle(this.m_ConfigIds[configId]);
    };
    UserBagData02.prototype.Delete = function (handle) {
        var itemData = _super.prototype.Delete.call(this, handle);
        if (itemData) {
            delete this.m_ConfigIds[itemData.configID];
        }
        return itemData;
    };
    return UserBagData02;
}(UserBagData));
__reflect(UserBagData02.prototype, "UserBagData02");
//# sourceMappingURL=UserBagData.js.map