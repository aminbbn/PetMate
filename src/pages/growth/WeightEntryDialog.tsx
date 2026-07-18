import React from 'react';
import { MotionDialog } from '../../motion/MotionDialog';
import { WeightEntry } from './growthTypes';
import { WeightEntryForm } from './WeightEntryForm';

interface WeightEntryDialogProps {
  isOpen: boolean;
  entry?: WeightEntry;
  onClose: () => void;
  onSuccess: () => void;
}

export const WeightEntryDialog: React.FC<WeightEntryDialogProps> = ({
  isOpen,
  entry,
  onClose,
  onSuccess,
}) => {
  return (
    <MotionDialog
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="p-6 md:p-8"
    >
      <WeightEntryForm
        entry={entry}
        onSuccess={onSuccess}
        onCancel={onClose}
      />
    </MotionDialog>
  );
};
