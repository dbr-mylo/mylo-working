
import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Node } from './types';

interface NodeContextMenuProps {
  node: Node;
  children: React.ReactNode;
  onHighlight: () => void;
  onEdit: () => void;
}

export const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  node,
  children,
  onHighlight,
  onEdit
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onEdit}>
          Edit Parameter
        </ContextMenuItem>
        <ContextMenuItem onClick={onHighlight}>
          Highlight Connections
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
