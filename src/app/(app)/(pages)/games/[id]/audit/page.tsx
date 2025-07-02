'use client';
import GameInfoSection from '@/app/(app)/components/GameDetailsModal/GameInfoSection';
import MapSection from '@/app/(app)/components/GameDetailsModal/MapSection';
import OrganizerSection from '@/app/(app)/components/GameDetailsModal/OrganizerSection';
import Button from '@/components/ui/Button';
import ErrorSection from '@/components/ui/ErrorSection';
import Loading from '@/components/ui/Loading';
import NotFound from '@/components/ui/NotFound';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { Game } from '@/types/game';
import { capitalize } from '@/utils/helper';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AuditGamePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/games/${id}`);
        if (!res.ok) throw new Error('Game not found');
        const data = await res.json();
        setGame(data);
        if (data.participants && Array.isArray(data.participants)) {
          const initial: Record<string, boolean> = {};
          data.participants.forEach((p: any) => {
            const pid = typeof p === 'object' ? p._id : p;
            initial[pid] = false;
          });
          setPresence(initial);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };
    if (id && user) fetchGame();
  }, [id, user]);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <ErrorSection text={error} />
      </div>
    );
  if (!game)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <NotFound
          text='Game not found'
          subtext='The game you are looking for does not exist or may have been removed.'
        />
      </div>
    );

  // Only organizer can access
  const organizerId = typeof game.organizer === 'object' ? game.organizer._id : game.organizer;
  if (!user || user._id !== organizerId) {
    return <ErrorSection text='You are not authorized to audit this game.' />;
  }

  const handlePresenceChange = (pid: string) => {
    setPresence((prev) => ({ ...prev, [pid]: !prev[pid] }));
  };

  const handleSendReminders = async () => {
    setSending(true);
    try {
      const presentIds = Object.entries(presence)
        .filter(([_, present]) => !present)
        .map(([pid]) => pid);
      if (presentIds.length === 0) {
        toast('All participants are marked present.');
        return;
      }
      const res = await fetch(`/api/games/${id}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: presentIds, organizerId: user._id }),
      });
      if (!res.ok) throw new Error('Failed to send reminders');
      toast.success('Reminders sent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reminders');
    } finally {
      setSending(false);
    }
  };

  // Helper to get participant user objects
  const participants: any[] = (game.participants || []).map((p: any) =>
    typeof p === 'object' ? p : { _id: p, name: p }
  );
  const organizer =
    typeof game.organizer === 'object'
      ? game.organizer
      : {
          _id: organizerId,
          name: 'Organizer',
          email: '',
          phone: '',
          createdAt: '',
          updatedAt: '',
        };

  return (
    <div className='container mx-auto p-2'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-dancing font-bold text-light-text-primary dark:text-dark-text-primary mb-2 flex items-center gap-2'>
          Game Audit
        </h1>
        <p className='text-light-text-secondary dark:text-dark-text-secondary flex items-center gap-2'>
          Auditing: <span className='font-semibold'>{game.title}</span>
        </p>
      </div>

      {/* Info Grid */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <GameInfoSection game={game} />
      </div>

      {/* Organizer Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <OrganizerSection game={game} organizer={organizer} />
      </div>

      {/* Map Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <MapSection game={game} userLocation={null} />
      </div>

      {/* Participants Presence Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
        <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
          Participants Presence
        </h3>
        <ul className='space-y-3'>
          {participants.map((p) => (
            <li
              key={p._id}
              className='flex items-center gap-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl p-3'
            >
              <UserAvatar avatar={p.avatar} />
              <span className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                {capitalize(p.name)}
              </span>
              {p._id === organizerId && (
                <span className='ml-2 text-xs text-light-primary dark:text-dark-primary'>
                  (Organizer)
                </span>
              )}
              <input
                type='checkbox'
                checked={presence[p._id] || false}
                onChange={() => handlePresenceChange(p._id)}
                className='ml-auto w-5 h-5 accent-blue-600 rounded focus:ring-2 focus:ring-blue-400 transition-all duration-200'
                title='Mark present'
              />
              <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary ml-2'>
                Present
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions Section */}
      <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 border border-light-border dark:border-dark-border mb-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <Button
            onClick={handleSendReminders}
            disabled={sending}
            variant='primary'
            className='flex-1 text-base py-3'
          >
            Send Reminder to Absent
          </Button>
          <Button
            onClick={() => setPresence(Object.fromEntries(participants.map((p) => [p._id, true])))}
            variant='ghost'
            className='flex-1 text-base py-3'
          >
            Mark All Present
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditGamePage;
