import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar, Event, momentLocalizer, View, Views} from "react-big-calendar";
import moment from "moment";
import {useCallback, useEffect, useState} from "react";
import {DateParam, StringParam, useQueryParam} from "use-query-params";
import {useQuery} from "@tanstack/react-query";
import Spinner from "./Spinner.tsx";
import EventModal from "./EventModal.tsx";
import airports from "./Airports.ts";
import posthog from "posthog-js";

const localizer = momentLocalizer(moment);

export default function FlightCalender() {
    const [defaultView = "week", setDefaultView] = useQueryParam("view", StringParam);
    const [start, setStart] = useQueryParam("start", DateParam);
    const [end, setEnd] = useQueryParam("end", DateParam);
    const [sourceAirport = "DTW", setSourceAirport] = useQueryParam("from", StringParam);
    const [destinationAirport = "IND", setDestinationAirport] = useQueryParam("to", StringParam);

    const [selectedEvent, setSelectedEvent] = useState(undefined as Event | undefined);
    const [modalState, setModalState] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        if (!start || !end) {
            const { newStart, newEnd } = calculateRange(new Date(), defaultView ?? "week");
            setStart(newStart);
            setEnd(newEnd);
        }
    }, [defaultView, setStart, setEnd]);

    const onView = useCallback((newView: View) => {
        setDefaultView(newView);
        const { newStart, newEnd } = calculateRange(new Date(), newView);
        setStart(newStart);
        setEnd(newEnd);
    }, [setDefaultView, setStart, setEnd]);

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

    const onCloseModal = useCallback(() => {
        setModalState(false);
        setSelectedEvent(undefined);
    }, [setModalState, setSelectedEvent]);

    const swapAirports = useCallback(() => {
        setSourceAirport(destinationAirport);
        setDestinationAirport(sourceAirport);
        window.location.reload();
    }, [setSourceAirport, setDestinationAirport]);

    const handleSubmitFeedback = async () => {
        if (feedbackText.trim() === '') return;

        const webhookUrl = import.meta.env.VITE_FEEDBACK_WEBHOOK_URL;

        const embed = {
            description: feedbackText,
            color: 3447003 // A light blue color
        };

        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed] })
        });

        setFeedbackText('');
        setFeedbackModal(false);
    };

    const { isPending, error, data } = useQuery({
        queryKey: [defaultView, start, end],
        queryFn: async () => {
            if (!sourceAirport || !destinationAirport) return [];
            if (!start) return [];
            if (!end) return [];
            const a = formatDate(start);
            const b = formatDate(end);
            return fetch(`${import.meta.env.VITE_API_URL}/flights/batch/?origin=${sourceAirport}&destination=${destinationAirport}&start=${a}&end=${b}`)
                .then(res => res.json() as Promise<Trip[]>)
        }
    });

    useEffect(() => {
        posthog.capture('pageview', { path: window.location.pathname });
    }, []);

    return (
        <div style={{ height: "100%" }}>
            <header className="header">
                <div className="social-links">
                    <a href="https://buymeacoffee.com/khardesty1w" target="_blank" className="buymeacoffee-link">
                        <img src="/buymeacoffee.png" alt="Buy Me a Coffee" className="buymeacoffee-icon"/>
                    </a>
                    <button className="feedback-button" onClick={() => setFeedbackModal(true)}>Feedback/Airport
                        Request
                    </button>
                </div>
                <span className="header-title">Flight Calendar</span>
                <div className="social-links">
                    <a href="https://github.com/TechnoWizzy/flightcalendar" target="_blank" className="github-link">
                        <img src="/github.svg" alt="GitHub" className="github-icon" />
                    </a>
                </div>
            </header>
            <div className="airport-selection-container">
                <div className="airport-selection">
                    <label>
                        Origin:
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
                    <button className="swap-button" onClick={swapAirports}>Swap</button>
                    <label>
                        Destination:
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
                        <Spinner />
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
                    views={['month', 'week', 'day']}
                    defaultDate={defaultDate(start, end)}
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
                        const { backgroundColor, border } = carrierToColor(trip.carrier);
                        return { style: { backgroundColor, border, borderStyle: "solid", borderBlockWidth: 1.5 } };
                    }}
                />
            </div>
            {modalState && selectedEvent && (
                <EventModal event={selectedEvent as Trip} onClose={onCloseModal} />
            )}
            {feedbackModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Feedback/Airport Request</h2>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Type feedback/request here"
                        ></textarea>
                        <button onClick={handleSubmitFeedback}>Submit</button>
                        <button onClick={() => setFeedbackModal(false)}>Close</button>
                    </div>
                </div>
            )}
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
        const end = new Date(trip.end)
        const title = view == "month" ? `${timelyDate(start)}-${timelyDate(end)}` : trip.legs.map(leg => `DL${leg.number}`).join('»');
        return {
            ...trip,
            start: new Date(trip.start),
            end: new Date(trip.end),
            title: title
        }
    })
}

const carrierToColor = (carrier: Carrier) => {
    switch (carrier.code) {
        case "DL": {
            return {backgroundColor: '#183d6e', border: '#d2212e'};
        }

        case "UA": {
            return {backgroundColor: '#eeeff9', border: '#1415d0'};
        }

        default:
            return {backgroundColor: 'black', border: 'black'};
    }
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

const defaultDate = (start?: Date | null, end?: Date | null) => {
    if (!start) return new Date();
    if (!end) return start;
    const halfTime = end.getTime() - start.getTime()
    return new Date(start.getTime() + halfTime)
}