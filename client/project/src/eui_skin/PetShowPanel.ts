class PetShowPanel extends RideShowPanel {}
// class PetShowPanel extends eui.Component implements  eui.UIComponent {

// 	private m_Body: string
// 	private bodyMv: MovieObject

// 	public constructor() {
// 		super()
// 	}

// 	public SetBodyId(value: number): void {
// 		this.SetBody(AppearanceConfig.GetUIPath(value))
// 	}

// 	public SetBody(value: string): void {
// 		if (this.m_Body == value) {
// 			return
// 		}
// 		this.m_Body = value
// 		this._Update()
// 	}

// 	private _SetSource(img: MovieObject, newPath: string) {
// 		if (!img) {
// 			return
// 		}
// 		if (StringUtils.IsNullOrEmpty(newPath)) {
// 			img.LoadByUrl(null)
// 		} else {
// 			img.LoadByUrl(newPath, -1, true)
// 		}
// 	}

// 	private _NewMovieObject() {
// 		let obj = new MovieObject
// 		// let scale = 1.5
// 		let scale = 1
// 		obj.scaleX = obj.scaleY = scale
// 		obj.x = (this.width * scale) >> 1
// 		obj.y = (this.height * scale) >> 1
// 		this.addChild(obj)
// 		return obj
// 	}

// 	private _Update() {
// 		if (!this.$stage) {
// 			return
// 		}
// 		this.bodyMv = this._InitMv(this.m_Body, this.bodyMv)
// 		this._SetSource(this.bodyMv, this.m_Body)
// 	}

// 	private _InitMv(resName: string, mvObj: MovieObject): MovieObject {
// 		if (!StringUtils.IsNullOrEmpty(resName)) {
// 			if (!mvObj) {
// 				mvObj = this._NewMovieObject()
// 			}
// 		} else {
// 			if (mvObj) {
// 				mvObj.LoadByUrl(null)
// 			}
// 		}
// 		return mvObj
// 	}

// 	protected partAdded(partName:string,instance:any):void
// 	{
// 		super.partAdded(partName,instance);
// 	}

// 	protected childrenCreated():void
// 	{
// 		super.childrenCreated();
// 		this._Update()
// 	}
// }