declare global {
  interface Window {
    DD_RUM: {
      onReady: (callback: () => void) => void;
      init: (config: {
        clientToken: string;
        applicationId: string;
        site: string;
        service: string;
        env: string;
        version?: string;
        sessionSampleRate: number;
        sessionReplaySampleRate: number;
        defaultPrivacyLevel: string;
      }) => void;
      addAction: (name: string, attributes?: Record<string, unknown>) => void;
      addError: (error: Error, attributes?: Record<string, unknown>) => void;
      addTiming: (name: string, time?: number) => void;
      setUser: (user: { id?: string; name?: string; email?: string; [key: string]: unknown }) => void;
      setAttribute: (key: string, value: unknown) => void;
      removeAttribute: (key: string) => void;
      getInternalContext: () => Record<string, unknown>;
    };
  }
}

export {}; 