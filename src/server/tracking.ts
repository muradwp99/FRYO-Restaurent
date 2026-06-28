import "server-only";
import { readObject, writeObject } from "./store";

export type TrackingSettings = {
  enabled: boolean; // master switch
  gtmId: string; // GTM-XXXXXXX
  ga4Id: string; // G-XXXXXXXXXX
  metaPixelId: string; // numeric
};

const FILE = "tracking";

const DEFAULTS: TrackingSettings = { enabled: false, gtmId: "", ga4Id: "", metaPixelId: "" };

export async function getTracking(): Promise<TrackingSettings> {
  const t = await readObject<Partial<TrackingSettings>>(FILE, DEFAULTS);
  return { ...DEFAULTS, ...t };
}

export async function updateTracking(data: TrackingSettings): Promise<void> {
  await writeObject(FILE, data);
}
