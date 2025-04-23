
import { useState } from 'react';
import { Node, Link } from '../types';

export const useGraphState = () => {
  const [renderedNodes, setRenderedNodes] = useState<Node[]>([]);
  const [renderedLinks, setRenderedLinks] = useState<Link[]>([]);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showRequired, setShowRequired] = useState(true);
  const [showOptional, setShowOptional] = useState(true);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

  const filterNodes = (nodes: Node[]) => {
    return nodes.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = (node.optional ? showOptional : showRequired);
      return matchesSearch && matchesType;
    });
  };

  const filterLinks = (links: Link[], filteredNodes: Node[]) => {
    return links.filter(link => {
      const sourceNode = (typeof link.source === 'string' ? link.source : link.source.id);
      const targetNode = (typeof link.target === 'string' ? link.target : link.target.id);
      return filteredNodes.some(n => n.id === sourceNode) && 
             filteredNodes.some(n => n.id === targetNode);
    });
  };

  return {
    renderedNodes,
    setRenderedNodes,
    renderedLinks,
    setRenderedLinks,
    transform,
    setTransform,
    searchQuery,
    setSearchQuery,
    showRequired,
    setShowRequired,
    showOptional,
    setShowOptional,
    highlightedNode,
    setHighlightedNode,
    filterNodes,
    filterLinks
  };
};
