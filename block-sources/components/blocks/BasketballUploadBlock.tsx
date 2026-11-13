/** SPDX-License-Identifier: Apache-2.0 */
import React, { useCallback, useState } from 'react';
import type { ThrowableFile } from './shotdrop/shotPhysics';
import { BasketballUploadScene } from './shotdrop/BasketballUploadScene';
import { ShotDropBlockShell, ShotDropToggle, type ShotDropDensity } from './shotdrop/ShotDropBlockShell';

export function BasketballUploadBlock({ density = 'normal' }: { density?: ShotDropDensity }) {
  const [files, setFiles] = useState<ThrowableFile[]>([]);
  const [movingHoop, setMovingHoop] = useState(false);
  const [aimAssist, setAimAssist] = useState(true);
  const addFile = useCallback((file: ThrowableFile) => setFiles((current) => [file, ...current]), []);
  const removeFile = useCallback((id: string) => setFiles((current) => current.filter((file) => file.id !== id)), []);
  const clearFiles = useCallback(() => setFiles([]), []);

  return (
    <ShotDropBlockShell blockName="basketball" files={files} onRemove={removeFile} onClear={clearFiles} controls={<ShotDropToggle label="조준 보정" value={aimAssist ? '스마트' : '수동'} pressed={aimAssist} onClick={() => setAimAssist((current) => !current)} />}>
      <BasketballUploadScene density={density} uploadedFiles={files} onFileUploaded={addFile} movingHoop={movingHoop} onToggleMovingHoop={() => setMovingHoop((current) => !current)} aimAssist={aimAssist} />
    </ShotDropBlockShell>
  );
}

export default BasketballUploadBlock;
