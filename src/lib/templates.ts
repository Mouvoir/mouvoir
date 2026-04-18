export interface TemplateData {
  slug: string;
  title: string;
  description: string;
  material: string;
  tutorialAuthor?: string;
  tutorialDescription?: string;
  hardwareTip?: string;
}

export const TEMPLATES: Record<string, TemplateData> = {
  "just-dance": {
    slug: "just-dance",
    title: "Just Dance",
    description:
      "Détecte le mouvement de la foule via webcam et génère des visuels réactifs en temps réel. Compatible TouchDesigner.",
    material: "Touchdesigner, caméra IF",
    tutorialAuthor: "Tutoriel, réalisé par Paul.",
    tutorialDescription:
      "Description: n this #touchdesigner #tutorial we take a look how we can use webcam and #kinect as a particle source in particlesGpu from the palette for some funky interactivity, and learn some things about particlesGpu along the way. These techniques can be used with any video or pointcloud input! We also incorporate simple motion tracking and audio reactivity.",
    hardwareTip:
      "Conseil: GALAYOU 2k Camera Surveillance WiFi Extérieure PTZ, Caméra IP 360° Étanche, Vision Nocturne en Couleur, Audio Bidirectionnel, Alerte instantanée, Carte TF, Alexa Y4",
  },
  camping: {
    slug: "camping",
    title: "Camping",
    description:
      "Set-up précaire mais faisable dans toutes les situations, il vous suffit de votre ordinateur et c'est tout !",
    material: "Votre ordinateur",
  },
};
