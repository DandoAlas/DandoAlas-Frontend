import { Pasajero } from "./pasajero";

export class Vuelo {
    constructor(
        public _id: string,
        public numeroVuelo: number,
        public nombreAerolinea: string,
        public origen: string,
        public destino: string,
        public fechaSalida: string,
        public horaSalida: string,
        public precio: number,
        public duracionVuelo: string,
        public pasajeros: Pasajero[],
        public costoMaletaAdicional: number,
        public clase: string,
        public numAsientos: number,
        public estado: string,
        public disponibilidad: boolean
    ) { }
}
