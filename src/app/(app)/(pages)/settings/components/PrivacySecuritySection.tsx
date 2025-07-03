import Checkbox from '@/components/ui/Checkbox';
import CustomSelect from '@/components/ui/CustomSelect';
import useTranslator from '@/hooks/useTranslator';
import React from 'react';

interface PrivacySecuritySectionProps {
  privacy: string;
  profileVisibility: string;
  onPrivacyChange: (value: string) => void;
  onProfileVisibilityChange: (value: string) => void;
  allowDirectGameInvites: boolean;
  setAllowDirectGameInvites: (value: boolean) => void;
  allowMessagesFromNonFriends: boolean;
  setAllowMessagesFromNonFriends: (value: boolean) => void;
}

const PrivacySecuritySection: React.FC<PrivacySecuritySectionProps> = ({
  privacy,
  profileVisibility,
  onPrivacyChange,
  onProfileVisibilityChange,
  allowDirectGameInvites,
  setAllowDirectGameInvites,
  allowMessagesFromNonFriends,
  setAllowMessagesFromNonFriends,
}) => {
  const text = useTranslator();

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden'>
      <div className='px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-b border-purple-200/50 dark:border-purple-700/50'>
        <h3 className='font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2'>
          <span className='w-2 h-2 bg-purple-500 rounded-full'></span>
          {text.settings.privacy_security || 'Privacy & Security'}
        </h3>
      </div>
      <div className='p-4 sm:p-6 space-y-3 sm:space-y-4'>
        <CustomSelect
          title={text.settings.profile_visibility || 'Profile Visibility'}
          selectedOption={profileVisibility}
          onChange={onProfileVisibilityChange}
          options={[
            { value: 'public', label: text.settings.public || 'Public' },
            { value: 'friends', label: text.settings.friends || 'Friends Only' },
            { value: 'private', label: text.settings.private || 'Private' },
          ]}
          className='w-full'
        />

        <CustomSelect
          title={text.settings.privacy || 'Privacy'}
          selectedOption={privacy}
          onChange={onPrivacyChange}
          options={[
            { value: 'public', label: text.settings.public || 'Public' },
            { value: 'friends', label: text.settings.friends || 'Friends Only' },
            { value: 'private', label: text.settings.private || 'Private' },
          ]}
          className='w-full'
        />

        <Checkbox
          id='allowDirectGameInvites'
          checked={allowDirectGameInvites}
          onChange={setAllowDirectGameInvites}
          label={text.settings.allow_direct_game_invites || 'Allow Direct Game Invites'}
          description={
            text.settings.allow_direct_game_invites_desc ||
            'Allow users to invite you to games directly, even if they are not your friends.'
          }
          accentColor='indigo'
        />
        <Checkbox
          id='allowMessagesFromNonFriends'
          checked={allowMessagesFromNonFriends}
          onChange={setAllowMessagesFromNonFriends}
          label={text.settings.allow_messages_from_non_friends || 'Allow Messages from Non-Friends'}
          description={
            text.settings.allow_messages_from_non_friends_desc ||
            'Allow users who are not your friends to message you.'
          }
          accentColor='indigo'
        />
      </div>
    </div>
  );
};

export default PrivacySecuritySection;
