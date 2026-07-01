'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useOnboardingPermissions } from './hooks/useOnboardingPermissions';

const ALARM_STORAGE_KEY = 'onboardingAlarm';

interface StoredAlarm {
  hour: number;
  minute: number;
}

function readStoredAlarm(): StoredAlarm | null {
  try {
    const raw = sessionStorage.getItem(ALARM_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAlarm;
    if (typeof parsed.hour !== 'number' || typeof parsed.minute !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function OnboardingPermissionsPage() {
  const router = useRouter();
  const hasCompleted = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleAllGranted = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    setIsCompleting(true);

    const alarm = readStoredAlarm();
    if (alarm) {
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({ type: 'SAVE_ALARM_TIME', hour: alarm.hour, minute: alarm.minute }),
      );
    }
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'CLEAR_PERMISSION_PENDING' }));
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_LOGGED_IN' }));
    sessionStorage.removeItem(ALARM_STORAGE_KEY);
    sessionStorage.removeItem('permissionsReloginMode');
    router.replace('/dashboard');
  }, [router]);

  const { step, needSettings, blocked, initGate, requestNotification, requestMic, openAppSettings } =
    useOnboardingPermissions(handleAllGranted);

  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'SET_PERMISSION_PENDING' }));
    initGate();
  }, [started, initGate]);

  const guideText =
    step === 'mic'
      ? '녹음 기능을 위해 마이크 권한이 필요해요'
      : '매일 말씀을 알려드리려면 알림 권한이 필요해요';

  const settingsText =
    step === 'mic'
      ? '마이크 권한이 꺼져 있어요. 설정에서 허용해주세요.'
      : '알림 권한이 꺼져 있어요. 설정에서 허용해주세요.';

  const retry = step === 'mic' ? requestMic : requestNotification;
  const showSettings = needSettings || blocked;

  const notificationDone = step === 'mic' || step === 'granted';
  const micActive = step === 'mic';

  const activeIcon = micActive ? 'fluent:mic-28-filled' : 'fluent:alert-28-filled';

  return (
    <>
      {isCompleting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
          <LoadingSpinner />
        </div>
      )}
      <section className="flex flex-col w-full flex-1 justify-between items-center px-[2.688rem] pt-[clamp(2.5rem,8dvh,5rem)] pb-[clamp(2rem,5dvh,5.313rem)]">
      <div className="flex flex-col items-center w-full gap-[0.5rem]">
        <h1 className="text-h1 text-primary-50 text-center whitespace-nowrap">거의 다 왔어요!</h1>
        <h2 className="text-h2 text-surface-200 text-center whitespace-nowrap">{guideText}</h2>
      </div>

      <div className="flex flex-col items-center w-full flex-1 justify-center gap-[clamp(2rem,6dvh,3.5rem)]">
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-[9.5rem] h-[9.5rem] rounded-full blur-2xl opacity-40"
            style={{ background: 'radial-gradient(circle, #CCB5F0 0%, transparent 70%)' }}
          />
          <div className="relative flex items-center justify-center w-[7.5rem] h-[7.5rem] rounded-full bg-linear-to-br from-white/10 via-white/5 to-transparent border border-white/10">
            <div className="flex items-center justify-center w-[5.5rem] h-[5.5rem] rounded-full bg-primary-75/15">
              <Icon icon={activeIcon} className="w-[2.75rem] h-[2.75rem] text-primary-75" />
            </div>
          </div>
        </div>

        <ul className="flex flex-col w-full max-w-[19.688rem] gap-[0.75rem]">
          <PermissionRow
            icon="fluent:alert-28-filled"
            label="알림 권한"
            state={notificationDone ? 'done' : 'active'}
          />
          <PermissionRow
            icon="fluent:mic-28-filled"
            label="마이크 권한"
            state={step === 'granted' ? 'done' : micActive ? 'active' : 'pending'}
          />
        </ul>
      </div>

      <div className="flex flex-col items-center w-full gap-[0.75rem]">
        <p className="text-surface-200 text-b2 text-center whitespace-nowrap min-h-[1.25rem]">
          {showSettings ? settingsText : ''}
        </p>
        <button
          type="button"
          onClick={showSettings ? openAppSettings : retry}
          className="w-full max-w-[19.688rem] h-12 text-btn-lg text-bg bg-primary-75 rounded-[1.25rem] whitespace-nowrap transition-opacity active:opacity-80"
        >
          {showSettings ? '설정으로 이동' : '권한 허용하기'}
        </button>
        </div>
      </section>
    </>
  );
}

function PermissionRow({
  icon,
  label,
  state,
}: {
  icon: string;
  label: string;
  state: 'done' | 'active' | 'pending';
}) {
  const isDone = state === 'done';
  const isActive = state === 'active';

  return (
    <li
      className={`flex items-center gap-[0.875rem] w-full h-[3.25rem] px-[1rem] rounded-[1rem] border transition-colors ${
        isActive
          ? 'border-primary-75/50 bg-primary-75/10'
          : 'border-white/8 bg-white/[0.03]'
      }`}
    >
      <Icon
        icon={icon}
        className={`w-[1.375rem] h-[1.375rem] shrink-0 ${
          isDone || isActive ? 'text-primary-75' : 'text-surface-200'
        }`}
      />
      <span
        className={`flex-1 text-btn-sm ${
          isDone || isActive ? 'text-surface-50' : 'text-surface-200'
        }`}
      >
        {label}
      </span>
      <span className="flex items-center justify-center w-[1.25rem] h-[1.25rem] shrink-0">
        {isDone ? (
          <Icon icon="fluent:checkmark-circle-28-filled" className="w-[1.25rem] h-[1.25rem] text-primary-75" />
        ) : (
          <span
            className={`h-[0.5rem] w-[0.5rem] rounded-full ${
              isActive ? 'bg-primary-75' : 'bg-surface-100'
            }`}
          />
        )}
      </span>
    </li>
  );
}
