export { calcularSimples, LIMITE_MAXIMO_RBT12 } from "./engine";
export { ANEXO_I   } from "./anexo-i";
export { ANEXO_II  } from "./anexo-ii";
export { ANEXO_III } from "./anexo-iii";
export { ANEXO_IV  } from "./anexo-iv";
export { ANEXO_V   } from "./anexo-v";
export type { Anexo, EstadoBR, Faixa, ResultadoSimples, CalcResult } from "./types";

export const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
] as const;

export const FAIXA_LABELS = [
  "1ª faixa (até R$180k)",
  "2ª faixa (R$180k–360k)",
  "3ª faixa (R$360k–720k)",
  "4ª faixa (R$720k–1,8M)",
  "5ª faixa (R$1,8M–3,6M)",
  "6ª faixa (R$3,6M–4,8M)",
] as const;

export const ANEXO_DESC: Record<string, string> = {
  I:   "Comércio (revenda de mercadorias)",
  II:  "Indústria (fabricação de produtos)",
  III: "Serviços — academia, viagens, lab., etc.",
  IV:  "Serviços — construção, limpeza, vigilância, etc.",
  V:   "Serviços — auditoria, consultoria, publicidade, etc.",
};
