import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar, Event, momentLocalizer, View, Views} from "react-big-calendar";
import moment from "moment";
import {useCallback, useState} from "react";
import {DateParam, StringParam, useQueryParam} from "use-query-params";
import {useQuery} from "@tanstack/react-query";
import Spinner from "./Spinner.tsx";
import EventModal from "./EventModal.tsx";

const localizer = momentLocalizer(moment);

export default function FlightCalender() {
    const [ defaultView = "week", setDefaultView ] = useQueryParam("view", StringParam);
    const [ start = getSundayOfCurrentWeek(), setStart ] = useQueryParam("start", DateParam);
    const [ end= getSaturdayOfCurrentWeek(), setEnd ] = useQueryParam("end", DateParam);
    const [ sourceAirport = "DTW", setSourceAirport ] = useQueryParam("from", StringParam);
    const [ destinationAirport = "IND", setDestinationAirport ] = useQueryParam("to", StringParam);

    const [ selectedEvent, setSelectedEvent ] = useState(undefined as Event | undefined);
    const [ modalState, setModalState ] = useState(false);

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
    const onSelectEvent = useCallback((event: Event) => {
        setSelectedEvent(event);
        setModalState(true);
    }, []);
    const onCloseModal = () => {
        setModalState(false);
        setSelectedEvent(undefined);
    };

    const { isPending, error, data } = useQuery({
        queryKey: [defaultView, start, end],
        queryFn: async () => {
            if (!sourceAirport || !destinationAirport) return [];
            if (!start) return [];
            if (!end) return [];
            const a = formatDate(start)
            const b = formatDate(end)
            return fetch(`${import.meta.env.VITE_API_URL}/flights/batch/?origin=${sourceAirport}&destination=${destinationAirport}&start=${a}&end=${b}`)
                .then(res =>
                    res.json() as Promise<Trip[]>
                )
        }

    });

    return (
        <div style={{height: "100dvh"}}>
            <header className="header">
                <span className="header-title">Flight Calendar</span>
            </header>
            <div className="airport-selection-container">
                <div className="airport-selection">
                    <label>
                        From:
                        <select value={sourceAirport ?? undefined} onChange={(e) => {
                            setSourceAirport(e.target.value);
                            if (destinationAirport) window.location.reload();
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
                            if (sourceAirport) window.location.reload();
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
                    events={formatTrips(data, defaultView)}
                    onView={onView}
                    onNavigate={onNavigate}
                    onRangeChange={onRangeChange}
                    onSelectEvent={onSelectEvent}
                    eventPropGetter={(event) => {
                        const trip = event as Trip;
                        const {backgroundColor, border} = carrierToColor(trip.carrier);
                        return {style: {backgroundColor, border, borderStyle: "solid", borderBlockWidth: 1.5}}
                    }}
                />
            </div>
            {modalState && selectedEvent && (
                <EventModal event={selectedEvent as Trip} onClose={onCloseModal}/>
            )}
            <div className="footer">
                <div className="social-links">
                    <a href="https://buymeacoffee.com/khardesty1w" target="_blank" className="buymeacoffee-link">
                        <img src="/buymeacoffee.png" alt="Buy Me a Coffee" className="buymeacoffee-icon"/>
                    </a>
                    <a href="https://github.com/TechnoWizzy/flightcalendar" target="_blank" className="github-link">
                        <img src="/github.svg" alt="GitHub" className="github-icon"/>
                    </a>
                </div>
            </div>
        </div>
    );
}

const timelyDate = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format minutes with leading zero if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Create the final formatted time string
    return hours + ':' + formattedMinutes + ' ' + ampm;
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so we add 1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const formatTrips = (trips?: Trip[], view?: string | null) => {
    return trips?.map(trip => {
        const start = new Date(trip.start)
        return {
            ...trip,
            start: new Date(trip.start),
            end: new Date(trip.end),
            title: trip.legs.map(leg => view == "month" ? timelyDate(start) : `DL${leg.number}`).join('»')
        }
    })
}

const carrierToColor = (carrier: Carrier) => {
    switch (carrier.code) {
        case "DL": {
            return { backgroundColor: '#183d6e', border: '#d2212e' };
        }

        case "UA": {
            return { backgroundColor: '#eeeff9', border: '#1415d0' };
        }

        default: return { backgroundColor: 'black', border: 'black' };
    }
}

const getSundayOfCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const sunday = new Date(today);

    // Calculate the date for the previous Sunday
    sunday.setDate(today.getDate() - dayOfWeek);

    // Set the time to the start of the day
    sunday.setHours(0, 0, 0, 0);

    return sunday;
}

const getSaturdayOfCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    const saturday = new Date(today);

    // Calculate the date for the upcoming Saturday
    saturday.setDate(today.getDate() + (6 - dayOfWeek));

    // Set the time to the start of the day
    saturday.setHours(0, 0, 0, 0);

    return saturday;
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
    return {newStart: start, newEnd: end};
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
    { code: 'MLI', city: 'Moline, IL'},
    { code: 'SJC', city: 'San Jose, CA'},
    { code: 'SNA', city: 'Santa Ana, CA'},
    { code: 'OAK', city: 'Oakland, CA'},
    { code: 'RSW', city: 'Fort Myers, FL'},
    { code: 'SJU', city: 'San Juan, CA'},
    { code: 'MCI', city: 'Kansas City, MO'},
    { code: 'SAT', city: 'San Antonio, TX'},
    { code: 'CLE', city: 'Cleveland, OH'},
    { code: 'OGG', city: 'Maui, HI'},
    { code: 'PIT', city: 'Pittsburgh, PA'},
    { code: 'CVG', city: 'Cincinnati, OH'},
    { code: 'CMH', city: 'Columbus, OH'},
    { code: 'PBI', city: 'West Palm Beach, FL'},
    { code: 'JAX', city: 'Jacksonville, FL'},
    { code: 'BUR', city: 'Burbank, CA'},
    { code: 'BDL', city: 'Hartford, CT'},
    { code: 'ONT', city: 'Ontario, CA'},
    { code: 'MKE', city: 'Milwaukee, WI'},
    { code: 'CHS', city: 'Charleston, SC'},
    { code: 'ANC', city: 'Anchorage, AK'},
    { code: 'ABQ', city: 'Albuquerque, NW'},
    { code: 'BOI', city: 'Boise, ID'},
    { code: 'OMA', city: 'Omaha, NE'},
    { code: 'MEM', city: 'Memphis'},
    { code: 'RIC', city: 'Richmond, VA'},
    { code: 'RNO', city: 'Reno, NV'},
].sort((a, b) => a.city.localeCompare(b.city));