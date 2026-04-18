export interface GalleryEntry {
  slug: string;
  vjName: string;
  date: string;
  template: string;
  party: string;
  quote: string;
}

export const GALLERY_ENTRIES: Record<string, GalleryEntry> = {
  "vj-babyblazer": {
    slug: "vj-babyblazer",
    vjName: "VJ Babyblazer",
    date: "15 mars 2026, Paris, Café d'Oz",
    template: "Just Dance",
    party: "Soirée techno",
    quote:
      "Le template a super bien tourné sur mon setup 2xGPU. J'ai dû tweaker le threshold de détection pour les lumières stroboscopiques, mais une fois calé, le résultat était dingue. Le public ne réalisait pas que c'était eux les visuels.",
  },
  "vj-carla": {
    slug: "vj-carla",
    vjName: "VJ Carla",
    date: "31 mai 2026, Paris, Nexus",
    template: "Camping",
    party: "Soirée Psytrance",
    quote:
      "Adapté pour Resolume avec un bridge OSC. Latence quasi nulle, vraiment réactif. J'ai partagé mon patch adapté dans les templates - vérifiez ça.",
  },
};
