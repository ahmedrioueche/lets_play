import useTranslator from '@/hooks/useTranslator';

const PageHeader: React.FC = () => {
  const text = useTranslator();
  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-dancing font-bold text-light-text-primary dark:text-dark-text-primary mb-2'>
        {text.my_games.page_title}
      </h1>
      <p className='text-light-text-secondary dark:text-dark-text-secondary'>
        {text.my_games.page_subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
