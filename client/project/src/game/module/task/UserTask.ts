class UserTask extends BaseSystem {
	/**任务类型 key = type 1 主线， 2 ...  value = TaskData[]*/
	taskData: { [key: number]: TaskData[] }
	/**1 主线任务 */
	mainTaskData: TaskData[] = [];

	/**
	* 通过任务id获取任务配置
	* @param id
	*/
	getTaskConfigById(id) {
		let task = GameGlobal.Config.TaskConfig;
		return task[id];
	};

	/**
	* 通过任务id获取任务条件说明
	* @param id
	*/
	getTaskConditionById(id) {
		let task = GameGlobal.Config.TaskConfig;
		return task[id].condition;
	};

	public static ins(): UserTask {
		return super.ins()
	}

	public constructor() {
		super();
		this.regNetMsg(S2cProtocol.sc_task_info, this.doTaskData);
		this.regNetMsg(S2cProtocol.sc_task_update, this.doTaskChangeData);
		// this.regNetMsg(S2cProtocol.sc_task_vitality, this.doVitality);
		// this.regNetMsg(S2cProtocol.sc_task_vitality_award, this.doVitalityAwards);
		// this.regNetMsg(S2cProtocol.sc_task_achieve_data, this.doAchieveData);
		// this.regNetMsg(S2cProtocol.sc_task_join_achieve_data, this.doJoinAchieveData);
		// this.regNetMsg(S2cProtocol.sc_task_achieve_change_data, this.doAchieveChangeData);
	}

    /**
     * 领取任务奖励
     * @param id
     */
	sendGetTask(id) {
		let req = new Sproto.cs_task_reward_request
		req.id = id
		this.Rpc(C2sProtocol.cs_task_reward, req)
	};
    /**
     * 领取活跃度奖励
     * @param id
     */
	// sendGetVitalityAwards(id) {
	// 	let req = new Sproto.cs_task_get_vitality_awards_request
	// 	req.taskID = id
	// 	this.Rpc(C2sProtocol.cs_task_get_vitality_awards, req)
	// };
    /**
     * 领取成就任务
     * @param id
     */
	// sendGetAchieve(id) {
	// 	let req = new Sproto.cs_task_get_achieve_request
	// 	req.taskID = id
	// 	this.Rpc(C2sProtocol.cs_task_get_achieve, req)
	// };

    /**
     * 任务数据同步
     * @param bytes
     */
	doTaskData(bytes: Sproto.sc_task_info_request) {
		this.taskData = {};
		this.mainTaskData = [];
		// this.vitalityAwards = [];
		let type = bytes.type;
		if (1 == type) {
			let len = bytes.tasks.length;	
			let data: TaskData;
			for (let i = 0; i < len; i++) {
				let taskData = bytes.tasks[i];
				data = new TaskData;
				data.id = taskData.id
				data.value = taskData.progress.value;
				data.state = taskData.status;
				this.mainTaskData.push(data);
			}
			GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MAIN_TASK)
		}
		this.taskData[type] = this.mainTaskData;
		// this.vitality = bytes.vitality
		// var awardsCount = bytes.vitalityDats.length
		// for (var i = 0; i < awardsCount; i++) {
		// 	let data = bytes.vitalityDats[i]
		// 	var awardsData = new VitalityData;
		// 	awardsData.id = data.id
		// 	awardsData.state = data.state
		// 	this.vitalityAwards.push(awardsData);
		// }
		this.sortTask();
	};
    /**
     * 更新任务数据
     * @param bytes
     */
	doTaskChangeData(bytes: Sproto.sc_task_update_request) {
		if (1 == bytes.type) {
			var id = bytes.data.id;
			var data = this.getTaskDataById(1, id);
			if (data) {
				data.value = bytes.data.progress.value;
				data.state = bytes.data.status;
				this.sortTask();
				GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_MAIN_TASK)
			}
		}
	};

	/**
	 * 根据任务类型，与任务ID取对应任务数据
	 * @param type
	 * @param id
	 */
	getTaskDataById(type, id) {
		let data: TaskData;
		if (this.taskData[type]) {
			let taskDatas = this.taskData[type];
			let i = 0, len = taskDatas.length;
			for (i; i < len; i++) {
				if (taskDatas[i].id == id) {
					data = taskDatas[i];
					break;
				}
			}
		}
		return data;
	}

	// doVitality(bytes: Sproto.sc_task_vitality_request) {
	// 	this.vitality = bytes.vitality
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY)
	// };
    /**
     * 更新活跃度奖励
     * @param bytes
     */
	// doVitalityAwards(bytes: Sproto.sc_task_vitality_award_request) {
	// 	var id = bytes.id
	// 	var data = this.getVitalityAwardsById(id);
	// 	data.state = bytes.state
	// 	// UserTask.postTaskChangeData();

		// GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_TASK)
	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATE_VITALITY)
	// };
    /**
     * 成就数据同步
     * @param bytes
     */
	// doAchieveData(bytes: Sproto.sc_task_achieve_data_request) {
	// 	this.achiEvement = [];
	// 	var count = bytes.achiEvement.length
	// 	for (var i = 0; i < count; i++) {
	// 		let rspData = bytes.achiEvement[i]
	// 		var data = new AchievementData;
	// 		// data.achievementId = rspData.achievementId
	// 		data.id = rspData.id
	// 		data.state = rspData.state
	// 		data.value = rspData.value
	// 		// if (data.achievementId == 1000) {
	// 			this.taskTrace = data;
	// 			UserTask.postUpdteTaskTrace();
	// 		// }
	// 		// else {
	// 			// this.achiEvement.push(data);
	// 		// }
	// 	}
	// 	this.sortAchiEvement();
	// };
	// static postUpdteTaskTrace() {
	// };
	// doJoinAchieveData(bytes: Sproto.sc_task_join_achieve_data_request) {
	// 	this.changeAchieve(bytes.data);
	// };
	// doAchieveChangeData(bytes: Sproto.sc_task_achieve_change_data_request) {
	// 	this.changeAchieve(bytes.data);
	// };
    /**
     * 更新成就数据
     * @param bytes
     */
	// changeAchieve(bytes: Sproto.achievement_data) {
	// 	if (bytes.id == 0) {
	// 		this.taskTrace = null
	// 		UserTask.postUpdteTaskTrace();
	// 		return
	// 	}
	// 	if (this.taskTrace == null) {
	// 		this.taskTrace = new AchievementData
	// 	}
	// 	// var achievementId = bytes.achievementId
	// 	var data;
	// 	// if (achievementId == 1000)
	// 		data = this.taskTrace;
	// 	// else
	// 		// data = this.getAchieveDataById(achievementId);
	// 	data.id = bytes.id
	// 	data.state = bytes.state
	// 	data.value = bytes.value
	// 	// if (data.achievementId == 1000) {
	// 		UserTask.postUpdteTaskTrace();
	// 	// }
	// 	// else {
	// 	// 	this.sortAchiEvement();
	// 	// 	UserTask.postTaskChangeData();

	// 	// 	GameGlobal.MessageCenter.dispatch(MessageDef.UPDATA_TASK)
	// 	// }
	// };
    /**
     * 通过成就id获取成就数据
     * @param id
     */
	// getAchieveDataById(id) {
	// 	for (var i = 0; i < this.achiEvement.length; i++) {
	// 		if (this.achiEvement[i].achievementId == id)
	// 			return this.achiEvement[i];
	// 	}
	// 	return null;
	// };
    /**
     * 通过任务id获取成就数据
     * @param id
     */
	// getAchieveByTaskId(id) {
	// 	for (var i = 0; i < this.achiEvement.length; i++) {
	// 		if (this.achiEvement[i].id == id)
	// 			return this.achiEvement[i];
	// 	}
	// 	return null;
	// };
    /**
     * 通过奖励id获取奖励数据
     * @param id
     */
	// getVitalityAwardsById(id) {
	// 	for (var i = 0; i < this.vitalityAwards.length; i++) {
	// 		if (this.vitalityAwards[i].id == id)
	// 			return this.vitalityAwards[i];
	// 	}
	// 	return null;
	// };
    /**
     * 通过任务id获取成就配置
     * @param id
     */
	// getAchieveConfById(id) {
	// 	var list = GlobalConfig.ins().AchievementTaskConfig;
	// 	var i;
	// 	for (i in list) {
	// 		var config = list[i];
	// 		if (config.taskId == id)
	// 			return config;
	// 	}
	// 	return null;
	// };

	// getAchievementConfigById(id) {
	// 	return this.getAchieveConfById(id)
	// }

    /**
     * 通过任务id获取奖励配置
     * @param id
     */
	// getAwardsConfigById(id) {
	// 	var list = GlobalConfig.ins().DailyAwardConfig;
	// 	var i;
	// 	for (i in list) {
	// 		var config = list[i];
	// 		if (config.id == id)
	// 			return config;
	// 	}
	// 	return null;
	// };
	// getTaskStast() {
	// 	if (this.task) {
	// 		var i = void 0;
	// 		for (i = 0; i < this.task.length; i++) {
	// 			if (this.task[i].state == 1) {
	// 				UserTask.postUpdataTaskPoint(true);
	// 				return;
	// 			}
	// 		}
	// 		for (i = 0; i < this.vitalityAwards.length; i++) {
	// 			var config = this.getAwardsConfigById(this.vitalityAwards[i].id);
	// 			if (this.vitality >= config.valueLimit && this.vitalityAwards[i].state == 0) {
	// 				UserTask.postUpdataTaskPoint(true);
	// 				return;
	// 			}
	// 		}
	// 		for (i = 0; i < this.achiEvement.length; i++) {
	// 			if (this.achiEvement[i].state == 1) {
	// 				UserTask.postUpdataTaskPoint(true);
	// 				return;
	// 			}
	// 		}
	// 		UserTask.postUpdataTaskPoint(false);
	// 		return;
	// 	}
	// };
	// static postUpdataTaskPoint(bo) {
	// 	return bo;
	// };
	sortTask() {
		if (this.mainTaskData.length > 2) {
			this.mainTaskData.sort(this.sort);
			var state1Task = [];
			for (var i = 0; i < this.mainTaskData.length; i++) {
				if (this.mainTaskData[i].state != 1) {
					state1Task.push(this.mainTaskData[i]);
					this.mainTaskData.splice(i, 1);
					i--;
				}
			}
			if (state1Task.length > 0)
				this.mainTaskData = this.mainTaskData.concat(state1Task);
		}
	};
	sort(a, b) {
		var s1 = a.id;
		var s2 = b.id;
		if (s1 < s2)
			return -1;
		else if (s1 > s2)
			return 1;
		else
			return 0;
	};
	// sortAchiEvement() {
	// 	for (var i = 0; i < this.achiEvement.length; i++) {
	// 		var data = this.achiEvement[i];
	// 		if (data.state == 1) {
	// 			this.achiEvement.splice(i, 1);
	// 			this.achiEvement.unshift(data);
	// 		}
	// 		else if (data.state == 2) {
	// 			this.achiEvement.splice(i, 1);
	// 			this.achiEvement.push(data);
	// 		}
	// 	}
	// };

	static getTopDataReach(e) {
		// var t = GameGlobal.Config.AchieveBottomConfig[e],
		let i = 0;
		// for (var n in t) {
		// 	var r = UserTask.ins().getAchieveDataById(t[n].achievementId);
		// 	r && r.state == MissionState.canGet && i++
		// }
		return i
	}

	static getBottomIndex(e) {
		// var t = GameGlobal.Config.AchieveBottomConfig;
		// for (var i in t)
		// 	for (var n in t[i])
		// 		if (t[i][n].achievementId == e) return t[i][n].index - 1;
		return 0
	}

	static getTopData() {
		var list = []
		// 	config = GameGlobal.Config.AchieveBottomConfig;
		// for (var n in config) {
		// 	var configData = config[n];
		// 	for (var o in configData) {
		// 		var s = GameGlobal.taskModel.getAchieveDataById(configData[o].achievementId);
		// 		s && list.push(s)
		// 	}
		// }
		return list.sort(UserTask.sortTopData), list
	}

	static sortTopData(e, t) {
		return e.state == MissionState.canGet && t.state != MissionState.canGet ? -1 : t.state == MissionState.canGet && e.state != MissionState.canGet ? 1 : e.state == MissionState.havaGet && t.state != MissionState.havaGet ? 1 : t.state == MissionState.havaGet && e.state != MissionState.havaGet ? -1 : e.id > t.id ? 1 : t.id > e.id ? -1 : 0
	}

	// public IsGotReward(index: number): boolean {
	// 	return this.vitalityAwards[index].state == 2;
	// }
	public CheckCanVitalityReward(index: number): boolean {
		// let configData = GameGlobal.Config.DailyAwardConfig[index + 1]
		// return this.vitalityAwards[index].state != 2 && this.vitality >= configData.valueLimit
		return false
	}
	// public CheckAllVitalityReward(): boolean {
	// 	if (!UserTask.ins().vitalityAwards) {
	// 		return false;
	// 	}
	// 	for (let i = 0; i < UserTask.ins().vitalityAwards.length; ++i) {
	// 		if (this.CheckCanVitalityReward(i)) return true
	// 	}
	// 	return false
	// }
}


enum TaskConfigId {
	INDEX = 7,
	MINE = 8,
}