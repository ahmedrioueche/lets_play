import { capitalize } from '@/utils/helper';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
  userName: string;
}

const AvatarModal: React.FC<AvatarModalProps> = ({ isOpen, onClose, avatarUrl, userName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className='relative max-w-2xl max-h-[90vh] p-4'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className='absolute top-2 right-2 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors'
            >
              <X className='w-5 h-5' />
            </button>

            {/* Avatar image */}
            <div className='relative'>
              <img
                src={avatarUrl}
                alt={`${userName}'s avatar`}
                className='w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl'
              />

              {/* User name overlay */}
              <div className='absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-3'>
                <h3 className='text-white font-semibold text-lg'>{capitalize(userName)}</h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvatarModal;
