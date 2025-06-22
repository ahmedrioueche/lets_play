'use client';

import GamesMap from '@/components/games/GamesMap';
import Button from '@/components/ui/Button';
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
        currentPlayers: 0,
        maxPlayers: formData.maxPlayers,
        skillLevel: formData.skillLevel as SkillLevel,
        location: formData.location,
        status: 'open' as GameStatus,
        organizer: { id: 'mock', name: 'Mock Organizer', avatar: '' }, // Ensure organizer matches Partial<User>
        price: formData.price,
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
      <div className='flex flex-col h-full rounded-2xl overflow-hidden border border-light-border/30 dark:border-dark-border/30 bg-white dark:bg-dark-card shadow-xl'>
        <div className='p-4 sm:p-6 flex flex-col gap-2'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <h2 className='text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary'>
              {text.create.select_location || 'Select Location'}
            </h2>
            <Button
              type='button'
              variant='primary'
              size='sm'
              className='w-full sm:w-auto'
              onClick={goToUserLocation}
            >
              {text.create.go_to_my_location || 'Go to My Location'}
            </Button>
          </div>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2 sm:mb-4'>
            {text.create.click_map_instruction || 'Click on the map to pin your game location'}
          </p>
        </div>

        <div className='flex-1 w-full px-4 sm:px-6'>
          <GamesMap
            games={gamesForMap}
            selectedGame={null}
            onGameSelect={onGameSelect}
            userLocation={mapCenter}
            onMapClick={stableHandleMapClick}
            allowMapClick={true}
          />
        </div>

        <div className='p-4 sm:p-6'>
          {errors.coordinates && (
            <p className='text-red-500 text-sm font-semibold'>
              {text.create.location_required || 'Please select a location on the map to continue.'}
            </p>
          )}
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary mt-2'>
            {text.create.coordinates || 'Coordinates'}: {formData.coordinates.lat.toFixed(4)},{' '}
            {formData.coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>
    );
  }
);

// Add a display name for better debugging in React DevTools
MapSection.displayName = 'MapSection';
