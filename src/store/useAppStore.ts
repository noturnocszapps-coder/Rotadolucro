import { create } from 'zustand';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  limit,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { 
  WorkLog, 
  Expense, 
  FuelLog, 
  MaintenanceLog, 
  VehicleSettings, 
  UserWorkProfile, 
  Goal,
  PlatformType
} from '../types';

interface AppState {
  workProfiles: UserWorkProfile[];
  vehicleSettings: VehicleSettings | null;
  workLogs: WorkLog[];
  expenses: Expense[];
  fuelLogs: FuelLog[];
  maintenanceLogs: MaintenanceLog[];
  goals: Goal[];
  loading: boolean;
  initialized: boolean;
  
  fetchData: (userId: string) => Promise<void>;
  addWorkLog: (log: Omit<WorkLog, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  addFuelLog: (log: Omit<FuelLog, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  addMaintenanceLog: (log: Omit<MaintenanceLog, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateVehicleSettings: (settings: Omit<VehicleSettings, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateWorkProfiles: (platforms: PlatformType[]) => Promise<void>;
  updateGoal: (goal: Omit<Goal, 'id' | 'created_at' | 'user_id'>) => Promise<void>;
  updateWorkLog: (id: string, log: Partial<WorkLog>) => Promise<void>;
  deleteWorkLog: (id: string) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  workProfiles: [],
  vehicleSettings: null,
  workLogs: [],
  expenses: [],
  fuelLogs: [],
  maintenanceLogs: [],
  goals: [],
  loading: false,
  initialized: false,

  reset: () => set({
    workProfiles: [],
    vehicleSettings: null,
    workLogs: [],
    expenses: [],
    fuelLogs: [],
    maintenanceLogs: [],
    goals: [],
    loading: false,
    initialized: false
  }),

  fetchData: async (userId: string) => {
    set({ loading: true });
    try {
      const fetchCollection = async (path: string, q?: any) => {
        try {
          const snapshot = await getDocs(q || collection(db, path));
          return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as object }));
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, path);
          return [];
        }
      };

      const [profiles, vehicle, logs, exps, fuels, maints, gls] = await Promise.all([
        fetchCollection('user_work_profiles', query(collection(db, 'user_work_profiles'), where('user_id', '==', userId))),
        fetchCollection('vehicle_settings', query(collection(db, 'vehicle_settings'), where('user_id', '==', userId), limit(1))),
        fetchCollection('work_logs', query(collection(db, 'work_logs'), where('user_id', '==', userId), orderBy('date', 'desc'))),
        fetchCollection('expenses', query(collection(db, 'expenses'), where('user_id', '==', userId), orderBy('date', 'desc'))),
        fetchCollection('fuel_logs', query(collection(db, 'fuel_logs'), where('user_id', '==', userId), orderBy('date', 'desc'))),
        fetchCollection('maintenance_logs', query(collection(db, 'maintenance_logs'), where('user_id', '==', userId), orderBy('date', 'desc'))),
        fetchCollection('goals', query(collection(db, 'goals'), where('user_id', '==', userId), orderBy('created_at', 'desc')))
      ]);

      set({
        workProfiles: profiles as UserWorkProfile[],
        vehicleSettings: (vehicle[0] as VehicleSettings) || null,
        workLogs: logs as WorkLog[],
        expenses: exps as Expense[],
        fuelLogs: fuels as FuelLog[],
        maintenanceLogs: maints as MaintenanceLog[],
        goals: gls as Goal[],
        loading: false,
        initialized: true
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      set({ loading: false, initialized: true });
    }
  },

  addWorkLog: async (log) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'work_logs';
    try {
      const data = { ...log, user_id: user.uid, created_at: new Date().toISOString() };
      const docRef = await addDoc(collection(db, path), data);
      const newLog = { id: docRef.id, ...data } as WorkLog;
      set((state) => ({ workLogs: [newLog, ...state.workLogs] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  addExpense: async (expense) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'expenses';
    try {
      const data = { ...expense, user_id: user.uid, created_at: new Date().toISOString() };
      const docRef = await addDoc(collection(db, path), data);
      const newExpense = { id: docRef.id, ...data } as Expense;
      set((state) => ({ expenses: [newExpense, ...state.expenses] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  addFuelLog: async (log) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'fuel_logs';
    try {
      const data = { ...log, user_id: user.uid, created_at: new Date().toISOString() };
      const docRef = await addDoc(collection(db, path), data);
      const newLog = { id: docRef.id, ...data } as FuelLog;
      set((state) => ({ fuelLogs: [newLog, ...state.fuelLogs] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  addMaintenanceLog: async (log) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'maintenance_logs';
    try {
      const data = { ...log, user_id: user.uid, created_at: new Date().toISOString() };
      const docRef = await addDoc(collection(db, path), data);
      const newLog = { id: docRef.id, ...data } as MaintenanceLog;
      set((state) => ({ maintenanceLogs: [newLog, ...state.maintenanceLogs] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  updateVehicleSettings: async (settings) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'vehicle_settings';
    
    try {
      const current = get().vehicleSettings;
      if (current) {
        await updateDoc(doc(db, path, current.id), settings);
        set({ vehicleSettings: { ...current, ...settings } });
      } else {
        const data = { ...settings, user_id: user.uid, created_at: new Date().toISOString() };
        const docRef = await addDoc(collection(db, path), data);
        set({ vehicleSettings: { id: docRef.id, ...data } as VehicleSettings });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  updateWorkProfiles: async (platforms) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'user_work_profiles';

    try {
      // Remove existing
      const q = query(collection(db, path), where('user_id', '==', user.uid));
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map(d => deleteDoc(doc(db, path, d.id))));
      
      // Add new
      const newProfiles = platforms.map(p => ({ 
        user_id: user.uid, 
        platform_type: p, 
        active: true,
        created_at: new Date().toISOString()
      }));
      
      const addedProfiles = await Promise.all(newProfiles.map(async p => {
        const ref = await addDoc(collection(db, path), p);
        return { id: ref.id, ...p } as UserWorkProfile;
      }));
      
      set({ workProfiles: addedProfiles });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  updateGoal: async (goal) => {
    const user = auth.currentUser;
    if (!user) return;
    const path = 'goals';

    try {
      // Deactivate others
      const q = query(collection(db, path), where('user_id', '==', user.uid), where('active', '==', true));
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map(d => updateDoc(doc(db, path, d.id), { active: false })));

      const data = { ...goal, user_id: user.uid, created_at: new Date().toISOString() };
      const docRef = await addDoc(collection(db, path), data);
      const newGoal = { id: docRef.id, ...data } as Goal;
      set((state) => ({ goals: [newGoal, ...state.goals] }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  updateWorkLog: async (id, log) => {
    const path = 'work_logs';
    try {
      await updateDoc(doc(db, path, id), log);
      set((state) => ({
        workLogs: state.workLogs.map((l) => (l.id === id ? { ...l, ...log } : l))
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  deleteWorkLog: async (id) => {
    const path = 'work_logs';
    try {
      await deleteDoc(doc(db, path, id));
      set((state) => ({
        workLogs: state.workLogs.filter((l) => l.id !== id)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  updateExpense: async (id, expense) => {
    const path = 'expenses';
    try {
      await updateDoc(doc(db, path, id), expense);
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...expense } : e))
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  deleteExpense: async (id) => {
    const path = 'expenses';
    try {
      await deleteDoc(doc(db, path, id));
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}));
