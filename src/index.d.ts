interface Trip {
    number: string;
    carrier: Carrier;
    legs: Flight[];
    start: Date;
    end: Date;
}

interface Flight {
    readonly number: string;
    readonly status: string;
    readonly carrier: Carrier;
    readonly aircraft: Aircraft;
    readonly origin: Station;
    readonly destination: Station;
    readonly takeoff: Date;
    readonly arrival: Date;
}

interface Station {
    code: string,
    city_name: string
}

interface Aircraft {
    code: string;
    name: string;
}

interface Carrier {
    code: Airline;
    name: string;
}

interface Airport {
    code: string;
    city: string;
}