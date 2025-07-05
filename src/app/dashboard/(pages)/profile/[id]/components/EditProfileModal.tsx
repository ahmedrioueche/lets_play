import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import { capitalize } from '@/utils/helper';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Phone, Save, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
  profileData: any; // User profile data including location, bio, etc.
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  profileData,
}) => {
  const [formData, setFormData] = useState({
    name: profileData?.name || '',
    phone: profileData?.phone || '',
    bio: profileData?.bio || '',
    location: profileData?.location || { address: '', cords: { lat: 0, lng: 0 } },
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    if (isOpen && profileData) {
      setFormData({
        name: profileData.name || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        location: profileData.location || { address: '', cords: { lat: 0, lng: 0 } },
      });
    }
  }, [isOpen, profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );

      let address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      if (response.ok) {
        const data = await response.json();
        address = data.display_name || address;
      }
      handleInputChange('location', { address, cords: { lat: latitude, lng: longitude } });
      toast.success('Location updated!');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Failed to get location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className='relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-700'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Edit Profile</h2>
              <button
                onClick={onClose}
                className='w-8 h-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='px-8 py-6'>
              <div className='grid grid-cols-2 gap-6'>
                {/* Left Column */}
                <div className='space-y-4'>
                  {/* Name */}
                  <InputField
                    label='Name'
                    icon={<User className='w-4 h-4' />}
                    value={capitalize(formData?.name!)}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder='Enter your name'
                    required
                  />

                  {/* Phone */}
                  <InputField
                    label='Phone Number'
                    icon={<Phone className='w-4 h-4' />}
                    type='tel'
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder='Enter your phone number'
                  />

                  {/* Location */}
                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
                      <MapPin className='w-4 h-4 inline mr-2' />
                      Location
                    </label>
                    <div className='relative'>
                      <input
                        type='text'
                        value={formData.location.address}
                        onChange={(e) =>
                          handleInputChange('location', {
                            ...formData.location,
                            address: e.target.value,
                          })
                        }
                        className='w-full pl-10 pr-12 py-3 bg-light-background dark:bg-dark-accent border border-light-border dark:border-dark-border rounded-lg text-light-text-primary dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary transition-all'
                        placeholder='Enter your location'
                      />
                      <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary' />
                      <button
                        type='button'
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded-md flex items-center justify-center text-white transition-colors'
                        title='Get current location'
                      >
                        {isGettingLocation ? (
                          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                        ) : (
                          <MapPin className='w-4 h-4' />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className='space-y-4'>
                  {/* Email (read-only) */}
                  <InputField
                    label='Email'
                    value={profileData?.email}
                    disabled
                    className='bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  />
                  <p className='text-xs text-gray-500 dark:text-gray-400 -mt-2'>
                    Email cannot be changed
                  </p>

                  {/* Bio */}
                  <TextArea
                    label='Bio'
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder='Tell us about yourself...'
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex gap-3 pt-6'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSaving}
                  className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                >
                  {isSaving ? (
                    <>
                      <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className='w-4 h-4' />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
