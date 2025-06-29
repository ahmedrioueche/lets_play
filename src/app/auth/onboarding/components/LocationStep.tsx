import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationStepProps {
  value: Location | null;
  onChange: (location: Location) => void;
  onNext: () => void;
  onBack: () => void;
}

const LocationStep: React.FC<LocationStepProps> = ({ value, onChange, onNext, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localLocation, setLocalLocation] = useState<Location | null>(value);

  const handleGeolocate = async () => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      const coords = {
        lat: Number(latitude.toFixed(6)),
        lng: Number(longitude.toFixed(6)),
      };

      // Get address using reverse geocoding
      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );
        if (response.ok) {
          const data = await response.json();
          address = data.display_name || address;
        }
      } catch (geocodeError) {
        console.log('Reverse geocoding failed, using coordinates as address');
      }

      const locationWithAddress = {
        ...coords,
        address,
      };

      setLocalLocation(locationWithAddress);
      onChange(locationWithAddress);
    } catch (geolocationError) {
      setError('Unable to retrieve your location.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (localLocation) {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className='p-8 flex flex-col items-center'
    >
      <h2 className='text-2xl font-bold mb-4 text-light-text-primary dark:text-dark-text-primary'>
        Where are you located?
      </h2>
      <div className='relative mb-6'>
        <Image
          src='/images/location.svg'
          alt='Location'
          width={200}
          height={200}
          className={`mx-auto drop-shadow-lg ${localLocation ? 'opacity-80' : 'opacity-40'}`}
        />
        {localLocation && (
          <span className='absolute -bottom-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-lg'>
            <svg width='20' height='20' fill='none' viewBox='0 0 24 24'>
              <path stroke='currentColor' strokeWidth='2' d='M5 13l4 4L19 7' />
            </svg>
          </span>
        )}
      </div>
      <Button
        variant='primary'
        className='mb-4 w-full'
        onClick={handleGeolocate}
        disabled={loading}
      >
        {loading
          ? 'Detecting location...'
          : localLocation
            ? 'Re-detect location'
            : 'Use my current location'}
      </Button>
      {localLocation && (
        <div className='mb-4 text-center text-light-text-primary dark:text-dark-text-primary text-sm'>
          <span className='font-semibold'>Detected:</span>
          <br />
          <span>
            {localLocation.address || `Lat: ${localLocation.lat}, Lng: ${localLocation.lng}`}
          </span>
        </div>
      )}
      {error && <div className='text-red-500 text-sm mb-2'>{error}</div>}
      <div className='flex w-full gap-2'>
        <Button variant='default' className='w-1/2' onClick={onBack}>
          Back
        </Button>
        <Button
          variant='primary'
          className='w-1/2'
          onClick={handleNext}
          disabled={!localLocation || loading}
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};

export default LocationStep;
