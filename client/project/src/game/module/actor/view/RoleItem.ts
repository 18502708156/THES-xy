class RoleItem extends eui.ItemRenderer {
	public constructor() {
		super();
	}
    /////////////////////////////////////////////////////////////////////////////
    // RoleItemSkin.exml
    /////////////////////////////////////////////////////////////////////////////
    protected itemBase: ItemBase;
    protected bless: eui.Image;
    protected redPoint: eui.Image;
    protected upImage: eui.Image;
    /////////////////////////////////////////////////////////////////////////////

	_model

	_lastData
	_lastModel

	private mQuality = -1

	childrenCreated() {
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.openEquipsTips, this);
	};

	public setItemImg(data) {
		this.itemBase.setItemImg(data)
	}

	public setItemBg(data) {
		this.itemBase.setItemBg(data)
	}

	public IsShowRedPoint(data) {
		this.itemBase.IsShowRedPoint(data)
	}

	public IsShowUp(bool: boolean) {
		this.upImage.visible = bool
	}

	get nameTxt() {
		if (this.itemBase) {
			return this.itemBase.nameTxt
		}
		return null
	}

	set nameTxt(v) {
		if (this.itemBase) {
			this.itemBase.nameTxt = v
		}
	}

	get count() {
		if (this.itemBase) {
			return this.itemBase.getCount()
		}
		return null
	}

	set count(v) {
		if (this.itemBase) {
			this.itemBase.setCount(v)
		}
	}

	dataChanged() {
		this.itemBase.data = this.data
		this.playEff();
		super.dataChanged();
		var itemConfig = this.data.itemConfig;
		if (itemConfig) {
			var equipsDatas = this.model.equipsData;
			var equipsData = void 0;
			for (var i = 0; i < equipsDatas.length; i++) {
				if (this.data.handle == equipsDatas[i].item.handle) {
					equipsData = equipsDatas[i];
					break;
				}
			}
		}
		this._lastData = this.data;
		this._lastModel = this._model;
	};
	clear() {
		this.itemBase.clear();
		this.playEff();
	};
	openEquipsTips() {
		if (this.itemBase.itemConfig == null) {
			return
		}
		ViewManager.ins().open(EquipUserDetailedWin, this.data.handle, this.itemBase.itemConfig.id, this.data, this._model);
	};
	get model() {
		return this._model;
	}
	set model(value) {
		this._model = value;
	}

	playEff() {
		if (this._lastData) {
			if (this._lastData != this.data && this.model == this._lastModel) {
				UIHelper.PlayUpEff(this)
			}
		}
	}
}