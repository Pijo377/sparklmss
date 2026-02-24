import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  FolderOpen,
  Folder,
  Megaphone,
  Tag,
  Package,

} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HierarchyNode {
  id: string;
  name: string;
  type?: 'portfolio' | 'campaign' | 'offer' | 'product' | 'root';
  children?: HierarchyNode[];
}

export interface HierarchyTreeProps {
  data: HierarchyNode[];
  expandAll?: boolean;
}

const getIcon = (type?: string, isOpen?: boolean) => {
  switch (type) {
    case 'root':
      return isOpen ? <FolderOpen className="size-5" /> : <Folder className="size-5" />;
    case 'portfolio':
      return <Package className="size-5" />;
    case 'campaign':
      return <Megaphone className="size-5" />;
    case 'offer':
      return <Tag className="size-5" />;
    case 'product':
    default:
      return <Package className="size-5" />;
  }
};

const getStylesByDepth = (depth: number) => {
  if (depth === 0) {
    return {
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-200/50',
      card: 'bg-gradient-to-br from-white to-blue-50/30 border-blue-200 shadow-lg hover:shadow-xl hover:border-blue-300',
      badge: 'bg-blue-100 text-blue-700 border border-blue-200'
    };
  }

  if (depth === 1) {
    return {
      icon: 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-200/40',
      card: 'bg-white border-indigo-100 shadow-md hover:shadow-lg hover:border-indigo-200',
      badge: 'bg-indigo-50 text-indigo-700 border border-indigo-100'
    };
  }

  if (depth === 2) {
    return {
      icon: 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-200/30',
      card: 'bg-white border-cyan-100 shadow hover:shadow-md hover:border-cyan-200',
      badge: 'bg-cyan-50 text-cyan-700 border border-cyan-100'
    };
  }

  return {
    icon: 'bg-gradient-to-br from-purple-400 to-purple-500 text-white border-purple-300 shadow-sm',
    card: 'bg-white border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300',
    badge: 'bg-purple-50 text-purple-700 border border-purple-100'
  };
};

const countDescendants = (node: HierarchyNode): number => {
  if (!node.children || node.children.length === 0) return 0;
  return node.children.reduce((acc, child) => acc + 1 + countDescendants(child), 0);
};

// ─── Connector constants ──────────────────────────────────────────────────────
const CONNECTOR_INDENT = 48;   // pl-12 equivalent – horizontal indentation per level
const CONNECTOR_LEFT = 24;     // x-position of the vertical trunk line within the indent
const LINE_COLOR = '#cbd5e1';  // slate-300
const CARD_GAP = 16;           // vertical gap between sibling cards (paddingTop)
const CARD_HEIGHT = 76;        // p-4(16) + size-11(44) + p-4(16) = 76
const CARD_CENTER = CARD_HEIGHT / 2; // vertical center where the dot + horizontal branch sit

const HierarchyItem = ({
  node,
  isLast,
  depth,
  expandAll,
}: {
  node: HierarchyNode;
  isLast: boolean;
  depth: number;
  expandAll?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Sync with external expandAll prop
  useEffect(() => {
    if (expandAll !== undefined) {
      setIsOpen(expandAll);
    }
  }, [expandAll]);
  const hasChildren = node.children && node.children.length > 0;
  const descendantsCount = countDescendants(node);
  const styles = getStylesByDepth(depth);
  const isLeafLayer = depth >= 3;
  const isRoot = depth === 0;

  const handleToggle = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    if (hasChildren) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className="relative"
      style={{
        paddingLeft: isRoot ? 0 : CONNECTOR_INDENT,
        paddingTop: isRoot ? 0 : CARD_GAP,
      }}
    >
      {/* ── Vertical trunk line ─ runs from top:0 through the paddingTop gap ──── */}
      {!isRoot && (
        <div
          className="absolute"
          style={{
            left: CONNECTOR_LEFT,
            top: 0,
            width: 1,
            backgroundColor: LINE_COLOR,
            // For the last sibling: stop at the center of this card (L-shape)
            // For others: extend full height so the line continues to the next sibling
            height: isLast ? CARD_GAP + CARD_CENTER : '100%',
          }}
        />
      )}

      {/* ── Connector dot ─ small circle on the vertical trunk ──────────────── */}
      {!isRoot && (
        <div
          className="absolute size-2 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 border-2 border-white shadow-sm"
          style={{
            left: CONNECTOR_LEFT - 3.5,   // center the 8px dot on the 1px line
            top: CARD_GAP + CARD_CENTER - 4, // center vertically on card center
            zIndex: 2,
          }}
        />
      )}

      {/* ── Horizontal branch ─ from trunk to the card ─────────────────────── */}
      {!isRoot && (
        <div
          className="absolute"
          style={{
            left: CONNECTOR_LEFT,
            top: CARD_GAP + CARD_CENTER,
            width: CONNECTOR_INDENT - CONNECTOR_LEFT,
            height: 1,
            backgroundColor: LINE_COLOR,
          }}
        />
      )}

      {/* ── Card ──────────────────────────────────────────────────────────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleToggle}
        onKeyDown={handleToggle}
        aria-expanded={isOpen}
        className={cn(
          "group relative flex items-center justify-between p-4 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isLeafLayer
            ? "rounded-xl focus-visible:ring-purple-500"
            : "rounded-2xl focus-visible:ring-blue-500",
          styles.card
        )}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <motion.div
            className={cn(
              "size-11 rounded-xl flex items-center justify-center border shrink-0 transition-all",
              styles.icon
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getIcon(node.type, isOpen)}
          </motion.div>

          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-slate-900 font-semibold text-base truncate">{node.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 capitalize">{node.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {descendantsCount > 0 && (
            <motion.div
              className={cn("px-2.5 py-1 rounded-full text-xs font-semibold", styles.badge)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {descendantsCount}
            </motion.div>
          )}

          {hasChildren && (
            <motion.div
              className="p-2 text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100 rounded-lg transition-colors"
              aria-hidden="true"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <ChevronRight className="size-5" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Children ─────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {node.children?.map((child, index) => (
              <HierarchyItem
                key={child.id}
                node={child}
                isLast={index === (node.children?.length || 0) - 1}
                depth={depth + 1}
                expandAll={expandAll}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HierarchyTree = ({ data, expandAll }: HierarchyTreeProps) => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {data.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <HierarchyItem
              node={node}
              isLast={index === data.length - 1}
              depth={0}
              expandAll={expandAll}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
