interface Flight {
    number: string;
    cancelled: boolean;
    carrier: Airline;
    to: Airport;
    from: Airport;
    takeoff: string;
    arrival: string;
    details: string;
}

interface Airport {
    code: string;
    city: string;
}

interface AirportPickerProps {
    airports: Airport[];
    sourceAirport: string;
    setSourceAirport: React.Dispatch<React.SetStateAction<string>>;
    destinationAirport: string;
    setDestinationAirport: React.Dispatch<React.SetStateAction<string>>;
}