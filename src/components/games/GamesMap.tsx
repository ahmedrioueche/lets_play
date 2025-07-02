import { Game } from '@/types/game';
import { Feature } from 'ol';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import View from 'ol/View';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import 'ol/ol.css';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import OSM from 'ol/source/OSM';
import { Circle, Fill, Icon, Stroke, Style, Text } from 'ol/style';
import React, { useEffect, useRef, useState } from 'react';

interface GamesMapProps {
  games: Game[];
  selectedGame: Game | null;
  onGameSelect: (game: Game) => void;
  userLocation: { lat: number; lng: number } | null;
  onMapClick?: (lat: number, lng: number) => void;
  allowMapClick?: boolean;
}

const defaultCenter = fromLonLat([-74.006, 40.7128]); // New York coordinates

const getSportMarker = (sport: string) => {
  switch (sport) {
    case 'basketball':
      return '/images/markers/basketball.svg';
    case 'football':
      return '/images/markers/football.svg';
    case 'tennis':
      return '/images/markers/tennis.svg';
    case 'volleyball':
      return '/images/markers/volleyball.svg';
    default:
      return '/images/marker.svg';
  }
};

const GamesMap: React.FC<GamesMapProps> = ({
  games,
  selectedGame,
  onGameSelect,
  userLocation,
  onMapClick,
  allowMapClick,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [vectorSource] = useState(() => new VectorSource());
  const [userVectorSource] = useState(() => new VectorSource());
  const [overlay] = useState(
    () =>
      new Overlay({
        element: document.createElement('div'),
        positioning: 'bottom-center',
        offset: [0, -10],
        autoPan: true,
      })
  );

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
        new VectorLayer({
          source: userVectorSource,
        }),
      ],
      view: new View({
        center: defaultCenter,
        zoom: 12,
      }),
      overlays: [overlay],
    });

    setMap(initialMap);

    // Add click listener for map if allowMapClick is true
    if (allowMapClick && onMapClick) {
      initialMap.on('click', (event) => {
        const clickedCoord = initialMap.getCoordinateFromPixel(event.pixel);
        if (clickedCoord) {
          const lonLat = toLonLat(clickedCoord);
          onMapClick(lonLat[1], lonLat[0]); // Pass lat, lng
        }
      });
    }

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [allowMapClick, onMapClick]);

  // Update map center and zoom when selected game changes
  useEffect(() => {
    if (!map) return;

    if (selectedGame) {
      const coordinates = fromLonLat([selectedGame.coordinates.lng, selectedGame.coordinates.lat]);
      map.getView().animate({
        center: coordinates,
        zoom: 15,
        duration: 500,
      });
    } else if (userLocation) {
      const coordinates = fromLonLat([userLocation.lng, userLocation.lat]);
      map.getView().animate({
        center: coordinates,
        zoom: 12,
        duration: 500,
      });
    }
  }, [map, selectedGame, userLocation]);

  // Update game markers
  useEffect(() => {
    if (!map) return;

    vectorSource.clear();

    games.forEach((game) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat([game.coordinates.lng, game.coordinates.lat])),
        properties: game,
      });

      // Create a custom hit detection area using a circle
      const hitAreaStyle = new Style({
        image: new Circle({
          radius: 30,
          fill: new Fill({
            color: 'rgba(0, 0, 0, 0.05)',
          }),
        }),
      });

      // Create the marker style
      const markerStyle = new Style({
        image: new Icon({
          src: getSportMarker(game.sport),
          scale: selectedGame?.id === game.id ? 0.7 : 0.5,
          anchor: [0.5, 1],
        }),
        text: new Text({
          text: game.title,
          offsetY: -40,
          font: '12px sans-serif',
          fill: new Fill({ color: '#1F2937' }),
          stroke: new Stroke({ color: 'white', width: 3 }),
          backgroundFill: new Fill({ color: 'rgba(255, 255, 255, 0.8)' }),
          padding: [4, 8],
        }),
      });

      // Combine both styles
      feature.setStyle([hitAreaStyle, markerStyle]);

      vectorSource.addFeature(feature);
    });

    // If there are games, fit the map to show all of them
    if (games.length > 0) {
      const extent = vectorSource.getExtent();
      map.getView().fit(extent, {
        padding: [50, 50, 50, 50],
        duration: 500,
        maxZoom: 15,
      });
    }

    // Add hover interaction
    let lastFeature: Feature<Point> | null = null;
    let isHoveringPopup = false;

    map.on('pointermove', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature) as
        | Feature<Point>
        | undefined;
      const popup = overlay.getElement();

      // Check if we're hovering over the popup
      if (popup && popup.contains(event.originalEvent.target as Node)) {
        isHoveringPopup = true;
        return; // Keep the popup visible
      } else {
        isHoveringPopup = false;
      }

      // If we're still over the same feature, don't do anything
      if (feature === lastFeature) {
        return;
      }

      lastFeature = feature || null;

      if (feature) {
        const game = feature.get('properties') as Game;
        const geometry = feature.getGeometry();

        if (geometry instanceof Point && popup) {
          const coordinates = geometry.getCoordinates();

          // Show popup immediately
          popup.innerHTML = `
            <div class="bg-white dark:bg-dark-card rounded-lg shadow-lg p-4 min-w-[250px] border border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-lg text-light-text-primary dark:text-dark-text-primary mb-3">${game.title}</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">

                  <div class="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary text-sm">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                     <span> ${game.participants.length}/${game.maxParticipants} participants
                    </span>                  </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-light-primary/10 dark:bg-dark-primary/10 text-light-primary dark:text-dark-primary">
                    ${game.skillLevel.charAt(0).toUpperCase() + game.skillLevel.slice(1)}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>${game.date}</span>
                  </div>
                  <div class="flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>${game.time}</span>
                  </div>
                </div>
                <button class="mt-2 w-full bg-light-primary dark:bg-dark-primary text-white rounded-lg py-2 text-sm hover:opacity-90 transition-opacity">
                  View Details
                </button>
              </div>
            </div>
          `;

          // Add click handler to the button
          const button = popup.querySelector('button');
          if (button) {
            button.addEventListener('click', () => onGameSelect(game));
          }

          overlay.setPosition(coordinates);
        }
      } else if (!isHoveringPopup) {
        // Only hide the popup if we're not hovering over it
        overlay.setPosition(undefined);
      }
    });

    // Add click interaction (existing, but now conditional)
    if (!allowMapClick) {
      // Only enable this if we're not allowing general map clicks for location selection
      map.on('click', (event) => {
        const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
        if (feature) {
          const game = feature.get('properties') as Game;
          onGameSelect(game);
        }
      });
    }
  }, [map, games, onGameSelect, selectedGame, allowMapClick, onMapClick]);

  // Update user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    userVectorSource.clear();

    const feature = new Feature({
      geometry: new Point(fromLonLat([userLocation.lng, userLocation.lat])),
    });

    feature.setStyle(
      new Style({
        image: new Icon({
          src: '/images/marker-user.svg',
          scale: 0.5,
          anchor: [0.5, 1],
        }),
      })
    );

    userVectorSource.addFeature(feature);
  }, [map, userLocation]);

  return (
    <div
      ref={mapRef}
      className='w-full h-full rounded-2xl overflow-hidden'
      style={{ position: 'relative' }}
    />
  );
};

export default GamesMap;
