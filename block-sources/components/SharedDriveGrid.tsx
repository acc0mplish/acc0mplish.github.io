import { PersonAvatar } from './PersonAvatar';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  GripVertical,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  FileSpreadsheet,
  Archive,
  Image as ImageIcon,
  Figma,
  MoreHorizontal,
  Maximize2,
  Minimize2,
  RotateCcw,
  Search,
  Plus,
  Trash2,
  Download,
  FolderInput,
  Edit2,
  X,
  ArrowUpDown,
  Check,
  Minus,
} from 'lucide-react';
import { DriveNode, DriveItemType, FlattenedDriveItem } from '../types';
import {
  formatBytes,
  flattenDriveTree,
  calculateDriveSummary,
  getNodeCheckboxState,
  toggleCascadeSelection,
  setAllSelection,
  reparentOrReorderNode,
  deleteNodesFromTree,
  renameNodeInTree,
  addNodeToTree,
  CheckboxState,
} from '../utils/driveTree';

interface SharedDriveGridProps {
  initialItems: DriveNode[];
  onResetToDefault?: () => void;
}

type SortField = 'name' | 'type' | 'size' | 'owner' | 'modified';
type SortDirection = 'asc' | 'desc';

function koreanModifiedDate(value: string) {
  const months: Record<string, number> = {Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  const match = value.match(/^([A-Za-z]{3}) (\d{1,2}), (\d{4})$/);
  return match && months[match[1]] ? `${match[3]}년 ${months[match[1]]}월 ${Number(match[2])}일` : value;
}

export function SharedDriveGrid({ initialItems, onResetToDefault }: SharedDriveGridProps) {
  const [tree, setTree] = useState<DriveNode[]>(initialItems);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['f-product-design'])
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Drag and drop states
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'inside' | 'before' | 'after' | null>(null);

  // Active action menu popover
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);

  // Modals
  const [renameTarget, setRenameTarget] = useState<FlattenedDriveItem | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveDestinationFolderId, setMoveDestinationFolderId] = useState<string | null>(null);

  // Sync tree if initialItems change externally
  useEffect(() => {
    setTree(initialItems);
  }, [initialItems]);

  // Close context menu on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.row-action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Compute drive summary metrics
  const driveSummary = useMemo(() => calculateDriveSummary(tree), [tree]);

  // Flatten the tree for rendering
  const flattenedRows = useMemo(() => {
    return flattenDriveTree(tree, expandedFolders);
  }, [tree, expandedFolders]);

  // Filter & Sort
  const displayRows = useMemo(() => {
    let rows = [...flattenedRows];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q)
      );
    }

    if (sortField) {
      rows.sort((a, b) => {
        let valA: any = a.name;
        let valB: any = b.name;

        if (sortField === 'type') {
          valA = a.type;
          valB = b.type;
        } else if (sortField === 'size') {
          valA = a.computedSize;
          valB = b.computedSize;
        } else if (sortField === 'owner') {
          valA = a.ownerName;
          valB = b.ownerName;
        } else if (sortField === 'modified') {
          valA = a.modifiedDate;
          valB = b.modifiedDate;
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [flattenedRows, searchQuery, sortField, sortDirection]);

  // Expand / Collapse All
  const handleExpandAll = () => {
    const allFolderIds = new Set<string>();
    function traverse(nodes: DriveNode[]) {
      for (const node of nodes) {
        if (node.type === 'folder') {
          allFolderIds.add(node.id);
          if (node.children) traverse(node.children);
        }
      }
    }
    traverse(tree);
    setExpandedFolders(allFolderIds);
  };

  const handleCollapseAll = () => {
    setExpandedFolders(new Set());
  };

  const handleReset = () => {
    setTree(structuredClone(initialItems));
    setSortDirection('asc');
    setDraggedNodeId(null);
    setDropTargetId(null);
    setDropPosition(null);
    setActiveMenuId(null);
    setRenameTarget(null);
    setIsNewFolderOpen(false);
    setIsMoveModalOpen(false);
    if (onResetToDefault) {
      onResetToDefault();
    }
    setExpandedFolders(new Set(['f-product-design']));
    setSelectedIds(new Set());
    setSearchQuery('');
    setSortField(null);
  };

  // Toggle single folder
  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Selection handlers
  const handleToggleRowSelection = (node: DriveNode) => {
    setSelectedIds((prev) => toggleCascadeSelection(tree, prev, node.id));
  };

  const isAllSelected = useMemo(() => {
    if (flattenedRows.length === 0) return false;
    return flattenedRows.every((r) => selectedIds.has(r.id));
  }, [flattenedRows, selectedIds]);

  const isHeaderIndeterminate = useMemo(() => {
    if (flattenedRows.length === 0) return false;
    const someChecked = flattenedRows.some((r) => selectedIds.has(r.id));
    return someChecked && !isAllSelected;
  }, [flattenedRows, selectedIds, isAllSelected]);

  const handleToggleAllSelection = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(setAllSelection(tree, true));
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedNodeId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, item: FlattenedDriveItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedNodeId || draggedNodeId === item.id) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const height = rect.height;

    if (item.type === 'folder') {
      // Middle 60% drops inside folder, top 20% drops before, bottom 20% drops after
      if (offsetY < height * 0.2) {
        setDropTargetId(item.id);
        setDropPosition('before');
      } else if (offsetY > height * 0.8) {
        setDropTargetId(item.id);
        setDropPosition('after');
      } else {
        setDropTargetId(item.id);
        setDropPosition('inside');
      }
    } else {
      // For file items, only before or after
      if (offsetY < height * 0.5) {
        setDropTargetId(item.id);
        setDropPosition('before');
      } else {
        setDropTargetId(item.id);
        setDropPosition('after');
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the row entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDropTargetId(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetItem: FlattenedDriveItem) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedNodeId || !dropPosition || draggedNodeId === targetItem.id) {
      setDraggedNodeId(null);
      setDropTargetId(null);
      setDropPosition(null);
      return;
    }

    const res = reparentOrReorderNode(tree, draggedNodeId, targetItem.id, dropPosition);
    if (res.success) {
      setTree(res.updatedTree);

      // If dropped inside a folder, auto-expand that folder
      if (dropPosition === 'inside' && targetItem.type === 'folder') {
        setExpandedFolders((prev) => new Set(prev).add(targetItem.id));
      }
    }

    setDraggedNodeId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedNodeId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  // Sorting
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Item deletion
  const handleDeleteItem = (id: string) => {
    setTree((prev) => deleteNodesFromTree(prev, new Set([id])));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setActiveMenuId(null);
  };

  // Bulk deletion
  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    setTree((prev) => deleteNodesFromTree(prev, selectedIds));
    setSelectedIds(new Set());
  };

  // Rename item
  const handleStartRename = (item: FlattenedDriveItem) => {
    setRenameTarget(item);
    setRenameValue(item.name);
    setActiveMenuId(null);
  };

  const handleConfirmRename = () => {
    if (renameTarget && renameValue.trim()) {
      setTree((prev) => renameNodeInTree(prev, renameTarget.id, renameValue.trim()));
    }
    setRenameTarget(null);
    setRenameValue('');
  };

  // Add new folder
  const handleCreateNewFolder = () => {
    if (!newFolderName.trim()) return;
    const newFolder: DriveNode = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      type: 'folder',
      sizeBytes: 0,
      ownerName: '김미라',
      ownerAvatar:
        './placeholders/avatar-27ccdef6fa6f.svg',
      modifiedDate: '2026년 7월 24일',
      relativeTime: '방금 전',
      children: [],
    };

    setTree((prev) => addNodeToTree(prev, newFolderParentId, newFolder));
    if (newFolderParentId) {
      setExpandedFolders((prev) => new Set(prev).add(newFolderParentId));
    }
    setIsNewFolderOpen(false);
    setNewFolderName('');
    setNewFolderParentId(null);
  };

  // Bulk move modal
  const handleConfirmBulkMove = () => {
    if (selectedIds.size === 0) return;
    let nextTree = tree;
    for (const dragId of Array.from(selectedIds)) {
      if (moveDestinationFolderId) {
        const res = reparentOrReorderNode(nextTree, dragId, moveDestinationFolderId, 'inside');
        if (res.success) nextTree = res.updatedTree;
      }
    }
    setTree(nextTree);
    if (moveDestinationFolderId) {
      setExpandedFolders((prev) => new Set(prev).add(moveDestinationFolderId));
    }
    setIsMoveModalOpen(false);
    setSelectedIds(new Set());
  };

  // Type Badges styling
  const renderTypeBadge = (type: DriveItemType) => {
    switch (type) {
      case 'folder':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100  text-zinc-700  border border-zinc-200/60 ">
            폴더
          </span>
        );
      case 'pdf':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50  text-blue-700  border border-blue-200/60 ">
            PDF
          </span>
        );
      case 'figma':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/60 ">
            Figma
          </span>
        );
      case 'spreadsheet':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/60 ">
            스프레드시트
          </span>
        );
      case 'doc':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/60 ">
            문서
          </span>
        );
      case 'archive':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50  text-amber-700  border border-amber-200/60 ">
            압축 파일
          </span>
        );
      case 'image':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50  text-blue-700  border border-blue-200/60 ">
            이미지
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-klic-muted">
            파일
          </span>
        );
    }
  };

  // Render item icon
  const renderItemIcon = (item: FlattenedDriveItem) => {
    if (item.type === 'folder') {
      return (
        <Folder
          size={16}
          className="text-zinc-700  fill-zinc-200/40  shrink-0 stroke-[1.75]"
        />
      );
    }
    if (item.type === 'pdf') {
      return <FileText size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
    }
    if (item.type === 'spreadsheet') {
      return <FileSpreadsheet size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
    }
    if (item.type === 'figma') {
      return <Figma size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
    }
    if (item.type === 'archive') {
      return <Archive size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
    }
    if (item.type === 'image') {
      return <ImageIcon size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
    }
    return <FileText size={16} className="text-klic-muted  shrink-0 stroke-[1.75]" />;
  };

  // All folders available for move dialog
  const allFolders = useMemo(() => {
    const list: { id: string; name: string }[] = [];
    function traverse(nodes: DriveNode[]) {
      for (const node of nodes) {
        if (node.type === 'folder') {
          list.push({ id: node.id, name: node.name });
          if (node.children) traverse(node.children);
        }
      }
    }
    traverse(tree);
    return list;
  }, [tree]);

  return (
    <div className="w-full rounded-2xl border border-zinc-200  bg-white  overflow-hidden shadow-xs relative">
      {/* 1. 상단 카드 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-zinc-200  bg-white ">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 ">
            공유 드라이브
          </h2>
          <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-klic-muted ">
            <span>신세계 워크스페이스</span>
            <span>•</span>
            <span>항목 {driveSummary.totalItems}개</span>
            <span>사용 용량</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100  font-medium text-zinc-800  border border-zinc-200/60 ">
              {formatBytes(driveSummary.totalBytes)}
            </span>
          </div>
        </div>

        {/* 액션 버튼 그룹 */}
        <div className="flex items-center flex-wrap gap-2">
          {/* 새 폴더 추가 */}
          <button
            onClick={() => {
              setNewFolderParentId(null);
              setIsNewFolderOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-klic-inverse  text-klic-on-emphasis  hover:bg-klic-inverse  transition shadow-2xs"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>새 폴더</span>
          </button>

          {/* Expand all */}
          <button
            onClick={handleExpandAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200  bg-white  text-zinc-700  hover:bg-zinc-50  transition"
          >
            <Maximize2 size={13} />
            <span>모두 펼치기</span>
          </button>

          {/* Collapse all */}
          <button
            onClick={handleCollapseAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200  bg-white  text-zinc-700  hover:bg-zinc-50  transition"
          >
            <Minimize2 size={13} />
            <span>모두 접기</span>
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200  bg-white  text-zinc-700  hover:bg-zinc-50  transition"
          >
            <RotateCcw size={13} />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* 2. 빠른 검색 및 필터 바 */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-zinc-50/60  border-b border-zinc-200/80  text-xs">
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-klic-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="파일명, 확장자 또는 소유자 검색..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200  bg-white  text-zinc-900  placeholder:text-klic-muted text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-klic-muted hover:text-klic-muted"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="text-[11px] text-klic-muted hidden sm:block">
          드래그 핸들(<span className="font-mono">:::</span>)을 잡고 폴더 위나 행 사이로 드래그하여 이동할 수 있습니다.
        </div>
      </div>

      {/* 3. 데이터 그리드 테이블 */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-zinc-200  text-klic-muted  bg-zinc-50/40  select-none">
              {/* Checkbox column */}
              <th className="py-2.5 pl-5 pr-2 w-10 text-center">
                <div
                  role="checkbox"
                  aria-checked={isAllSelected ? true : isHeaderIndeterminate ? 'mixed' : false}
                  tabIndex={0}
                  onClick={handleToggleAllSelection}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleToggleAllSelection()}
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition ${
                    isAllSelected
                      ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                      : isHeaderIndeterminate
                      ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                      : 'border-zinc-300  bg-white '
                  }`}
                >
                  {isAllSelected && <Check size={11} strokeWidth={3} />}
                  {isHeaderIndeterminate && <Minus size={11} strokeWidth={3} />}
                </div>
              </th>

              {/* Name column */}
              <th
                onClick={() => toggleSort('name')}
                className="py-2.5 px-3 font-medium cursor-pointer hover:text-zinc-900 "
              >
                <div className="flex items-center gap-1">
                  <span>이름</span>
                  <ArrowUpDown size={12} className="opacity-60" />
                </div>
              </th>

              {/* Type column */}
              <th
                onClick={() => toggleSort('type')}
                className="py-2.5 px-4 font-medium w-28 cursor-pointer hover:text-zinc-900 "
              >
                <div className="flex items-center gap-1">
                  <span>유형</span>
                  <ArrowUpDown size={12} className="opacity-60" />
                </div>
              </th>

              {/* Size column */}
              <th
                onClick={() => toggleSort('size')}
                className="py-2.5 px-4 font-medium w-36 cursor-pointer hover:text-zinc-900 "
              >
                <div className="flex items-center gap-1">
                  <span>크기</span>
                  <ArrowUpDown size={12} className="opacity-60" />
                </div>
              </th>

              {/* Owner column */}
              <th
                onClick={() => toggleSort('owner')}
                className="py-2.5 px-4 font-medium w-44 cursor-pointer hover:text-zinc-900 "
              >
                <div className="flex items-center gap-1">
                  <span>소유자</span>
                  <ArrowUpDown size={12} className="opacity-60" />
                </div>
              </th>

              {/* Modified column */}
              <th
                onClick={() => toggleSort('modified')}
                className="py-2.5 px-4 font-medium w-40 cursor-pointer hover:text-zinc-900 "
              >
                <div className="flex items-center gap-1">
                  <span>수정일</span>
                  <ArrowUpDown size={12} className="opacity-60" />
                </div>
              </th>

              {/* Action column */}
              <th className="py-2.5 pr-4 pl-2 w-10 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 ">
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <div className="max-w-xs mx-auto flex flex-col items-center justify-center text-klic-muted ">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100  flex items-center justify-center text-klic-muted mb-3">
                      <Folder size={24} />
                    </div>
                    <p className="font-semibold text-zinc-900  text-sm">
                      표시할 항목이 없습니다
                    </p>
                    <p className="text-xs text-klic-muted mt-1">
                      검색 필터를 재설정하거나 초기 데이터로 복원해 보세요.
                    </p>
                    <button
                      onClick={handleReset}
                      className="mt-4 px-3.5 py-1.5 rounded-lg border border-zinc-200  bg-white  text-xs font-medium text-zinc-800  hover:bg-zinc-50 transition"
                    >
                      기본 샘플 복원
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              displayRows.map((row) => {
                const isSelected = selectedIds.has(row.id);
                const isFolder = row.type === 'folder';
                const checkboxState = isFolder
                  ? getNodeCheckboxState(row, selectedIds)
                  : isSelected
                  ? 'checked'
                  : 'unchecked';

                const isDraggingThis = draggedNodeId === row.id;
                const isDropTarget = dropTargetId === row.id;

                // Visual styling for drag feedback as specified in prompt:
                // "an insertion line and a folder tint as the only feedback so no row moves for the length of a drag"
                let rowBgClasses = 'bg-white  hover:bg-zinc-50/70 ';
                if (isDropTarget && dropPosition === 'inside' && isFolder) {
                  rowBgClasses = 'bg-blue-50/80  ring-1 ring-blue-500/50';
                } else if (isSelected) {
                  rowBgClasses = 'bg-zinc-50/90 ';
                }

                return (
                  <tr
                    key={row.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, row.id)}
                    onDragOver={(e) => handleDragOver(e, row)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, row)}
                    onDragEnd={handleDragEnd}
                    className={`group transition-colors relative ${rowBgClasses} ${
                      isDraggingThis ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    {/* Top insertion line */}
                    {isDropTarget && dropPosition === 'before' && (
                      <td colSpan={7} className="p-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-30 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500 -ml-1" />
                        </div>
                      </td>
                    )}

                    {/* Bottom insertion line */}
                    {isDropTarget && dropPosition === 'after' && (
                      <td colSpan={7} className="p-0 pointer-events-none">
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-30 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-500 -ml-1" />
                        </div>
                      </td>
                    )}

                    {/* Checkbox column */}
                    <td className="py-2.5 pl-5 pr-2 w-10 text-center">
                      <div
                        role="checkbox"
                        aria-checked={
                          checkboxState === 'checked'
                            ? true
                            : checkboxState === 'indeterminate'
                            ? 'mixed'
                            : false
                        }
                        tabIndex={0}
                        onClick={() => handleToggleRowSelection(row)}
                        onKeyDown={(e) =>
                          (e.key === 'Enter' || e.key === ' ') && handleToggleRowSelection(row)
                        }
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition ${
                          checkboxState === 'checked'
                            ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                            : checkboxState === 'indeterminate'
                            ? 'bg-klic-inverse  border-zinc-900  text-klic-on-emphasis '
                            : 'border-zinc-300  bg-white '
                        }`}
                      >
                        {checkboxState === 'checked' && <Check size={11} strokeWidth={3} />}
                        {checkboxState === 'indeterminate' && <Minus size={11} strokeWidth={3} />}
                      </div>
                    </td>

                    {/* Name column with drag handle, indentation, chevron, and icon */}
                    <td className="py-2.5 px-3">
                      <div
                        className="flex items-center gap-1.5 min-w-0"
                        style={{ paddingLeft: `${row.depth * 24}px` }}
                      >
                        {/* Drag grip handle */}
                        <span
                          className="cursor-grab active:cursor-grabbing text-klic-muted  group-hover:text-klic-muted  p-0.5 -ml-1 transition"
                          title="드래그하여 재배치 또는 폴더로 이동"
                        >
                          <GripVertical size={14} />
                        </span>

                        {/* Folder Expand/Collapse Chevron or spacing spacer */}
                        {isFolder ? (
                          <button
                            onClick={() => toggleFolder(row.id)}
                            className="w-4 h-4 flex items-center justify-center text-klic-muted hover:text-zinc-700  transition"
                            title={row.isExpanded ? '접기' : '펼치기'}
                          >
                            {row.isExpanded ? (
                              <ChevronDown size={14} strokeWidth={2} />
                            ) : (
                              <ChevronRight size={14} strokeWidth={2} />
                            )}
                          </button>
                        ) : (
                          <span className="w-4" />
                        )}

                        {/* File or Folder Icon */}
                        <div className="flex items-center justify-center w-5 h-5">
                          {renderItemIcon(row)}
                        </div>

                        {/* Name label */}
                        <span
                          className={`truncate font-medium text-xs ${
                            isFolder
                              ? 'text-zinc-900  font-semibold'
                              : 'text-zinc-800 '
                          }`}
                        >
                          {row.name}
                        </span>
                      </div>
                    </td>

                    {/* Type column */}
                    <td className="py-2.5 px-4">{renderTypeBadge(row.type)}</td>

                    {/* Size column with rolled-up items count */}
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-zinc-900  text-[12px] font-medium">
                          {formatBytes(row.computedSize)}
                        </span>
                        {isFolder && row.computedItemCount !== undefined && (
                          <span className="text-[11px] text-klic-muted">
                            항목 {row.computedItemCount}개
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Owner column with avatar */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <PersonAvatar
                          src={row.ownerAvatar}
                          alt={row.ownerName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-200 "
                        />
                        <span className="text-zinc-800  truncate font-medium">
                          {row.ownerName}
                        </span>
                      </div>
                    </td>

                    {/* Modified column */}
                    <td className="py-2.5 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-zinc-800  font-medium">
                          {koreanModifiedDate(row.modifiedDate)}
                        </span>
                        <span className="text-klic-muted">{row.relativeTime}</span>
                      </div>
                    </td>

                    {/* Action menu button */}
                    <td className="py-2.5 pr-4 pl-2 text-right relative row-action-menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeMenuId === row.id) {
                            setActiveMenuId(null);
                          } else {
                            setActiveMenuId(row.id);
                          }
                        }}
                        className="p-1 rounded-md text-klic-muted hover:text-zinc-700  hover:bg-zinc-100  transition"
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === row.id && (
                        <div className="absolute right-4 top-8 z-50 w-36 bg-white  rounded-lg shadow-lg border border-zinc-200  py-1 text-left text-xs">
                          {isFolder && (
                            <button
                              onClick={() => {
                                setNewFolderParentId(row.id);
                                setIsNewFolderOpen(true);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-zinc-700 "
                            >
                              <Plus size={12} />
                              <span>하위 폴더 추가</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleStartRename(row)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-zinc-700 "
                          >
                            <Edit2 size={12} />
                            <span>이름 변경</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedIds(new Set([row.id]));
                              setIsMoveModalOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-zinc-700 "
                          >
                            <FolderInput size={12} />
                            <span>이동</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-zinc-100  text-zinc-700 "
                          >
                            <Download size={12} />
                            <span>다운로드</span>
                          </button>
                          <div className="my-1 border-t border-zinc-100 " />
                          <button
                            onClick={() => handleDeleteItem(row.id)}
                            className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-blue-50  text-blue-600 "
                          >
                            <Trash2 size={12} />
                            <span>삭제</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. 하단 플로팅 일괄 선택 액션 바 */}
      {selectedIds.size > 0 && (
        <div className="sticky bottom-3 mx-4 my-2 p-2.5 rounded-xl bg-klic-inverse  text-klic-on-emphasis  shadow-xl flex items-center justify-between gap-3 text-xs z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-semibold">{selectedIds.size}개 항목 선택됨</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMoveModalOpen(true)}
              className="px-2.5 py-1 rounded-md bg-klic-inverse  hover:bg-klic-inverse  text-klic-on-emphasis  font-medium transition flex items-center gap-1.5"
            >
              <FolderInput size={13} />
              <span>폴더 이동</span>
            </button>

            <button
              onClick={() => {
                // mock bulk download
              }}
              className="px-2.5 py-1 rounded-md bg-klic-inverse  hover:bg-klic-inverse  text-klic-on-emphasis  font-medium transition flex items-center gap-1.5"
            >
              <Download size={13} />
              <span>다운로드</span>
            </button>

            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded-md bg-blue-600/90 hover:bg-blue-600 text-klic-on-emphasis font-medium transition flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>삭제</span>
            </button>

            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1 rounded-md text-klic-muted hover:text-klic-on-emphasis "
              title="선택 해제"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 5. 새 폴더 모달 */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white  border border-zinc-200  p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-zinc-900  mb-2">
              {newFolderParentId ? '하위 폴더 만들기' : '새 폴더 만들기'}
            </h3>
            <p className="text-xs text-klic-muted mb-3">생성할 폴더명을 입력하세요.</p>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더 이름"
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-xs text-zinc-900  mb-4 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNewFolder()}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setIsNewFolderOpen(false);
                  setNewFolderName('');
                }}
                className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50"
              >
                취소
              </button>
              <button
                onClick={handleCreateNewFolder}
                className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-medium"
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 이름 변경 모달 */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white  border border-zinc-200  p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-zinc-900  mb-2">
              이름 변경
            </h3>
            <p className="text-xs text-klic-muted mb-3">새로운 이름을 입력하세요.</p>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-zinc-200  bg-white  text-xs text-zinc-900  mb-4 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRenameTarget(null)}
                className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRename}
                className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-medium"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 폴더 이동 모달 */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white  border border-zinc-200  p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-zinc-900  mb-2">
              다른 폴더로 이동
            </h3>
            <p className="text-xs text-klic-muted mb-3">
              {selectedIds.size}개 항목을 이동할 대상 폴더를 선택하세요.
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1 mb-4 border border-zinc-200  rounded-lg p-2">
              {allFolders
                .filter((f) => !selectedIds.has(f.id))
                .map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setMoveDestinationFolderId(folder.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center gap-2 transition ${
                      moveDestinationFolderId === folder.id
                        ? 'bg-blue-50  text-blue-600  font-medium'
                        : 'hover:bg-zinc-100  text-zinc-800 '
                    }`}
                  >
                    <Folder size={14} />
                    <span className="truncate">{folder.name}</span>
                  </button>
                ))}
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  setIsMoveModalOpen(false);
                  setMoveDestinationFolderId(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-zinc-200  text-klic-muted  hover:bg-zinc-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmBulkMove}
                disabled={!moveDestinationFolderId}
                className="px-3 py-1.5 rounded-lg bg-klic-inverse  text-klic-on-emphasis  font-medium disabled:opacity-40"
              >
                이동 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
