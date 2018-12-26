/** 
 * 记录通过WarnWin.showCheckBox()函数，提示框的提示状态
*/
class WarnWinDate extends BaseSystem {
	private m_record: { [name: string]: { hint: boolean, callFun: any } } = {};
    
	static ins(): WarnWinDate {
		return super.ins();
	};

	setRecord(name, hint, callFun) {
		for (let key in this.m_record) {
			if (key == name) {
				return
			}
		}
		this.m_record[name] = { hint: hint, callFun: callFun };
	}

	changeHint(name: string, hint: boolean) {
		for (let key in this.m_record) {
			if (key == name)
				this.m_record[key].hint = hint;
		}
	}

	checkerHintByName(name) {
		for (let key in this.m_record) {
			if (key == name) {
				if (!this.m_record[key].hint)//如果关闭提示，就直接执行回调
				{
					let tempCb1 = this.m_record[key].callFun
					if (tempCb1 && tempCb1.func != null)
						tempCb1.func.call(tempCb1.thisObj);
				}
				return this.m_record[key].hint;
			}
		}
		return true;
	}
}