export class Vuelo {
    constructor(
        public _id: string,
        public numeroVuelo: number,
        public nombreAerolinea: string,
        public origen: string,
        public destino: string,
        public fechaSalida: string,
        public fechaLlegada: string,
        public horaSalida: string,
        public horaLlegada: string,
        public duracionVuelo: string,
        public pasajeros: Pasajero[],
        public costoMaletaAdicional: number,
        public estado: string,
        public disponibilidad: boolean
    ) { }
}

export class Pasajero {
    constructor(
        public identificacion: string,
        public numeroAsiento: number,
        public costo: number
    ) { }
}
