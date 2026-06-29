interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
}

declare module '*.webp' {
  import { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.svg' {
  const src: string;
  export default src;
}
