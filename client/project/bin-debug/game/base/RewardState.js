var RewardState;
(function (RewardState) {
    RewardState[RewardState["NotReached"] = 0] = "NotReached";
    RewardState[RewardState["CanGet"] = 1] = "CanGet";
    RewardState[RewardState["Gotten"] = 2] = "Gotten";
    RewardState[RewardState["Undo"] = 3] = "Undo";
})(RewardState || (RewardState = {}));
// 另一种状态
var BitRewardState;
(function (BitRewardState) {
    BitRewardState[BitRewardState["NotReached"] = 2] = "NotReached";
    BitRewardState[BitRewardState["CanGet"] = 3] = "CanGet";
    BitRewardState[BitRewardState["Gotten"] = 4] = "Gotten";
})(BitRewardState || (BitRewardState = {}));
//# sourceMappingURL=RewardState.js.map