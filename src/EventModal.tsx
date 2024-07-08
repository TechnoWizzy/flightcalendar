import moment from "moment";

export default function EventModal({ event, onClose }: { event: Trip, onClose: () => void }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Trip Number: {event.number}</h2>
                <p><strong>Start:</strong> {moment(event.start).format('MMMM Do YYYY, h:mm A')}</p>
                <p><strong>End:</strong> {moment(event.end).format('MMMM Do YYYY, h:mm A')}</p>

                {event.legs.map((flight, index) => (
                    <div key={index} className="flight-details">
                        <h3>Flight Number: {flight.number}</h3>
                        <p><strong>Status:</strong> {flight.status}</p>
                        <p><strong>Carrier:</strong> {flight.carrier.name} ({flight.carrier.code})</p>
                        <p><strong>Aircraft:</strong> {flight.aircraft.name} ({flight.aircraft.code})</p>
                        <p><strong>From:</strong> {flight.from.cityName} ({flight.from.code})</p>
                        <p><strong>To:</strong> {flight.to.cityName} ({flight.to.code})</p>
                        <p><strong>Departure:</strong> {moment(flight.departure).format('MMMM Do YYYY, h:mm A')}</p>
                        <p><strong>Arrival:</strong> {moment(flight.arrival).format('MMMM Do YYYY, h:mm A')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}