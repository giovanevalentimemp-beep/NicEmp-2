export interface Faixa {
  /** Limite superior do RBT12 para esta faixa (use Infinity na última) */
  limiteRbt12: number;
  /** Alíquota nominal como decimal — ex.: 0.073 = 7,3% */
  aliquotaNominal: number;
  /** Parcela a deduzir em R$ conforme tabela oficial */
  parcelaADeduzir: number;
}

export type Anexo = "I" | "II" | "III" | "IV" | "V";

export type EstadoBR =
  | "AC" | "AL" | "AP" | "AM" | "BA" | "CE" | "DF" | "ES" | "GO" | "MA"
  | "MT" | "MS" | "MG" | "PA" | "PB" | "PR" | "PE" | "PI" | "RJ" | "RN"
  | "RS" | "RO" | "RR" | "SC" | "SP" | "SE" | "TO";

export interface ResultadoSimples {
  /** Alíquota nominal da faixa (decimal) */
  aliquotaNominal: number;
  /** Parcela a deduzir em R$ */
  parcelaADeduzir: number;
  /** Alíquota efetiva calculada (decimal) */
  aliquotaEfetiva: number;
  /** Valor do DAS a pagar (R$) */
  valorDAS: number;
  /** Receita líquida após DAS (R$) */
  receitaLiquida: number;
  /** Imposto por cada R$1.000 faturados (R$) */
  impostosPorMil: number;
  /** Índice da faixa (0-based) */
  faixaIndex: number;
}

export type CalcResult =
  | { ok: true; result: ResultadoSimples }
  | { ok: false; error: string };
