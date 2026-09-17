/**
 * Resolves a request's company/warehouse ids into localized display names.
 * Companies are provided by the master-data store. Returns null when no
 * assignment exists.
 */
export function resolveAssignment(request, isAr = true, companies = []) {
  const company = companies.find((item) => item.id === request?.companyId);
  const warehouse = company?.warehouses.find((item) => item.id === request?.warehouseId);
  if (!company || !warehouse) return null;
  return {
    company: isAr ? company.nameAr : company.nameEn,
    warehouse: isAr ? warehouse.nameAr : warehouse.nameEn,
  };
}
