'use client';

import GamesMap from '@/components/games/GamesMap';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import useTranslator from '@/hooks/useTranslator';
import { Game, GameStatus, SkillLevel, SportType } from '@/types/game';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

interface MapSectionProps {
  formData: any;
  errors: any;
  mapCenter: any;
  handleMapClick: (lat: number, lng: number) => void;
}

export const MapSection = React.memo(
  ({ formData, errors, mapCenter, handleMapClick }: MapSectionProps) => {
    const text = useTranslator();
    const { user } = useAuth();

    const gamesForMap = useMemo(() => {
      // Ensure the generated game object strictly adheres to the Game interface
      const tempGame: Game = {
        id: 'temp',
        title: formData.title || 'New Game',
        sport: formData.sport as SportType,
        description: formData.description,
        coordinates: formData.coordinates,
        date: formData.date,
        time: formData.time,
        skillLevel: formData.skillLevel as SkillLevel,
        location: formData.location,
        status: 'open' as GameStatus,
        organizer: user!,
        price: formData.price,
        _id: '',
        participants: [],
        maxParticipants: formData.maxParticipants,
      };

      return formData.coordinates.lat !== 0 || formData.coordinates.lng !== 0 ? [tempGame] : [];
    }, [
      formData.coordinates,
      formData.title,
      formData.sport,
      formData.description,
      formData.date,
      formData.time,
      formData.maxPlayers,
      formData.skillLevel,
      formData.location,
      formData.price,
    ]);

    // Memoize onGameSelect to avoid new function identity on each render
    const onGameSelect = useCallback(() => {}, []);
    // Memoize handleMapClick to avoid new function identity on each render
    const stableHandleMapClick = useCallback(
      (lat: number, lng: number) => {
        handleMapClick(lat, lng);
      },
      [handleMapClick]
    );

    // Handler for going to user's location
    const goToUserLocation = useCallback(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            handleMapClick(position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            toast.error(
              text.create.location_error ||
                'Could not get your location. Please allow location access.'
            );
          }
        );
      } else {
        toast.error(
          text.create.geolocation_not_supported || 'Geolocation is not supported by your browser.'
        );
      }
    }, [handleMapClick, text.create.location_error, text.create.geolocation_not_supported]);

    return (
      <div className='space-y-4'>
        {/* Location Button */}
        <div className='flex justify-between items-center'>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            Select Location
          </p>
          <Button
            type='button'
            variant='default'
            size='sm'
            className='flex items-center gap-2'
            onClick={goToUserLocation}
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
            My Location
          </Button>
        </div>

        {/* Map Container */}
        <div className='relative w-full h-[400px] rounded-xl overflow-hidden border border-light-border dark:border-dark-border'>
          <GamesMap
            games={gamesForMap}
            selectedGame={null}
            onGameSelect={onGameSelect}
            userLocation={mapCenter}
            onMapClick={stableHandleMapClick}
            allowMapClick={true}
          />
        </div>

        {/* Coordinates and Error Display */}
        <div className='space-y-2'>
          {errors.coordinates && (
            <p className='text-red-500 text-sm font-medium'>
              {text.create.location_required || 'Please select a location on the map to continue.'}
            </p>
          )}

          {(formData.coordinates.lat !== 0 || formData.coordinates.lng !== 0) && (
            <div className='bg-light-accent dark:bg-dark-accent rounded-lg p-3'>
              <p className='text-xs font-medium text-light-text-secondary dark:text-dark-text-secondary mb-1'>
                Coordinates
              </p>
              <p className='text-sm text-light-text-primary dark:text-dark-text-primary font-mono'>
                {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

// Add a display name for better debugging in React DevTools
MapSection.displayName = 'MapSection';
