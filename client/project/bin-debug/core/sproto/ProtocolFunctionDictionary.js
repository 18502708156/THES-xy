var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var MetaInfo = (function () {
        function MetaInfo() {
        }
        return MetaInfo;
    }());
    Sproto.MetaInfo = MetaInfo;
    __reflect(MetaInfo.prototype, "Sproto.MetaInfo");
    var ProtocolFunctionDictionary = (function () {
        function ProtocolFunctionDictionary() {
            this.MetaDictionary = {};
        }
        ProtocolFunctionDictionary.prototype._GetMeta = function (tag) {
            var data = this.MetaDictionary[tag];
            if (data == null) {
                data = new MetaInfo();
                data.ProtocolType = tag;
                this.MetaDictionary[tag] = data;
            }
            return data;
        };
        ProtocolFunctionDictionary.prototype.Set = function (tag, request, response) {
            var data = this._GetMeta(tag);
            data.RequestType = request;
            data.ResponseType = response;
        };
        // private _Gen(func: Function, tag: number, buffer: Uint8Array, offset: number = 0): SprotoTypeBase {
        // 	let obj: SprotoTypeBase = func(buffer, offset)
        // 	// obj.InitArray(buffer, offset);
        // 	return obj
        // }
        // public GenResponse(tag: number, buffer: Uint8Array, offset: number = 0): SprotoTypeBase {
        // 	let data = this.MetaDictionary[tag];
        // 	return this._Gen(data.ResponseType, tag, buffer, offset);
        // }
        ProtocolFunctionDictionary.prototype.GenRequest = function (tag, buffer, offset) {
            if (offset === void 0) { offset = 0; }
            var data = this.MetaDictionary[tag];
            if (data.RequestType == null) {
                return null;
            }
            var des = Sproto.SprotoCore.GetDeserialize(buffer, offset, buffer.length);
            var obj = Sproto.ALL_DICT[data.RequestType].de(des);
            Sproto.SprotoCore.CloseDeserialize(des);
            return obj;
            // return this._Gen(ALL_DICT[data.RequestType].de, tag, sp);
        };
        ProtocolFunctionDictionary.prototype.Get = function (tag) {
            return this.MetaDictionary[tag];
        };
        return ProtocolFunctionDictionary;
    }());
    Sproto.ProtocolFunctionDictionary = ProtocolFunctionDictionary;
    __reflect(ProtocolFunctionDictionary.prototype, "Sproto.ProtocolFunctionDictionary");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=ProtocolFunctionDictionary.js.map