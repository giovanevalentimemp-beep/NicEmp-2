import type { Faixa } from "./simples-nacional/types";
import { ANEXO_I } from "./simples-nacional/anexo-i";
import { ANEXO_II } from "./simples-nacional/anexo-ii";
import { ANEXO_III } from "./simples-nacional/anexo-iii";
import { ANEXO_IV } from "./simples-nacional/anexo-iv";
import { ANEXO_V } from "./simples-nacional/anexo-v";

export type MarkupExample = { titulo: string; custo: number; despesas: number; margem: number };
export type RoiExample = { titulo: string; invest: number; retorno: number };

export interface MarkupSettings {
  margemPadrao: number;
  despesasPadrao: number;
  decimais: number;
}

export interface RoiSettings {
  decimais: number;
  exibirROIPct: boolean;
  exibirLucro: boolean;
  exibirMultiplo: boolean;
}

export interface ToolSettings {
  simplesAnexos: Record<string, Faixa[]>;
  markupSettings: MarkupSettings;
  markupExamples: MarkupExample[];
  roiSettings: RoiSettings;
  roiExamples: RoiExample[];
}

const STORAGE_KEY = "nicemp_tool_settings_v2";

export const DEFAULT_SETTINGS: ToolSettings = {
  simplesAnexos: {
    I: ANEXO_I.map((f) => ({ ...f })),
    II: ANEXO_II.map((f) => ({ ...f })),
    III: ANEXO_III.map((f) => ({ ...f })),
    IV: ANEXO_IV.map((f) => ({ ...f })),
    V: ANEXO_V.map((f) => ({ ...f })),
  },
  markupSettings: {
    margemPadrao: 20,
    despesasPadrao: 25,
    decimais: 2,
  },
  roiSettings: {
    decimais: 2,
    exibirROIPct: true,
    exibirLucro: true,
    exibirMultiplo: true,
  },
  markupExamples: [
    { titulo: "Varejo", custo: 50, despesas: 25, margem: 20 },
    { titulo: "Alimentação", custo: 8, despesas: 35, margem: 25 },
    { titulo: "Serviços", custo: 200, despesas: 20, margem: 30 },
  ],
  roiExamples: [
    { titulo: "Marketing", invest: 1000, retorno: 1500 },
    { titulo: "Estoque", invest: 5000, retorno: 7500 },
    { titulo: "Máquinas", invest: 20000, retorno: 26000 },
  ],
};

export function loadToolSettings(): ToolSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SETTINGS);
    const parsed = JSON.parse(raw) as Partial<ToolSettings>;
    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...parsed,
      simplesAnexos: {
        ...structuredClone(DEFAULT_SETTINGS.simplesAnexos),
        ...(parsed.simplesAnexos ?? {}),
      },
    };
  } catch {
    return structuredClone(DEFAULT_SETTINGS);
  }
}

export function saveToolSettings(settings: ToolSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function resetToolSettings(): ToolSettings {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_SETTINGS);
}
