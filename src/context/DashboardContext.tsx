import { createContext, useState, useContext, useEffect, type ReactNode } from "react";

const SERVER_URL = "http://localhost:4000";

export interface DieselEntry {
  id: string;
  date: string;
  amount: number;
  litres: number;
  type: string;
  vehicle?: string;
}
 

export interface SalaryEntry {
  id: string;
  date: string;
  amount: number;
}

export interface InsuranceEntry {
  id: string;
  date: string;
  amount: number;
  price?: number;
  type: string;
  vehicle?: string;
}

export interface MileageEntry {
  id: string;
  date: string;
  mileage?: number;
  route?: string;
  amount: number;
  currency: 'KES' | 'USD';
  country?: string;
  county?: string;
  company?: string;
  type: 'in' | 'out';
}

export interface ProductEntry {
  id: string;
  date: string;
  spareParts: string;
  truckNumber: string;
  price: number;
}

export interface ServiceEntry {
  id: string;
  date: string;
  accessories: string;
  issuedBy: string;
  fittedBy: string;
  approvedBy: string;
  truckNumber?: string;
}

export interface OtherQueryEntry {
  id: string;
  date: string;
  name: string;
  description: string;
}

export interface OtherExpenseEntry {
  id: string;
  date: string;
  name: string;
  description: string;
  amount: number;
}

interface DashboardContextType {
  diesel: DieselEntry[];
  salary: SalaryEntry[];
  insurance: InsuranceEntry[];
  mileage: MileageEntry[];
  products: ProductEntry[];
  services: ServiceEntry[];
  otherQueries: OtherQueryEntry[];
  otherExpenses: OtherExpenseEntry[];
  reportSelection: { salary: boolean; diesel: boolean; insurance: boolean; mileage: boolean };
  setReportSelection: (selection: { salary: boolean; diesel: boolean; insurance: boolean; mileage: boolean }) => void;
  addOtherQuery: (entry: Omit<OtherQueryEntry, "id">) => void;
  addOtherExpense: (entry: Omit<OtherExpenseEntry, "id">) => void;
  removeOtherQuery: (id: string) => void;
  removeOtherExpense: (id: string) => void;
  addDiesel: (entry: Omit<DieselEntry, "id">) => void;
  addSalary: (entry: Omit<SalaryEntry, "id">) => void;
  addInsurance: (entry: Omit<InsuranceEntry, "id">) => void;
  addMileage: (entry: Omit<MileageEntry, "id">) => void;
  updateMileage: (id: string, entry: Partial<MileageEntry>) => void;
  addProduct: (entry: Omit<ProductEntry, "id">) => void;
  addService: (entry: Omit<ServiceEntry, "id">) => void;
  removeDiesel: (id: string) => void;
  removeSalary: (id: string) => void;
  removeInsurance: (id: string) => void;
  removeMileage: (id: string) => void;
  removeProduct: (id: string) => void;
  removeService: (id: string) => void;
  backupData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [diesel, setDiesel] = useState<DieselEntry[]>([]);
  const [salary, setSalary] = useState<SalaryEntry[]>([]);
  const [insurance, setInsurance] = useState<InsuranceEntry[]>([]);
  const [mileage, setMileage] = useState<MileageEntry[]>([]);
  const [products, setProducts] = useState<ProductEntry[]>([]);
  const [services, setServices] = useState<ServiceEntry[]>([]);
  const [otherQueries, setOtherQueries] = useState<OtherQueryEntry[]>([]);
  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseEntry[]>([]);

  const [reportSelection, setReportSelection] = useState({ salary: true, diesel: true, insurance: true, mileage: true });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("dashboard_state");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Migrate herocien to herocean in mileage entries and add type if missing
        const migratedMileage = (parsed.mileage || []).map((entry: any) => ({
          ...entry,
          company: entry.company === 'herocien' ? 'herocean' : entry.company,
          type: entry.type || 'out' // default to 'out' for existing entries
        }));

        // Check if migration was needed
        const wasMigrated = migratedMileage.some((_: any, index: number) =>
          parsed.mileage?.[index]?.company === 'herocien'
        );

        setDiesel(parsed.diesel || []);
        setSalary(parsed.salary || []);
        setInsurance(parsed.insurance || []);
        setMileage(migratedMileage);
        setProducts(parsed.products || []);
        setServices(parsed.services || []);
        setOtherQueries(parsed.otherQueries || []);
        setOtherExpenses(parsed.otherExpenses || []);

        // If migration occurred, save the corrected data back to localStorage
        if (wasMigrated) {
          const correctedData = {
            ...parsed,
            mileage: migratedMileage
          };
          localStorage.setItem("dashboard_state", JSON.stringify(correctedData));
          localStorage.setItem("dashboard_state_last_saved", String(Date.now()));
        }
      }
    } catch (e) {
      console.warn("Failed to load from localStorage", e);
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      backupData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [diesel, salary, insurance, mileage, products, services, otherQueries, otherExpenses]);




  

  const addDiesel = (entry: Omit<DieselEntry, "id">) => {
    setDiesel([...diesel, { ...entry, id: Date.now().toString() }]);
  };

  const addSalary = (entry: Omit<SalaryEntry, "id">) => {
    setSalary([...salary, { ...entry, id: Date.now().toString() }]);
  };

  const addInsurance = (entry: Omit<InsuranceEntry, "id">) => {
    setInsurance([...insurance, { ...entry, id: Date.now().toString() }]);
  };

  const addMileage = (entry: Omit<MileageEntry, "id">) => {
    setMileage([...mileage, { ...entry, id: Date.now().toString() }]);
  };

  const updateMileage = (id: string, entry: Partial<MileageEntry>) => {
    setMileage(mileage.map((m) => (m.id === id ? { ...m, ...entry } : m)));
  };

  const addProduct = (entry: Omit<ProductEntry, "id">) => {
    setProducts([...products, { ...entry, id: Date.now().toString() }]);
  };

  const addOtherQuery = (entry: Omit<OtherQueryEntry, "id">) => {
    setOtherQueries([...otherQueries, { ...entry, id: Date.now().toString() }]);
  };

  const addOtherExpense = (entry: Omit<OtherExpenseEntry, "id">) => {
    setOtherExpenses([...otherExpenses, { ...entry, id: Date.now().toString() }]);
  };

  const addService = (entry: Omit<ServiceEntry, "id">) => {
    setServices([...services, { ...entry, id: Date.now().toString() }]);
  };

  const removeDiesel = (id: string) => {
    setDiesel(diesel.filter((item) => item.id !== id));
  };

  const removeSalary = (id: string) => {
    setSalary(salary.filter((item) => item.id !== id));
  };

  const removeInsurance = (id: string) => {
    setInsurance(insurance.filter((item) => item.id !== id));
  };

  const removeMileage = (id: string) => {
    setMileage(mileage.filter((item) => item.id !== id));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  const removeOtherQuery = (id: string) => {
    setOtherQueries(otherQueries.filter((item) => item.id !== id));
  };

  const removeOtherExpense = (id: string) => {
    setOtherExpenses(otherExpenses.filter((item) => item.id !== id));
  };

  const removeService = (id: string) => {
    setServices(services.filter((item) => item.id !== id));
  };

  const backupData = async () => {
    const toSave = {
      diesel,
      salary,
      insurance,
      mileage,
      products,
      services,
      otherQueries,
      otherExpenses,
    };
    try {
      await fetch(`${SERVER_URL}/backup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      });
    } catch (e) {
      console.warn("Failed to save to server", e);
    }
    try {
      localStorage.setItem("dashboard_state", JSON.stringify(toSave));
      localStorage.setItem("dashboard_state_last_saved", String(Date.now()));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        diesel,
        salary,
        insurance,
        mileage,
        products,
        services,
        otherQueries,
        otherExpenses,
        reportSelection,
        setReportSelection,
        addDiesel,
        addSalary,
        addInsurance,
        addMileage,
        updateMileage,
        addProduct,
        addOtherQuery,
        addOtherExpense,
        addService,
        removeDiesel,
        removeSalary,
        removeInsurance,
        removeMileage,
        removeProduct,
        removeOtherQuery,
        removeOtherExpense,
        removeService,
        backupData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
