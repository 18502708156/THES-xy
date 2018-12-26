var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoTypeDeserialize = (function () {
        function SprotoTypeDeserialize() {
            this.tag = -1;
            this.reader = new Sproto.SprotoTypeReader;
        }
        SprotoTypeDeserialize.prototype.Init = function (byteArray, offset, size) {
            this.Clear();
            this.reader.Init(byteArray, offset, size);
            this._DoInit();
        };
        SprotoTypeDeserialize.prototype._DoInit = function () {
            this.fn = this._ReadWord();
            var header_length = Sproto.SprotoTypeSize.SIZEOF_HEADER + this.fn * Sproto.SprotoTypeSize.SIZEOF_FIELD;
            this.begin_data_pos = header_length;
            this.cur_field_pos = this.reader.Position;
            if (this.reader.Length < header_length) {
                Sproto.SprotoTypeSize.error("invalid decode header.");
            }
            this.reader.Seek(this.begin_data_pos);
        };
        SprotoTypeDeserialize.prototype._Expand64 = function (v) {
            var value = v;
            if ((value & 0x80000000) != 0) {
                value |= (0xffffffff00000000);
            }
            return value;
        };
        SprotoTypeDeserialize.prototype._ReadWord = function () {
            var v1 = this.reader.ReadByte();
            var v2 = this.reader.ReadByte();
            return Math.pow(2, 8) * v2 + v1;
        };
        SprotoTypeDeserialize.prototype._ReadDword = function () {
            var v1 = this.reader.ReadByte();
            var v2 = this.reader.ReadByte();
            var v3 = this.reader.ReadByte();
            var v4 = this.reader.ReadByte();
            return v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1;
        };
        SprotoTypeDeserialize.prototype._ReadDouble = function () {
            var v1 = this.reader.ReadByte();
            var v2 = this.reader.ReadByte();
            var v3 = this.reader.ReadByte();
            var v4 = this.reader.ReadByte();
            var v5 = this.reader.ReadByte();
            var v6 = this.reader.ReadByte();
            var v7 = this.reader.ReadByte();
            var v8 = this.reader.ReadByte();
            return v8 * Math.pow(2, 56) + v7 * Math.pow(2, 48) + v6 * Math.pow(2, 40) + v5 * Math.pow(2, 32) + v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1;
        };
        SprotoTypeDeserialize.prototype._ReadArraySize = function () {
            if (this.value >= 0)
                Sproto.SprotoTypeSize.error("invalid array value.");
            var sz = this._ReadDword();
            if (sz < 0)
                Sproto.SprotoTypeSize.error("error array size(" + sz + ")");
            return sz;
        };
        SprotoTypeDeserialize.prototype.rt = function () {
            var pos = this.reader.Position;
            this.reader.Seek(this.cur_field_pos);
            while (this.reader.Position < this.begin_data_pos) {
                this.tag++;
                var value = this._ReadWord();
                if ((value & 1) == 0) {
                    this.cur_field_pos = this.reader.Position;
                    this.reader.Seek(pos);
                    this.value = Math.floor(value * 0.5) - 1;
                    return this.tag;
                }
                this.tag += Math.floor(value * 0.5);
            }
            this.reader.Seek(pos);
            return -1;
        };
        SprotoTypeDeserialize.prototype.ri = function () {
            if (this.value >= 0) {
                return (this.value);
            }
            else {
                var sz = this._ReadDword();
                if (sz == SprotoTypeDeserialize.sizeof_uint32) {
                    var v = this._Expand64(this._ReadDword());
                    return v;
                }
                else if (sz == SprotoTypeDeserialize.sizeof_uint64) {
                    // var low = this._ReadDword();
                    // var hi = this._ReadDword();
                    // var v = low | hi << 32;
                    // return v;
                    return this._ReadDouble();
                }
                else {
                    Sproto.SprotoTypeSize.error("read invalid integer size (" + sz + ")");
                }
            }
            return 0;
        };
        SprotoTypeDeserialize.prototype.ria = function () {
            var integer_list = null;
            var sz = this._ReadArraySize();
            if (sz == 0) {
                return [];
                // return new List<Int64>();
            }
            var len = this.reader.ReadByte();
            sz--;
            if (len == SprotoTypeDeserialize.sizeof_uint32) {
                if (sz % SprotoTypeDeserialize.sizeof_uint32 != 0) {
                    Sproto.SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint32)");
                }
                integer_list = [];
                for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint32; i++) {
                    var v = this._Expand64(this._ReadDword());
                    integer_list.push(v);
                }
            }
            else if (len == SprotoTypeDeserialize.sizeof_uint64) {
                if (sz % SprotoTypeDeserialize.sizeof_uint64 != 0) {
                    Sproto.SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint64)");
                }
                integer_list = [];
                for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint64; i++) {
                    // var low = this._ReadDword();
                    // var hi = this._ReadDword();
                    // var v = low | hi << 32;
                    var v_1 = this._ReadDouble();
                    integer_list.push(v_1);
                }
            }
            else {
                Sproto.SprotoTypeSize.error("error intlen(" + len + ")");
            }
            return integer_list;
        };
        SprotoTypeDeserialize.prototype.rb = function () {
            if (this.value < 0) {
                Sproto.SprotoTypeSize.error("read invalid boolean.");
                return false;
            }
            else {
                return (this.value == 0) ? (false) : (true);
            }
        };
        SprotoTypeDeserialize.prototype.rba = function () {
            var sz = this._ReadArraySize();
            var boolean_list = [];
            for (var i = 0; i < sz; i++) {
                var v = (this.reader.ReadByte() == 0) ? (false) : (true);
                boolean_list.push(v);
            }
            return boolean_list;
        };
        SprotoTypeDeserialize.prototype.rs = function () {
            var sz = this._ReadDword();
            var buffer = new Uint8Array(sz);
            this.reader.Read(buffer, 0, buffer.length);
            return BitUtil.decodeUTF8(buffer);
        };
        SprotoTypeDeserialize.prototype.rsa = function () {
            var sz = this._ReadArraySize();
            var stringList = [];
            for (var i = 0; sz > 0; i++) {
                if (sz < Sproto.SprotoTypeSize.SIZEOF_LENGTH) {
                    Sproto.SprotoTypeSize.error("error array size.");
                }
                var hsz = this._ReadDword();
                sz -= Sproto.SprotoTypeSize.SIZEOF_LENGTH;
                if (hsz > sz) {
                    Sproto.SprotoTypeSize.error("error array object.");
                }
                // byte[] buffer = new byte[hsz];
                var buffer = new Uint8Array(hsz);
                this.reader.Read(buffer, 0, buffer.length);
                var v = BitUtil.decodeUTF8(buffer);
                stringList.push(v);
                sz -= hsz;
            }
            return stringList;
        };
        SprotoTypeDeserialize.prototype.ro = function (clsName) {
            var sz = this._ReadDword();
            var deserialize = Sproto.SprotoCore.GetDeserialize(this.reader.Buffer, this.reader.Offset, sz);
            this.reader.Seek(this.reader.Position + sz);
            var obj = Sproto.ALL_DICT[clsName].de(deserialize);
            Sproto.SprotoCore.CloseDeserialize(deserialize);
            return obj;
        };
        SprotoTypeDeserialize.prototype._ReadElement = function (clsName, sz) {
            var read_size = 0;
            if (sz < Sproto.SprotoTypeSize.SIZEOF_LENGTH) {
                Sproto.SprotoTypeSize.error("error array size.");
            }
            var hsz = this._ReadDword();
            sz -= Sproto.SprotoTypeSize.SIZEOF_LENGTH;
            read_size += Sproto.SprotoTypeSize.SIZEOF_LENGTH;
            if (hsz > sz) {
                Sproto.SprotoTypeSize.error("error array object.");
            }
            var deserialize = Sproto.SprotoCore.GetDeserialize(this.reader.Buffer, this.reader.Offset, hsz);
            this.reader.Seek(this.reader.Position + hsz);
            var obj = Sproto.ALL_DICT[clsName].de(deserialize);
            Sproto.SprotoCore.CloseDeserialize(deserialize);
            read_size += hsz;
            return [obj, read_size];
        };
        SprotoTypeDeserialize.prototype.roa = function (clsName) {
            var sz = this._ReadArraySize();
            var obj_list = [];
            for (var i = 0; sz > 0; i++) {
                var _a = this._ReadElement(clsName, sz), obj = _a[0], read_size = _a[1];
                obj_list.push(obj);
                sz -= read_size;
            }
            return obj_list;
        };
        SprotoTypeDeserialize.prototype.ReadMap = function (clsName, func) {
            var sz = this._ReadArraySize();
            var map = {};
            for (var i = 0; sz > 0; i++) {
                var _a = this._ReadElement(clsName, sz), v = _a[0], read_size = _a[1];
                var k = func(v);
                map[k] = v;
                sz -= read_size;
            }
            return map;
        };
        SprotoTypeDeserialize.prototype.nod = function () {
            if (this.value < 0) {
                var sz = this._ReadDword();
                this.reader.Seek(sz + this.reader.Position);
            }
        };
        SprotoTypeDeserialize.prototype.Size = function () {
            return this.reader.Position;
        };
        SprotoTypeDeserialize.prototype.Clear = function () {
            this.fn = 0;
            this.tag = -1;
            this.value = 0;
            if (this.reader) {
                this.reader.Clear();
            }
        };
        SprotoTypeDeserialize.sizeof_uint64 = 8;
        SprotoTypeDeserialize.sizeof_uint32 = 4;
        return SprotoTypeDeserialize;
    }());
    Sproto.SprotoTypeDeserialize = SprotoTypeDeserialize;
    __reflect(SprotoTypeDeserialize.prototype, "Sproto.SprotoTypeDeserialize");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoTypeDeserialize.js.map