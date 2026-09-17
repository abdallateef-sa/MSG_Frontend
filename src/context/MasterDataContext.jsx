import { createContext, useContext, useState } from 'react';
import { MOCK_COMPANIES, MOCK_REGIONS, MOCK_CITIES } from '@/constants/mockMasterData';
import { SUPERVISORS } from '@/constants/supervisors';

const MasterDataContext = createContext(null);

let companySeq = MOCK_COMPANIES.length;
let warehouseSeq = MOCK_COMPANIES.reduce((sum, company) => sum + company.warehouses.length, 0);

function nextCompanyCode() {
  companySeq += 1;
  return `CMP-${String(companySeq).padStart(3, '0')}`;
}

function nextWarehouseCode() {
  warehouseSeq += 1;
  return `WH-${String(warehouseSeq).padStart(3, '0')}`;
}

export function MasterDataProvider({ children }) {
  // Companies here represent MSG clients (the company is the client).
  const [companies, setCompanies] = useState(MOCK_COMPANIES);
  const [regions, setRegions] = useState(MOCK_REGIONS);
  const [cities, setCities] = useState(MOCK_CITIES);
  const [supervisors, setSupervisors] = useState(SUPERVISORS);

  const addCompany = (data) =>
    setCompanies((current) => [
      ...current,
      {
        ...data,
        id: `comp-${Date.now()}`,
        code: data.code || nextCompanyCode(),
        status: data.status || 'active',
        warehouses: [],
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);

  const updateCompany = (id, updates) =>
    setCompanies((current) => current.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  const toggleCompany = (id) =>
    setCompanies((current) =>
      current.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c,
      ),
    );

  const addWarehouse = (companyId, data) =>
    setCompanies((current) =>
      current.map((c) =>
        c.id === companyId
          ? {
              ...c,
              warehouses: [
                ...c.warehouses,
                { ...data, id: `wh-${Date.now()}`, code: data.code || nextWarehouseCode(), status: data.status || 'active' },
              ],
            }
          : c,
      ),
    );

  const updateWarehouse = (companyId, warehouseId, updates) =>
    setCompanies((current) =>
      current.map((c) =>
        c.id === companyId
          ? { ...c, warehouses: c.warehouses.map((w) => (w.id === warehouseId ? { ...w, ...updates } : w)) }
          : c,
      ),
    );

  const toggleWarehouse = (companyId, warehouseId) =>
    setCompanies((current) =>
      current.map((c) =>
        c.id === companyId
          ? {
              ...c,
              warehouses: c.warehouses.map((w) =>
                w.id === warehouseId
                  ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
                  : w,
              ),
            }
          : c,
      ),
    );

  const addRegion = (data) =>
    setRegions((current) => [...current, { ...data, id: `region-${Date.now()}` }]);

  const addCity = (data) =>
    setCities((current) => [...current, { ...data, id: `city-${Date.now()}` }]);

  const addSupervisor = (data) =>
    setSupervisors((current) => [
      ...current,
      { ...data, id: data.id || `sup-${Date.now()}` },
    ]);

  const updateSupervisor = (id, updates) =>
    setSupervisors((current) => current.map((s) => (s.id === id ? { ...s, ...updates } : s)));

  const value = {
    companies,
    regions,
    cities,
    supervisors,
    addCompany,
    updateCompany,
    toggleCompany,
    addWarehouse,
    updateWarehouse,
    toggleWarehouse,
    addRegion,
    addCity,
    addSupervisor,
    updateSupervisor,
  };

  return <MasterDataContext.Provider value={value}>{children}</MasterDataContext.Provider>;
}

export function useMasterData() {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
}

export default MasterDataContext;
