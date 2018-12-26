var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SeekOrigin;
    (function (SeekOrigin) {
        SeekOrigin[SeekOrigin["Begin"] = 0] = "Begin";
        SeekOrigin[SeekOrigin["Current"] = 1] = "Current";
        SeekOrigin[SeekOrigin["End"] = 2] = "End";
    })(SeekOrigin = Sproto.SeekOrigin || (Sproto.SeekOrigin = {}));
    var SByteArray = (function () {
        function SByteArray() {
            this.m_Data = new DataView(new ArrayBuffer(0));
        }
        Object.defineProperty(SByteArray.prototype, "Position", {
            get: function () {
                return this.m_Position;
            },
            set: function (value) {
                this.m_Position = value;
                this.write_position = value > this.write_position ? value : this.write_position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SByteArray.prototype, "Buffer", {
            get: function () {
                return this.m_Data.buffer;
            },
            set: function (value) {
                this.m_Data = new DataView(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SByteArray.prototype, "Length", {
            get: function () {
                return this.write_position;
            },
            set: function (value) {
                this.write_position = value;
                var tmp = new Uint8Array(new ArrayBuffer(value));
                var byteLength = this.m_Data.buffer.byteLength;
                if (byteLength > value) {
                    this.m_Position = value;
                }
                var length = Math.min(byteLength, value);
                tmp.set(new Uint8Array(this.m_Data.buffer, 0, length));
                this.Buffer = tmp.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SByteArray.prototype, "mBytesAvailable", {
            get: function () {
                return this.m_Data.byteLength - this.m_Position;
            },
            enumerable: true,
            configurable: true
        });
        SByteArray.prototype.Seek = function (pos, seekOrigin) {
            switch (seekOrigin) {
                case SeekOrigin.Begin:
                    this.Position = pos;
                    break;
                case SeekOrigin.Current:
                    this.Position += pos;
                    break;
                case SeekOrigin.End:
                    this.Position = this.Length + pos;
                    break;
            }
        };
        SByteArray.prototype.WriteByte = function (value) {
            this.ValidateBuffer(1);
            this.m_Data.setInt8(this.Position++, value);
        };
        SByteArray.prototype.ValidateBuffer = function (len, needReplace) {
            if (needReplace === void 0) { needReplace = false; }
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this.m_Position;
            if (this.m_Data.byteLength < len || needReplace) {
                var tmp = new Uint8Array(new ArrayBuffer(len));
                var length_1 = Math.min(this.m_Data.buffer.byteLength, len);
                tmp.set(new Uint8Array(this.m_Data.buffer, 0, length_1));
                this.Buffer = tmp.buffer;
            }
        };
        SByteArray.prototype.WriteBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.ValidateBuffer(writeLength);
                var tmp_data = new DataView(bytes.buffer);
                var length_2 = writeLength;
                var BYTES_OF_UINT32 = 4;
                for (; length_2 > BYTES_OF_UINT32; length_2 -= BYTES_OF_UINT32) {
                    this.m_Data.setUint32(this.m_Position, tmp_data.getUint32(offset));
                    this.Position += BYTES_OF_UINT32;
                    offset += BYTES_OF_UINT32;
                }
                for (; length_2 > 0; length_2--) {
                    this.m_Data.setUint8(this.Position++, tmp_data.getUint8(offset++));
                }
            }
        };
        SByteArray.prototype.ReadBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length == 0) {
                length = this.mBytesAvailable;
            }
            else if (!this.Validate(length)) {
                return null;
            }
            for (var i = 0; i < length; i++) {
                bytes[i + offset] = this.m_Data.getUint8(this.Position++);
            }
        };
        SByteArray.prototype.Validate = function (len) {
            if (this.m_Data.byteLength > 0 && this.m_Position + len <= this.m_Data.byteLength) {
                return true;
            }
            else {
                egret.$error(1025);
            }
        };
        return SByteArray;
    }());
    Sproto.SByteArray = SByteArray;
    __reflect(SByteArray.prototype, "Sproto.SByteArray");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SByteArray.js.map