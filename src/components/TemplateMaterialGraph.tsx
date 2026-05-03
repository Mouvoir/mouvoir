"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { TemplateConnectionLayer, type NodeAnchors } from "@/components/TemplateConnectionLayer";
import { TemplateMaterialNode, type MaterialNodeData } from "@/components/TemplateMaterialNode";
import { TemplateCarouselModal } from "@/components/TemplateCarouselModal";
import type { AnchorSide } from "@/hooks/useConnections";
import { useConnections } from "@/hooks/useConnections";
import { useGraphConnectivity } from "@/hooks/useGraphConnectivity";
import { useScatterPositions } from "@/hooks/useScatterPositions";
import type { Template } from "@/lib/templates";

export interface GraphMaterial {
  id: string;
  label: string;
  imageUrl?: string;
}

interface TemplateMaterialGraphProps {
  materials: GraphMaterial[];
  templates: Template[];
}

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, #ffd4e8 0%, #ff8ad1 100%)",
  "linear-gradient(135deg, #c4f0e1 0%, #6cd9b8 100%)",
  "linear-gradient(135deg, #d6e2ff 0%, #88a8ff 100%)",
  "linear-gradient(135deg, #ffe6c7 0%, #ffb079 100%)",
  "linear-gradient(135deg, #e9d4ff 0%, #c975e8 100%)",
  "linear-gradient(135deg, #ffd1d1 0%, #e1212a 100%)",
];

function gradientFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return FALLBACK_GRADIENTS[Math.abs(h) % FALLBACK_GRADIENTS.length];
}

interface DragState {
  fromMaterialId: string;
  fromSide: AnchorSide;
  cursorX: number;
  cursorY: number;
}

export function TemplateMaterialGraph({ materials, templates }: TemplateMaterialGraphProps) {
  const t = useTranslations("TemplateGraph");

  const containerRef = useRef<HTMLElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const ids = useMemo(() => materials.map((m) => m.id), [materials]);
  const positions = useScatterPositions(ids);
  const slots = isMobile ? positions.mobile : positions.desktop;

  const { connections, selectedConnectionId, addConnection, removeConnection, clearConnections, selectConnection } =
    useConnections();
  const { connectedMaterialIds, isGraphConnected, matchingTemplates } = useGraphConnectivity(connections, templates);

  const [drag, setDrag] = useState<DragState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const anchorRefs = useRef(new Map<string, { left: HTMLButtonElement | null; right: HTMLButtonElement | null }>());
  const [anchorPositions, setAnchorPositions] = useState<Map<string, NodeAnchors>>(new Map());

  const measureAnchors = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    setContainerSize({ width: cRect.width, height: cRect.height });
    const next = new Map<string, NodeAnchors>();
    for (const [id, refs] of anchorRefs.current) {
      if (!refs.left || !refs.right) continue;
      const lr = refs.left.getBoundingClientRect();
      const rr = refs.right.getBoundingClientRect();
      next.set(id, {
        left: { x: lr.left - cRect.left + lr.width / 2, y: lr.top - cRect.top + lr.height / 2 },
        right: { x: rr.left - cRect.left + rr.width / 2, y: rr.top - cRect.top + rr.height / 2 },
      });
    }
    setAnchorPositions(next);
  }, []);

  useLayoutEffect(() => {
    measureAnchors();
  }, [measureAnchors, slots, materials.length]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => measureAnchors());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureAnchors]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 600px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const setAnchorRef = useCallback(
    (id: string, side: AnchorSide) => (el: HTMLButtonElement | null) => {
      const existing = anchorRefs.current.get(id) ?? { left: null, right: null };
      existing[side] = el;
      anchorRefs.current.set(id, existing);
    },
    [],
  );

  const setNodeRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    [],
  );

  const containerPoint = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return { x: clientX, y: clientY };
    const rect = container.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handleAnchorPointerDown = useCallback(
    (materialId: string, side: AnchorSide, e: ReactPointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const { x, y } = containerPoint(e.clientX, e.clientY);
      setDrag({ fromMaterialId: materialId, fromSide: side, cursorX: x, cursorY: y });
    },
    [containerPoint],
  );

  const handleAnchorPointerUp = useCallback(
    (materialId: string, side: AnchorSide) => {
      setDrag((current) => {
        if (!current) return null;
        if (current.fromMaterialId === materialId) return null;
        addConnection(
          { materialId: current.fromMaterialId, side: current.fromSide },
          { materialId, side },
        );
        return null;
      });
    },
    [addConnection],
  );

  // Global pointer move/up while dragging.
  useEffect(() => {
    if (!drag) return;
    const onMove = (e: PointerEvent) => {
      const { x, y } = containerPoint(e.clientX, e.clientY);
      setDrag((current) => (current ? { ...current, cursorX: x, cursorY: y } : null));
    };
    const onUp = () => setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, containerPoint]);

  // Delete-key removes the selected connection.
  useEffect(() => {
    if (!selectedConnectionId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeConnection(selectedConnectionId);
      } else if (e.key === "Escape") {
        selectConnection(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedConnectionId, removeConnection, selectConnection]);

  // Click-outside clears selection.
  useEffect(() => {
    if (!selectedConnectionId) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".connection-line__hit")) return;
      selectConnection(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [selectedConnectionId, selectConnection]);

  const ctaLabel = (() => {
    if (connectedMaterialIds.size === 0) return t("ctaIdle");
    if (!isGraphConnected) return t("ctaDisconnected");
    if (matchingTemplates.length === 1) return t("ctaSingle");
    return t("ctaMany", { count: matchingTemplates.length });
  })();
  const ctaDisabled = connectedMaterialIds.size === 0 || !isGraphConnected;

  if (materials.length === 0) {
    return <div className="material-graph material-graph--empty">{t("empty")}</div>;
  }

  const connectedMaterials = materials.filter((m) => connectedMaterialIds.has(m.id));

  return (
    <section
      ref={containerRef}
      className="material-graph"
      aria-label={t("sectionLabel")}
    >
      <TemplateConnectionLayer
        width={containerSize.width}
        height={containerSize.height}
        connections={connections}
        anchorPositions={anchorPositions}
        selectedConnectionId={selectedConnectionId}
        drag={drag}
        onSelect={selectConnection}
      />

      {materials.map((m, i) => {
        const slot = slots.get(m.id);
        if (!slot) return null;
        const data: MaterialNodeData = {
          id: m.id,
          label: m.label,
          imageUrl: m.imageUrl,
          fallbackGradient: gradientFor(m.id),
        };
        return (
          <TemplateMaterialNode
            key={m.id}
            ref={setNodeRef(m.id)}
            material={data}
            slot={slot}
            index={i}
            isConnected={connectedMaterialIds.has(m.id)}
            isDragSource={drag?.fromMaterialId === m.id}
            anchorRefs={{ left: setAnchorRef(m.id, "left"), right: setAnchorRef(m.id, "right") }}
            onAnchorPointerDown={(side, e) => handleAnchorPointerDown(m.id, side, e)}
            onAnchorPointerUp={(side, e) => handleAnchorPointerUp(m.id, side)}
            anchorAriaLabel={(side) => t("anchorLabel", { label: m.label, side: t(`side.${side}`) })}
          />
        );
      })}

      <div className="material-graph__cta">
        <button
          type="button"
          className="btn-cta material-graph__cta-button"
          disabled={ctaDisabled}
          onClick={() => setIsModalOpen(true)}
        >
          {ctaLabel}
        </button>
        {connections.length > 0 ? (
          <button type="button" className="btn-outline" onClick={clearConnections}>
            {t("reset")}
          </button>
        ) : null}
      </div>

      <TemplateCarouselModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templates={matchingTemplates}
        connectedMaterials={connectedMaterials}
      />
    </section>
  );
}
