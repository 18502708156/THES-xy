namespace Sproto {
    // {max: number, en: Function, de: Function}
    export var ALL_DICT = {}

    export class SprotoCore {

        private static m_ParserPack: Sproto.SprotoPack;
        private static m_Pkg: Sproto.Spackage;

        public static mSerialize: SprotoTypeSerialize[] = []
        public static mDeserialize: SprotoTypeDeserialize[] = []

        public static GetSerialize(st: SprotoStream, max: number): SprotoTypeSerialize {
            let ser = SprotoCore.mSerialize.pop()
            if (ser == null) {
                ser = new SprotoTypeSerialize
            }
            ser.Open(st, max)
            return ser
        }

        public static CloseSerialize(ser: SprotoTypeSerialize) {
            let n = ser.Close()
            SprotoCore.mSerialize.push(ser)
            return n
        }

        public static GetDeserialize(byteArray: Uint8Array, offset: number, size: number): SprotoTypeDeserialize {
            let ser = SprotoCore.mDeserialize.pop()
            if (ser == null) {
                ser = new SprotoTypeDeserialize
            }
            ser.Init(byteArray, offset, size)
            return ser
        }

        public static CloseDeserialize(ser: SprotoTypeDeserialize): void {
            ser.Clear()
            SprotoCore.mDeserialize.push(ser)
        }

        public static Init(): void {
            SprotoCore.m_ParserPack = new Sproto.SprotoPack();
            SprotoCore.m_Pkg = new Sproto.Spackage();
        }

        public static Dispatch(byteArray: Uint8Array): egret.ByteArray {
            let pack2 = SprotoCore.m_ParserPack;
            let data = pack2.Unpack(byteArray);

            let sp = SprotoCore.GetDeserialize(data, 0, data.length)

            let packet = SprotoCore.m_Pkg;
            packet.type = undefined
            packet.session = undefined
            _decode_Spackage(sp, packet)
            let offset = sp.Size()

            if (packet.type) {
                let rpcRsp = Sproto.SprotoReceiver.HandlerType(packet.type, packet.session, data, offset);
                if (rpcRsp != null) {
                    return Sproto.SprotoSender.SendData(rpcRsp, packet.session, packet.type);
                }
            } else {
                Sproto.SprotoSender.HandlerSession(packet.session, data, offset);
            }
            SprotoCore.CloseDeserialize(sp)
            return null;
        }
    }
}