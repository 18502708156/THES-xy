var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var EventListenerData = (function () {
    function EventListenerData(addObj, type, func, thisObj, useCapture, priority) {
        this.addObject = addObj;
        this.type = type;
        this.listener = func;
        this.thisObject = thisObj;
        this.useCapture = useCapture;
        this.priority = priority;
        if (addObj) {
            addObj.addEventListener(type, func, thisObj, useCapture, priority);
        }
        else {
            console.warn("不存在增加侦听事件的对象");
        }
    }
    EventListenerData.prototype.clean = function () {
        if (this.addObject) {
            if (this.addObject.hasEventListener(this.type)) {
                this.addObject.removeEventListener(this.type, this.listener, this.thisObject, this.useCapture);
                this.addObject = null;
                this.type = null;
                this.listener = null;
                this.useCapture = null;
                this.priority = null;
            }
            else {
                // console.warn("无可删除侦听事件: " + this.type);
                // console.log(this)
            }
        }
        else {
            // console.warn("不存在增加侦听事件的对象")
        }
    };
    return EventListenerData;
}());
__reflect(EventListenerData.prototype, "EventListenerData");
//# sourceMappingURL=EventListenerData.js.map