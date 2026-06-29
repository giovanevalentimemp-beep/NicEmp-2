export const companies = [
  { id: "empresa-1", name: "Empresa Exemplo", document: "00.000.000/0001-00" },
  { id: "empresa-2", name: "Nova Unidade", document: "11.111.111/0001-11" },
];

export const dreRows = [
  { group: "Receitas", description: "Receita bruta", amount: 125000 },
  { group: "Custos", description: "Custos variaveis", amount: -42000 },
  { group: "Despesas", description: "Despesas operacionais", amount: -31000 },
  { group: "Resultado", description: "Resultado liquido", amount: 52000 },
];

export const cashflowRows = [
  { type: "Entrada", category: "Vendas", costCenter: "Comercial", amount: 85000 },
  { type: "Saida", category: "Fornecedores", costCenter: "Operacao", amount: -26000 },
  { type: "Saida", category: "Folha", costCenter: "Administrativo", amount: -18000 },
];

export const indicators = [
  { label: "ROI", value: "34,5%" },
  { label: "Margem", value: "41,6%" },
  { label: "Markup", value: "1,82x" },
  { label: "Capital de Giro", value: "R$ 38.000" },
  { label: "Ticket Medio", value: "R$ 420" },
  { label: "Ponto de Equilibrio", value: "R$ 58.000" },
  { label: "Faturamento", value: "R$ 125.000" },
  { label: "Lucro Liquido", value: "R$ 52.000" },
];
