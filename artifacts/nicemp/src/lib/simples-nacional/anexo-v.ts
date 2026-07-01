import type { Faixa } from "./types";

export const ANEXO_V: Faixa[] = [
  { limiteRbt12: 180_000,   aliquotaNominal: 0.1550, parcelaADeduzir: 0         },
  { limiteRbt12: 360_000,   aliquotaNominal: 0.1800, parcelaADeduzir: 4_500     },
  { limiteRbt12: 720_000,   aliquotaNominal: 0.1950, parcelaADeduzir: 9_900     },
  { limiteRbt12: 1_800_000, aliquotaNominal: 0.2050, parcelaADeduzir: 17_100    },
  { limiteRbt12: 3_600_000, aliquotaNominal: 0.2300, parcelaADeduzir: 62_100    },
  { limiteRbt12: Infinity,  aliquotaNominal: 0.3050, parcelaADeduzir: 540_000   },
];
