import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar, momentLocalizer, View, Views} from "react-big-calendar";
import moment from "moment";
import {useCallback} from "react";
import {DateParam, StringParam, useQueryParam} from "use-query-params";
import {useQuery} from "@tanstack/react-query";
import Spinner from "./Spinner.tsx";

const localizer = momentLocalizer(moment);

function FlightCalender() {
    const [ defaultView, setDefaultView ] = useQueryParam("view", StringParam);
    const [ start, setStart ] = useQueryParam("start", DateParam);
    const [ end, setEnd ] = useQueryParam("end", DateParam);
    const [ sourceAirport, setSourceAirport ] = useQueryParam("from", StringParam);
    const [ destinationAirport, setDestinationAirport ] = useQueryParam("to", StringParam);

    const onView = useCallback((newView: View) => setDefaultView(newView), [setDefaultView]);

    const onRangeChange = useCallback((newRange: Date[] | { start: Date, end: Date }) => {
        if (Array.isArray(newRange)) {
            const newStart = newRange[0];
            const newEnd = newRange.pop();
            setStart(newStart);
            setEnd(newEnd);
        } else {
            setStart(newRange.start);
            setEnd(newRange.end);
        }
    }, [setStart, setEnd]);

    const onNavigate = useCallback((newDate: Date, view: View) => {
        const { newStart, newEnd } = calculateRange(newDate, view);
        setStart(newStart);
        setEnd(newEnd);
        setDefaultView(view);
    }, [setStart, setEnd]);

    const { isPending, error, data } = useQuery({
        queryKey: [defaultView, start, end],
        queryFn: async () => {
            if (!sourceAirport || !destinationAirport) return[];
            return fetch(`${import.meta.env.VITE_API_URL}/flights/batch/?to=${destinationAirport}&from=${sourceAirport}&start=${start}&end=${end}`).then(res =>
                res.json() as Promise<Flight[]>
            )
        }

    });

    return (
        <div className="container">
            <div className="header">
                <h1>Flight Calendar</h1>
            </div>
            <div className="airport-selection">
                <label>
                    From:
                    <select value={sourceAirport ?? undefined} onChange={(e) => {
                        setSourceAirport(e.target.value);
                        window.location.reload();
                    }}>
                        <option value="">Select an airport</option>
                        {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                                {airport.city} ({airport.code})
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    To:
                    <select value={destinationAirport ?? undefined} onChange={(e) => {
                        setDestinationAirport(e.target.value);
                        window.location.reload();
                    }}>
                        <option value="">Select an airport</option>
                        {airports.map((airport) => (
                            <option key={airport.code} value={airport.code}>
                                {airport.city} ({airport.code})
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="calendar-container">
                {isPending && (
                    <div className="spinner-overlay">
                        <Spinner/>
                        <p>Loading Flight Data...</p>
                    </div>
                )}
                {error && (
                    <div className="error-message">
                        <p>An Error Occurred Loading Flight Data... :(</p>
                    </div>
                )}
                <Calendar
                    localizer={localizer}
                    defaultDate={start ?? new Date()}
                    defaultView={verifiedView(defaultView)}
                    startAccessor="start"
                    endAccessor="end"
                    events={formatFlights(data)}
                    onView={onView}
                    onNavigate={onNavigate}
                    onRangeChange={onRangeChange}
                />
            </div>
        </div>
    );
}

const formatFlights = (flights?: Flight[]) => {
    return flights?.map(flight => {
        return {
            ...flight,
            start: new Date(flight.takeoff),
            end: new Date(flight.arrival),
            title: `DL${flight.number} from ${flight.from} ${flight.details} to ${flight.to}`
        }
    })
}

const calculateRange = (date: Date, view: string) => {
    let start, end;
    switch (view) {
        case Views.DAY:
            start = moment(date).startOf('day').toDate();
            end = moment(date).endOf('day').toDate();
            break;
        case Views.WEEK:
            start = moment(date).startOf('week').toDate();
            end = moment(date).endOf('week').toDate();
            break;
        case Views.WORK_WEEK:
            start = moment(date).startOf('isoWeek').toDate();
            end = moment(date).endOf('isoWeek').toDate();
            break;
        case Views.MONTH:
            start = moment(date).startOf('month').toDate();
            end = moment(date).endOf('month').toDate();
            break;
        case Views.AGENDA:
            start = moment(date).startOf('day').toDate();
            end = moment(date).add(1, 'month').endOf('day').toDate();
            break;
        default:
            start = moment(date).startOf('month').toDate();
            end = moment(date).endOf('month').toDate();
    }
    return { newStart: start, newEnd: end };
}

const verifiedView = (view?: string | null) => {
    if (view == Views.AGENDA) return view;
    if (view == Views.DAY) return view;
    if (view == Views.MONTH) return view;
    if (view == Views.WEEK) return view;
    if (view == Views.WORK_WEEK) return view;
    return Views.MONTH;
}

const airports: Airport[] = [
    { code: 'ATL', city: 'Atlanta, GA' },
    { code: 'LAX', city: 'Los Angeles, CA' },
    { code: 'ORD', city: 'Chicago, IL' },
    { code: 'DFW', city: 'Dallas, TX' },
    { code: 'DEN', city: 'Denver, CO' },
    { code: 'IND', city: 'Indianapolis, IN'},
    { code: 'DTW', city: 'Detroit, MI'},
    { code: 'JFK', city: 'New York City, NY'},
    { code: 'LAS', city: 'Las Vegas, NV'},
    { code: 'MCO', city: 'Orlando, FL'},
    { code: 'MIA', city: 'Miami, Fl'},
    { code: 'CLT', city: 'Charlotte, NC'},
    { code: 'SEA', city: 'Seattle, WA'},
    { code: 'PHX', city: 'Phoenix, AZ'},
    { code: 'EWR', city: 'Newark, NJ'},
    { code: 'SFO', city: 'San Francisco, CA'},
    { code: 'IAH', city: 'Houston, TX'},
    { code: 'BOS', city: 'Boston, MA'},
    { code: 'FLL', city: 'Fort Lauderdale, FL'},
    { code: 'MSP', city: 'Minneapolis, MN'},
    { code: 'LGA', city: 'New York City, NY'},
    { code: 'PHL', city: 'Philadelphia, PA'},
    { code: 'SLC', city: 'Salt Lake City, UT'},
    { code: 'DCA', city: 'Washington DC, VA'},
    { code: 'SAN', city: 'San Diego, CA'},
    { code: 'BWI', city: 'Baltimore, MD'},
    { code: 'TPA', city: 'Tampa, FL'},
    { code: 'AUS', city: 'Austin, TX'},
    { code: 'IAD', city: 'Washington DC, VA'},
    { code: 'BNA', city: 'Nashville, TN'},
    { code: 'MDW', city: 'Chicago, IL'},
    { code: 'HNL', city: 'Honolulu, HI'},
    { code: 'DAL', city: 'Dallas, TX'},
    { code: 'PDX', city: 'Portland, OR'},
    { code: 'STL', city: 'St Louis, MO'},
    { code: 'HOU', city: 'Houston, TX'},
    { code: 'SMF', city: 'Sacramento, CA'},
    { code: 'MSY', city: 'New Orleans, LA'},
    { code: 'RDU', city: 'Raleigh, NC'},
    { code: 'MLI', city: 'Moline, IL'}

    // Add more airports as needed
].sort((a, b) => a.city.localeCompare(b.city));

export default FlightCalender;