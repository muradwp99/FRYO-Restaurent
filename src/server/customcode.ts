import "server-only";
import { readObject, writeObject } from "./store";

export type CustomCode = {
  enabled: boolean;
  headHtml: string;
  bodyHtml: string;
};

const FILE = "custom-code";
const DEFAULTS: CustomCode = { enabled: false, headHtml: "", bodyHtml: "" };

export async function getCustomCode(): Promise<CustomCode> {
  const c = await readObject<Partial<CustomCode>>(FILE, DEFAULTS);
  return { ...DEFAULTS, ...c };
}

export async function updateCustomCode(data: CustomCode): Promise<void> {
  await writeObject(FILE, data);
}
