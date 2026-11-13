/** SPDX-License-Identifier: Apache-2.0 */
import React, { useCallback, useState } from 'react';
import type { ThrowableFile } from './shotdrop/shotPhysics';
import { TrashCanUploadScene } from './shotdrop/TrashCanUploadScene';
import { ShotDropBlockShell, ShotDropToggle, type ShotDropDensity } from './shotdrop/ShotDropBlockShell';

export function TrashCanUploadBlock({ density = 'normal' }: { density?: ShotDropDensity }) {
  const [files, setFiles] = useState<ThrowableFile[]>([]);
  const [windActive, setWindActive] = useState(false);
  const [aimAssist, setAimAssist] = useState(true);
  const addFile = useCallback((file: ThrowableFile) => setFiles((current) => [file, ...current]), []);
  const removeFile = useCallback((id: string) => setFiles((current) => current.filter((file) => file.id !== id)), []);
  const clearFiles = useCallback(() => setFiles([]), []);

  return (
    <ShotDropBlockShell blockName="trash" files={files} onRemove={removeFile} onClear={clearFiles} controls={<ShotDropToggle label="조준 보정" value={aimAssist ? '스마트' : '수동'} pressed={aimAssist} onClick={() => setAimAssist((current) => !current)} />}>
      <TrashCanUploadScene density={density} uploadedFiles={files} onFileUploaded={addFile} windActive={windActive} onToggleWind={() => setWindActive((current) => !current)} aimAssist={aimAssist} />
    </ShotDropBlockShell>
  );
}

export default TrashCanUploadBlock;
