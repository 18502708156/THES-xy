var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TaskData = (function () {
    function TaskData() {
    }
    return TaskData;
}());
__reflect(TaskData.prototype, "TaskData");
var TaskState;
(function (TaskState) {
    TaskState[TaskState["NONE"] = 0] = "NONE";
    TaskState[TaskState["FINISH"] = 1] = "FINISH";
    TaskState[TaskState["GET"] = 2] = "GET";
})(TaskState || (TaskState = {}));
//# sourceMappingURL=TaskData.js.map