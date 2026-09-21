export interface GommageConfig {
  text?: string;
  autoStart?: boolean;
  petalCount?: number;
  dustCount?: number;
}

export interface GommageStatus {
  progress: number;
  isAnimating: boolean;
  isWebGPUSupported: boolean;
  error?: string;
}
