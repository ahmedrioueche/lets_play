'use client';

import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import { useAuth } from '@/context/AuthContext';
import { gamesApi } from '@/lib/api/gamesApi';
import { Game } from '@/types/game';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { GameFormSection } from './components/GameFormSection';
import { MapSection } from './components/MapSection';

export default function CreateGamePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<
    Omit<
      Game,
      'id' | 'status' | 'organizer' | 'currentPlayers' | 'participants' | 'createdAt' | 'updatedAt'
    > & {
      ageMin?: number;
      ageMax?: number;
    }
  >({
    title: '',
    description: '',
    location: '',
    coordinates: { lat: 0, lng: 0 },
    date: '',
    time: '',
    maxPlayers: 10,
    ageMin: 18,
    ageMax: 65,
    sport: 'football',
    skillLevel: 'beginner',
    price: 0,
  });

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  // Auto-generate title if empty and sport changes
  const autoTitle =
    formData.title.trim() === ''
      ? `${formData.sport.charAt(0).toUpperCase() + formData.sport.slice(1)} Game`
      : formData.title;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => {
        // If the user clears the title, auto-generate it
        if (name === 'title' && value.trim() === '') {
          return {
            ...prev,
            [name]: `${prev.sport.charAt(0).toUpperCase() + prev.sport.slice(1)} Game`,
          };
        }
        return { ...prev, [name]: value };
      });
      setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error on change
    },
    []
  );

  const handleSelectChange = useCallback((name: string, value: string | number) => {
    setFormData((prev) => {
      // If sport changes and title is empty or auto-generated, update title
      if (
        name === 'sport' &&
        (prev.title.trim() === '' ||
          prev.title === `${prev.sport.charAt(0).toUpperCase() + prev.sport.slice(1)} Game`)
      ) {
        return {
          ...prev,
          sport: value as import('@/types/game').SportType,
          title: `${(value as string).charAt(0).toUpperCase() + (value as string).slice(1)} Game`,
        };
      }
      // Always cast sport to SportType if changing sport
      if (name === 'sport') {
        return { ...prev, sport: value as import('@/types/game').SportType };
      }
      return { ...prev, [name]: value };
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, coordinates: { lat, lng } }));
    setMapCenter({ lat, lng });
    setErrors((prev) => ({ ...prev, coordinates: '' }));

    // Reverse geocode to get location name
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      if (res.ok) {
        const data = await res.json();
        const displayName = data.display_name || '';
        setFormData((prev) => ({ ...prev, location: displayName }));
      }
    } catch (err) {
      // Fallback: leave location as is if geocoding fails
      console.error('Reverse geocoding failed:', err);
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    // Title is now optional, so no check
    if (formData.coordinates.lat === 0 && formData.coordinates.lng === 0) {
      newErrors.coordinates = 'Please select a location on the map.';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required.';
    }
    if (!formData.time) {
      newErrors.time = 'Time is required.';
    }
    if (formData.maxPlayers < 2) {
      newErrors.maxPlayers = 'Minimum 2 players required.';
    }
    if (formData.ageMin && formData.ageMax && formData.ageMin > formData.ageMax) {
      newErrors.ageRange = 'Minimum age cannot be greater than maximum age.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        toast.error('Please fill in all required fields correctly.');
        return;
      }

      try {
        const newGameData = {
          ...formData,
          title: autoTitle,
          currentPlayers: 0,
          status: 'open',
          organizer: user,
          participants: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await gamesApi.createGame(newGameData);
        toast.success('Game created successfully!');
        router.push('/explore');
      } catch (error) {
        console.error('Error creating game:', error);
        toast.error('Failed to create game. Please try again.');
      }
    },
    [formData, validateForm, router, autoTitle]
  );

  return (
    <div className='min-h-screen bg-light-background dark:bg-dark-background'>
      <div className='container mx-auto '>
        <div className='max-w-6xl mx-auto'>
          <form
            onSubmit={handleSubmit}
            className='bg-light-card dark:bg-dark-card rounded-2xl shadow-xl p-6'
          >
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Left Column - Form Fields */}
              <div className='space-y-6'>
                <GameFormSection
                  formData={{ ...formData, title: autoTitle }}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                />
              </div>

              {/* Right Column - Map */}
              <div className='space-y-4'>
                <MapSection
                  formData={formData}
                  errors={errors}
                  mapCenter={mapCenter}
                  handleMapClick={handleMapClick}
                />

                {/* Location Input */}
                <div className='space-y-2'>
                  <InputField
                    label='Location Name'
                    name='location'
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder='e.g., Central Park Soccer Field'
                    error={errors.location}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className='mt-8 pt-6 border-t border-light-border dark:border-dark-border'>
              <Button type='submit' variant='primary' className='w-full py-3 text-lg font-medium'>
                Create Game
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
