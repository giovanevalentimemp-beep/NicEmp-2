import { ANEXO_I   } from "./anexo-i";
import { ANEXO_II  } from "./anexo-ii";
import { ANEXO_III } from "./anexo-iii";
import { ANEXO_IV  } from "./anexo-iv";
import { ANEXO_V   } from "./anexo-v";
import type { Anexo, CalcResult, Faixa } from "./types";

export const LIMITE_MAXIMO_RBT12 = 4_800_000;

const TABELAS_PADRAO: Record<Anexo, Faixa[]> = {
  I:   ANEXO_I,
  II:  ANEXO_II,
  III: ANEXO_III,
  IV:  ANEXO_IV,
  V:   ANEXO_V,
};

export function calcularSimplesComFaixas(
  rbt12: number,
  receitaMes: number,
  faixas: Faixa[],
): CalcResult {
  if (!Number.isFinite(rbt12) || rbt12 <= 0) {
    return { ok: false, error: "O faturamento acumulado dos últimos 12 meses deve ser maior que zero." };
  }
  if (!Number.isFinite(receitaMes) || receitaMes <= 0) {
    return { ok: false, error: "A receita bruta do mês atual deve ser maior que zero." };
  }
  if (rbt12 > LIMITE_MAXIMO_RBT12) {
    return {
      ok: false,
      error: `O RBT12 (R$ ${rbt12.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}) ultrapassa o limite máximo do Simples Nacional de R$ 4.800.000,00.`,
    };
  }

  const idx   = faixas.findIndex((f: Faixa) => rbt12 <= f.limiteRbt12);
  const faixa = faixas[idx === -1 ? faixas.length - 1 : idx];

  const aliquotaNominal = faixa.aliquotaNominal;
  const parcelaADeduzir = faixa.parcelaADeduzir;
  const aliquotaEfetiva = ((rbt12 * aliquotaNominal) - parcelaADeduzir) / rbt12;
  const valorDAS        = receitaMes * aliquotaEfetiva;
  const receitaLiquida  = receitaMes - valorDAS;
  const impostosPorMil  = aliquotaEfetiva * 1_000;

  return {
    ok: true,
    result: {
      aliquotaNominal,
      parcelaADeduzir,
      aliquotaEfetiva,
      valorDAS,
      receitaLiquida,
      impostosPorMil,
      faixaIndex: idx === -1 ? faixas.length - 1 : idx,
    },
  };
}

export function calcularSimples(rbt12: number, receitaMes: number, anexo: Anexo): CalcResult {
  return calcularSimplesComFaixas(rbt12, receitaMes, TABELAS_PADRAO[anexo]);
}
