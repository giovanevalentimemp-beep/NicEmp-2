// Anexo I — Comércio (revenda de mercadorias)
// LC 155/2016, Resolução CGSN 140/2018 — Tabela 1
// To update: change only the values in this file. The engine reads them automatically.

import type { Faixa } from "./types";

export const ANEXO_I: Faixa[] = [
  { limiteRbt12: 180_000,   aliquotaNominal: 0.0400, parcelaADeduzir: 0         },
  { limiteRbt12: 360_000,   aliquotaNominal: 0.0730, parcelaADeduzir: 5_940     },
  { limiteRbt12: 720_000,   aliquotaNominal: 0.0950, parcelaADeduzir: 13_860    },
  { limiteRbt12: 1_800_000, aliquotaNominal: 0.1070, parcelaADeduzir: 22_500    },
  { limiteRbt12: 3_600_000, aliquotaNominal: 0.1430, parcelaADeduzir: 87_300    },
  { limiteRbt12: Infinity,  aliquotaNominal: 0.1900, parcelaADeduzir: 378_000   },
];
