import { parseCurrency } from "@/utils/format";

export interface RoiResult {
  roi: number;
  lucro: number;
  invest: number;
  retorno: number;
}

export function calculateRoi(investStr: string, retornoStr: string) {
  const invest = parseCurrency(investStr);
  const retorno = parseCurrency(retornoStr);
  const errs: { invest?: string; retorno?: string } = {};

  if (!investStr || invest <= 0) errs.invest = "Informe um valor de investimento válido (maior que zero).";
  if (!retornoStr || retorno < 0) errs.retorno = "Informe um retorno válido (não negativo).";
  if (Object.keys(errs).length) return { errs, result: null };

  return {
    errs: {},
    result: {
      roi: ((retorno - invest) / invest) * 100,
      lucro: retorno - invest,
      invest,
      retorno,
    },
  };
}
