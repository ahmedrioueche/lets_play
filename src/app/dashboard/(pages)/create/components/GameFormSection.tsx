'use client';

import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import { availableGames } from '@/constants/game';
import useTranslator from '@/hooks/useTranslator';
import { SkillLevel, SportType } from '@/types/game';

interface GameFormSectionProps {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | number) => void;
}

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

export const GameFormSection = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
}: GameFormSectionProps) => {
  const t = useTranslator();

  return (
    <div className='space-y-6 '>
      <div className='grid grid-cols-1 gap-5'>
        <InputField
          label={t.create.game_title}
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          placeholder={t.create.game_title_placeholder}
          error={errors.title}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <CustomSelect
            title={t.create.sport_type}
            options={availableGames.map((game) => ({
              value: game.name,
              label: game.name.charAt(0).toUpperCase() + game.name.slice(1),
            }))}
            selectedOption={formData.sport}
            onChange={(value) => handleSelectChange('sport', value as SportType)}
          />

          <CustomSelect
            title={t.create.skill_level}
            options={SKILL_LEVELS.map((level) => ({
              value: level,
              label: level.charAt(0).toUpperCase() + level.slice(1),
            }))}
            selectedOption={formData.skillLevel}
            onChange={(value) => handleSelectChange('skillLevel', value as SkillLevel)}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <InputField
            label={t.create.date}
            name='date'
            type='date'
            value={formData.date}
            onChange={handleInputChange}
            error={errors.date}
          />

          <InputField
            label={t.create.time}
            name='time'
            type='time'
            value={formData.time}
            onChange={handleInputChange}
            error={errors.time}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <InputField
            label={t.create.max_participants}
            name='maxParticipants'
            type='number'
            value={formData.maxParticipants?.toString() || ''}
            onChange={handleInputChange}
            error={errors.maxParticipants}
            min='2'
          />

          <InputField
            label={t.create.price_optional}
            name='price'
            type='number'
            value={formData.price.toString()}
            onChange={handleInputChange}
            placeholder='0'
            min='0'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <InputField
            label={t.create.minimum_age}
            name='ageMin'
            type='number'
            value={formData.ageMin?.toString() || ''}
            onChange={handleInputChange}
            error={errors.ageRange}
            min='13'
            max='100'
          />

          <InputField
            label={t.create.maximum_age}
            name='ageMax'
            type='number'
            value={formData.ageMax?.toString() || ''}
            onChange={handleInputChange}
            error={errors.ageRange}
            min='13'
            max='100'
          />
        </div>
        {errors.ageRange && <p className='text-red-500 text-sm -mt-3'>{errors.ageRange}</p>}

        <div>
          <label className='block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2'>
            {t.create.description}
          </label>

          <TextArea
            name='description'
            value={formData.description}
            placeholder={t.create.description_placeholder}
            rows={4}
            error={errors.description}
            onChange={handleInputChange}
          />
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
        </div>
      </div>
    </div>
  );
};
