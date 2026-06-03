import { useState, useRef, useCallback } from "react";

const BAR_COUNT = 12; // 막대 개수
const MIN_FREQ = 80; // 목소리 하한 (성인 남성 저음)
const MAX_FREQ = 3500; // 목소리 상한 (여성 + 주요 포먼트)
const SENSITIVITY = 1.4; // 민감도 (클수록 작은 소리에도 막대가 큼)

export function useRecord() {
  const [elapsed, setElapsed] = useState(0);
  const [levels, setLevels] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // 파형 그리기
  const tick = useCallback(() => {
    const analyser = analyserRef.current;
    const audioCtx = audioCtxRef.current;
    if (!analyser || !audioCtx) return;

    // 128칸에 소리의 주파수별 세기를 값으로 채우기
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);

    // 주파수(Hz) → 빈 인덱스로 변환 (실제 sampleRate 기준)
    const nyquist = audioCtx.sampleRate / 2;
    const binCount = analyser.frequencyBinCount;
    const hzPerBin = nyquist / binCount;
    const minBin = Math.floor(MIN_FREQ / hzPerBin);
    const maxBin = Math.min(binCount - 1, Math.ceil(MAX_FREQ / hzPerBin));

    // 목소리 구간만 12개 막대로 나누기
    const usableBins = maxBin - minBin + 1;
    const size = Math.max(1, Math.floor(usableBins / BAR_COUNT));

    const next = Array.from({ length: BAR_COUNT }, (_, i) => {
      let sum = 0;
      for (let j = 0; j < size; j++) {
        sum += data[minBin + i * size + j] ?? 0;
      }
      const avg = sum / size / 255; // 0~1 정규화
      return Math.min(1, avg * SENSITIVITY); // 민감도 적용 + 상한 클램프
    });

    // 배열에 담아 화면으로 그리기
    setLevels(next);
    // 다음 프레임에 자신의 tick 함수를 예약해서 계속 그려지도록 하기
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // 녹음 시작하기
  const start = useCallback(async () => {
    // 마이크 연결되었는지 확인
    console.log("[useRecord] mediaDevices?", !!navigator.mediaDevices);
    console.log("[useRecord] before getUserMedia");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("[useRecord] after getUserMedia (granted)");
    streamRef.current = stream;

    // 녹음을 하면 chunks 데이터 채우기
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;

    // 스트림을 analyser에 넣어서 파형 분석에 필요한 세팅하기
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024; // 목소리 구간 해상도 ↑
    analyser.smoothingTimeConstant = 0.75; // 약간의 부드러움 (낮출수록 반응 빠름)
    analyser.minDecibels = -80; // 작은 소리 바닥 ↑ → 민감도 ↑
    analyser.maxDecibels = -30; // 큰 소리 상한
    source.connect(analyser);
    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    rafRef.current = requestAnimationFrame(tick);

    // 녹음 시간 설정
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
  }, [tick]);

  // 녹음 중단
  const stop = useCallback(async (): Promise<Blob> => {
    const recorder = mediaRecorderRef.current;

    // 조각 chunks를 하나의 blob으로 합치기
    const blob = await new Promise<Blob>((resolve) => {
      if (!recorder) return resolve(new Blob());
      recorder.onstop = () =>
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
      recorder.stop();
    });

    // 종료 시, 관련 ref 초기화
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    await audioCtxRef.current?.close();

    return blob;
  }, []);

  return { elapsed, start, stop, levels };
}
