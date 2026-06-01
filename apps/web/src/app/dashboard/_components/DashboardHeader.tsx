'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import ProfileDropdown from './ProfileDropdown';

type Props = {
  nickname?: string;
};

export default function DashboardHeader({ nickname }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <header
        className="
          relative flex flex-row justify-end items-center w-full
          gap-[clamp(1.5rem,7vw,2.5rem)]
          mb-[clamp(0.5rem,2vw,0.75rem)]
          z-50
        "
      >
        <Icon
          icon="tabler:archive-filled"
          className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
        />
        <button
          onClick={() => setIsDropdownOpen((v) => !v)}
          className="relative"
          aria-label="프로필 메뉴"
        >
          <Icon
            icon="iconamoon:profile-fill"
            className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
          />
          <ProfileDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            nickname={nickname}
          />
        </button>
      </header>
    </>
  );
}
