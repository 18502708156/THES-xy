var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoTypeSerialize = (function () {
        function SprotoTypeSerialize() {
            this.m_HeaderCap = Sproto.SprotoTypeSize.SIZEOF_HEADER;
            this.m_Lasttag = -1;
            this.m_Index = 0;
            this.m_DataView = new DataView(new ArrayBuffer(8));
        }
        SprotoTypeSerialize.prototype._SetHeaderFn = function (fn) {
            this.m_Data.Set(this.m_HeaderIdx - 2, fn & 0xff);
            this.m_Data.Set(this.m_HeaderIdx - 1, (fn >> 8) & 0xff);
        };
        SprotoTypeSerialize.prototype._WriteHeaderRecord = function (record) {
            this.m_Data.Set(this.m_HeaderIdx + this.m_HeaderCap - 2, record & 0xff);
            this.m_Data.Set(this.m_HeaderIdx + this.m_HeaderCap - 1, (record >> 8) & 0xff);
            this.m_HeaderCap += 2;
            this.m_Index++;
        };
        SprotoTypeSerialize.prototype._WriteUint32ToUint64Sign = function (is_negative) {
            var v = is_negative ? 0xff : 0;
            this.m_Data.WriteByte(v);
            this.m_Data.WriteByte(v);
            this.m_Data.WriteByte(v);
            this.m_Data.WriteByte(v);
        };
        SprotoTypeSerialize.prototype._WriteTag = function (tag, value) {
            var stag = tag - this.m_Lasttag - 1;
            if (stag > 0) {
                stag = (stag - 1) * 2 + 1;
                if (stag > 0xffff)
                    Sproto.SprotoTypeSize.error("tag is too big.");
                this._WriteHeaderRecord(stag);
            }
            this._WriteHeaderRecord(value);
            this.m_Lasttag = tag;
        };
        SprotoTypeSerialize.prototype._WriteInt32 = function (v) {
            this.m_DataView.setInt32(0, v);
            this.m_Data.WriteByte(this.m_DataView.getUint8(3));
            this.m_Data.WriteByte(this.m_DataView.getUint8(2));
            this.m_Data.WriteByte(this.m_DataView.getUint8(1));
            this.m_Data.WriteByte(this.m_DataView.getUint8(0));
        };
        SprotoTypeSerialize.prototype._WriteUint64 = function (v) {
            this.m_Data.WriteByte(v & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 8)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 16)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 24)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 32)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 40)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 48)) & 0xff);
            this.m_Data.WriteByte((v / Math.pow(2, 56)) & 0xff);
        };
        SprotoTypeSerialize.prototype._FillSize = function (sz) {
            if (sz < 0)
                Sproto.SprotoTypeSize.error("fill invaild size.");
            this._WriteInt32(sz);
        };
        SprotoTypeSerialize.prototype._EncodeInteger = function (v) {
            this._FillSize(4);
            this._WriteInt32(v);
            return Sproto.SprotoTypeSize.SIZEOF_LENGTH + 4;
        };
        SprotoTypeSerialize.prototype._EncodeUint64 = function (v) {
            this._FillSize(SprotoTypeSerialize.sizeof_uint64);
            this._WriteUint64(v);
            return Sproto.SprotoTypeSize.SIZEOF_LENGTH + SprotoTypeSerialize.sizeof_uint64;
        };
        SprotoTypeSerialize.prototype._EncodeString = function (str) {
            var sArray = BitUtil.encodeUTF8(str);
            this._FillSize(sArray.length);
            this.m_Data.Write(sArray, 0, sArray.length);
            return Sproto.SprotoTypeSize.SIZEOF_LENGTH + sArray.length;
        };
        SprotoTypeSerialize.prototype._EncodeStruct = function (clsName, obj) {
            var szPos = this.m_Data.Position;
            this.m_Data.Seek(Sproto.SprotoTypeSize.SIZEOF_LENGTH, Sproto.SeekOrigin.Current);
            var len = Sproto.ALL_DICT[clsName].en(obj, this.m_Data);
            var curPos = this.m_Data.Position;
            this.m_Data.Seek(szPos, Sproto.SeekOrigin.Begin);
            this._FillSize(len);
            this.m_Data.Seek(curPos, Sproto.SeekOrigin.Begin);
            return Sproto.SprotoTypeSize.SIZEOF_LENGTH + len;
        };
        SprotoTypeSerialize.prototype._Clear = function () {
            this.m_Index = 0;
            this.m_HeaderIdx = 2;
            this.m_Lasttag = -1;
            this.m_Data = null;
            this.m_HeaderCap = Sproto.SprotoTypeSize.SIZEOF_HEADER;
        };
        SprotoTypeSerialize.prototype.wi = function (integer, tag) {
            this.m_DataView.setInt32(0, integer);
            var sz = this.m_DataView.getInt32(0) == integer ? SprotoTypeSerialize.sizeof_uint32 : SprotoTypeSerialize.sizeof_uint64;
            // let vh = integer >> 31;
            // let vh = this.m_DataView.getInt32(0);
            // let sz = (vh == 0 || vh == -1) ? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);
            var value = 0;
            if (sz == SprotoTypeSerialize.sizeof_uint32) {
                var v = integer;
                if (v == 0 || v == 1) {
                    value = ((v + 1) * 2);
                    sz = 2;
                }
                else {
                    sz = this._EncodeInteger(v);
                }
                // if (v < 0x7fff) {
                // 	value = ((v + 1) * 2);
                // 	sz = 2;
                // } else {
                // sz = this._EncodeInteger(v);
                // }
            }
            else if (sz == SprotoTypeSerialize.sizeof_uint64) {
                var v = integer;
                sz = this._EncodeUint64(v);
            }
            else {
                Sproto.SprotoTypeSize.error("invaild integer size.");
            }
            this._WriteTag(tag, value);
        };
        SprotoTypeSerialize.prototype.wia = function (integer_list, tag) {
            if (integer_list == null || integer_list.length <= 0)
                return;
            var sz_pos = this.m_Data.Position;
            this.m_Data.Seek(sz_pos + Sproto.SprotoTypeSize.SIZEOF_LENGTH, Sproto.SeekOrigin.Begin);
            var begin_pos = this.m_Data.Position;
            var intlen = SprotoTypeSerialize.sizeof_uint32;
            this.m_Data.Seek(begin_pos + 1, Sproto.SeekOrigin.Begin);
            for (var index = 0; index < integer_list.length; index++) {
                var v = integer_list[index];
                // let vh = v >> 31;
                var integer = v;
                this.m_DataView.setInt32(0, integer);
                var sz = this.m_DataView.getInt32(0) == integer ? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);
                // let sz = (vh == 0 || vh == -1) ? (SprotoTypeSerialize.sizeof_uint32) : (SprotoTypeSerialize.sizeof_uint64);
                if (sz == SprotoTypeSerialize.sizeof_uint32) {
                    this._WriteInt32(v);
                    if (intlen == SprotoTypeSerialize.sizeof_uint64) {
                        var is_negative = ((v & 0x80000000) == 0) ? (false) : (true);
                        this._WriteUint32ToUint64Sign(is_negative);
                    }
                }
                else if (sz == SprotoTypeSerialize.sizeof_uint64) {
                    if (intlen == SprotoTypeSerialize.sizeof_uint32) {
                        this.m_Data.Seek(begin_pos + 1, Sproto.SeekOrigin.Begin);
                        for (var i = 0; i < index; i++) {
                            var value = (integer_list[i]);
                            this._WriteUint64(value);
                        }
                        intlen = SprotoTypeSerialize.sizeof_uint64;
                    }
                    this._WriteUint64(v);
                }
                else {
                    Sproto.SprotoTypeSize.error("invalid integer size(" + sz + ")");
                }
            }
            var cur_pos = this.m_Data.Position;
            this.m_Data.Seek(begin_pos, Sproto.SeekOrigin.Begin);
            this.m_Data.WriteByte(intlen);
            var size = (cur_pos - begin_pos);
            this.m_Data.Seek(sz_pos, Sproto.SeekOrigin.Begin);
            this._FillSize(size);
            this.m_Data.Seek(cur_pos, Sproto.SeekOrigin.Begin);
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.wb = function (b, tag) {
            var v = (b) ? (1) : (0);
            this.wi(v, tag);
        };
        SprotoTypeSerialize.prototype.wba = function (b_list, tag) {
            if (b_list == null || b_list.length <= 0)
                return;
            this._FillSize(b_list.length);
            for (var i = 0; i < b_list.length; i++) {
                var v = ((b_list[i]) ? (1) : (0));
                this.m_Data.WriteByte(v);
            }
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.ws = function (str, tag) {
            this._EncodeString(str);
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.wsa = function (str_list, tag) {
            if (str_list == null || str_list.length <= 0)
                return;
            var sz = 0;
            for (var v in str_list) {
                sz += Sproto.SprotoTypeSize.SIZEOF_LENGTH + BitUtil.UTF8ByteCount(v);
            }
            this._FillSize(sz);
            for (var v in str_list) {
                this._EncodeString(v);
            }
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.wo = function (clsName, obj, tag) {
            this._EncodeStruct(clsName, obj);
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.WriteSet = function (func, tag) {
            var sz_pos = this.m_Data.Position;
            this.m_Data.Seek(Sproto.SprotoTypeSize.SIZEOF_LENGTH, Sproto.SeekOrigin.Current);
            func();
            var cur_pos = this.m_Data.Position;
            var sz = (cur_pos - sz_pos - Sproto.SprotoTypeSize.SIZEOF_LENGTH);
            this.m_Data.Seek(sz_pos, Sproto.SeekOrigin.Begin);
            this._FillSize(sz);
            this.m_Data.Seek(cur_pos, Sproto.SeekOrigin.Begin);
            this._WriteTag(tag, 0);
        };
        SprotoTypeSerialize.prototype.woa = function (clsName, obj_list, tag) {
            var _this = this;
            if (obj_list == null || obj_list.length <= 0)
                return;
            var func = function () {
                for (var _i = 0, obj_list_1 = obj_list; _i < obj_list_1.length; _i++) {
                    var v = obj_list_1[_i];
                    _this._EncodeStruct(clsName, v);
                }
            };
            this.WriteSet(func, tag);
        };
        SprotoTypeSerialize.prototype.wod = function (clsName, map, tag) {
            var _this = this;
            if (map == null || map.length <= 0)
                return;
            var func = function () {
                for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
                    var pair = map_1[_i];
                    _this._EncodeStruct(clsName, map[pair]);
                }
            };
            this.WriteSet(func, tag);
        };
        SprotoTypeSerialize.prototype.Open = function (stream, max_field_count) {
            this._Clear();
            this.m_HeaderSz = Sproto.SprotoTypeSize.SIZEOF_HEADER + max_field_count * Sproto.SprotoTypeSize.SIZEOF_FIELD;
            this.m_Data = stream;
            this.m_HeaderIdx = stream.Position + this.m_HeaderCap;
            this.m_DataIdx = this.m_Data.Seek(this.m_HeaderSz, Sproto.SeekOrigin.Current);
        };
        SprotoTypeSerialize.prototype.Close = function () {
            this._SetHeaderFn(this.m_Index);
            var up_count = this.m_HeaderSz - this.m_HeaderCap;
            this.m_Data.MoveUp(this.m_DataIdx, up_count);
            var count = this.m_Data.Position - this.m_HeaderIdx + Sproto.SprotoTypeSize.SIZEOF_HEADER;
            this._Clear();
            return count;
        };
        SprotoTypeSerialize.sizeof_uint64 = 8;
        SprotoTypeSerialize.sizeof_uint32 = 4;
        return SprotoTypeSerialize;
    }());
    Sproto.SprotoTypeSerialize = SprotoTypeSerialize;
    __reflect(SprotoTypeSerialize.prototype, "Sproto.SprotoTypeSerialize");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoTypeSerialize.js.map