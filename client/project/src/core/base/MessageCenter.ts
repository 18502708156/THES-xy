class MessageCenter extends BaseClass {

	flag: number = 0;
	type: number = 0;
	private dict: {[key: string]: any[]} = {};
	eVec: MessageVo[] = [];
	lastRunTime: number = 0;

	private m_TempDict: {[key: string]: boolean} = {}

	/**
	 * 构造函数
	 * @param type 0:使用分帧处理 1:及时执行
	 */
	public constructor(type) {
		super();
		this.type = type;
		if (this.type == 0) {
			TimerManager.ins().doFrame(1, 0, this.run, this);
		}
	}

	public static ins(): MessageCenter {
        return super.ins(0)
	}

    /**
     * 清空处理
     */
	public clear() {
		this.dict = {};
		this.eVec.splice(0);
	};
    /**
     * 添加消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     *
     */
	public addListener(type: string, listener: Function, listenerObj: any) {
		var arr = this.dict[type];
		if (!arr) {
			this.dict[type] = arr = [];
		} else if (this.flag != 0) {
			this.dict[type] = arr = arr.concat();
		}
		//检测是否已经存在
		for (let item of arr) {
			if (item[0] == listener && item[1] == listenerObj) {
				return;
			}
		}
		arr.push([listener, listenerObj]);
	};
    /**
     * 移除消息监听
     * @param type 消息唯一标识
     * @param listener 侦听函数
     * @param listenerObj 侦听函数所属对象
     */
	public removeListener(type: string, listener: Function, listenerObj: any) {
		var arr = this.dict[type];
		if (!arr) {
			return;
		}
		if (this.flag != 0) {
			this.dict[type] = arr = arr.concat();
		}
		var len = arr.length;
		for (var i = len - 1; i >= 0; --i) {
			let item = arr[i]
			if (item[0] == listener && item[1] == listenerObj) {
				arr.splice(i, 1);
				break;
			}
		}
		if (arr.length == 0) {
			this.dict[type] = null;
			delete this.dict[type];
		}
	};
    /**
     * 移除某一对象的所有监听
     * @param listenerObj 侦听函数所属对象
     */
	public removeAll(listenerObj) {
		var keys = Object.keys(this.dict);
		for (var type of keys) {
			var arr = this.dict[type];
			if (this.flag != 0) {
				this.dict[type] = arr = arr.concat();
			}
			for (var j = 0; j < arr.length; j++) {
				if (arr[j][1] == listenerObj) {
					arr.splice(j, 1);
					j--;
				}
			}
			if (arr.length == 0) {
				this.dict[type] = null;
				delete this.dict[type];
			}
		}
	};
    /**
     * 触发消息
     * @param type 消息唯一标识
     * @param param 消息参数
     *
     */
	public dispatch(type: string, ...param: any[]): void {
		if (param == null || param.length == 0) {
			if (this.m_TempDict[type]) {
				return
			}
			this.m_TempDict[type] = true
		}
		var vo: MessageVo = ObjectPool.pop("MessageVo");
		vo.type = type;
		vo.param = param;
		if (this.type == 0) {
			this.eVec.push(vo);
		} else if (this.type == 1) {
			this.dealMsg(vo);
		} else {
			console.log("MessageCenter未实现的类型");
		}
	};

	public dispatchImmediate(type: string, ...param: any[]): void {
		var vo: MessageVo = ObjectPool.pop("MessageVo");
		vo.type = type;
		vo.param = param;
		this.dealMsg(vo);
	};
	
    /**
     * 运行
     *
     */
	public run() {
		var currTime = egret.getTimer();
		var inSleep = currTime - this.lastRunTime > 100;
		this.lastRunTime = currTime;
		if (inSleep) {
			while (this.eVec.length > 0) {
				this.dealMsg(this.eVec.shift());
			}
		}
		else {
			while (this.eVec.length > 0) {
				this.dealMsg(this.eVec.shift());
				if ((egret.getTimer() - currTime) > 5) {
					break;
				}
			}
		}
	};
    /**
     * 处理一条消息
     */
	private dealMsg(msgVo: MessageVo) {
		if (this.m_TempDict[msgVo.type]) {
			delete this.m_TempDict[msgVo.type]
		}
		var listeners = this.dict[msgVo.type];
		if (!listeners) {
			return;
		}
		var len = listeners.length;
		if (len == 0)
			return;
		this.flag++;
		for (var listener of listeners) {
			listener[0].apply(listener[1], msgVo.param);
		}
		this.flag--;
		msgVo.dispose();
		ObjectPool.push(msgVo);
	};
}

class MessageVo {
	type: string = null;
	param = null;
	dispose() {
		this.type = null;
		this.param = null;
	}
}