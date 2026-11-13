/** SPDX-License-Identifier: Apache-2.0 */
import React, { useCallback, useState } from 'react';
import type { ThrowableFile } from './shotdrop/shotPhysics';
import { SoccerGoalUploadScene } from './shotdrop/SoccerGoalUploadScene';
import { ShotDropBlockShell, type ShotDropDensity } from './shotdrop/ShotDropBlockShell';

export function SoccerGoalUploadBlock({ density = 'normal' }: { density?: ShotDropDensity }) {
  const [files, setFiles] = useState<ThrowableFile[]>([]);
  const [keeperActive, setKeeperActive] = useState(false);
  const addFile = useCallback((file: ThrowableFile) => setFiles((current) => [file, ...current]), []);
  const removeFile = useCallback((id: string) => setFiles((current) => current.filter((file) => file.id !== id)), []);
  const clearFiles = useCallback(() => setFiles([]), []);

  return (
    <ShotDropBlockShell blockName="soccer" files={files} onRemove={removeFile} onClear={clearFiles}>
      <SoccerGoalUploadScene density={density} uploadedFiles={files} onFileUploaded={addFile} keeperActive={keeperActive} onToggleKeeper={() => setKeeperActive((current) => !current)} />
    </ShotDropBlockShell>
  );
}

export default SoccerGoalUploadBlock;
