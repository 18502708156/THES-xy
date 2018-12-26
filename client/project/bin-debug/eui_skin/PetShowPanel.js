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
var PetShowPanel = (function (_super) {
    __extends(PetShowPanel, _super);
    function PetShowPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PetShowPanel;
}(RideShowPanel));
__reflect(PetShowPanel.prototype, "PetShowPanel");
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
//# sourceMappingURL=PetShowPanel.js.map