import React from 'react';
import { SharedDriveGrid } from '../SharedDriveGrid';
import { DriveNode } from '../../types';

interface SharedDriveBlockProps {
  items: DriveNode[];
  onResetItems: () => void;
}

export function SharedDriveBlock({ items, onResetItems }: SharedDriveBlockProps) {
  return (
    <div className="w-full space-y-4">
      <SharedDriveGrid initialItems={items} onResetToDefault={onResetItems} />
    </div>
  );
}
