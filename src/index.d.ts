interface Trip {
    number: string;
    legs: Flight[];
    start: Date;
    end: Date;
}

interface Flight {
    readonly number: string;
    readonly status: string;
    readonly carrier: DeltaCarrier;
    readonly aircraft: DeltaAircraft;
    readonly from: DeltaStation;
    readonly to: DeltaStation;
    readonly departure: Date;
    readonly arrival: Date;
}

interface DeltaStation {
    code: Airport,
    cityName: string
}

interface DeltaAircraft {
    code: string;
    name: string;
}

interface DeltaCarrier {
    code: Airline;
    name: string;
}

interface Airport {
    code: string;
    city: string;
}