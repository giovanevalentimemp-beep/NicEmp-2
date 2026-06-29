// Anexo II — Indústria (fábricas e produção)
// LC 155/2016, Resolução CGSN 140/2018 — Tabela 2
// To update: change only the values in this file. The engine reads them automatically.

import type { Faixa } from "./types";

export const ANEXO_II: Faixa[] = [
  { limiteRbt12: 180_000,   aliquotaNominal: 0.0450, parcelaADeduzir: 0         },
  { limiteRbt12: 360_000,   aliquotaNominal: 0.0780, parcelaADeduzir: 5_940     },
  { limiteRbt12: 720_000,   aliquotaNominal: 0.1000, parcelaADeduzir: 13_860    },
  { limiteRbt12: 1_800_000, aliquotaNominal: 0.1120, parcelaADeduzir: 22_500    },
  { limiteRbt12: 3_600_000, aliquotaNominal: 0.1470, parcelaADeduzir: 85_500    },
  { limiteRbt12: Infinity,  aliquotaNominal: 0.3000, parcelaADeduzir: 720_000   },
];
