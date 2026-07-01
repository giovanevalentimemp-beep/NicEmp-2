export interface Faixa {
  limiteRbt12: number;
  aliquotaNominal: number;
  parcelaADeduzir: number;
}

export type Anexo = "I" | "II" | "III" | "IV" | "V";

export type EstadoBR =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA"
  | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN"
  | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

export interface ResultadoSimples {
  aliquotaNominal: number;
  parcelaADeduzir: number;
  aliquotaEfetiva: number;
  valorDAS: number;
  receitaLiquida: number;
  impostosPorMil: number;
  faixaIndex: number;
}

export type CalcResult =
  | { ok: true; result: ResultadoSimples }
  | { ok: false; error: string };
