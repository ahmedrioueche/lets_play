import UserAvatar from '@/components/ui/UserAvatar';
import useTranslator from '@/hooks/useTranslator';
import { Game } from '@/types/game';
import { User } from '@/types/user';
import { capitalize } from '@/utils/helper';
import { useRouter } from 'next/navigation';

interface OrganizerSectionProps {
  game: Game;
  organizer: User | null;
}

const OrganizerSection: React.FC<OrganizerSectionProps> = ({ game, organizer }) => {
  const router = useRouter();
  const text = useTranslator();

  return (
    <div>
      <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-2'>
        {text.general.organizer}
      </h3>
      <div
        className='flex items-center gap-3 p-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl cursor-pointer'
        onClick={() => (organizer ? router.push(`/dashboard/profile/${organizer._id}`) : undefined)}
        title={organizer ? `View ${organizer.name}'s profile` : text.general.organizer}
      >
        <UserAvatar avatar={organizer?.avatar} />
        <div>
          <p className='font-medium text-light-text-primary dark:text-dark-text-primary'>
            {organizer ? capitalize(organizer.name!) : text.general.organizer}
          </p>
          <p className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
            {text.general.organizer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSection;
