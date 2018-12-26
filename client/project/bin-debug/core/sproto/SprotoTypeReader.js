var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Sproto;
(function (Sproto) {
    var SprotoTypeReader = (function () {
        function SprotoTypeReader() {
        }
        Object.defineProperty(SprotoTypeReader.prototype, "Buffer", {
            get: function () {
                return this.buffer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SprotoTypeReader.prototype, "Position", {
            get: function () {
                return this.pos - this.begin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SprotoTypeReader.prototype, "Offset", {
            get: function () {
                return this.pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SprotoTypeReader.prototype, "Length", {
            get: function () {
                return this.size - this.begin;
            },
            enumerable: true,
            configurable: true
        });
        SprotoTypeReader.prototype.Init = function (buffer, offset, size) {
            this.begin = offset;
            this.pos = offset;
            this.buffer = buffer;
            this.size = offset + size;
            this.check();
        };
        SprotoTypeReader.prototype.check = function () {
            if (this.pos > this.size || this.begin > this.pos) {
                Sproto.SprotoTypeSize.error("invalid pos.");
            }
        };
        SprotoTypeReader.prototype.ReadByte = function () {
            this.check();
            return this.buffer[this.pos++];
        };
        SprotoTypeReader.prototype.Seek = function (offset) {
            this.pos = this.begin + offset;
            this.check();
        };
        SprotoTypeReader.prototype.Read = function (data, offset, size) {
            var cur_pos = this.pos;
            this.pos += size;
            this.check();
            for (var i = cur_pos; i < this.pos; i++) {
                data[offset + i - cur_pos] = this.buffer[i];
            }
        };
        SprotoTypeReader.prototype.Clear = function () {
            this.pos = this.begin = 0;
            this.buffer = null;
        };
        return SprotoTypeReader;
    }());
    Sproto.SprotoTypeReader = SprotoTypeReader;
    __reflect(SprotoTypeReader.prototype, "Sproto.SprotoTypeReader");
})(Sproto || (Sproto = {}));
//# sourceMappingURL=SprotoTypeReader.js.map