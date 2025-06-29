import React from 'react';

interface UserAvatarProps {
  avatar?: string;
  alt?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ avatar, alt = 'User Avatar', className = '' }) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={alt}
        className={`h-9 w-9 rounded-full object-cover flex-shrink-0 ${className}`}
      />
    );
  }
  return (
    <div
      className={`h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex-shrink-0 ${className}`}
    ></div>
  );
};

export default UserAvatar;
export type { UserAvatarProps };
