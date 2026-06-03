import { useState, useRef, useCallback } from "react";

export function useRecord() {
  const [elapsed, setElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;

    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    setIsRecording(true);
  }, []);

  const stop = useCallback(async (): Promise<Blob> => {
    const recorder = mediaRecorderRef.current;

    const blob = await new Promise<Blob>((resolve) => {
      if (!recorder) return resolve(new Blob());
      recorder.onstop = () =>
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType }));
      recorder.stop();
    });

    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());

    setIsRecording(false);
    return blob;
  }, []);

  return { elapsed, start, stop };
}
