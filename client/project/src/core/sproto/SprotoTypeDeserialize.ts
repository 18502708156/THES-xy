namespace Sproto {
	export class SprotoTypeDeserialize {

		static readonly sizeof_uint64 = 8;
		static readonly sizeof_uint32 = 4;

		private reader: SprotoTypeReader;
		private begin_data_pos: number;
		private cur_field_pos: number;

		private fn: number;
		private tag: number = -1;
		private value: number;

		constructor() {
			this.reader = new SprotoTypeReader
		}

		public Init(byteArray: Uint8Array, offset: number, size: number): void {
			this.Clear();
			this.reader.Init(byteArray, offset, size)
			this._DoInit()
		}

		private _DoInit(): void {
			this.fn = this._ReadWord();

			var header_length = SprotoTypeSize.SIZEOF_HEADER + this.fn * SprotoTypeSize.SIZEOF_FIELD;
			this.begin_data_pos = header_length;
			this.cur_field_pos = this.reader.Position;

			if (this.reader.Length < header_length) {
				SprotoTypeSize.error("invalid decode header.");
			}

			this.reader.Seek(this.begin_data_pos);
		}

		private _Expand64(v: number): number {
			var value = v;
			if ((value & 0x80000000) != 0) {
				value |= (0xffffffff00000000);
			}
			return value;
		}

		private _ReadWord(): number {
			let v1 = this.reader.ReadByte()
			let v2 = this.reader.ReadByte()
			return Math.pow(2, 8) * v2 + v1
		}

		private _ReadDword(): number {
			let v1 = this.reader.ReadByte()
			let v2 = this.reader.ReadByte()
			let v3 = this.reader.ReadByte()
			let v4 = this.reader.ReadByte()

			return v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1
		}

		private _ReadDouble(): number {
			let v1 = this.reader.ReadByte()
			let v2 = this.reader.ReadByte()
			let v3 = this.reader.ReadByte()
			let v4 = this.reader.ReadByte()
			let v5 = this.reader.ReadByte()
			let v6 = this.reader.ReadByte()
			let v7 = this.reader.ReadByte()
			let v8 = this.reader.ReadByte()
			return v8 * Math.pow(2, 56) + v7 * Math.pow(2, 48) + v6 * Math.pow(2, 40) + v5 * Math.pow(2, 32) + v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1
		}

		private _ReadArraySize(): number {
			if (this.value >= 0)
				SprotoTypeSize.error("invalid array value.");

			var sz = this._ReadDword();
			if (sz < 0)
				SprotoTypeSize.error("error array size(" + sz + ")");

			return sz;
		}

		public rt(): number {
			var pos = this.reader.Position;
			this.reader.Seek(this.cur_field_pos);

			while (this.reader.Position < this.begin_data_pos) {
				this.tag++;
				var value = this._ReadWord();

				if ((value & 1) == 0) {
					this.cur_field_pos = this.reader.Position;
					this.reader.Seek(pos);
					this.value =  Math.floor(value * 0.5) - 1;
					return this.tag;
				}

				this.tag += Math.floor(value * 0.5);
			}

			this.reader.Seek(pos);
			return -1;
		}


		public ri(): number {
			if (this.value >= 0) {
				return (this.value);
			} else {
				var sz = this._ReadDword();
				if (sz == SprotoTypeDeserialize.sizeof_uint32) {
					var v = this._Expand64(this._ReadDword());
					return v;
				} else if (sz == SprotoTypeDeserialize.sizeof_uint64) {
					// var low = this._ReadDword();
					// var hi = this._ReadDword();
					// var v = low | hi << 32;
					// return v;
					return this._ReadDouble();
				} else {
					SprotoTypeSize.error("read invalid integer size (" + sz + ")");
				}
			}

			return 0;
		}

		public ria(): number[] {
			var integer_list: number[] = null;

			var sz = this._ReadArraySize();
			if (sz == 0) {
				return [];
				// return new List<Int64>();
			}

			var len = this.reader.ReadByte();
			sz--;

			if (len == SprotoTypeDeserialize.sizeof_uint32) {
				if (sz % SprotoTypeDeserialize.sizeof_uint32 != 0) {
					SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint32)");
				}

				integer_list = [];
				for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint32; i++) {
					var v = this._Expand64(this._ReadDword());
					integer_list.push(v);
				}

			} else if (len == SprotoTypeDeserialize.sizeof_uint64) {
				if (sz % SprotoTypeDeserialize.sizeof_uint64 != 0) {
					SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint64)");
				}

				integer_list = [];
				for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint64; i++) {
					// var low = this._ReadDword();
					// var hi = this._ReadDword();
					// var v = low | hi << 32;
					let v = this._ReadDouble();
					integer_list.push(v);
				}

			} else {
				SprotoTypeSize.error("error intlen(" + len + ")");
			}

			return integer_list;
		}


		public rb(): boolean {
			if (this.value < 0) {
				SprotoTypeSize.error("read invalid boolean.");
				return false;
			} else {
				return (this.value == 0) ? (false) : (true);
			}
		}

		public rba(): boolean[] {
			var sz = this._ReadArraySize();

			var boolean_list = [];
			for (var i = 0; i < sz; i++) {
				var v = (this.reader.ReadByte() == 0) ? (false) : (true);
				boolean_list.push(v);
			}

			return boolean_list;
		}


		public rs(): string {
			var sz = this._ReadDword();
			var buffer = new Uint8Array(sz);
			this.reader.Read(buffer, 0, buffer.length);
			return BitUtil.decodeUTF8(buffer);
		}

		public rsa(): string[] {
			var sz = this._ReadArraySize();

			var stringList = []
			for (var i = 0; sz > 0; i++) {
				if (sz < SprotoTypeSize.SIZEOF_LENGTH) {
					SprotoTypeSize.error("error array size.");
				}

				var hsz = this._ReadDword();
				sz -= SprotoTypeSize.SIZEOF_LENGTH;

				if (hsz > sz) {
					SprotoTypeSize.error("error array object.");
				}

				// byte[] buffer = new byte[hsz];
				var buffer: Uint8Array = new Uint8Array(hsz);
				this.reader.Read(buffer, 0, buffer.length);
				var v: string = BitUtil.decodeUTF8(buffer);

				stringList.push(v);
				sz -= hsz;
			}

			return stringList;
		}


		public ro(clsName: string): any {
			var sz = this._ReadDword();
			let deserialize = SprotoCore.GetDeserialize(this.reader.Buffer, this.reader.Offset, sz);
			this.reader.Seek(this.reader.Position + sz);
			let obj = ALL_DICT[clsName].de(deserialize)
			SprotoCore.CloseDeserialize(deserialize)
			return obj;
		}

		private _ReadElement(clsName: string, sz: number) {
			let read_size = 0;
			if (sz < SprotoTypeSize.SIZEOF_LENGTH) {
				SprotoTypeSize.error("error array size.");
			}

			let hsz = this._ReadDword();
			sz -= SprotoTypeSize.SIZEOF_LENGTH;
			read_size += SprotoTypeSize.SIZEOF_LENGTH;

			if (hsz > sz) {
				SprotoTypeSize.error("error array object.");
			}

			let deserialize = SprotoCore.GetDeserialize(this.reader.Buffer, this.reader.Offset, hsz);
			this.reader.Seek(this.reader.Position + hsz);

			let obj = ALL_DICT[clsName].de(deserialize)
			SprotoCore.CloseDeserialize(deserialize)

			read_size += hsz;
			return [obj, read_size];
		}

		public roa(clsName: string): any[] {
			let sz = this._ReadArraySize();

			let obj_list: any[] = [];
			for (let i = 0; sz > 0; i++) {
				let [obj, read_size] = this._ReadElement(clsName, sz);
				obj_list.push(obj);
				sz -= read_size;
			}

			return obj_list;
		}

		public ReadMap(clsName: string, func: Function): any {
			let sz = this._ReadArraySize();

			let map = {};
			for (let i = 0; sz > 0; i++) {
				let [v, read_size] = this._ReadElement(clsName, sz);
				let k = func(v);
				map[k] = v;
				sz -= read_size;
			}

			return map;
		}


		public nod(): void {
			if (this.value < 0) {
				let sz = this._ReadDword();
				this.reader.Seek(sz + this.reader.Position);
			}
		}

		public Size(): number {
			return this.reader.Position;
		}

		public Clear(): void {
			this.fn = 0;
			this.tag = -1;
			this.value = 0;
			if (this.reader) {
				this.reader.Clear()
			}
		}
	}
}