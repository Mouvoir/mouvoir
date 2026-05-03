import { useCallback, useState } from "react";

export type AnchorSide = "left" | "right";

export interface Connection {
  id: string;
  fromMaterialId: string;
  fromSide: AnchorSide;
  toMaterialId: string;
  toSide: AnchorSide;
}

interface UseConnectionsResult {
  connections: Connection[];
  selectedConnectionId: string | null;
  addConnection: (
    from: { materialId: string; side: AnchorSide },
    to: { materialId: string; side: AnchorSide },
  ) => void;
  removeConnection: (id: string) => void;
  clearConnections: () => void;
  selectConnection: (id: string | null) => void;
}

function isSameEdge(
  a: Connection,
  fromId: string,
  fromSide: AnchorSide,
  toId: string,
  toSide: AnchorSide,
): boolean {
  return (
    (a.fromMaterialId === fromId &&
      a.fromSide === fromSide &&
      a.toMaterialId === toId &&
      a.toSide === toSide) ||
    (a.fromMaterialId === toId &&
      a.fromSide === toSide &&
      a.toMaterialId === fromId &&
      a.toSide === fromSide)
  );
}

export function useConnections(): UseConnectionsResult {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | null
  >(null);

  const addConnection = useCallback<UseConnectionsResult["addConnection"]>(
    (from, to) => {
      if (from.materialId === to.materialId) return;
      setConnections((prev) => {
        if (
          prev.some((c) =>
            isSameEdge(c, from.materialId, from.side, to.materialId, to.side),
          )
        ) {
          return prev;
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            fromMaterialId: from.materialId,
            fromSide: from.side,
            toMaterialId: to.materialId,
            toSide: to.side,
          },
        ];
      });
    },
    [],
  );

  const removeConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    setSelectedConnectionId((sel) => (sel === id ? null : sel));
  }, []);

  const clearConnections = useCallback(() => {
    setConnections([]);
    setSelectedConnectionId(null);
  }, []);

  const selectConnection = useCallback((id: string | null) => {
    setSelectedConnectionId(id);
  }, []);

  return {
    connections,
    selectedConnectionId,
    addConnection,
    removeConnection,
    clearConnections,
    selectConnection,
  };
}
