import React from 'react';
import { Modal } from '../shared/Modal';
import { ProfileForm } from './ProfileForm';
import { ProfileImage } from './ProfileImage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
    >
      <div className="space-y-8">
        <ProfileImage />
        <ProfileForm onSuccess={onClose} />
      </div>
    </Modal>
  );
}
