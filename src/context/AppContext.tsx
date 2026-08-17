import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident } from '../types/incident';
import { EmergencyResource } from '../types/resource';
import { SensorTelemetry } from '../types/sensor';
import { EvacuationRoute, Shelter, RoadStatus } from '../types/evacuation';
import { User, UserRole } from '../types/user';
import { MLModelMeta, InferenceResult, TrainingProgress } from '../types/ml';
import { defaultMLEngine, INITIAL_ML_MODELS } from '../services/mlEngine';

// Import raw json files
import rawIncidents from '../dummy-data/incidents.json';
import rawResources from '../dummy-data/resources.json';
import rawSensors from '../dummy-data/sensors.json';
import rawEvac from '../dummy-data/evacuation.json';
import rawUsers from '../dummy-data/users.json';

interface AppContextType {
  incidents: Incident[];
  resources: EmergencyResource[];
  sensors: SensorTelemetry[];
  routes: EvacuationRoute[];
  shelters: Shelter[];
  roads: RoadStatus[];
  users: User[];
  currentUser: User | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  setResources: React.Dispatch<React.SetStateAction<EmergencyResource[]>>;
  setSensors: React.Dispatch<React.SetStateAction<SensorTelemetry[]>>;
  setRoutes: React.Dispatch<React.SetStateAction<EvacuationRoute[]>>;
  setShelters: React.Dispatch<React.SetStateAction<Shelter[]>>;
  setRoads: React.Dispatch<React.SetStateAction<RoadStatus[]>>;
  
  // Quick Actions
  addIncident: (incident: Omit<Incident, 'id' | 'reportedAt' | 'timeline'>) => void;
  deployResource: (resourceId: string, incidentId: string) => void;
  resolveIncident: (incidentId: string) => void;
  escalateIncident: (incidentId: string) => void;
  
  // Live Alert Notifications
  notifications: AppNotification[];
  addNotification: (message: string, severity: 'info' | 'warning' | 'error') => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Simulated Event Playback Mode
  simSpeedMultiplier: number;
  setSimSpeedMultiplier: (speed: number) => void;
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;
  triggerPredictiveSimulation: () => Promise<string>;

  // ML Engine & Training Studio
  activeModels: MLModelMeta[];
  trainingProgress: Record<string, TrainingProgress>;
  recentInferences: InferenceResult[];
  runModelInference: (modelId: string, inputs: Record<string, number>) => InferenceResult;
  retrainModelJob: (modelId: string, totalEpochs?: number) => Promise<MLModelMeta>;
}

export interface AppNotification {
  id: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
  read: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cast raw data safely
  const [incidents, setIncidents] = useState<Incident[]>(rawIncidents as Incident[]);
  const [resources, setResources] = useState<EmergencyResource[]>(rawResources as EmergencyResource[]);
  const [sensors, setSensors] = useState<SensorTelemetry[]>(rawSensors as SensorTelemetry[]);
  const [routes, setRoutes] = useState<EvacuationRoute[]>(rawEvac.routes as EvacuationRoute[]);
  const [shelters, setShelters] = useState<Shelter[]>(rawEvac.shelters as Shelter[]);
  const [roads, setRoads] = useState<RoadStatus[]>(rawEvac.roads as RoadStatus[]);
  const [users] = useState<User[]>(rawUsers as User[]);
  
  const [currentRole, setCurrentRoleState] = useState<UserRole>('ADMIN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ML Models & Training State
  const [activeModels, setActiveModels] = useState<MLModelMeta[]>(INITIAL_ML_MODELS);
  const [trainingProgress, setTrainingProgress] = useState<Record<string, TrainingProgress>>({});
  const [recentInferences, setRecentInferences] = useState<InferenceResult[]>([
    defaultMLEngine.predictFireRisk(485, 88, 25),
    defaultMLEngine.predictLandslideRisk(14.8, 42.6, 38)
  ]);
  
  // Set current user based on selected role
  useEffect(() => {
    const matched = users.find(u => u.role === currentRole);
    if (matched) {
      setCurrentUser(matched);
    }
  }, [currentRole, users]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  // Live Alert Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "N1",
      message: "ALERT: Chemical Warehouse Smoke Detector reached CRITICAL threshold (88%).",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      severity: "error",
      read: false
    },
    {
      id: "N2",
      message: "WARNING: InSAR Extensometer Node detected 14.8mm shear displacement on West Ridge.",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: "warning",
      read: false
    },
    {
      id: "N3",
      message: "INFO: Rideau River Gauge RSV-4 warning level breached. Stream rising 0.12m/hr.",
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      severity: "info",
      read: true
    }
  ]);

  const addNotification = (message: string, severity: 'info' | 'warning' | 'error') => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Math.random().toString(36).substr(2, 9)}`,
      message,
      timestamp: new Date(),
      severity,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simulation parameters
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Quick actions implementation
  const addIncident = (incData: Omit<Incident, 'id' | 'reportedAt' | 'timeline'>) => {
    const id = `INC-00${incidents.length + 1}`;
    const newInc: Incident = {
      ...incData,
      id,
      reportedAt: new Date().toISOString(),
      timeline: [
        {
          id: 'T-NEW-1',
          timestamp: new Date().toISOString(),
          event: `Incident established in Smart EOC under category: ${incData.type}`,
          actor: currentUser?.name || 'System Operator',
          type: 'alert'
        }
      ]
    };
    setIncidents(prev => [newInc, ...prev]);
    addNotification(`NEW CRITICAL INCIDENT REPORTED: ${incData.title}`, incData.severity === 'CRITICAL' || incData.severity === 'HIGH' ? 'error' : 'warning');
  };

  const deployResource = (resourceId: string, incidentId: string) => {
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        return {
          ...res,
          status: 'DEPLOYED',
          etaMinutes: Math.floor(Math.random() * 8) + 2,
          capacityLabel: 'Engaged on emergency tactical unit'
        };
      }
      return res;
    }));

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const matchingRes = resources.find(r => r.id === resourceId);
        const resourceName = matchingRes ? matchingRes.name : `Unit ${resourceId}`;
        const newTimelineEvent = {
          id: `T-DISP-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event: `Dispatched & Allocated resource: ${resourceName}`,
          actor: currentUser?.name || 'Tactical Supervisor',
          type: 'dispatch' as const
        };
        return {
          ...inc,
          status: inc.status === 'ACTIVE' ? 'DISPATCHED' : inc.status,
          assignedResources: [...inc.assignedResources, resourceId],
          timeline: [newTimelineEvent, ...inc.timeline]
        };
      }
      return inc;
    }));

    const targetIncident = incidents.find(i => i.id === incidentId);
    const resourceObj = resources.find(r => r.id === resourceId);
    addNotification(`TACTICAL DISPATCH: ${resourceObj?.name || 'Resource'} assigned to ${targetIncident?.title || 'incident'}.`, 'info');
  };

  const resolveIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newEvent = {
          id: `T-RES-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event: `Incident status updated to RESOLVED. All units returning to base.`,
          actor: currentUser?.name || 'Commander-in-charge',
          type: 'resolution' as const
        };
        return {
          ...inc,
          status: 'RESOLVED',
          timeline: [newEvent, ...inc.timeline]
        };
      }
      return inc;
    }));

    const incident = incidents.find(i => i.id === incidentId);
    if (incident) {
      const assignedIds = incident.assignedResources;
      setResources(prev => prev.map(res => {
        if (assignedIds.includes(res.id)) {
          return {
            ...res,
            status: 'AVAILABLE',
            capacityLabel: 'Ready for dispatch'
          };
        }
        return res;
      }));
      addNotification(`INCIDENT RESOLVED: ${incident.title}`, 'info');
    }
  };

  const escalateIncident = (incidentId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const newEvent = {
          id: `T-ESC-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event: `Incident HAZARD LEVEL ESCALATED to Critical level. Inter-agency mutual aid request triggered.`,
          actor: currentUser?.name || 'Chief Commander',
          type: 'alert' as const
        };
        return {
          ...inc,
          severity: 'CRITICAL',
          timeline: [newEvent, ...inc.timeline]
        };
      }
      return inc;
    }));
    
    const target = incidents.find(i => i.id === incidentId);
    if (target) {
      addNotification(`CRITICAL ESCALATION: Mutual aid requested for "${target.title}"!`, 'error');
    }
  };

  // ML Engine Execution
  const runModelInference = (modelId: string, inputs: Record<string, number>): InferenceResult => {
    const result = defaultMLEngine.runInference(modelId, inputs);
    setRecentInferences(prev => [result, ...prev.slice(0, 19)]);
    return result;
  };

  const retrainModelJob = async (modelId: string, totalEpochs: number = 8): Promise<MLModelMeta> => {
    addNotification(`AI TRAINING INITIATED: Retraining model ${modelId} on active dataset...`, 'info');
    
    const updated = await defaultMLEngine.retrainModel(modelId, totalEpochs, (progress) => {
      setTrainingProgress(prev => ({
        ...prev,
        [modelId]: progress
      }));
    });

    setActiveModels(defaultMLEngine.getModels());
    addNotification(`AI TRAINING COMPLETED: ${updated.name} updated to ${updated.accuracy}% accuracy (${totalEpochs} epochs).`, 'info');
    return updated;
  };

  const triggerPredictiveSimulation = (): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSensors(prev => prev.map(s => {
          if (s.type === 'WATER_LEVEL') {
            return {
              ...s,
              currentValue: Math.min(s.currentValue + 0.35, 6.2),
              status: 'CRITICAL'
            };
          }
          return s;
        }));
        
        setShelters(prev => prev.map(sh => {
          if (sh.status === 'OPEN') {
            const newOcc = Math.min(sh.occupancy + 25, sh.capacity);
            return {
              ...sh,
              occupancy: newOcc,
              status: newOcc >= sh.capacity ? 'FULL' : 'OPEN'
            };
          }
          return sh;
        }));

        setRoads(prev => prev.map(r => {
          if (r.id === 'RD-02') {
            return {
              ...r,
              status: 'CLOSED',
              reason: 'PREDICTIVE LOCKOUT: Water overflow reached risk threshold'
            };
          }
          return r;
        }));

        addNotification("PREDICTIVE SCENARIO COMPLETED: Evac Route Beta congestion predicted to reach critical density in 45m. Water overflows detected on River Road.", "error");
        resolve("Simulation output generated: River runoff peaks in 1.5h. 120 residential units mapped into safe zones.");
      }, 1500);
    });
  };

  return (
    <AppContext.Provider value={{
      incidents,
      resources,
      sensors,
      routes,
      shelters,
      roads,
      users,
      currentUser,
      currentRole,
      setCurrentRole,
      setIncidents,
      setResources,
      setSensors,
      setRoutes,
      setShelters,
      setRoads,
      
      addIncident,
      deployResource,
      resolveIncident,
      escalateIncident,
      
      notifications,
      addNotification,
      clearNotification,
      clearAllNotifications,
      
      simSpeedMultiplier,
      setSimSpeedMultiplier,
      isSimulating,
      setIsSimulating,
      triggerPredictiveSimulation,

      activeModels,
      trainingProgress,
      recentInferences,
      runModelInference,
      retrainModelJob
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
