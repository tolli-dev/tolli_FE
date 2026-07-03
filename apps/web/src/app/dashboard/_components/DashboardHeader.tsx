"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { updateNickname, deleteUser } from "@firebasegen/default-connector";
import { fireAuth } from "@/firebase/fireAuth";
import { dataConnect, terminateDataConnect } from "@/lib/dataconnect";
import ProfileDropdown from "./ProfileDropdown";
import standingTolli from "../../../../public/tolli1.webp";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,8}$/;

type ModalType = "logout" | "withdraw" | "rename" | null;

type Props = {
  nickname?: string;
  done?: boolean;
};

export default function DashboardHeader({ nickname, done = false }: Props) {
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        profileBtnRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
      setIsDropdownOpen(false);
    };
    if (isDropdownOpen) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isDropdownOpen]);
  const [modal, setModal] = useState<ModalType>(null);
  const [modalClosing, setModalClosing] = useState(false);
  const [renameValue, setRenameValue] = useState(nickname ?? "");
  const [renameError, setRenameError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [renameApiError, setRenameApiError] = useState<string | null>(null);
  const router = useRouter();

  const closeModal = () => {
    setActionError(null);
    setRenameApiError(null);
    setModalClosing(true);
    setTimeout(() => {
      setModal(null);
      setModalClosing(false);
    }, 200);
  };

  const handleAccessToStorage = () => {
    const params = new URLSearchParams({ isDone: String(done) });
    if (nickname) params.set("nickname", nickname);
    router.push(`/dashboard/storage?${params.toString()}`);
  };

  const handleLogout = async () => {
    setActionLoading(true);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "SET_LOGGED_OUT" }),
    );
    try {
      await fetch("/api/push/unregister", { method: "POST" });
      await terminateDataConnect();
      await fetch("/api/auth/clear-session", { method: "POST" });
      await signOut(fireAuth);
    } catch (error) {
      console.error("로그아웃 에러", error);
    }
    router.push("/login");
  };

  const handleWithdraw = async () => {
    setActionLoading(true);
    setActionError(null);
    const idToken = await fireAuth.currentUser?.getIdToken();

    try {
      await deleteUser(dataConnect);
    } catch (error) {
      console.error("계정 삭제 실패", error);
      setActionLoading(false);
      setActionError("탈퇴 중 오류가 발생했어요. 다시 시도해주세요.");
      return;
    }

    if (idToken) {
      await fetch("/api/auth/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    }
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "CLEAR_ALL_DATA" }),
    );
    try {
      await fetch("/api/push/unregister", { method: "POST" });
      await terminateDataConnect();
      await fetch("/api/auth/clear-session", { method: "POST" });
      await signOut(fireAuth);
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
    router.push("/login");
  };

  const handleRenameSave = async () => {
    if (!NICKNAME_REGEX.test(renameValue)) {
      setRenameError(true);
      return;
    }
    setActionLoading(true);
    setRenameApiError(null);
    try {
      await updateNickname(dataConnect, { nickname: renameValue });
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("닉네임 재설정 에러", error);
      setActionLoading(false);
      setRenameApiError(
        "닉네임 재설정 중 오류가 발생했어요. 다시 시도해주세요.",
      );
    }
  };

  const openModal = (type: ModalType) => {
    setIsDropdownOpen(false);
    setModal(type);
  };

  return (
    <>
      {actionLoading && <LoadingSpinner />}

      {isDropdownOpen && !modal && (
        <div
          className="fixed inset-0 z-40 bg-black/45"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {(modal === "logout" || modal === "withdraw") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
          style={{
            animation: `${modalClosing ? "fade-out-modal" : "fade-in-modal"} 0.2s ease forwards`,
          }}
        >
          <div className="w-[80vw] max-w-88 rounded-4xl overflow-hidden flex flex-col items-center px-6 pt-8 pb-8 gap-4 bg-[#1e1e1e]">
            <h2 className="text-[1.1875rem] leading-7.75 text-[#CCB5F0] whitespace-nowrap">
              {modal === "logout" ? "로그아웃 할까요?" : "회원 탈퇴 할까요?"}
            </h2>
            <div className="relative w-32 h-32">
              <Image
                src={standingTolli}
                fill
                alt="tolli"
                className="object-contain"
              />
            </div>
            <p className="text-[0.875rem] leading-4.5 text-[#949494] text-center whitespace-pre-line">
              {modal === "logout"
                ? "다음에 또 만나요!\n톨리가 기다리고 있을게요!"
                : "탈퇴하면 계정 정보는 복구되지 않아요\n정말 탈퇴하시나요?"}
            </p>
            {actionError && (
              <p className="text-red-400 text-[0.8125rem] text-center -mb-1">
                {actionError}
              </p>
            )}
            <div className="flex flex-col w-full gap-3 mt-2">
              <button
                onClick={modal === "logout" ? handleLogout : handleWithdraw}
                disabled={actionLoading}
                className="w-full h-12 rounded-[1.25rem] text-btn-sm text-black bg-[#CCB5F0] disabled:opacity-50"
              >
                {modal === "logout" ? "로그아웃하기" : "탈퇴하기"}
              </button>
              <button
                onClick={closeModal}
                className="w-full h-12 rounded-[1.25rem] text-btn-sm text-black bg-[#D9D9D9]"
              >
                남아있기
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "rename" && (
        <div
          className="fixed inset-0 z-200 flex items-center justify-center bg-black/60"
          style={{
            animation: `${modalClosing ? "fade-out-modal" : "fade-in-modal"} 0.2s ease forwards`,
          }}
          onClick={closeModal}
        >
          <div
            className="flex flex-col w-79.5 rounded-4xl gap-4.5 bg-[#373737]"
            style={{
              paddingTop: "1.0625rem",
              paddingBottom: "1.0625rem",
              paddingLeft: "1.438rem",
              paddingRight: "1.438rem",
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
                  aria-label="이름 입력"
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
                <span className="text-[#FF6B6B] text-[0.75rem] px-2 whitespace-nowrap">
                  한글, 영문, 숫자 1~8자로 입력해주세요
                </span>
              )}
            </div>

            {renameApiError && (
              <p className="text-red-400 text-[0.75rem] text-center px-2 whitespace-nowrap">
                {renameApiError}
              </p>
            )}
            <div className="flex gap-2.5">
              <button
                onClick={closeModal}
                className="flex-1 h-12 rounded-[1.25rem] font-semibold text-[1rem] text-[#CCB5F0] border border-[#CCB5F0] bg-transparent"
              >
                취소
              </button>
              <button
                onClick={handleRenameSave}
                disabled={actionLoading}
                className="flex-1 h-12 rounded-[1.25rem] font-semibold text-[1rem] bg-[#CCB5F0] text-[#373737] disabled:opacity-50"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <header
        className="
          absolute inset-0
          flex flex-row justify-end items-center w-full
          gap-[clamp(1.5rem,7vw,2.5rem)]
          z-50
        "
      >
        <svg
          onClick={handleAccessToStorage}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
          aria-hidden="true"
        >
          <path d="M3 3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z" />
          <path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3zm7 2h4a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2z" />
        </svg>
        <button
          ref={profileBtnRef}
          onClick={() => setIsDropdownOpen((v) => !v)}
          className="relative"
          aria-label="프로필 메뉴"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
            aria-hidden="true"
          >
            <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2z" />
            <path d="M2 20c0-4.418 4.477-8 10-8s10 3.582 10 8H2z" />
          </svg>
          <ProfileDropdown
            ref={dropdownRef}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            nickname={nickname}
            onModal={(type) => openModal(type)}
            onRename={() => {
              setRenameValue(nickname ?? "");
              setRenameError(false);
              openModal("rename");
            }}
            notificationEnabled={notificationEnabled}
            onNotificationChange={setNotificationEnabled}
          />
        </button>
      </header>
    </>
  );
}
