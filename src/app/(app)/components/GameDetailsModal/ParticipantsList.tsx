import UserAvatar from '@/components/ui/UserAvatar';
import { User } from '@/types/user';

interface ParticipantsListProps {
  participants: (User | string)[];
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return (
      <div className='text-light-text-secondary dark:text-dark-text-secondary'>
        No participants yet.
      </div>
    );
  }
  return (
    <div className='flex flex-wrap gap-3'>
      {participants.map((p, idx) => {
        const user = typeof p === 'object' ? p : null;
        return (
          <div
            key={user?._id || (p as string)}
            className='flex items-center gap-2 bg-light-hover dark:bg-dark-hover rounded-lg px-3 py-2'
          >
            <UserAvatar avatar={user?.avatar} />
            <span className='font-medium text-light-text-primary dark:text-dark-text-primary'>
              {user?.name || 'User'}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ParticipantsList;
