import "server-only";
import { readObject, writeObject } from "./store";

export type DayHours = { day: string; open: string; close: string; closed: boolean };

export type GeneralSettings = {
  restaurantName: string;
  tagline: string;
  email: string;
  phone: string;
  currency: string;
  timezone: string;
  hours: DayHours[];
};

const FILE = "settings";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULTS: GeneralSettings = {
  restaurantName: "FRYO",
  tagline: "Burgers, Wraps & Pure Fire",
  email: "hello@fryo.co.uk",
  phone: "+44 161 555 0142",
  currency: "GBP (£)",
  timezone: "Europe/London",
  hours: DAYS.map((day) => ({ day, open: "11:00", close: "23:00", closed: false })),
};

export async function getSettings(): Promise<GeneralSettings> {
  const s = await readObject<Partial<GeneralSettings>>(FILE, DEFAULTS);
  return {
    ...DEFAULTS,
    ...s,
    hours: s.hours && s.hours.length === 7 ? s.hours : DEFAULTS.hours,
  };
}

export async function updateSettings(data: GeneralSettings): Promise<void> {
  await writeObject(FILE, data);
}
