'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { GommageExperience } from '@/webgpu/gommageExperience';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface WebGPUCanvasHandle {
  setScrollProgress: (progress: number, velocity?: number) => void;
  /** Pause/resume drawing when the hero scrolls out of / back into view. */
  setVisible: (visible: boolean) => void;
}

interface WebGPUCanvasProps {
  onProgressUpdate?: (progress: number) => void;
  text?: string;
}

export const WebGPUCanvas = forwardRef<WebGPUCanvasHandle, WebGPUCanvasProps>(
  ({ onProgressUpdate, text = 'EMRE MERIC' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const experienceRef = useRef<GommageExperience | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const callbacksRef = useRef({ onProgressUpdate });
    useEffect(() => {
      callbacksRef.current = { onProgressUpdate };
    }, [onProgressUpdate]);

    useImperativeHandle(ref, () => ({
      setScrollProgress: (progress: number, velocity = 0) => {
        experienceRef.current?.setScrollProgress(progress, velocity);
      },
      setVisible: (visible: boolean) => {
        experienceRef.current?.setVisible(visible);
      },
    }));

    useEffect(() => {
      let isMounted = true;
      const container = containerRef.current;
      if (!container) return;

      const experience = new GommageExperience(
        {
          onProgressUpdate: (p) => callbacksRef.current.onProgressUpdate?.(p),
          onError: (err) => {
            if (isMounted) {
              setErrorMessage(
                err.message || 'WebGPU or WebGL2 is not supported or failed to initialize.'
              );
              setIsLoading(false);
            }
          },
        },
        text
      );

      experienceRef.current = experience;

      experience
        .initialize(container)
        .then(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setErrorMessage(err.message || 'WebGPU initialization failed.');
            setIsLoading(false);
          }
        });

      return () => {
        isMounted = false;
        experience.dispose();
        experienceRef.current = null;
      };
    }, [text]);

    return (
      <div className="relative w-full h-full overflow-hidden select-none bg-transparent">
        {/* Canvas DOM Container */}
        <div ref={containerRef} className="w-full h-full absolute inset-0 z-0" />

        {/* Cream Luxury Loading Overlay */}
        {isLoading && !errorMessage && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#F5EFE6] transition-opacity duration-700">
            <div className="w-9 h-9 border border-[#161413]/20 flex items-center justify-center mb-3">
              <Loader2 className="w-4 h-4 text-[#161413] animate-spin" />
            </div>
            <div className="font-syne text-[11px] tracking-[0.35em] uppercase text-[#161413] font-bold">
              EMRE MERIC
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {errorMessage && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-[#F5EFE6]">
            <AlertCircle className="w-8 h-8 text-amber-800 mb-3" />
            <h3 className="font-syne text-base text-[#161413] tracking-widest uppercase mb-2 font-bold">
              WebGPU Context Notice
            </h3>
            <p className="text-xs text-[#584E44] max-w-md mb-4 leading-relaxed">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    );
  }
);

WebGPUCanvas.displayName = 'WebGPUCanvas';

export default WebGPUCanvas;
