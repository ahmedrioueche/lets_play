import useTranslator from '@/hooks/useTranslator';

interface WarningModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  warning?: string;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  warning,
}) => {
  const text = useTranslator();
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='bg-white dark:bg-dark-card rounded-xl shadow-xl p-8 max-w-md w-full'>
        <h2 className='text-xl font-bold mb-4 text-red-600 dark:text-red-400'>
          {warning || text.my_games.warning_title}
        </h2>
        <p className='mb-6 text-light-text-primary dark:text-dark-text-primary'>{message}</p>
        <div className='flex justify-end gap-4'>
          <button
            className='px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            onClick={onCancel}
          >
            {text.my_games.warning_cancel}
          </button>
          <button
            className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'
            onClick={onConfirm}
          >
            {text.my_games.warning_confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
