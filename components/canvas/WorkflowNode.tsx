'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { CanvasNode } from '@/lib/mockData';

export const nodeStatusColors: Record<string, { bg: string; border: string; accent: string; dot: string }> = {
  complete: { bg: 'rgba(5,150,105,0.15)',  border: 'rgba(52,211,153,0.4)',  accent: '#34D399', dot: '#34D399' },
  active:   { bg: 'rgba(79,70,229,0.2)',   border: 'rgba(129,140,248,0.5)', accent: '#818CF8', dot: '#818CF8' },
  pending:  { bg: 'rgba(30,41,59,0.8)',    border: 'rgba(70,69,85,0.6)',    accent: '#64748B', dot: '#464555' },
  blocked:  { bg: 'rgba(220,38,38,0.15)',  border: 'rgba(248,113,113,0.4)', accent: '#F87171', dot: '#F87171' },
};

export const typeIcons: Record<string, string> = {
  phase:     'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  milestone: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  gate:      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  action:    'M13 10V3L4 14h7v7l9-11h-7z',
};

export type WorkflowNodeData = { node: CanvasNode };

export default function WorkflowNode({ data, selected }: NodeProps<Node<WorkflowNodeData>>) {
  const { node } = data;
  const sc = nodeStatusColors[node.status];

  return (
    <div
      style={{
        width: 180,
        background: sc.bg,
        border: `1.5px solid ${selected ? '#4F46E5' : sc.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        cursor: 'pointer',
        userSelect: 'none',
        boxShadow: selected
          ? '0 0 0 2px rgba(79,70,229,0.4), 0 8px 24px rgba(0,0,0,0.6)'
          : '0 4px 16px rgba(0,0,0,0.5)',
        transition: 'border-color 0.15s, box-shadow 0.15s, transform 0.15s',
        transform: selected ? 'translateY(-2px)' : 'none',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 9, height: 9, background: sc.accent, border: '1.5px solid #0c1017' }}
      />

      {/* Type icon + status dot */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: 'rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sc.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={typeIcons[node.type]}/>
          </svg>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: sc.dot,
          boxShadow: node.status === 'active' ? `0 0 8px ${sc.dot}` : 'none',
        }} className={node.status === 'active' ? 'pulse-dot' : ''} />
      </div>

      {/* Title */}
      <div className="text-label-lg" style={{ color: 'var(--on-surface)', marginBottom: 2, lineHeight: '1.3' }}>{node.title}</div>
      {node.subtitle && (
        <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 10, lineHeight: '1.4' }}>{node.subtitle}</div>
      )}

      {/* SLA */}
      {node.sla && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span className="text-code-tabular" style={{ fontSize: 10, color: 'var(--on-surface-variant)' }}>SLA: {node.sla}</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 9, height: 9, background: sc.accent, border: '1.5px solid #0c1017' }}
      />
    </div>
  );
}
