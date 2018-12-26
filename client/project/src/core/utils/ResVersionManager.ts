class ResVersionManager extends BaseClass {

    private resVersionData: {[key: string]: number}
    private tempDict: {[key: string]: number} = {}

    private __base_ver__: number = 1

	public constructor() {
		super();
        this.resVersionData = window["verData"]
        this.__base_ver__ = this.resVersionData["__base_ver__"] || 1
		this.res_loadByVersion();
	}

	public static ins() {
        return super.ins.call(this);
    }

    private _GetVer(fullName: string): number {
        if (fullName == null || fullName.length == 0 || this.resVersionData == null) {
            return 1
        }
        let code = this.tempDict[fullName]
        if (code == null) {
            let array = fullName.split("/")
            let dict: any = this.resVersionData
            for (let value of array) {
                dict = dict[value]
                if (dict == null) {
                    break
                }
            }
            if (dict == null || typeof(dict) != "number") {
                code = this.__base_ver__
            } else {
                code = dict
            }
            this.tempDict[fullName] = code
        }
        return code
    }

    /**
     * Res加载使用版本号的形式
     */
    public res_loadByVersion  () {
        let verPlat = LocationProperty.VerPlat()
        if (window["__LOCAL_RES__"]) {
            if (window["__LOCAL_RES__"] == 1) {
                let resUrl = WindowData._GetResAddr()
                RES.web.Html5VersionController.prototype.getVirtualUrl = (url) => {
                    return resUrl + url
                }
            }
        } else {
            let resVersionData = this.resVersionData
            let resUrl = WindowData._GetResAddr()
            RES.web.Html5VersionController.prototype.getVirtualUrl = (url) => {
                if (DEBUG) {
                    if (url.lastIndexOf(".exml") != -1) {
                        return url
                    }
                }
                if (url.indexOf("http") == -1) {
                    var version = 1;
                    if (url.indexOf("resource/assets/map/") != -1) {
                        let name = "resource/assets/map/"+url.split("/")[3]+"/small.jpg"
                        version = this._GetVer(name)
                    } else {
                        version = this._GetVer(url)
                    }
                    if (verPlat) {
                        let arr = url.split(".")
                        url = `${resUrl}${version}/${arr[0]}_${verPlat}_${version}.${arr.slice(1).join(".")}`
                    } else {
                        url = resUrl + version + "/" + url
                    }
                }
                return url
            }
        }
    }
}