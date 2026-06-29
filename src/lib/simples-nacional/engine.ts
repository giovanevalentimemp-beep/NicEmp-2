/**
 * Simples Nacional Tax Calculation Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Legal basis: LC 123/2006 (art. 3º), LC 155/2016 (art. 18, §1º),
 *              Resolução CGSN 140/2018.
 *
 * Official formula:
 *   Alíquota Efetiva = ((RBT12 × Alíquota Nominal) − Parcela a Deduzir) ÷ RBT12
 *   DAS              = Receita Bruta do Mês × Alíquota Efetiva
 *   Receita Líquida  = Receita Bruta do Mês − DAS
 *
 * Limit: RBT12 ≤ R$ 4.800.000 (art. 3º, LC 123/2006, redação LC 155/2016)
 *
 * ── ABOUT THE ESTADO (STATE) FIELD ──────────────────────────────────────────
 * The DAS federal calculation (this engine) is STATE-AGNOSTIC. The effective
 * rate formula uses only RBT12, the chosen Anexo, and the federal brackets.
 * The Estado field is collected for future expansion (e.g., partilha do ICMS
 * por estado, ISS municipal, substituição tributária) but does NOT affect any
 * value computed by calcularSimples() at this time.
 * Do NOT add fake state-specific logic — any future state-dependent calculation
 * must come from official legislation.
 *
 * ── ABOUT THE FAIXA 5 → 6 BOUNDARY ─────────────────────────────────────────
 * Faixas 1–5: the Parcela a Deduzir values are precisely calculated so that the
 * effective rate is PERFECTLY CONTINUOUS at every bracket boundary (verified
 * numerically — zero discontinuity).
 *
 * Faixa 5 → 6 (R$ 3.600.000): there is an intentional DOWNWARD kink in the
 * effective rate. This is NOT a bug — it is a deliberate policy feature of
 * LC 155/2016. The large Parcela a Deduzir in the 6th bracket was set by
 * the legislature to create a "soft landing" transition zone before a company
 * exceeds the R$ 4.800.000 annual limit and must migrate to Lucro Presumido
 * or Lucro Real. The kink sizes are (verified against official tables):
 *   Anexo I:   −3.375% | Anexo II:  −2.325% | Anexo III: −2.510%
 *   Anexo IV:  −6.895% | Anexo V:   −5.775%
 * The official dedução values in each anexo-*.ts file are correct per
 * Resolução CGSN 140/2018. Do not "fix" them for continuity.
 */

import { ANEXO_I   } from "./anexo-i";
import { ANEXO_II  } from "./anexo-ii";
import { ANEXO_III } from "./anexo-iii";
import { ANEXO_IV  } from "./anexo-iv";
import { ANEXO_V   } from "./anexo-v";
import type { Anexo, CalcResult, Faixa } from "./types";

export const LIMITE_MAXIMO_RBT12 = 4_800_000;

const TABELAS: Record<Anexo, Faixa[]> = {
  I:   ANEXO_I,
  II:  ANEXO_II,
  III: ANEXO_III,
  IV:  ANEXO_IV,
  V:   ANEXO_V,
};

/**
 * Calculates the Simples Nacional DAS for a given month.
 *
 * @param rbt12      Receita Bruta acumulada nos últimos 12 meses (R$).
 *                   This is the figure that determines which bracket applies.
 * @param receitaMes Receita Bruta do mês de apuração (R$).
 *                   The DAS is levied on this amount at the effective rate.
 * @param anexo      Anexo do Simples Nacional (I–V).
 *                   Determined by the company's CNAE — do not let users choose
 *                   freely; the correct anexo is a legal classification.
 *
 * NOTE: `estado` is intentionally NOT a parameter — see header comment above.
 */
export function calcularSimples(
  rbt12: number,
  receitaMes: number,
  anexo: Anexo
): CalcResult {
  // ── Input validation ───────────────────────────────────────────────────────
  if (!Number.isFinite(rbt12) || rbt12 <= 0) {
    return {
      ok: false,
      error: "O faturamento acumulado dos últimos 12 meses deve ser maior que zero.",
    };
  }
  if (!Number.isFinite(receitaMes) || receitaMes <= 0) {
    return {
      ok: false,
      error: "A receita bruta do mês atual deve ser maior que zero.",
    };
  }
  if (rbt12 > LIMITE_MAXIMO_RBT12) {
    return {
      ok: false,
      error: `O RBT12 (R$ ${rbt12.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}) ultrapassa o limite máximo do Simples Nacional de R$ 4.800.000,00.`,
    };
  }

  // ── Bracket lookup (rbt12 ≤ limiteRbt12 — official boundary is inclusive) ──
  const tabela = TABELAS[anexo];
  const idx    = tabela.findIndex((f: Faixa) => rbt12 <= f.limiteRbt12);
  // findIndex never returns -1 here: the last bracket has limiteRbt12 = Infinity
  // and rbt12 is finite (validated above). Defensive guard kept for type safety.
  const faixa  = tabela[idx === -1 ? tabela.length - 1 : idx];

  // ── Official formula (LC 155/2016, art. 18, §1º) ──────────────────────────
  const aliquotaNominal = faixa.aliquotaNominal;
  const parcelaADeduzir = faixa.parcelaADeduzir;

  // Alíquota Efetiva = ((RBT12 × Alíquota Nominal) − Parcela a Deduzir) ÷ RBT12
  const aliquotaEfetiva = ((rbt12 * aliquotaNominal) - parcelaADeduzir) / rbt12;

  // DAS = Receita do Mês × Alíquota Efetiva
  const valorDAS       = receitaMes * aliquotaEfetiva;
  const receitaLiquida = receitaMes - valorDAS;

  // Interpretation helper: how much tax per R$1.000 faturados
  // = aliquotaEfetiva × 1.000  (consistent with DAS / receitaMes × 1.000)
  const impostosPorMil = aliquotaEfetiva * 1_000;

  return {
    ok: true,
    result: {
      aliquotaNominal,
      parcelaADeduzir,
      aliquotaEfetiva,
      valorDAS,
      receitaLiquida,
      impostosPorMil,
      faixaIndex: idx === -1 ? tabela.length - 1 : idx,
    },
  };
}
