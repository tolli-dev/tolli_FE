'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { updateNickname, deleteUser } from '@firebasegen/default-connector';
import { fireAuth } from '@/firebase/fireAuth';
import { dataConnect } from '@/lib/dataconnect';
import ProfileDropdown from './ProfileDropdown';
import standingTolli from '../../../../public/tolli1.svg';

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,8}$/;

type ModalType = 'logout' | 'withdraw' | 'rename' | null;

type Props = {
  nickname?: string;
  done?: boolean;
};

export default function DashboardHeader({ nickname, done = false }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [renameValue, setRenameValue] = useState(nickname ?? '');
  const [renameError, setRenameError] = useState(false);
  const router = useRouter();

  const handleAccessToStorage = () => {
    router.push(`/dashboard/storage?isDone=${done}`);
  };

  const handleLogout = async () => {
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_LOGGED_OUT' }));
    await signOut(fireAuth);
    router.push('/login');
  };

  const handleWithdraw = async () => {
    const idToken = await fireAuth.currentUser?.getIdToken();
    await deleteUser(dataConnect);
    if (idToken) {
      await fetch('/api/auth/unregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
    }
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_LOGGED_OUT' }));
    await signOut(fireAuth);
    router.push('/login');
  };

  const handleRenameSave = async () => {
    if (!NICKNAME_REGEX.test(renameValue)) {
      setRenameError(true);
      return;
    }
    await updateNickname(dataConnect, { nickname: renameValue });
    setModal(null);
  };

  const openModal = (type: ModalType) => {
    setIsDropdownOpen(false);
    setModal(type);
  };

  return (
    <>
      {isDropdownOpen && !modal && (
        <div className="fixed inset-0 z-40 bg-black/45" onClick={() => setIsDropdownOpen(false)} />
      )}

      {/* 로그아웃 / 회원탈퇴 모달 */}
      {(modal === 'logout' || modal === 'withdraw') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92">
          <div className="w-[80vw] max-w-88 rounded-4xl overflow-hidden flex flex-col items-center px-6 pt-8 pb-8 gap-4 bg-[#1e1e1e]">
            <h2 className="text-[1.1875rem] leading-7.75 text-[#CCB5F0]">
              {modal === 'logout' ? '로그아웃 할까요?' : '회원 탈퇴 할까요?'}
            </h2>
            <div className="relative w-32 h-32">
              <Image src={standingTolli} fill alt="tolli" className="object-contain" />
            </div>
            <p className="text-[0.875rem] leading-4.5 text-[#949494] text-center whitespace-pre-line">
              {modal === 'logout'
                ? '다음에 또 만나요!\n톨리가 기다리고 있을게요!'
                : '탈퇴하면 계정 정보는 복구되지 않아요\n정말 탈퇴하시나요?'}
            </p>
            <div className="flex flex-col w-full gap-3 mt-2">
              <button
                onClick={modal === 'logout' ? handleLogout : handleWithdraw}
                className="w-full h-12 rounded-[1.25rem] text-btn-sm text-black bg-[#CCB5F0]"
              >
                {modal === 'logout' ? '로그아웃하기' : '탈퇴하기'}
              </button>
              <button
                onClick={() => setModal(null)}
                className="w-full h-12 rounded-[1.25rem] text-btn-sm text-black bg-[#D9D9D9]"
              >
                남아있기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 이름 변경 모달 */}
      {modal === 'rename' && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/60"
          onClick={() => setModal(null)}
        >
          <div
            className="flex flex-col w-79.5 rounded-4xl gap-4.5 bg-[#373737]"
            style={{
              paddingTop: '1.0625rem',
              paddingBottom: '1.0625rem',
              paddingLeft: '1.438rem',
              paddingRight: '1.438rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-0.5 pl-4">
              <h2 className="text-[#CCB5F0] font-semibold text-[1.125rem] tracking-tighter">
                이름 편집
              </h2>
              <p className="font-semibold text-[0.875rem] text-[#B0B0B0] tracking-[0.04em]">
                이름을 입력하세요
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="relative w-full h-12.5 rounded-full overflow-hidden bg-white/12">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => {
                    setRenameValue(e.target.value);
                    setRenameError(false);
                  }}
                  maxLength={8}
                  className="absolute inset-0 w-full h-full bg-transparent px-5 text-white font-semibold text-[1rem] outline-none tracking-[0.04em]"
                  autoFocus
                />
              </div>
              {renameError && (
                <span className="text-[#FF6B6B] text-[0.75rem] px-2">
                  한글, 영문, 숫자 1~8자로 입력해주세요
                </span>
              )}
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 h-12 rounded-[1.25rem] font-semibold text-[1rem] text-[#CCB5F0] border border-[#CCB5F0] bg-transparent"
              >
                취소
              </button>
              <button
                onClick={handleRenameSave}
                className="flex-1 h-12 rounded-[1.25rem] font-semibold text-[1rem] bg-[#CCB5F0] text-[#373737]"
              >
                저장
              </button>
            </div>
          </div>
        </div>
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
          onClick={handleAccessToStorage}
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
            onModal={(type) => openModal(type)}
            onRename={() => {
              setRenameValue(nickname ?? '');
              setRenameError(false);
              openModal('rename');
            }}
          />
        </button>
      </header>
    </>
  );
}
