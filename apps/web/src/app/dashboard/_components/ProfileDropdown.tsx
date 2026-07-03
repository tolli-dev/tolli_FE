"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAlarm, setAlarmEnabled } from "@/lib/alarm";

const ChevronRight = () => (
  <svg
    width="9"
    height="15"
    viewBox="0 0 9 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.00083 13.4531L7.22656 7.2274L1.00084 1.00167"
      stroke="#C1C1C1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="15"
    height="9"
    viewBox="0 0 15 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1.00083L7.22573 7.22656L13.4515 1.00083"
      stroke="#C1C1C1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type MenuKey =
  | "profile"
  | "notification"
  | "account"
  | "feedback"
  | "terms"
  | null;

type SubItem =
  | { type: "link"; label: string; href: string }
  | { type: "toggle"; label: string; key: string }
  | { type: "external"; label: string; url: string }
  | { type: "modal"; label: string; modal: "logout" | "withdraw" }
  | { type: "rename"; label: string };

type MenuItem = {
  key: Exclude<MenuKey, null>;
  label: string;
  icon: string;
  subItems?: SubItem[];
};

const MENU_ITEMS: MenuItem[] = [
  {
    key: "profile",
    label: "프로필 편집",
    icon: "/icons/dropdown/profile.svg",
    subItems: [{ type: "rename", label: "이름 변경" }],
  },
  {
    key: "notification",
    label: "알림설정",
    icon: "/icons/dropdown/notification.svg",
    subItems: [
      { type: "toggle", label: "알림 On/Off", key: "notificationEnabled" },
      {
        type: "link",
        label: "알림 시간 설정",
        href: "/signup/set-alarm-time",
      },
    ],
  },
  {
    key: "account",
    label: "계정관리",
    icon: "/icons/dropdown/account.svg",
    subItems: [
      { type: "modal", label: "로그아웃", modal: "logout" },
      { type: "modal", label: "회원 탈퇴", modal: "withdraw" },
    ],
  },
  {
    key: "feedback",
    label: "피드백 보내기",
    icon: "/icons/dropdown/feedback.svg",
  },
  {
    key: "terms",
    label: "약관",
    icon: "/icons/dropdown/terms.svg",
    subItems: [
      {
        type: "external",
        label: "이용약관",
        url: "https://polite-swift-c6b.notion.site/tolli-3724b4ce693880cd8ee8e17d36cd0353?pvs=143",
      },
      {
        type: "external",
        label: "개인정보 처리방침",
        url: "https://polite-swift-c6b.notion.site/tolli-3724b4ce69388037a658f35884348c2a?pvs=143",
      },
    ],
  },
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nickname?: string;
  onModal?: (type: "logout" | "withdraw") => void;
  onRename?: () => void;
  notificationEnabled: boolean | null;
  onNotificationChange: (enabled: boolean) => void;
};

const ProfileDropdown = forwardRef<HTMLDivElement, Props>(function ProfileDropdown({
  isOpen,
  onClose,
  nickname = "",
  onModal,
  onRename,
  notificationEnabled,
  onNotificationChange,
}, ref) {
  const menuListRef = useRef<HTMLDivElement>(null);
  const menuRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const router = useRouter();
  const [expandedKey, setExpandedKey] = useState<MenuKey>(null);
  const [subPanelTops, setSubPanelTops] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isOpen) {
      setExpandedKey(null);
      return;
    }
    // 드롭다운을 열 때마다 서버에서 현재 알람 on/off 상태를 가져온다
    getAlarm().then((alarm) => {
      if (alarm) onNotificationChange(alarm.enabled);
    });
  }, [isOpen, onNotificationChange]);

  const handleMenuClick = (item: MenuItem) => {
    if (item.key === "feedback") {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: "OPEN_EXTERNAL_URL",
          url: "https://walla.my/survey/2kZYBBzNVfjI4RYMcFJ3",
        }),
      );
      onClose();
      return;
    }
    if (!item.subItems) return;

    const btn = menuRefs.current[item.key];
    if (btn) {
      const top = btn.offsetTop + btn.offsetHeight;
      setSubPanelTops((prev) => ({ ...prev, [item.key]: top }));
    }

    setExpandedKey((prev) => (prev === item.key ? null : item.key));
  };

  const handleSubItemClick = (subItem: SubItem) => {
    if (subItem.type === "link") {
      router.push(subItem.href);
      onClose();
    } else if (subItem.type === "external") {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: "OPEN_EXTERNAL_URL", url: subItem.url }),
      );
      onClose();
    } else if (subItem.type === "modal") {
      onModal?.(subItem.modal);
    } else if (subItem.type === "rename") {
      onClose();
      onRename?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-[15.563rem]"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="rounded-4xl px-4 py-3"
        style={{
          animation: 'dropdown-enter 0.2s cubic-bezier(0.4,0,0.2,1) forwards',
          backgroundColor: "rgba(217,217,217,0.15)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 1px rgba(0,0,0,0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3 px-1 py-3">
          <div
            className="w-[2.063rem] h-[2.063rem] rounded-full flex items-center justify-center shrink-0 overflow-hidden"
            style={{ backgroundColor: "#D9D9D9" }}
          >
            <Image
              src="/tolli1.webp"
              alt="tolli"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <span className="text-white font-light text-[1rem] tracking-[-0.02em]">
            {nickname}
          </span>
        </div>

        <div ref={menuListRef} className="relative flex flex-col">
          {MENU_ITEMS.map((item) => {
            const isExpanded = expandedKey === item.key;
            const subPanelTop = subPanelTops[item.key] ?? 0;
            return (
              <div key={item.key}>
                <button
                  ref={(el) => {
                    menuRefs.current[item.key] = el;
                  }}
                  onClick={() => handleMenuClick(item)}
                  className="w-full flex items-center justify-between px-2 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Image src={item.icon} alt="" width={20} height={20} className="shrink-0" />
                    <span
                      className="text-white text-[1rem] tracking-[-0.02em]"
                      style={{ fontWeight: isExpanded ? 500 : 300 }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown /> : <ChevronRight />}
                </button>

                {isExpanded && item.subItems && (
                  <div
                    className="absolute rounded-4xl px-4 z-10"
                    style={{
                      top: subPanelTop,
                      right: "-1rem",
                      width: "calc(100% + 4rem)",
                      paddingTop: "1.4375rem",
                      paddingBottom: "1.4375rem",
                      backgroundColor: "rgba(60,60,60,0.85)",
                      border: "1px solid #CCB5F0",
                      animation: 'dropdown-enter 0.2s cubic-bezier(0.4,0,0.2,1) forwards',
                    }}
                  >
                    <button
                      onClick={() => setExpandedKey(null)}
                      className="w-full flex items-center justify-between pb-3 border-b border-[#959595]/50"
                    >
                      <div className="flex items-center gap-2.5">
                        <Image src={item.icon} alt="" width={20} height={20} className="shrink-0" />
                        <span className="text-white font-medium text-[1rem] tracking-[-0.02em]">
                          {item.label}
                        </span>
                      </div>
                      <ChevronDown />
                    </button>

                    <div className="flex flex-col mt-1">
                      {item.subItems.map((subItem) => (
                        <div key={subItem.label}>
                          {subItem.type === "toggle" ? (
                            <div className="flex items-center justify-between px-1 py-3">
                              <span className="text-white font-light text-[1rem] tracking-[-0.02em]">
                                {subItem.label}
                              </span>
                              <button
                                title="알람 설정"
                                disabled={notificationEnabled === null}
                                onClick={async () => {
                                  if (!notificationEnabled) {
                                    // OS 알림 권한 요청(푸시 수신에 필요) 후, 서버 알람 켜기
                                    window.ReactNativeWebView?.postMessage(
                                      JSON.stringify({
                                        type: "REQUEST_NOTIFICATION_PERMISSION",
                                      }),
                                    );
                                    const result = await setAlarmEnabled(true);
                                    if (result.needsTime) {
                                      // 저장된 시간이 없으면 시간 설정 화면으로
                                      router.push("/signup/set-alarm-time");
                                      onClose();
                                    } else if (result.ok) {
                                      onNotificationChange(true);
                                    }
                                  } else {
                                    await setAlarmEnabled(false);
                                    onNotificationChange(false);
                                  }
                                }}
                                className="relative w-11 h-6.5 rounded-full transition-colors duration-200"
                                style={{
                                  backgroundColor: notificationEnabled
                                    ? "rgba(204,181,240,0.35)"
                                    : "rgba(217,217,217,0.08)",
                                  boxShadow: notificationEnabled
                                    ? "inset 0 0 0 1px rgba(204,181,240,0.6)"
                                    : "inset 0 0 0 1px rgba(255,255,255,0.15)",
                                  backdropFilter: "blur(4px)",
                                  opacity: notificationEnabled === null ? 0.5 : 1,
                                }}
                              >
                                <span
                                  className="absolute top-0.75 w-5 h-5 rounded-full transition-all duration-200"
                                  style={{
                                    backgroundColor: notificationEnabled
                                      ? "#CCB5F0"
                                      : "rgba(255,255,255,0.5)",
                                    left: notificationEnabled
                                      ? "calc(100% - 1.375rem)"
                                      : "0.125rem",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                                  }}
                                />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSubItemClick(subItem)}
                              className="w-full flex items-center justify-between px-1 py-3"
                            >
                              <span className="text-white font-light text-[1rem] tracking-[-0.02em]">
                                {subItem.label}
                              </span>
                              <ChevronRight />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default ProfileDropdown;
