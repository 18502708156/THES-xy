namespace Sproto {
	export class Spackage implements SprotoTypeBase {
		public type: number;
		public session: number;

		// public constructor() {
		// 	super(2)
		// }

		// protected Decode(): void {
		// 	let tag = -1;
		// 	while ((tag = this.de.rt()) != -1) {
		// 		switch (tag) {
		// 			case 0: this.type = this.de.ri(); break;
		// 			case 1: this.session = this.de.ri(); break;
		// 			default: this.de.ReadUnknowData(); break;
		// 		}
		// 	}
		// }

		// public EncodeStream(stream: SprotoStream): number {
		// 	this.se.Open(stream);
		// 	if (this.type != undefined) {
		// 		this.se.wi(this.type, 0);
		// 	}
		// 	if (this.session != undefined) {
		// 		this.se.wi(this.session, 1);
		// 	}
		// 	return this.se.Close();
		// }
	}

	export function _decode_Spackage(d: SprotoTypeDeserialize, obj: Spackage): SprotoTypeBase {
		let tag = -1;
		while ((tag = d.rt()) != -1) {
			switch (tag) {
				case 0: obj.type = d.ri(); break;
				case 1: obj.session = d.ri(); break;
				default: d.nod(); break;
			}
		}
		return obj
	}

	export function _encode_Spackage(self: Spackage, n: number, st: SprotoStream) {
		let se = SprotoCore.GetSerialize(st, n)
		if (self.type != undefined) {
			se.wi(self.type, 0);
		}
		if (self.session != undefined) {
			se.wi(self.session, 1);
		}
		return SprotoCore.CloseSerialize(se)
	}

}