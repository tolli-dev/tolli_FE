"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import IndividualStorage from "./IndividualStorage";
import { QueryFetchPolicy } from "firebase/data-connect";
import { dataConnect } from "@/lib/dataconnect";
import {
  getMyBookmarks,
  getMyCompletions,
  getVerse,
} from "@firebasegen/default-connector";
import { signOut } from "firebase/auth";
import { fireAuth } from "@/firebase/fireAuth";
import { updateNickname, deleteUser } from "@firebasegen/default-connector";
import standingTolli from "../../../../../public/tolli1.webp";
import Image from "next/image";
import ProfileDropdown from "../../_components/ProfileDropdown";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CompletedVerse {
  verse: {
    id: number;
    reference: string;
    fullText: string;
  };
}

interface Props {
  done: boolean;
  nickname?: string;
}

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{1,8}$/;

type ModalType = "logout" | "withdraw" | "rename" | null;

export default function StorageView({ done, nickname }: Props) {
  const router = useRouter();
  const [searchVerse, setSearchVerse] = useState("");
  const [myCompletions, setMyCompletions] = useState<CompletedVerse[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [renameValue, setRenameValue] = useState(nickname ?? "");
  const [renameError, setRenameError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleLogout = async () => {
    setActionLoading(true);
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "SET_LOGGED_OUT" }),
    );
    await signOut(fireAuth);
    router.push("/login");
  };

  const handleWithdraw = async () => {
    setActionLoading(true);
    const idToken = await fireAuth.currentUser?.getIdToken();
    await deleteUser(dataConnect);
    if (idToken) {
      await fetch("/api/auth/unregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    }
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "SET_LOGGED_OUT" }),
    );
    await signOut(fireAuth);
    router.push("/login");
  };

  const handleRenameSave = async () => {
    if (!NICKNAME_REGEX.test(renameValue)) {
      setRenameError(true);
      return;
    }
    setActionLoading(true);
    await updateNickname(dataConnect, { nickname: renameValue });
    window.location.href = "/dashboard";
  };

  const openModal = (type: ModalType) => {
    setIsDropdownOpen(false);
    setModal(type);
  };

  useEffect(() => {
    const getMyStorage = async () => {
      setLoading(true);
      const { data } = await getMyCompletions(dataConnect);
      const [verses, { data: bookmarksData }] = await Promise.all([
        Promise.all(
          data.studyCompletions.map(async (value) => {
            const { data: verseData } = await getVerse(dataConnect, {
              id: value.verse.id,
            });
            return {
              verse: {
                id: verseData.verse?.id ?? value.verse.id,
                reference: verseData.verse?.reference ?? value.verse.reference,
                fullText: verseData.verse?.fullText ?? "",
              },
            };
          }),
        ),
        getMyBookmarks(dataConnect, {
          fetchPolicy: QueryFetchPolicy.SERVER_ONLY,
        }),
      ]);
      setBookmarkedIds(new Set(bookmarksData.bookmarks.map((b) => b.verse.id)));
      setMyCompletions(verses);
      setLoading(false);
    };
    getMyStorage();
  }, []);

  const handleSearch = (value: string) => {
    setSearchVerse(value);
  };

  const filteredData = myCompletions.filter((item) => {
    return (
      item.verse.reference.includes(searchVerse) ||
      item.verse.fullText.includes(searchVerse)
    );
  });

  return (
    <section
      className={`
        dashboard-layout
        flex flex-col w-full flex-1 min-h-0 justify-between items-center
        px-[2.688rem] py-[clamp(2rem,5dvh,5.313rem)]
        ${done ? "is-done" : ""}
      `}
    >
      <>
        {(loading || actionLoading) && <LoadingSpinner />}

        {isDropdownOpen && !modal && (
          <div
            className="fixed inset-0 z-40 bg-black/45"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {/* 로그아웃 / 회원탈퇴 모달 */}
        {(modal === "logout" || modal === "withdraw") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92">
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
              <div className="flex flex-col w-full gap-3 mt-2">
                <button
                  onClick={modal === "logout" ? handleLogout : handleWithdraw}
                  className="w-full h-12 rounded-[1.25rem] text-btn-sm text-black bg-[#CCB5F0]"
                >
                  {modal === "logout" ? "로그아웃하기" : "탈퇴하기"}
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
        {modal === "rename" && (
          <div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/60"
            onClick={() => setModal(null)}
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

        <header className="flex flex-row items-center w-full h-[clamp(1.125rem,5vw,1.5rem)] gap-[clamp(1.5rem,7vw,2.5rem)] mb-[clamp(0.5rem,2vw,0.75rem)] z-50">
          <div className="flex flex-row items-center">
            <Icon
              onClick={() => router.back()}
              icon="fluent:ios-arrow-24-filled"
              className="shrink-0 w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)] text-[#CCB5F0] cursor-pointer mr-auto"
            />
            <div className="relative flex-1 min-w-0">
              <Icon
                aria-hidden
                icon="tabler:search"
                className="pointer-events-none absolute left-[0.75rem] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#B2B2B2]"
              />
              <input
                onChange={(e) => handleSearch(e.target.value)}
                type="search"
                aria-label="말씀 찾기"
                title="말씀 찾기"
                className="
                w-full h-[clamp(1.875rem,8vw,2.25rem)] rounded-full 
                border border-[#B2B2B2] bg-transparent 
                pl-[2.125rem] pr-[0.875rem] text-[clamp(0.75rem,3.5vw,0.875rem)] text-[#353535] 
                placeholder:text-[#B2B2B2] focus:outline-none focus:border-[#CCB5F0]"
              />
            </div>
          </div>
          <Icon
            icon="tabler:archive-filled"
            className="shrink-0 w-[clamp(1.125rem,5vw,1.5rem)] h-[clamp(1.125rem,5vw,1.5rem)]"
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
                setRenameValue(nickname ?? "");
                setRenameError(false);
                openModal("rename");
              }}
            />
          </button>
        </header>
      </>

      <div className="flex flex-col w-full shrink-0 mb-[clamp(0.625rem,3vw,0.9375rem)]">
        <h1 className="text-dashboard-h1">{nickname}의 보관함</h1>
        <h2 className="font-light text-[clamp(0.6875rem,3vw,0.75rem)] leading-[1.6] tracking-[-2%] text-[#353535]">
          지금까지 완료한 말씀들을 확인하고, 다시 복습할 수 있어요
        </h2>
      </div>

      {!searchVerse && myCompletions.length === 0 && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              아직 완료한 말씀 구절이 없어요
            </p>
          </div>
        </main>
      )}

      {!searchVerse && myCompletions.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] overflow-auto bookmarks">
            {myCompletions.map((value) => (
              <IndividualStorage
                key={value.verse.id}
                bookmarkedIds={bookmarkedIds}
                verse={value.verse}
              />
            ))}
          </div>
        </main>
      )}

      {searchVerse && filteredData.length === 0 && (
        <main className="w-full flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="font-light text-[clamp(0.8125rem,3.8vw,0.9375rem)] leading-[1.55] tracking-[-2%] text-[#353535]">
              검색 결과를 찾을 수 없습니다
            </p>
          </div>
        </main>
      )}

      {searchVerse && filteredData.length !== 0 && (
        <main className="w-full flex-1 min-h-0 flex flex-col items-center">
          <div className="flex flex-col w-full flex-1 min-h-0 gap-[clamp(0.75rem,3.5vw,1rem)] pr-[clamp(0.375rem,2vw,0.5625rem)] overflow-auto bookmarks">
            {filteredData.map((value) => (
              <IndividualStorage
                key={value.verse.id}
                bookmarkedIds={bookmarkedIds}
                verse={value.verse}
              />
            ))}
          </div>
        </main>
      )}
    </section>
  );
}
