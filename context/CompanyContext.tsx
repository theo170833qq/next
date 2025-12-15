import React, { createContext, useState, useContext, useEffect, PropsWithChildren } from 'react';

export interface CompanyData {
  companyName: string;
  userName: string;
  mrr: number; // Receita Mensal Recorrente
  cashBalance: number; // Caixa Atual
  monthlyBurn: number; // Gastos Mensais
  sector: string;
  currency: string;
}

interface CompanyContextType {
  companyData: CompanyData | null;
  saveCompanyData: (data: CompanyData) => void;
  clearCompanyData: () => void;
  formatCurrency: (value: number) => string;
}

const CompanyContext = createContext<CompanyContextType>({
  companyData: null,
  saveCompanyData: () => {},
  clearCompanyData: () => {},
  formatCurrency: () => '',
});

export const CompanyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    // Tenta carregar dados salvos localmente ao iniciar
    const savedData = localStorage.getItem('next_company_data');
    if (savedData) {
      setCompanyData(JSON.parse(savedData));
    }
  }, []);

  const saveCompanyData = (data: CompanyData) => {
    setCompanyData(data);
    localStorage.setItem('next_company_data', JSON.stringify(data));
  };

  const clearCompanyData = () => {
    setCompanyData(null);
    localStorage.removeItem('next_company_data');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CompanyContext.Provider value={{ companyData, saveCompanyData, clearCompanyData, formatCurrency }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
