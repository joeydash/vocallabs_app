import React from 'react';
import { Modal } from '../shared/Modal';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '../../utils/cn';

interface AudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export function AudioModal({ isOpen, onClose, url, title }: AudioModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title || "Audio Player"}
    >
      <div className={cn(
        "p-3 sm:p-6 bg-white dark:bg-gray-800 rounded-lg",
        "w-full max-w-3xl mx-auto"
      )}>
        <AudioPlayer url={url} autoPlay={true} />
      </div>
    </Modal>
  );
}
