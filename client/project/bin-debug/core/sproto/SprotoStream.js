var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoStream = (function () {
        function SprotoStream() {
            this.size = 128;
            this.pos = 0;
            this.buffer = new Uint8Array(this.size);
        }
        Object.defineProperty(SprotoStream.prototype, "Position", {
            get: function () {
                return this.pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SprotoStream.prototype, "Buffer", {
            get: function () {
                return this.buffer;
            },
            enumerable: true,
            configurable: true
        });
        SprotoStream.prototype._Expand = function (sz) {
            if (sz === void 0) { sz = 0; }
            if (this.size - this.pos < sz) {
                var bak_sz = this.size;
                while (this.size - this.pos < sz) {
                    this.size = this.size * 2;
                }
                if (this.size >= Sproto.SprotoTypeSize.ENCODE_MAX_SIZE) {
                    Sproto.SprotoTypeSize.error("object is too large (>" + Sproto.SprotoTypeSize.ENCODE_MAX_SIZE + ")");
                }
                var new_buffer = new Uint8Array(this.size);
                for (var i = 0; i < bak_sz; i++) {
                    new_buffer[i] = this.buffer[i];
                }
                this.buffer = new_buffer;
            }
        };
        SprotoStream.prototype.WriteByte = function (v) {
            this._Expand(1);
            this.buffer[this.pos++] = v;
        };
        SprotoStream.prototype.Write = function (data, offset, count) {
            this._Expand(count);
            for (var i = 0; i < count; i++) {
                this.buffer[this.pos++] = data[offset + i];
            }
        };
        SprotoStream.prototype.Seek = function (offset, loc) {
            switch (loc) {
                case Sproto.SeekOrigin.Begin:
                    this.pos = offset;
                    break;
                case Sproto.SeekOrigin.Current:
                    this.pos += offset;
                    break;
                case Sproto.SeekOrigin.End:
                    this.pos = this.size + offset;
                    break;
            }
            this._Expand();
            return this.pos;
        };
        SprotoStream.prototype.Read = function (buffer, offset, count) {
            for (var i = 0; i < count; i++) {
                buffer[offset + i] = this.buffer[this.pos++];
            }
        };
        SprotoStream.prototype.MoveUp = function (position, up_count) {
            if (up_count <= 0)
                return;
            var count = this.pos - position;
            for (var i = 0; i < count; i++) {
                this.buffer[position - up_count + i] = this.buffer[position + i];
            }
            this.pos -= up_count;
        };
        SprotoStream.prototype.Get = function (i) {
            if (i < 0 || i >= this.size) {
                egret.error("invalid idx:" + i + "@get");
            }
            return this.buffer[i];
        };
        SprotoStream.prototype.Set = function (i, value) {
            if (i < 0 || i >= this.size) {
                egret.error("invalid idx:" + i + "@set");
            }
            this.buffer[i] = value;
        };
        return SprotoStream;
    }());
    Sproto.SprotoStream = SprotoStream;
    __reflect(SprotoStream.prototype, "Sproto.SprotoStream");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoStream.js.map