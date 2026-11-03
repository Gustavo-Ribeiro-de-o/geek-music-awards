import { MAIN_MIN_SUBSCRIBERS, REVELACAO_MAX_SUBSCRIBERS } from "@/data/gma-data";

export type Tier = "lendas" | "prodigios" | "pequenos-gigantes";

export const TIER_LABEL: Record<Tier, string> = {
  lendas: "LENDAS",
  prodigios: "PRODÍGIOS",
  "pequenos-gigantes": "PEQUENOS GIGANTES",
};

export function getTier(subscriberCount: number | undefined): Tier {
  if (subscriberCount === undefined || subscriberCount >= MAIN_MIN_SUBSCRIBERS) return "lendas";
  if (subscriberCount > REVELACAO_MAX_SUBSCRIBERS) return "prodigios";
  return "pequenos-gigantes";
}
