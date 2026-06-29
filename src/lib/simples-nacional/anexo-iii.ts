// Anexo III — Serviços (academia, viagens, laboratório, odontologia, etc.)
// LC 155/2016, Resolução CGSN 140/2018 — Tabela 3
// To update: change only the values in this file. The engine reads them automatically.

import type { Faixa } from "./types";

export const ANEXO_III: Faixa[] = [
  { limiteRbt12: 180_000,   aliquotaNominal: 0.0600, parcelaADeduzir: 0         },
  { limiteRbt12: 360_000,   aliquotaNominal: 0.1120, parcelaADeduzir: 9_360     },
  { limiteRbt12: 720_000,   aliquotaNominal: 0.1350, parcelaADeduzir: 17_640    },
  { limiteRbt12: 1_800_000, aliquotaNominal: 0.1600, parcelaADeduzir: 35_640    },
  { limiteRbt12: 3_600_000, aliquotaNominal: 0.2100, parcelaADeduzir: 125_640   },
  { limiteRbt12: Infinity,  aliquotaNominal: 0.3300, parcelaADeduzir: 648_000   },
];
