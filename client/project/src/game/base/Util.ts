class Util {
	public static GetClass(obj: any): any {
		if (!obj) {
			return null
		}
        let clsName = obj.__class__
		if (!clsName) {
			return null
		}
		return egret.getDefinitionByName(clsName)
	}

	public static CopyProtoData(obj: Sproto.SprotoTypeBase) {
		if (obj == null) {
			return null
		}
		let newObj = {}
		var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
			if (key == "se" || key == "de") {
				continue
			}
            newObj[key] = obj[key]
        }
	}

	public static GetParentByType(obj: egret.DisplayObject, cls: any): egret.DisplayObject {
		if (obj == null) {
			return null
		}
		let parentName = egret.getQualifiedClassName(cls);
		let parent = obj
		if (egret.is(parent, parentName)) {
			return parent
		}
		for (let i = 0; i < 10; ++i) {
			parent = parent.parent
			if (parent == null) {
				return null
			}
			if (egret.is(parent, parentName)) {
				return parent
			}
		}
		return null
	}




	public static Copy(text: string): boolean {
		try {
			var t = document.createElement("input");
			t.value = text
			document.body.appendChild(t)
			t.select()
			t.setSelectionRange(0, t.value.length)
			document.execCommand("Copy")
			document.body.removeChild(t)
			return true
		} catch(e) {
			console.error("Copy => " + e)
		}
		return false
	}
}