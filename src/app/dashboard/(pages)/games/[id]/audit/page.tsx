'use client';
import GameInfoSection from '@/app/dashboard/components/GameDetailsModal/GameInfoSection';
import MapSection from '@/app/dashboard/components/GameDetailsModal/MapSection';
import OrganizerSection from '@/app/dashboard/components/GameDetailsModal/OrganizerSection';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import ErrorSection from '@/components/ui/ErrorSection';
import Loading from '@/components/ui/Loading';
import NotFound from '@/components/ui/NotFound';
import UserAvatar from '@/components/ui/UserAvatar';
import { useAuth } from '@/context/AuthContext';
import { usersApi } from '@/lib/api/usersApi';
import { Game } from '@/types/game';
import { capitalize } from '@/utils/helper';
import dayjs from 'dayjs';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import WarningModal from '../../components/WarningModal';

const AuditGamePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presence, setPresence] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [kicking, setKicking] = useState<string | null>(null);
  const [showKickModal, setShowKickModal] = useState(false);
  const [kickTarget, setKickTarget] = useState<any>(null);
  const [kickModalReason, setKickModalReason] = useState('');
  const [joinRequestUsers, setJoinRequestUsers] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchJoinRequestUsers = async () => {
      if (!game?.joinRequests || game.joinRequests.length === 0) {
        setJoinRequestUsers([]);
        return;
      }
      try {
        const users = await Promise.all(
          game.joinRequests.map(async (id: string) => {
            try {
              return await usersApi.getUserById(id);
            } catch {
              return { _id: id, name: id };
            }
          })
        );
        setJoinRequestUsers(users);
      } catch {
        setJoinRequestUsers([]);
      }
    };
    fetchJoinRequestUsers();
  }, [game?.joinRequests]);

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

  // Utility: has the game started?
  const hasGameStarted = game && dayjs(`${game.date} ${game.time}`).isBefore(dayjs());

  // Use presentUsers from game for checked state
  const presentUserIds = Array.isArray(game?.presentUsers)
    ? game.presentUsers.map((u: any) => (typeof u === 'object' ? u._id : u))
    : [];

  // Update presentUsers in backend and local state
  const handlePresenceChange = async (pid: string) => {
    const isPresent = presentUserIds.includes(pid);
    let updatedPresentUsers: string[];
    if (isPresent) {
      updatedPresentUsers = presentUserIds.filter((id) => id !== pid);
    } else {
      updatedPresentUsers = [...presentUserIds, pid];
    }
    // Update backend
    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presentUsers: updatedPresentUsers }),
      });
      if (!res.ok) throw new Error('Failed to update present users');
      setGame((prev) => (prev ? { ...prev, presentUsers: updatedPresentUsers } : prev));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update present users');
    }
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

  // Kick participant handler (opens modal)
  const openKickModal = (participant: any) => {
    setKickTarget(participant);
    setKickModalReason('');
    setShowKickModal(true);
  };

  // Confirm kick (calls API)
  const confirmKick = async (reason: string) => {
    if (!kickTarget) return;
    setKicking(kickTarget._id);
    setShowKickModal(false);
    try {
      const res = await fetch(`/api/games/${id}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: kickTarget._id, organizerId: user._id, reason }),
      });
      if (!res.ok) throw new Error('Failed to kick participant');
      toast.success('Participant removed!');

      // Update game state to remove the kicked participant
      setGame((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.filter((p: any) => {
            const participantId = typeof p === 'object' ? p._id : p;
            return participantId !== kickTarget._id;
          }),
        };
      });

      // Remove from presence state
      setPresence((prev) => {
        const newPresence = { ...prev };
        delete newPresence[kickTarget._id];
        return newPresence;
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove participant');
    } finally {
      setKicking(null);
      setKickTarget(null);
      setKickModalReason('');
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

  // Accept join request
  const handleAcceptRequest = async (requestUser: any) => {
    try {
      const res = await fetch(`/api/games/${id}/join-request`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: requestUser._id, action: 'accept' }),
      });
      if (!res.ok) throw new Error('Failed to accept join request');
      toast.success('User added as participant!');
      setGame((prev) =>
        prev
          ? {
              ...prev,
              participants: [...prev.participants, requestUser],
              joinRequests: (prev.joinRequests || []).filter(
                (uid: string) => uid !== requestUser._id
              ),
            }
          : prev
      );
      setJoinRequestUsers((prev) => prev.filter((u) => u._id !== requestUser._id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to accept join request');
    }
  };

  // Reject join request
  const handleRejectRequest = async (requestUser: any) => {
    try {
      const res = await fetch(`/api/games/${id}/join-request`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: requestUser._id, action: 'reject' }),
      });
      if (!res.ok) throw new Error('Failed to reject join request');
      toast.success('Join request rejected!');
      setGame((prev) =>
        prev
          ? {
              ...prev,
              joinRequests: (prev.joinRequests || []).filter(
                (uid: string) => uid !== requestUser._id
              ),
            }
          : prev
      );
      setJoinRequestUsers((prev) => prev.filter((u) => u._id !== requestUser._id));
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject join request');
    }
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
        <div className='space-y-4'>
          {participants.map((p) => (
            <div
              key={p._id}
              className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl p-3 border border-light-border dark:border-dark-border shadow-sm'
            >
              <div
                className='flex items-center gap-3 flex-1 min-w-0 cursor-pointer'
                onClick={() => router.push(`/profile/${p._id}`)}
                tabIndex={0}
                aria-label={`Go to profile of ${p.name}`}
              >
                <UserAvatar avatar={p.avatar} />
                <span className='font-medium truncate text-light-text-primary dark:text-dark-text-primary'>
                  {capitalize(p.name)}
                </span>
                {p._id === organizerId && (
                  <span className='ml-2 text-xs text-light-primary dark:text-dark-primary'>
                    (Organizer)
                  </span>
                )}
              </div>
              <div className='flex items-center gap-3'>
                {/* Show Present checkbox only if game has started */}
                {hasGameStarted && (
                  <Checkbox
                    id={`present-${p._id}`}
                    checked={presentUserIds.includes(p._id)}
                    onChange={() => handlePresenceChange(p._id)}
                    label='Present'
                    accentColor='blue'
                    className='min-w-[120px]'
                  />
                )}
                {/* Kick button for non-organizer participants */}
                {p._id !== organizerId && (
                  <Button
                    className='ml-2 text-xs font-semibold'
                    variant='danger'
                    size='default'
                    disabled={kicking === p._id}
                    onClick={() => openKickModal(p)}
                    title='Remove participant'
                  >
                    Remove participant
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Requests Section */}
      {joinRequestUsers.length > 0 && (
        <div className='bg-light-card dark:bg-dark-card rounded-2xl p-6 mb-6 border border-light-border dark:border-dark-border'>
          <h3 className='text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4'>
            Join Requests
          </h3>
          <div className='space-y-4'>
            {joinRequestUsers.map((u) => (
              <div
                key={u._id}
                className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-light-hover/50 dark:bg-dark-hover/50 rounded-xl p-3 border border-light-border dark:border-dark-border shadow-sm'
              >
                <div
                  className='flex items-center gap-3 flex-1 min-w-0 cursor-pointer'
                  onClick={() => router.push(`/profile/${u._id}`)}
                  tabIndex={0}
                  aria-label={`Go to profile of ${u.name}`}
                >
                  <UserAvatar avatar={u.avatar} />
                  <span className='font-medium truncate text-light-text-primary dark:text-dark-text-primary'>
                    {capitalize(u.name)}
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <Button
                    className='text-xs font-semibold'
                    variant='primary'
                    size='default'
                    onClick={() => handleAcceptRequest(u)}
                  >
                    Accept
                  </Button>
                  <Button
                    className='text-xs font-semibold'
                    variant='danger'
                    size='default'
                    onClick={() => handleRejectRequest(u)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Kick Warning Modal */}
      <WarningModal
        isOpen={showKickModal}
        onCancel={() => setShowKickModal(false)}
        onConfirm={(reason) => confirmKick(reason || '')}
        message={`Are you sure you want to remove ${kickTarget?.name || 'this participant'} from the game?`}
        warning='Remove Participant'
        showInput
        inputLabel='Reason (optional)'
        inputPlaceholder='Reason for kick (shown in notification)'
        inputValue={kickModalReason}
        onInputChange={setKickModalReason}
      />
    </div>
  );
};

export default AuditGamePage;
