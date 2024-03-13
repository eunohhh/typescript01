'use client'
import { LegacyRef, RefObject, createContext } from 'react';

const VideoContext = createContext<RefObject<HTMLVideoElement> | undefined>(undefined);

export default VideoContext;