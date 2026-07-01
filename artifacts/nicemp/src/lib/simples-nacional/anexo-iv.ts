import type { Faixa } from "./types";

export const ANEXO_IV: Faixa[] = [
  { limiteRbt12: 180_000,   aliquotaNominal: 0.0450, parcelaADeduzir: 0         },
  { limiteRbt12: 360_000,   aliquotaNominal: 0.0900, parcelaADeduzir: 8_100     },
  { limiteRbt12: 720_000,   aliquotaNominal: 0.1020, parcelaADeduzir: 12_420    },
  { limiteRbt12: 1_800_000, aliquotaNominal: 0.1400, parcelaADeduzir: 39_780    },
  { limiteRbt12: 3_600_000, aliquotaNominal: 0.2200, parcelaADeduzir: 183_780   },
  { limiteRbt12: Infinity,  aliquotaNominal: 0.3300, parcelaADeduzir: 828_000   },
];
