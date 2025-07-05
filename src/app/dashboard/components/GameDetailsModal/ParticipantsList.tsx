import UserAvatar from '@/components/ui/UserAvatar';
import { User } from '@/types/user';
import { capitalize } from '@/utils/helper';
import { useRouter } from 'next/navigation';

interface ParticipantsListProps {
  participants: User[];
  organizer: User;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants, organizer }) => {
  const router = useRouter();

  return (
    <ul className='space-y-3'>
      {participants.map((participant) => (
        <li
          onClick={() => router.push(`/dashboard/profile/${participant._id}`)}
          key={participant._id}
          className='flex items-center gap-4 cursor-pointer'
        >
          <UserAvatar avatar={participant.avatar} />
          <span>{capitalize(participant.name)}</span>
          {participant._id === organizer._id && (
            <span className='ml-2 text-xs text-light-primary dark:text-dark-primary'>
              (Organizer)
            </span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ParticipantsList;
