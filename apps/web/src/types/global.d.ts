interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
