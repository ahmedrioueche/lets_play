import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl text-white`}>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-sm opacity-90 mb-1'>{title}</p>
        <p className='text-3xl font-bold'>{value}</p>
      </div>
      <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center'>
        <Icon className='w-6 h-6' />
      </div>
    </div>
  </div>
);

export default StatsCard;
