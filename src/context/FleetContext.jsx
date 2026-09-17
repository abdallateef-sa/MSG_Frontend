import { createContext, useContext, useState } from 'react';

const FleetContext = createContext(null);

export function FleetProvider({ children }) {
  // Session-only fleet state (mock, no backend yet):
  // - addedVehicles: vehicles created manually
  // - overrides: edits applied to derived (employee) vehicles, keyed by id
  // - removedIds: ids hidden from the derived fleet
  const [addedVehicles, setAddedVehicles] = useState([]);
  const [overrides, setOverrides] = useState({});
  const [removedIds, setRemovedIds] = useState([]);

  const addVehicle = (vehicle) => setAddedVehicles((current) => [vehicle, ...current]);

  const updateVehicle = (id, updates) => {
    setOverrides((current) => ({ ...current, [id]: { ...(current[id] || {}), ...updates } }));
    setAddedVehicles((current) =>
      current.map((vehicle) => (vehicle.id === id ? { ...vehicle, ...updates } : vehicle)),
    );
  };

  const removeVehicle = (id) => {
    setRemovedIds((current) => (current.includes(id) ? current : [...current, id]));
    setAddedVehicles((current) => current.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <FleetContext.Provider
      value={{ addedVehicles, overrides, removedIds, addVehicle, updateVehicle, removeVehicle }}
    >
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error('useFleet must be used within a FleetProvider');
  }
  return context;
}

export default FleetContext;
