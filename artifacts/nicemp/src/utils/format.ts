export function parseCurrency(value: string): number {
  const parsed = Number.parseFloat(value.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parsePercent(value: string): number {
  const parsed = Number.parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPct(value: number): string {
  return `${(value * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

export function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return formatBRL(Number.parseInt(digits, 10) / 100);
}

export function maskPercent(raw: string): string {
  const clean = raw.replace(/[^0-9,.]/g, "").replace(".", ",");
  const parts = clean.split(",");
  if (parts.length > 2) return `${parts[0]},${parts[1]}`;
  if (parts[1] !== undefined) return `${parts[0]},${parts[1].slice(0, 2)}`;
  return clean;
}
