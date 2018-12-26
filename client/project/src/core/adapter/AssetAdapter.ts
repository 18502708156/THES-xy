class AssetAdapter implements eui.IAssetAdapter{
	public constructor() {
	}

	public getAsset (source, compFunc, thisObject) {
        function onGetRes(data) {
            compFunc.call(thisObject, data, source);
        }
        if (RES.hasRes(source)) {
            var data = RES.getRes(source);
            if (data) {
                onGetRes(data);
            } else {
                RES.getResAsync(source, onGetRes, this);
            }
        } else {
            let data = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE).getRes(source)
            if (data) {
                onGetRes(data)
            } else {
                RES.getResByUrl(source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE);
            }
        }
    }
}