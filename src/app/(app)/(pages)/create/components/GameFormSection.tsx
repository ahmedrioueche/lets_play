'use client';

import CustomSelect from '@/components/ui/CustomSelect';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import { SkillLevel, SportType } from '@/types/game';

interface GameFormSectionProps {
  formData: any;
  errors: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string | number) => void;
}

const SPORTS: SportType[] = ['football', 'basketball', 'tennis', 'volleyball', 'badminton'];
const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced'];

export const GameFormSection = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
}: GameFormSectionProps) => (
  <div className='space-y-6 '>
    <div className='grid grid-cols-1 gap-5'>
      <InputField
        label='Game Title'
        name='title'
        value={formData.title}
        onChange={handleInputChange}
        placeholder='e.g., Sunday Football Match'
        error={errors.title}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <CustomSelect
          title='Sport Type'
          options={SPORTS.map((sport) => ({
            value: sport,
            label: sport.charAt(0).toUpperCase() + sport.slice(1),
          }))}
          selectedOption={formData.sport}
          onChange={(value) => handleSelectChange('sport', value as SportType)}
        />

        <CustomSelect
          title='Skill Level'
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
          label='Date'
          name='date'
          type='date'
          value={formData.date}
          onChange={handleInputChange}
          error={errors.date}
        />

        <InputField
          label='Time'
          name='time'
          type='time'
          value={formData.time}
          onChange={handleInputChange}
          error={errors.time}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <InputField
          label='Max Players'
          name='maxPlayers'
          type='number'
          value={formData.maxPlayers.toString()}
          onChange={handleInputChange}
          error={errors.maxPlayers}
          min='2'
        />

        <InputField
          label='Price (optional)'
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
          label='Minimum Age'
          name='ageMin'
          type='number'
          value={formData.ageMin?.toString() || ''}
          onChange={handleInputChange}
          error={errors.ageRange}
          min='13'
          max='100'
        />

        <InputField
          label='Maximum Age'
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
          Description
        </label>

        <TextArea
          name='description'
          value={formData.description}
          placeholder='Describe your game, rules, what to bring, etc.'
          rows={4}
          error={errors.description}
          onChange={handleInputChange}
        />
        {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
      </div>
    </div>
  </div>
);
