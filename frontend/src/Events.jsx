import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ensure Leaflet's default icon path is set
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Events = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const events = [
    { id: 1, name: "Delhi Stamp Exhibition", lat: 28.6139, lng: 77.2090, description: "Annual exhibition featuring rare Indian stamps", organizer: "Philatelic Society of India", date: "October 15-17, 2024", website: "www.delhistampexhibition.com" },
    { id: 2, name: "Mumbai Collectors' Fair", lat: 19.0760, lng: 72.8777, description: "Largest stamp and coin collection event in Western India", organizer: "Mumbai Philatelists Association", date: "November 5-7, 2024", website: "www.mumbaicollectorsfair.org" },
    { id: 3, name: "Kolkata Philatelic Symposium", lat: 22.5726, lng: 88.3639, description: "Academic conference on Indian postal history", organizer: "Bengal Philatelic Society", date: "September 20-22, 2024", website: "www.kolkataphilately.com" },
    { id: 4, name: "Bangalore Stamp Workshop", lat: 12.9716, lng: 77.5946, description: "Hands-on workshop for beginners in stamp collecting", organizer: "Karnataka Philatelic Society", date: "August 10-11, 2024", website: "www.bangalorestamps.org" },
    { id: 5, name: "Chennai Rare Stamps Auction", lat: 13.0827, lng: 80.2707, description: "Auction of valuable and rare Indian stamps", organizer: "South India Philatelists' Association", date: "December 3-4, 2024", website: "www.chennaistampauction.com" },
  ];

  const customIcon = new Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const RoutingMachine = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
      if (!map || !start || !end) return;

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng),
          L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: true,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false
      }).addTo(map);

      routingControl.on('routesfound', function (e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        toast.info(`Route found! Distance: ${summary.totalDistance / 1000} km, Estimated time: ${Math.round(summary.totalTime / 60)} minutes`);
      });

      return () => map.removeControl(routingControl);
    }, [map, start, end]);

    return null;
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-bold mb-4">Philatelic Events in India</h1>
      <button 
        onClick={getUserLocation}
        className="mb-4 px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-800"
      >
        Get My Location
      </button>
      <div className="flex-grow flex">
        {userLocation ? (
          <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={5} className="flex-grow">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {events.map((event) => (
              <Marker
                key={event.id}
                position={[event.lat, event.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedEvent(event);
                    setShowDetails(false); // Ensure details are hidden initially
                    toast.success(`Selected event: ${event.name}`);
                  },
                }}
              >
                <Popup>
                  <div>
                    <h2 className="font-bold">{event.name}</h2>
                    <p>{event.description}</p>
                    <p>Distance: {calculateDistance(userLocation.lat, userLocation.lng, event.lat, event.lng).toFixed(2)} km</p>
                    <button
                      onClick={() => setShowDetails(true)}
                      className="mt-2 px-2 py-1 bg-yellow-800 text-white rounded hover:bg-yellow-600"
                    >
                      More Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {selectedEvent && (
              <RoutingMachine start={userLocation} end={{ lat: selectedEvent.lat, lng: selectedEvent.lng }} />
            )}
          </MapContainer>
        ) : (
          <div>Loading map...</div>
        )}
        {selectedEvent && showDetails && (
          <div className="w-1/3 p-4 bg-white shadow-lg overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">{selectedEvent.name}</h2>
            <p className="mb-2">{selectedEvent.description}</p>
            <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
            <p><strong>Date:</strong> {selectedEvent.date}</p>
            <p><strong>Website:</strong> <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedEvent.website}</a></p>
            <p><strong>Distance:</strong> {calculateDistance(userLocation.lat, userLocation.lng, selectedEvent.lat, selectedEvent.lng).toFixed(2)} km</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
