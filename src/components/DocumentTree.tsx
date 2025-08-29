import { useState, useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { 
  Folder, 
  FolderOpen, 
  File, 
  MoreHorizontal, 
  Plus, 
  Edit2, 
  Trash2, 
  Move,
  ChevronRight,
  ChevronDown,
  Database, 
  Zap, 
  Rocket, 
  ClipboardList,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

interface DocumentItem {
  id: string;
  name: string;
  type: 'document';
  icon: any;
  docType: string;
  size: string;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  children: (DocumentItem | FolderItem)[];
  isExpanded: boolean;
}

type TreeItem = DocumentItem | FolderItem;

const ITEM_TYPES = {
  DOCUMENT: 'document',
  FOLDER: 'folder',
};

const DocumentTree = () => {
  const [treeData, setTreeData] = useState<TreeItem[]>([
    {
      id: 'folder-1',
      name: 'CRM Documents',
      type: 'folder',
      isExpanded: true,
      children: [
        { id: 'doc-1', name: 'CRM Matrix', type: 'document', icon: Database, docType: 'Database Schema', size: '2.4 MB' },
        { id: 'doc-2', name: 'User Analytics', type: 'document', icon: Database, docType: 'Analytics', size: '1.2 MB' },
      ]
    },
    {
      id: 'folder-2',
      name: 'Architecture',
      type: 'folder',
      isExpanded: false,
      children: [
        { id: 'doc-3', name: 'Tech Blueprint', type: 'document', icon: Zap, docType: 'Architecture', size: '1.8 MB' },
      ]
    },
    { id: 'doc-4', name: 'Mission Plan', type: 'document', icon: Rocket, docType: 'Strategy Doc', size: '3.2 MB' },
    { id: 'doc-5', name: 'Spec Codex', type: 'document', icon: ClipboardList, docType: 'Requirements', size: '1.1 MB' },
  ]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const findItemById = (items: TreeItem[], id: string): TreeItem | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.type === 'folder') {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const removeItemById = (items: TreeItem[], id: string): TreeItem[] => {
    return items.filter(item => {
      if (item.id === id) return false;
      if (item.type === 'folder') {
        item.children = removeItemById(item.children, id);
      }
      return true;
    });
  };

  const addItemToFolder = (items: TreeItem[], folderId: string, newItem: TreeItem): TreeItem[] => {
    return items.map(item => {
      if (item.id === folderId && item.type === 'folder') {
        return { ...item, children: [...item.children, newItem] };
      }
      if (item.type === 'folder') {
        return { ...item, children: addItemToFolder(item.children, folderId, newItem) };
      }
      return item;
    });
  };

  const toggleFolder = (id: string) => {
    const updateItems = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === id && item.type === 'folder') {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.type === 'folder') {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    setTreeData(updateItems(treeData));
  };

  const createNewFolder = (parentId?: string) => {
    const newFolder: FolderItem = {
      id: `folder-${Date.now()}`,
      name: 'New Folder',
      type: 'folder',
      children: [],
      isExpanded: true,
    };

    if (parentId) {
      setTreeData(addItemToFolder(treeData, parentId, newFolder));
    } else {
      setTreeData([...treeData, newFolder]);
    }
    
    setEditingId(newFolder.id);
    setEditingName(newFolder.name);
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveEdit = () => {
    if (!editingId || !editingName.trim()) return;
    
    const updateItemName = (items: TreeItem[]): TreeItem[] => {
      return items.map(item => {
        if (item.id === editingId) {
          return { ...item, name: editingName.trim() };
        }
        if (item.type === 'folder') {
          return { ...item, children: updateItemName(item.children) };
        }
        return item;
      });
    };
    
    setTreeData(updateItemName(treeData));
    setEditingId(null);
    setEditingName('');
  };

  const deleteItem = (id: string) => {
    setTreeData(removeItemById(treeData, id));
  };

  const moveItemToFolder = (itemId: string, targetFolderId: string) => {
    const item = findItemById(treeData, itemId);
    if (!item) return;
    
    // Remove from current location
    let newTreeData = removeItemById(treeData, itemId);
    
    // Add to target folder
    newTreeData = addItemToFolder(newTreeData, targetFolderId, item);
    
    setTreeData(newTreeData);
  };

  const moveItemToRoot = (itemId: string) => {
    const item = findItemById(treeData, itemId);
    if (!item) return;
    
    // Remove from current location
    let newTreeData = removeItemById(treeData, itemId);
    
    // Add to root
    newTreeData = [...newTreeData, item];
    
    setTreeData(newTreeData);
  };

  const handleDrop = (draggedId: string, targetId: string | null, draggedItem: TreeItem) => {
    if (draggedId === targetId) return; // Can't drop on itself
    
    if (targetId) {
      // Check if we're trying to drop a folder into one of its children
      if (draggedItem.type === 'folder') {
        const isDescendant = (folderId: string, checkId: string): boolean => {
          const folder = findItemById(treeData, folderId) as FolderItem;
          if (!folder || folder.type !== 'folder') return false;
          
          for (const child of folder.children) {
            if (child.id === checkId) return true;
            if (child.type === 'folder' && isDescendant(child.id, checkId)) return true;
          }
          return false;
        };
        
        if (isDescendant(draggedId, targetId)) {
          return; // Prevent circular reference
        }
      }
      
      moveItemToFolder(draggedId, targetId);
    } else {
      moveItemToRoot(draggedId);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Document Tree</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => createNewFolder()}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <RootDropZone onDrop={handleDrop}>
          <div className="space-y-1">
            {treeData.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                level={0}
                treeData={treeData}
                onToggle={toggleFolder}
                onCreateFolder={createNewFolder}
                onStartEditing={startEditing}
                onDelete={deleteItem}
                onMoveToFolder={moveItemToFolder}
                onDrop={handleDrop}
                editingId={editingId}
                editingName={editingName}
                onEditingNameChange={setEditingName}
                onSaveEdit={saveEdit}
                onCancelEdit={() => {
                  setEditingId(null);
                  setEditingName('');
                }}
              />
            ))}
          </div>
        </RootDropZone>
      </div>
    </DndProvider>
  );
};

interface RootDropZoneProps {
  children: React.ReactNode;
  onDrop: (draggedId: string, targetId: string | null, draggedItem: TreeItem) => void;
}

const RootDropZone = ({ children, onDrop }: RootDropZoneProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ITEM_TYPES.DOCUMENT, ITEM_TYPES.FOLDER],
    drop: (draggedItem: { id: string; item: TreeItem }) => {
      onDrop(draggedItem.id, null, draggedItem.item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[100px] transition-all duration-200 ${
        isOver ? 'bg-primary/5 border-2 border-dashed border-primary/30 rounded-lg p-2' : ''
      }`}
    >
      {isOver && (
        <div className="text-center py-4 text-primary text-sm font-medium">
          Drop here to move to root level
        </div>
      )}
      {children}
    </div>
  );
};

interface TreeNodeProps {
  item: TreeItem;
  level: number;
  treeData: TreeItem[];
  onToggle: (id: string) => void;
  onCreateFolder: (parentId?: string) => void;
  onStartEditing: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onMoveToFolder: (itemId: string, targetFolderId: string) => void;
  onDrop: (draggedId: string, targetId: string | null, draggedItem: TreeItem) => void;
  editingId: string | null;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}

const TreeNode = ({
  item,
  level,
  treeData,
  onToggle,
  onCreateFolder,
  onStartEditing,
  onDelete,
  onMoveToFolder,
  onDrop,
  editingId,
  editingName,
  onEditingNameChange,
  onSaveEdit,
  onCancelEdit
}: TreeNodeProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = editingId === item.id;

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: item.type === 'folder' ? ITEM_TYPES.FOLDER : ITEM_TYPES.DOCUMENT,
    item: { id: item.id, item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop target (only for folders)
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ITEM_TYPES.DOCUMENT, ITEM_TYPES.FOLDER],
    drop: (draggedItem: { id: string; item: TreeItem }) => {
      if (item.type === 'folder' && draggedItem.id !== item.id) {
        onDrop(draggedItem.id, item.id, draggedItem.item);
      }
    },
    canDrop: (draggedItem: { id: string; item: TreeItem }) => {
      return item.type === 'folder' && draggedItem.id !== item.id;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // Get all folders for move menu (excluding current item and its children)
  const getAllFolders = (items: TreeItem[], exclude?: string[]): FolderItem[] => {
    const folders: FolderItem[] = [];
    for (const itm of items) {
      if (itm.type === 'folder' && !exclude?.includes(itm.id)) {
        folders.push(itm);
        folders.push(...getAllFolders(itm.children, exclude));
      }
    }
    return folders;
  };

  const availableFolders = getAllFolders(treeData, [item.id]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveEdit();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  const renderContent = () => {
    if (item.type === 'folder') {
      const folderItem = item as FolderItem;
      return (
        <div>
          <div
            ref={(node) => {
              if (item.type === 'folder') {
                drag(drop(node));
              } else {
                drag(node);
              }
            }}
            className={`
              flex items-center gap-2 p-2 rounded-md transition-all duration-200 group
              ${isDragging ? 'opacity-50 scale-95 cursor-grabbing' : 'hover:bg-accent cursor-grab'}
              ${isOver && canDrop ? 'bg-primary/10 border-2 border-dashed border-primary/40 scale-105' : ''}
              ${item.type === 'folder' && canDrop ? 'border border-transparent' : ''}
            `}
            style={{ marginLeft: level * 16 }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onToggle(item.id)}
              className="h-4 w-4 p-0 hover:bg-transparent"
            >
              {folderItem.isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
            
            {folderItem.isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )}
            
            {isEditing ? (
              <Input
                ref={inputRef}
                value={editingName}
                onChange={(e) => onEditingNameChange(e.target.value)}
                onBlur={onSaveEdit}
                onKeyDown={handleKeyPress}
                className="h-6 text-sm py-0 px-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center flex-1 gap-2">
                <span className="text-sm font-medium flex-1">{item.name}</span>
                {isDragging && (
                  <div className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                    Dragging...
                  </div>
                )}
                {isOver && canDrop && (
                  <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                    Drop here
                  </div>
                )}
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm hover:bg-accent hover:text-accent-foreground">
                <MoreHorizontal className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onCreateFolder(item.id)}>
                  <Plus className="h-3 w-3 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStartEditing(item.id, item.name)}>
                  <Edit2 className="h-3 w-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                {availableFolders.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">Move to folder</div>
                    {availableFolders.slice(0, 5).map((folder) => (
                      <DropdownMenuItem 
                        key={folder.id}
                        onClick={() => onMoveToFolder(item.id, folder.id)}
                        className="text-xs pl-6"
                      >
                        <Folder className="h-3 w-3 mr-2" />
                        {folder.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {folderItem.isExpanded && (
            <div>
              {folderItem.children.map((child) => (
                <TreeNode
                  key={child.id}
                  item={child}
                  level={level + 1}
                  treeData={treeData}
                  onToggle={onToggle}
                  onCreateFolder={onCreateFolder}
                  onStartEditing={onStartEditing}
                  onDelete={onDelete}
                  onMoveToFolder={onMoveToFolder}
                  onDrop={onDrop}
                  editingId={editingId}
                  editingName={editingName}
                  onEditingNameChange={onEditingNameChange}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                />
              ))}
            </div>
          )}
        </div>
      );
    } else {
      const docItem = item as DocumentItem;
      return (
        <Card
          ref={drag}
          className={`
            p-3 transition-all duration-200 group
            ${isDragging ? 'opacity-50 scale-95 cursor-grabbing' : 'hover:bg-accent cursor-grab'}
          `}
          style={{ marginLeft: (level + 1) * 16 }}
        >
          <div className="flex items-start gap-3">
            <docItem.icon className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={editingName}
                  onChange={(e) => onEditingNameChange(e.target.value)}
                  onBlur={onSaveEdit}
                  onKeyDown={handleKeyPress}
                  className="h-6 text-sm py-0 px-1 mb-1"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate flex-1">{item.name}</p>
                  {isDragging && (
                    <div className="text-xs text-muted-foreground bg-primary/10 px-1 py-0.5 rounded">
                      Moving...
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">{docItem.docType}</Badge>
                <span className="text-xs text-muted-foreground">{docItem.size}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm hover:bg-accent hover:text-accent-foreground">
                <MoreHorizontal className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStartEditing(item.id, item.name)}>
                  <Edit2 className="h-3 w-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                {availableFolders.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">Move to folder</div>
                    {availableFolders.slice(0, 5).map((folder) => (
                      <DropdownMenuItem 
                        key={folder.id}
                        onClick={() => onMoveToFolder(item.id, folder.id)}
                        className="text-xs pl-6"
                      >
                        <Folder className="h-3 w-3 mr-2" />
                        {folder.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      );
    }
  };

  return renderContent();
};

export { DocumentTree };