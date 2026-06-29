import { parseCurrency, parsePercent } from "@/utils/format";

export interface MarkupResult {
  precoVenda: number;
  multiplicador: number;
  lucroEsperado: number;
  custo: number;
  despesas: number;
  margem: number;
  custoPorReal: number;
}

export function calculateMarkup(custoStr: string, despesasStr: string, margemStr: string) {
  const custo = parseCurrency(custoStr);
  const despesas = parsePercent(despesasStr);
  const margem = parsePercent(margemStr);
  const errs: Record<string, string> = {};

  if (!custoStr || custo <= 0) errs.custo = "Informe um custo válido (maior que zero).";
  if (!despesasStr || despesas < 0) errs.despesas = "Informe um valor de despesas válido.";
  if (!margemStr || margem <= 0) errs.margem = "Informe uma margem de lucro válida (maior que zero).";
  if (despesas + margem >= 100) errs.margem = "A soma de despesas e margem não pode atingir ou ultrapassar 100%.";

  if (Object.keys(errs).length) return { errs, result: null };

  const multiplicador = 100 / (100 - despesas - margem);
  const precoVenda = custo * multiplicador;
  const lucroEsperado = precoVenda - custo - (precoVenda * despesas) / 100;
  const custoPorReal = precoVenda / custo;

  return {
    errs: {},
    result: { precoVenda, multiplicador, lucroEsperado, custo, despesas, margem, custoPorReal },
  };
}
