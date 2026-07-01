export const companies = [
  { id: "empresa-1", name: "Empresa Principal Ltda" },
  { id: "empresa-2", name: "Filial São Paulo" },
];

export const dreRows = [
  { group: "Receita", description: "Receita Bruta de Vendas", amount: 125000 },
  { group: "Receita", description: "Deduções e Impostos", amount: -12500 },
  { group: "Custos", description: "Custo dos Produtos Vendidos", amount: -45000 },
  { group: "Despesas", description: "Despesas Operacionais", amount: -15500 },
  { group: "Resultado", description: "Lucro Operacional", amount: 52000 },
];

export const cashflowRows = [
  { type: "Entrada", category: "Vendas", costCenter: "Comercial", amount: 85000 },
  { type: "Entrada", category: "Serviços", costCenter: "Consultoria", amount: 40000 },
  { type: "Saída", category: "Fornecedores", costCenter: "Operacional", amount: -32000 },
  { type: "Saída", category: "Salários", costCenter: "RH", amount: -28000 },
  { type: "Saída", category: "Marketing", costCenter: "Marketing", amount: -8500 },
];

export const indicators = [
  { label: "Margem Bruta", value: "64%" },
  { label: "Margem Líquida", value: "41,6%" },
  { label: "EBITDA", value: "R$ 58.000" },
  { label: "Giro de Estoque", value: "4,2x" },
];
