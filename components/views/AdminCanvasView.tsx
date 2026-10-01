'use client';

import { useCallback } from 'react';
import { useTheme } from 'next-themes';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  MarkerType,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useViewport,
  type Node,
  type Edge,
  type Connection,
  type OnConnect,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useApp } from '@/lib/appContext';
import { mockCanvasNodes, mockProfiles, CanvasNode } from '@/lib/mockData';
import WorkflowNode, { nodeStatusColors, typeIcons, WorkflowNodeData } from '@/components/canvas/WorkflowNode';
import AppSelect from '@/components/ui/AppSelect';

const nodeTypes = { workflowNode: WorkflowNode };

const EDGE_PAIRS: [string, string][] = [
  ['node-1', 'node-2'], ['node-2', 'node-3'], ['node-3', 'node-4'],
  ['node-4', 'node-5'], ['node-5', 'node-6'], ['node-6', 'node-7'],
  ['node-7', 'node-8'], ['node-8', 'node-9'], ['node-9', 'node-10'],
];

function edgeStyleForSourceStatus(status: CanvasNode['status'] | undefined) {
  if (status === 'complete') return { stroke: 'color-mix(in srgb, var(--color-success) 60%, transparent)', animated: false, dashed: false };
  if (status === 'active') return { stroke: 'color-mix(in srgb, var(--color-info) 70%, transparent)', animated: true, dashed: false };
  return { stroke: 'color-mix(in srgb, var(--outline) 50%, transparent)', animated: false, dashed: true };
}

function buildInitialNodes(): Node<WorkflowNodeData>[] {
  return mockCanvasNodes.map(node => ({
    id: node.id,
    type: 'workflowNode',
    position: { x: node.x, y: node.y },
    data: { node },
  }));
}

function buildInitialEdges(): Edge[] {
  const nodeMap = Object.fromEntries(mockCanvasNodes.map(n => [n.id, n]));
  return EDGE_PAIRS.map(([source, target]) => {
    const { stroke, animated, dashed } = edgeStyleForSourceStatus(nodeMap[source]?.status);
    return {
      id: `${source}-${target}`,
      source,
      target,
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke },
      style: { stroke, strokeWidth: 1.5, strokeDasharray: dashed ? '5 4' : undefined },
      animated,
    };
  });
}

// Properties Panel
function PropertiesPanel({ node, onClose, onStatusChange }: {
  node: CanvasNode | null;
  onClose: () => void;
  onStatusChange: (status: CanvasNode['status']) => void;
}) {
  const sc = node ? nodeStatusColors[node.status] : nodeStatusColors.pending;

  return (
    <div style={{
      width: 320,
      background: 'var(--surface-overlay)',
      borderLeft: '1px solid var(--border-strong)',
      boxShadow: '-8px 0 32px var(--scrim)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', flexShrink: 0,
      transition: 'width 0.25s ease',
    }}>
      {/* Panel Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'color-mix(in srgb, var(--scrim) 50%, transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          <span className="text-label-lg" style={{ color: 'var(--on-surface)' }}>Properties</span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
            background: 'transparent', color: 'var(--on-surface-variant)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          title="Collapse panel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
          </svg>
        </button>
      </div>

      {/* Panel Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {!node ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, padding: '40px 20px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--surface-container-high)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--on-surface-variant)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M3 9h18"/><path d="M9 21V9"/>
              </svg>
            </div>
            <div>
              <div className="text-label-lg" style={{ color: 'var(--on-surface)', marginBottom: 4 }}>No node selected</div>
              <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>Click any node on the canvas to inspect and edit its properties</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Node identity */}
            <div style={{
              padding: '14px', borderRadius: 10,
              background: sc.bg, border: `1px solid ${sc.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'color-mix(in srgb, var(--on-surface) 6%, transparent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={sc.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={typeIcons[node.type]}/>
                  </svg>
                </div>
                <div>
                  <div className="text-label-sm" style={{ color: sc.accent, textTransform: 'uppercase', marginBottom: 2 }}>{node.type}</div>
                  <div className="text-headline-sm" style={{ color: 'var(--on-surface)' }}>{node.title}</div>
                </div>
              </div>
              {node.subtitle && (
                <div className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{node.subtitle}</div>
              )}
            </div>

            {/* Fields */}
            {([
              { label: 'Node ID',  value: node.id },
              { label: 'Type',     value: node.type },
              { label: 'Status',   value: node.status, color: sc.accent },
              { label: 'SLA',      value: node.sla ?? '—' },
              { label: 'Owner',    value: node.owner ?? '—' },
            ] as { label: string; value: string; color?: string }[]).map(f => (
              <div key={f.label}>
                <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</div>
                {f.label === 'Status' ? (
                  <AppSelect
                    value={node.status}
                    onChange={v => onStatusChange(v as CanvasNode['status'])}
                    searchable={false}
                    options={[
                      { value: 'complete', label: 'Complete' },
                      { value: 'active', label: 'Active' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'blocked', label: 'Blocked' },
                    ]}
                  />
                ) : f.label === 'Owner' ? (
                  <input className="input-base" style={{ height: 34, fontSize: 12 }} defaultValue={f.value} />
                ) : (
                  <div className="text-code-tabular" style={{ color: f.color ?? 'var(--on-surface)', padding: '6px 10px', background: 'var(--surface-container)', borderRadius: 6 }}>
                    {f.value}
                  </div>
                )}
              </div>
            ))}

            {/* SLA field */}
            <div>
              <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>SLA Target</div>
              <input className="input-base" style={{ height: 34, fontSize: 12 }} defaultValue={node.sla ?? ''} placeholder="e.g. 3 days" />
            </div>

            {/* Description */}
            <div>
              <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 4 }}>Description</div>
              <textarea
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  background: 'var(--surface-input)', border: '1px solid var(--border-strong)',
                  color: 'var(--on-surface)', fontSize: 12, fontFamily: 'var(--font-sans)',
                  resize: 'vertical', minHeight: 72, outline: 'none',
                }}
                defaultValue={node.subtitle ?? ''}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
              <button className="btn-primary btn-sm" style={{ flex: 1, fontSize: 11 }}>
                Save Changes
              </button>
              <button className="btn-ghost btn-sm" style={{ width: 36, padding: 0, justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>

            {/* Connections */}
            <div>
              <div className="text-label-sm" style={{ color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: 8 }}>Connections</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(['Incoming', 'Outgoing'] as const).map(dir => (
                  <div key={dir} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '6px 10px', borderRadius: 7,
                    background: 'var(--surface-container)',
                  }}>
                    <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)' }}>{dir}</span>
                    <span className="text-code-tabular" style={{ color: 'var(--on-surface)' }}>1</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CanvasContent() {
  const { setActiveView, selectedCanvasProfileId, selectedNodeId, setSelectedNodeId, propertiesPanelOpen, setPropertiesPanelOpen, openModal } = useApp();
  const { resolvedTheme } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>(buildInitialNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(buildInitialEdges());
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();

  const profile = mockProfiles.find(p => p.id === selectedCanvasProfileId) ?? mockProfiles[0];
  const selectedNode = nodes.find(n => n.id === selectedNodeId)?.data.node ?? null;

  const onConnect: OnConnect = useCallback((connection: Connection) => {
    setEdges(eds => addEdge({
      ...connection,
      markerEnd: { type: MarkerType.ArrowClosed, color: 'color-mix(in srgb, var(--color-info) 70%, transparent)' },
      style: { stroke: 'color-mix(in srgb, var(--color-info) 70%, transparent)', strokeWidth: 1.5 },
    }, eds));
  }, [setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNodeId(node.id);
    if (!propertiesPanelOpen) setPropertiesPanelOpen(true);
  }, [setSelectedNodeId, propertiesPanelOpen, setPropertiesPanelOpen]);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), [setSelectedNodeId]);

  const updateSelectedNodeStatus = useCallback((status: CanvasNode['status']) => {
    if (!selectedNodeId) return;
    setNodes(nds => nds.map(n => (
      n.id === selectedNodeId ? { ...n, data: { node: { ...n.data.node, status } } } : n
    )));
  }, [selectedNodeId, setNodes]);

  const handleAddPhase = useCallback(() => {
    const id = `node-${Date.now()}`;
    setNodes(nds => {
      const maxX = nds.reduce((m, n) => Math.max(m, n.position.x), 0);
      const avgY = nds.length ? nds.reduce((s, n) => s + n.position.y, 0) / nds.length : 80;
      const position = { x: maxX + 240, y: avgY };
      const newCanvasNode: CanvasNode = {
        id, type: 'action', title: 'New Phase', subtitle: 'Configure this step',
        x: position.x, y: position.y, status: 'pending',
      };
      return [...nds, { id, type: 'workflowNode', position, data: { node: newCanvasNode } }];
    });
    setSelectedNodeId(id);
    setPropertiesPanelOpen(true);
  }, [setNodes, setSelectedNodeId, setPropertiesPanelOpen]);

  const handleAutoLayout = useCallback(() => {
    setNodes(nds => {
      const ids = nds.map(n => n.id);
      const incoming = new Map<string, number>(ids.map(id => [id, 0]));
      const adjacency = new Map<string, string[]>();
      edges.forEach(e => {
        if (incoming.has(e.target)) incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1);
        adjacency.set(e.source, [...(adjacency.get(e.source) ?? []), e.target]);
      });

      const layer = new Map<string, number>();
      const queue: string[] = ids.filter(id => (incoming.get(id) ?? 0) === 0);
      const visited = new Set(queue);
      queue.forEach(id => layer.set(id, 0));
      while (queue.length) {
        const id = queue.shift()!;
        const depth = layer.get(id) ?? 0;
        (adjacency.get(id) ?? []).forEach(next => {
          const nextDepth = depth + 1;
          if (!visited.has(next)) {
            visited.add(next);
            layer.set(next, nextDepth);
            queue.push(next);
          } else if (nextDepth > (layer.get(next) ?? 0)) {
            layer.set(next, nextDepth);
          }
        });
      }
      ids.forEach(id => { if (!layer.has(id)) layer.set(id, 0); });

      const layerCounts = new Map<number, number>();
      return nds.map(n => {
        const l = layer.get(n.id) ?? 0;
        const indexInLayer = layerCounts.get(l) ?? 0;
        layerCounts.set(l, indexInLayer + 1);
        return { ...n, position: { x: l * 220, y: indexInLayer * 140 } };
      });
    });
    requestAnimationFrame(() => fitView({ padding: 0.2, duration: 400 }));
  }, [edges, setNodes, fitView]);

  const toolbarButtons: { label: string; icon: string; onClick: () => void }[] = [
    { label: 'Add Phase', icon: 'M12 5v14M5 12h14', onClick: handleAddPhase },
    { label: 'Auto-layout', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', onClick: handleAutoLayout },
    { label: 'Fit View', icon: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7', onClick: () => fitView({ padding: 0.2, duration: 400 }) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

      {/* Canvas Workspace Header */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: '12px 0 10px', borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="text-label-md">
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => setActiveView('admin-profiles')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin
            </button>
            <span style={{ color: 'var(--outline-variant)' }}>/</span>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }} onClick={() => setActiveView('admin-profiles')}>
              Workflow Profiles
            </button>
            <span style={{ color: 'var(--outline-variant)' }}>/</span>
            <span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--surface-container-low)', color: 'var(--primary-fixed)' }} className="text-code-tabular">
              {profile.code}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-secondary btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Discard
            </button>
            <button className="btn-primary btn-sm glow-primary-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </button>
          </div>
        </div>

        {/* Title + Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="18" r="3"/><circle cx="15" cy="6" r="3"/><line x1="9" y1="15" x2="15" y2="9" strokeWidth="2" stroke="var(--primary)"/>
            </svg>
            <h1 className="text-headline-md" style={{ color: 'var(--on-surface)', margin: 0 }}>{profile.name}</h1>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                height: 20, padding: '0 8px', borderRadius: 9999,
                background: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)',
                border: '1px solid color-mix(in srgb, var(--color-success) 30%, transparent)', fontSize: 11, fontWeight: 600,
              }}>
                <span className="pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                Active Draft
              </span>
              <span className="text-code-tabular" style={{ padding: '2px 8px', borderRadius: 5, background: 'var(--surface-container-high)', color: 'var(--on-surface-variant)' }}>Account: {profile.account}</span>
            </div>
            <button
              className="btn-ghost btn-sm"
              style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4 }}
              onClick={() => openModal('edit-profile-metadata', profile.id)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Metadata
            </button>
          </div>

          {/* Canvas Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'var(--surface-container-lowest)', borderRadius: 10, padding: '4px',
            border: '1px solid var(--border-subtle)',
          }}>
            {toolbarButtons.map(b => (
              <button
                key={b.label}
                onClick={b.onClick}
                style={{
                  height: 30, padding: '0 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: b.label === 'Add Phase' ? 'var(--surface-container-high)' : 'transparent',
                  color: b.label === 'Add Phase' ? 'var(--on-surface)' : 'var(--on-surface-variant)',
                  fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={b.icon}/>
                </svg>
                {b.label}
              </button>
            ))}
            <div style={{ width: 1, height: 16, background: 'var(--surface-variant)', margin: '0 4px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <button onClick={() => zoomOut({ duration: 200 })} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span className="text-code-tabular" style={{ color: 'var(--on-surface)', minWidth: 40, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
              <button onClick={() => zoomIn({ duration: 200 })} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', borderRadius: 12, marginTop: 8 }}>

        {/* Canvas */}
        <div
          style={{
            flex: 1, position: 'relative', overflow: 'hidden',
            background: 'var(--surface-container-lowest)',
            borderRadius: propertiesPanelOpen ? '12px 0 0 12px' : 12,
            border: '1px solid var(--border-subtle)',
            transition: 'border-radius 0.25s',
          }}
        >
          <ReactFlow
            colorMode={resolvedTheme === 'light' ? 'light' : 'dark'}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.5}
            maxZoom={2}
            deleteKeyCode={['Backspace', 'Delete']}
            connectionLineStyle={{ stroke: 'var(--color-info)', strokeWidth: 1.5, strokeDasharray: '5 4' }}
            defaultEdgeOptions={{
              markerEnd: { type: MarkerType.ArrowClosed, color: 'color-mix(in srgb, var(--outline) 50%, transparent)' },
              style: { strokeWidth: 1.5 },
            }}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="var(--primary)" style={{ opacity: 0.25 }} />
            <MiniMap pannable zoomable style={{ background: 'var(--surface-container-lowest)' }} />
            <Controls showInteractive={false} />
          </ReactFlow>

          {/* Canvas Legend */}
          <div style={{
            position: 'absolute', bottom: 16, left: 16,
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--surface-header)', backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-subtle)',
            padding: '8px 14px', borderRadius: 9999,
            pointerEvents: 'none', zIndex: 5,
          }}>
            {[
              { label: 'Complete', dot: 'var(--color-success)' },
              { label: 'Active', dot: 'var(--color-info)' },
              { label: 'Pending', dot: 'var(--outline-variant)' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: l.dot, flexShrink: 0 }} />
                <span className="text-body-sm" style={{ color: 'var(--on-surface-variant)', fontSize: 11 }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Collapse panel trigger when closed */}
          {!propertiesPanelOpen && (
            <button
              onClick={() => setPropertiesPanelOpen(true)}
              title="Open Properties Panel"
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 32, height: 80, borderRadius: '8px 0 0 8px',
                background: 'var(--surface-container-high)', border: '1px solid var(--border-strong)',
                borderRight: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '-4px 0 12px color-mix(in srgb, var(--scrim) 50%, transparent)',
                zIndex: 5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
              </svg>
            </button>
          )}
        </div>

        {/* Properties Panel */}
        {propertiesPanelOpen && (
          <PropertiesPanel
            node={selectedNode}
            onClose={() => setPropertiesPanelOpen(false)}
            onStatusChange={updateSelectedNodeStatus}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminCanvasView() {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
}
