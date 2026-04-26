import { useState, useCallback } from 'react';

export interface PhotoSession {
  templateId: string | null;
  photos: string[];        // data URLs
  currentStep: number;     // 0-2 during capture, 3 = done
}

const INITIAL: PhotoSession = {
  templateId: null,
  photos: [],
  currentStep: 0,
};

export function usePhotoSession() {
  const [session, setSession] = useState<PhotoSession>(INITIAL);

  const selectTemplate = useCallback((id: string) => {
    setSession({ templateId: id, photos: [], currentStep: 0 });
  }, []);

  const addPhoto = useCallback((dataUrl: string) => {
    setSession((prev) => {
      const photos = [...prev.photos, dataUrl];
      return { ...prev, photos, currentStep: photos.length };
    });
  }, []);

  const retakePhoto = useCallback((index: number) => {
    setSession((prev) => {
      const photos = prev.photos.filter((_, i) => i !== index);
      return { ...prev, photos, currentStep: photos.length };
    });
  }, []);

  const reset = useCallback(() => {
    setSession(INITIAL);
  }, []);

  const resetToTemplate = useCallback(() => {
    setSession((prev) => ({ ...prev, photos: [], currentStep: 0 }));
  }, []);

  const isDone = session.currentStep >= 3;

  return { session, selectTemplate, addPhoto, retakePhoto, reset, resetToTemplate, isDone };
}
