import { useEffect, useState } from 'react';

// 공지 내용이 바뀌면 키를 바꿔서 '다시 보지 않기' 했던 사람에게도 다시 띄운다
const HIDDEN_KEY = 'tolli:notice:together-feature:hidden';
// 닫기만 누른 경우 앱을 다시 켜기 전까지(학습 후 홈 복귀 등) 다시 띄우지 않는다
const CLOSED_KEY = 'tolli:notice:together-feature:closed';

function readFlag(storage: Storage, key: string) {
  try {
    return storage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(storage: Storage, key: string) {
  try {
    storage.setItem(key, '1');
  } catch {
    // 저장소를 못 쓰는 환경이면 이번 화면에서만 닫힌다
  }
}

export function useNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isHidden =
      readFlag(localStorage, HIDDEN_KEY) || readFlag(sessionStorage, CLOSED_KEY);
    setIsOpen(!isHidden);
  }, []);

  const close = () => {
    writeFlag(sessionStorage, CLOSED_KEY);
    setIsOpen(false);
  };

  const hideForever = () => {
    writeFlag(localStorage, HIDDEN_KEY);
    setIsOpen(false);
  };

  return { isOpen, close, hideForever };
}
