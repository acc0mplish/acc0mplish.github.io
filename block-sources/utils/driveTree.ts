import { DriveItemType, DriveNode, FlattenedDriveItem } from '../types';

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = bytes / Math.pow(k, i);
  // If whole number or >= 100, no decimal points
  if (Number.isInteger(val) || val >= 100) {
    return `${val.toFixed(0)} ${sizes[i]}`;
  }
  // If >= 10, one decimal point (e.g. 10.5 MB, 83.1 MB)
  if (val >= 10) {
    return `${val.toFixed(1)} ${sizes[i]}`;
  }
  // Otherwise two decimals or one if ends in 0 (e.g. 2.35 MB, 9.68 MB, 7.37 MB)
  const twoDec = val.toFixed(2);
  return `${twoDec.endsWith('0') ? val.toFixed(1) : twoDec} ${sizes[i]}`;
}

/**
 * Recursively computes the rolled-up byte size and descendant item count for a folder.
 */
export function calculateFolderStats(node: DriveNode): { totalBytes: number; itemCount: number } {
  if (node.type !== 'folder' || !node.children || node.children.length === 0) {
    return {
      totalBytes: node.sizeBytes,
      itemCount: node.type === 'folder' ? 0 : 1,
    };
  }

  let totalBytes = 0;
  let itemCount = 0;

  for (const child of node.children) {
    itemCount += 1; // Direct child counts as 1 item
    if (child.type === 'folder') {
      const sub = calculateFolderStats(child);
      totalBytes += sub.totalBytes;
      itemCount += sub.itemCount; // All descendants inside subfolder
    } else {
      totalBytes += child.sizeBytes;
    }
  }

  return { totalBytes, itemCount };
}

/**
 * Calculates total items and bytes in the entire drive.
 */
export function calculateDriveSummary(nodes: DriveNode[]): { totalItems: number; totalBytes: number } {
  let totalItems = 0;
  let totalBytes = 0;

  for (const node of nodes) {
    totalItems += 1;
    if (node.type === 'folder') {
      const stats = calculateFolderStats(node);
      totalBytes += stats.totalBytes;
      totalItems += stats.itemCount;
    } else {
      totalBytes += node.sizeBytes;
    }
  }

  return { totalItems, totalBytes };
}

/**
 * Flattens the recursive tree into a linear list respecting the expanded folders.
 */
export function flattenDriveTree(
  nodes: DriveNode[],
  expandedIds: Set<string>,
  depth = 0,
  parentId: string | null = null
): FlattenedDriveItem[] {
  const result: FlattenedDriveItem[] = [];

  for (const node of nodes) {
    const isFolder = node.type === 'folder';
    const isExpanded = isFolder && expandedIds.has(node.id);
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const stats = isFolder ? calculateFolderStats(node) : null;

    result.push({
      ...node,
      depth,
      parentId,
      isExpanded,
      hasChildren,
      computedSize: isFolder ? (stats?.totalBytes ?? node.sizeBytes) : node.sizeBytes,
      computedItemCount: isFolder ? (stats?.itemCount ?? 0) : undefined,
    });

    if (isFolder && isExpanded && node.children && node.children.length > 0) {
      const childrenFlat = flattenDriveTree(node.children, expandedIds, depth + 1, node.id);
      result.push(...childrenFlat);
    }
  }

  return result;
}

/**
 * Collect all IDs of descendants for a given node.
 */
export function getDescendantIds(node: DriveNode): string[] {
  const ids: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      ids.push(child.id);
      ids.push(...getDescendantIds(child));
    }
  }
  return ids;
}

/**
 * Find a node and its ancestors/parents by ID.
 */
export function findNodeAndParent(
  nodes: DriveNode[],
  id: string,
  parent: DriveNode | null = null
): { node: DriveNode; parent: DriveNode | null } | null {
  for (const item of nodes) {
    if (item.id === id) {
      return { node: item, parent };
    }
    if (item.children) {
      const found = findNodeAndParent(item.children, id, item);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Check if a candidate node is a descendant of another node.
 */
export function isDescendant(nodes: DriveNode[], ancestorId: string, candidateId: string): boolean {
  if (ancestorId === candidateId) return true;
  const ancestorInfo = findNodeAndParent(nodes, ancestorId);
  if (!ancestorInfo) return false;
  const descendants = getDescendantIds(ancestorInfo.node);
  return descendants.includes(candidateId);
}

/**
 * Tri-state selection status calculation.
 */
export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';

export function getNodeCheckboxState(node: DriveNode, selectedIds: Set<string>): CheckboxState {
  if (node.type !== 'folder' || !node.children || node.children.length === 0) {
    return selectedIds.has(node.id) ? 'checked' : 'unchecked';
  }

  const allDescendants = [node.id, ...getDescendantIds(node)];
  const checkedCount = allDescendants.filter((id) => selectedIds.has(id)).length;

  if (checkedCount === 0) return 'unchecked';
  if (checkedCount === allDescendants.length) return 'checked';
  return 'indeterminate';
}

/**
 * Toggle selection cascading down to all descendants and up to parents.
 */
export function toggleCascadeSelection(
  nodes: DriveNode[],
  selectedIds: Set<string>,
  targetId: string,
  forceValue?: boolean
): Set<string> {
  const next = new Set(selectedIds);
  const targetInfo = findNodeAndParent(nodes, targetId);
  if (!targetInfo) return next;

  const targetNode = targetInfo.node;
  const currentStatus = getNodeCheckboxState(targetNode, selectedIds);
  const shouldSelect = forceValue !== undefined ? forceValue : currentStatus !== 'checked';

  const affectedIds = [targetNode.id, ...getDescendantIds(targetNode)];
  for (const id of affectedIds) {
    if (shouldSelect) {
      next.add(id);
    } else {
      next.delete(id);
    }
  }

  return next;
}

/**
 * Select all or deselect all items in the tree.
 */
export function setAllSelection(nodes: DriveNode[], select: boolean): Set<string> {
  const next = new Set<string>();
  if (!select) return next;

  function traverse(list: DriveNode[]) {
    for (const item of list) {
      next.add(item.id);
      if (item.children) {
        traverse(item.children);
      }
    }
  }
  traverse(nodes);
  return next;
}

/**
 * Reparent or reorder a node within the tree.
 * position: 'inside' (drop directly into a folder) | 'before' | 'after' (sibling reorder)
 */
export function reparentOrReorderNode(
  nodes: DriveNode[],
  dragId: string,
  targetId: string,
  position: 'inside' | 'before' | 'after'
): { updatedTree: DriveNode[]; success: boolean } {
  if (dragId === targetId) {
    return { updatedTree: nodes, success: false };
  }

  // Prevent moving ancestor into its own descendant
  if (isDescendant(nodes, dragId, targetId)) {
    return { updatedTree: nodes, success: false };
  }

  // 1. Clone deep to ensure purity
  const treeClone: DriveNode[] = JSON.parse(JSON.stringify(nodes));

  // 2. Remove dragged item from its current location
  let draggedItem: DriveNode | null = null;

  function removeItem(list: DriveNode[]): boolean {
    const idx = list.findIndex((item) => item.id === dragId);
    if (idx !== -1) {
      draggedItem = list.splice(idx, 1)[0];
      return true;
    }
    for (const item of list) {
      if (item.children && removeItem(item.children)) {
        return true;
      }
    }
    return false;
  }

  removeItem(treeClone);

  if (!draggedItem) {
    return { updatedTree: nodes, success: false };
  }

  // 3. Insert into target location
  const finalItem: DriveNode = draggedItem;

  function insertItem(list: DriveNode[]): boolean {
    const targetIdx = list.findIndex((item) => item.id === targetId);
    if (targetIdx !== -1) {
      const targetNode = list[targetIdx];

      if (position === 'inside' && targetNode.type === 'folder') {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(finalItem);
        return true;
      }

      if (position === 'before') {
        list.splice(targetIdx, 0, finalItem);
        return true;
      }

      if (position === 'after') {
        list.splice(targetIdx + 1, 0, finalItem);
        return true;
      }

      // Fallback for dropping on a non-folder when position is 'inside': place after
      list.splice(targetIdx + 1, 0, finalItem);
      return true;
    }

    for (const item of list) {
      if (item.children && insertItem(item.children)) {
        return true;
      }
    }

    return false;
  }

  const inserted = insertItem(treeClone);
  if (!inserted) {
    // If target was not found in nested levels, fallback to appending at root
    treeClone.push(finalItem);
  }

  return { updatedTree: treeClone, success: true };
}

/**
 * Delete a list of node IDs from the tree.
 */
export function deleteNodesFromTree(nodes: DriveNode[], idsToDelete: Set<string>): DriveNode[] {
  function filterTree(list: DriveNode[]): DriveNode[] {
    return list
      .filter((item) => !idsToDelete.has(item.id))
      .map((item) => {
        if (item.children) {
          return { ...item, children: filterTree(item.children) };
        }
        return item;
      });
  }

  return filterTree(nodes);
}

/**
 * Rename a node in the tree.
 */
export function renameNodeInTree(nodes: DriveNode[], id: string, newName: string): DriveNode[] {
  return nodes.map((item) => {
    if (item.id === id) {
      return { ...item, name: newName };
    }
    if (item.children) {
      return { ...item, children: renameNodeInTree(item.children, id, newName) };
    }
    return item;
  });
}

/**
 * Add a new node into parent folder or root.
 */
export function addNodeToTree(nodes: DriveNode[], parentId: string | null, newNode: DriveNode): DriveNode[] {
  if (!parentId) {
    return [newNode, ...nodes];
  }

  return nodes.map((item) => {
    if (item.id === parentId && item.type === 'folder') {
      return {
        ...item,
        children: [newNode, ...(item.children || [])],
      };
    }
    if (item.children) {
      return {
        ...item,
        children: addNodeToTree(item.children, parentId, newNode),
      };
    }
    return item;
  });
}
