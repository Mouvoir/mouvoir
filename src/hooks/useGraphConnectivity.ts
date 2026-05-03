import { useMemo } from "react";
import type { Connection } from "@/hooks/useConnections";
import type { Template } from "@/lib/templates";

interface UseGraphConnectivityResult {
  connectedMaterialIds: Set<string>;
  isGraphConnected: boolean;
  matchingTemplates: Template[];
}

function buildAdjacency(connections: Connection[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  for (const c of connections) {
    if (!adj.has(c.fromMaterialId)) adj.set(c.fromMaterialId, new Set());
    if (!adj.has(c.toMaterialId)) adj.set(c.toMaterialId, new Set());
    adj.get(c.fromMaterialId)!.add(c.toMaterialId);
    adj.get(c.toMaterialId)!.add(c.fromMaterialId);
  }
  return adj;
}

function isConnected(adj: Map<string, Set<string>>): boolean {
  if (adj.size <= 1) return true;
  const start = adj.keys().next().value as string;
  const visited = new Set<string>([start]);
  const queue: string[] = [start];
  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of adj.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited.size === adj.size;
}

export function useGraphConnectivity(
  connections: Connection[],
  templates: Template[],
): UseGraphConnectivityResult {
  return useMemo(() => {
    const adj = buildAdjacency(connections);
    const connectedMaterialIds = new Set(adj.keys());
    const graphIsConnected = isConnected(adj);
    const matchingTemplates =
      connectedMaterialIds.size === 0
        ? []
        : templates.filter((t) => {
            for (const mid of connectedMaterialIds) {
              if (!t.materials.some((m) => m.id === mid)) return false;
            }
            return true;
          });
    return {
      connectedMaterialIds,
      isGraphConnected: graphIsConnected,
      matchingTemplates,
    };
  }, [connections, templates]);
}
