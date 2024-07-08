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
    readonly from: Station;
    readonly to: Station;
    readonly departure: Date;
    readonly arrival: Date;
}

interface Station {
    code: string,
    cityName: string
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