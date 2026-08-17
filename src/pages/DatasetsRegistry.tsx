import React, { useState } from 'react';
import {
  Database,
  Search,
  CheckCircle2,
  ExternalLink,
  Activity,
  Layers,
  Code,
  Download,
  Flame,
  Droplets,
  ShieldAlert,
  Car,
  Users,
  Building2,
  Wind,
  Radio,
  Clock,
  ChevronDown,
  ChevronUp,
  Cpu,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  BarChart,
  Check,
  AlertTriangle,
  X
} from 'lucide-react';
import rawDatasets from '../dummy-data/datasets.json';
import { DatasetItem, DataCategory } from '../types/dataset';
import { MLModelMeta, InferenceResult } from '../types/ml';
import { useApp } from '../context/AppContext';

export const DatasetsRegistry: React.FC = () => {
  const { addNotification, activeModels, trainingProgress, runModelInference, retrainModelJob } = useApp();
  const [datasets] = useState<DatasetItem[]>(rawDatasets as DatasetItem[]);
  
  const [activeTab, setActiveTab] = useState<'datasets' | 'models'>('datasets');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedPayloadId, setExpandedPayloadId] = useState<string | null>(null);

  // Playground Modal State
  const [playgroundModalOpen, setPlaygroundModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<MLModelMeta>(activeModels[0]);
  
  // Custom slider inputs for the live playground
  const [inputSliders, setInputSliders] = useState<Record<string, number>>({
    tempC: 485,
    smokePct: 88,
    solventDistM: 25,
    displacementMm: 14.8,
    porePressureKpa: 42.6,
    gaugeDepthM: 3.42,
    rainRateMmh: 8.4,
    lelPct: 68,
    windSpeedKmh: 28,
    windDirDeg: 65,
    magnitudeMl: 4.2,
    microstrain: 342
  });

  const [liveInference, setLiveInference] = useState<InferenceResult | null>(null);

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Datasets', value: 'ALL', icon: <Database className="w-3.5 h-3.5" /> },
    { label: 'Fire & Thermal', value: 'Fire & Thermal', icon: <Flame className="w-3.5 h-3.5 text-orange-500" /> },
    { label: 'Flood & Hydro', value: 'Flood & Hydro', icon: <Droplets className="w-3.5 h-3.5 text-blue-500" /> },
    { label: 'Landslide & Terrain', value: 'Landslide & Terrain', icon: <Layers className="w-3.5 h-3.5 text-amber-600" /> },
    { label: 'Gas & Chemical', value: 'Gas & Chemical', icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-500" /> },
    { label: 'Seismic & Structural', value: 'Seismic & Structural', icon: <Activity className="w-3.5 h-3.5 text-rose-500" /> },
    { label: 'Traffic & Transit', value: 'Traffic & Transit', icon: <Car className="w-3.5 h-3.5 text-sky-500" /> },
    { label: 'Crowd & Pedestrian', value: 'Crowd & Pedestrian', icon: <Users className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: 'Hospital & Medical', value: 'Hospital & Medical', icon: <Building2 className="w-3.5 h-3.5 text-blue-600" /> },
    { label: 'Weather & Climate', value: 'Weather & Climate', icon: <Wind className="w-3.5 h-3.5 text-cyan-500" /> }
  ];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const filteredModels = activeModels.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.architecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.hazardDomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.datasetName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || m.hazardDomain.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  const handleOpenPlayground = (model: MLModelMeta) => {
    setSelectedModel(model);
    const result = runModelInference(model.id, inputSliders);
    setLiveInference(result);
    setPlaygroundModalOpen(true);
  };

  const handleSliderChange = (key: string, val: number) => {
    const updated = { ...inputSliders, [key]: val };
    setInputSliders(updated);
    if (selectedModel) {
      const res = runModelInference(selectedModel.id, updated);
      setLiveInference(res);
    }
  };

  const handleRetrain = async (modelId: string) => {
    await retrainModelJob(modelId, 8);
  };

  const getStatusBadge = (status: DatasetItem['status']) => {
    switch (status) {
      case 'ACTIVE_STREAM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Stream
          </span>
        );
      case 'SYNCHRONIZED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            Synchronized
          </span>
        );
      case 'ML_MODEL_TRAINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-extrabold shadow-2xs">
            <Activity className="w-3 h-3 text-purple-600" />
            ML Model Trained
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200 text-[10px] font-extrabold shadow-2xs">
            Historical Baseline
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 text-left font-sans">
      
      {/* Top Header & Switcher (Apple Liquid Glassmorphism) */}
      <div className="liquid-glass-card p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Multi-Hazard Datasets & ML Model Training Studio
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200 shadow-2xs">
              {activeModels.length} Active AI Models
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time multi-hazard telemetry feeds, feature weights, neural loss convergence & background inferencing
          </p>
        </div>

        {/* Tab Switcher & Search */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="flex items-center bg-white/60 p-0.5 rounded-xl border border-white/80 shadow-2xs backdrop-blur-md">
            <button
              onClick={() => setActiveTab('datasets')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'datasets'
                  ? 'liquid-glass-pill text-slate-900 shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Datasets Registry ({datasets.length})
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'models'
                  ? 'liquid-glass-pill text-blue-700 shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              AI Models & Training ({activeModels.length})
            </button>
          </div>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 liquid-glass-pill rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all flex-shrink-0 cursor-pointer ${
              selectedCategory === cat.value
                ? 'liquid-glass-blue text-blue-700 font-extrabold border border-blue-300 shadow-xs'
                : 'liquid-glass-pill text-slate-600 hover:text-slate-900 shadow-2xs'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Datasets Registry */}
      {activeTab === 'datasets' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDatasets.map(dataset => {
            const isExpanded = expandedPayloadId === dataset.id;
            const connectedModel = activeModels.find(m => m.datasetId === dataset.id);

            return (
              <div
                key={dataset.id}
                className="liquid-glass-card p-5 rounded-2xl space-y-4 text-left hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                {/* Header: ID + Title + Provider + Status Badge */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {dataset.id} • {dataset.category}
                    </span>
                    {getStatusBadge(dataset.status)}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    {dataset.name}
                  </h3>
                  <p className="text-[11px] text-blue-600 font-semibold flex items-center space-x-1">
                    <span>🏢 Provider:</span>
                    <span className="text-slate-700">{dataset.provider}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed bg-white/50 p-3 rounded-xl border border-white/60">
                  {dataset.description}
                </p>

                {/* Metadata Grid */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-white/60 rounded-xl border border-white/80 text-[11px] shadow-2xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-sans font-bold">FORMAT</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{dataset.format}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-sans font-bold">CADENCE</span>
                    <span className="font-bold text-slate-800 truncate block mt-0.5">{dataset.updateCadence}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-sans font-bold">RECORDS</span>
                    <span className="font-bold text-emerald-600 truncate block mt-0.5">{dataset.recordsCount}</span>
                  </div>
                </div>

                {/* Connected ML Model Tag & Action */}
                {connectedModel && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-blue-700 tracking-wider block">CONNECTED AI MODEL</span>
                      <span className="text-xs font-bold text-slate-900">{connectedModel.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 block">{connectedModel.architecture} (Acc: {connectedModel.accuracy}%)</span>
                    </div>
                    <button
                      onClick={() => handleOpenPlayground(connectedModel)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Test Model</span>
                    </button>
                  </div>
                )}

                {/* Monitored Fields Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    MONITORED TELEMETRY FIELDS ({dataset.monitoredFields.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {dataset.monitoredFields.map(f => (
                      <span
                        key={f.name}
                        title={`${f.description} (${f.type}${f.unit ? `, ${f.unit}` : ''})`}
                        className="px-2 py-0.5 bg-slate-100/90 text-slate-700 rounded-md text-[10px] font-mono font-semibold border border-slate-200"
                      >
                        {f.name} {f.unit && <span className="text-slate-400">({f.unit})</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sample Payload Accordion */}
                <div className="pt-2 border-t border-white/60 space-y-2">
                  <button
                    onClick={() => setExpandedPayloadId(isExpanded ? null : dataset.id)}
                    className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                  >
                    <span className="flex items-center space-x-1.5 text-blue-600">
                      <Code className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Live Payload Sample' : 'View Live Payload Sample (JSON)'}</span>
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800 shadow-inner">
                      {JSON.stringify(dataset.samplePayload, null, 2)}
                    </pre>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: AI Models & Training Studio */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredModels.map(model => {
            const trainState = trainingProgress[model.id];
            const isTraining = trainState?.status === 'TRAINING';

            return (
              <div
                key={model.id}
                className="liquid-glass-card p-5 rounded-2xl space-y-4 text-left hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                {/* Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {model.id} • {model.hazardDomain}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold shadow-2xs">
                      ⚡ {model.accuracy}% Accuracy
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    {model.name}
                  </h3>
                  <p className="text-[11px] text-blue-700 font-semibold flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Architecture: {model.architecture}</span>
                  </p>
                </div>

                {/* Benchmark Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 p-3 bg-white/60 rounded-xl border border-white/80 text-center font-mono shadow-2xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">AUC-ROC</span>
                    <span className="text-xs font-black text-slate-900">{model.aucRoc}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">F1-SCORE</span>
                    <span className="text-xs font-black text-slate-900">{model.f1Score}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">LATENCY</span>
                    <span className="text-xs font-black text-blue-600">{model.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">EPOCHS</span>
                    <span className="text-xs font-black text-emerald-600">{model.epochsTrained}</span>
                  </div>
                </div>

                {/* Feature Importance Weights */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    FEATURE IMPORTANCE WEIGHTS (DATASET CORRELATION)
                  </span>
                  <div className="space-y-1.5">
                    {model.featureImportances.map((f, i) => (
                      <div key={i} className="space-y-0.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-700 font-medium">
                          <span className="truncate max-w-[240px]">{f.feature}</span>
                          <span className="font-mono font-bold text-slate-900">{Math.round(f.weight * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all"
                            style={{ width: `${f.weight * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Epoch Progress Bar if active */}
                {isTraining && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                      <span>Training Epoch {trainState.currentEpoch}/{trainState.totalEpochs}</span>
                      <span>Loss: {trainState.currentLoss}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-purple-200 overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all"
                        style={{ width: `${(trainState.currentEpoch / trainState.totalEpochs) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions: Retrain & Interactive Playground */}
                <div className="flex items-center justify-between pt-2 border-t border-white/60">
                  <button
                    onClick={() => handleRetrain(model.id)}
                    disabled={isTraining}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
                    <span>{isTraining ? 'Retraining...' : 'Retrain on Dataset'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenPlayground(model)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Inference Playground</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Live ML Playground Modal */}
      {playgroundModalOpen && selectedModel && liveInference && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass-card bg-white/95 rounded-3xl p-6 max-w-3xl w-full space-y-5 shadow-2xl border border-white/90 max-h-[90vh] overflow-y-auto text-left">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">
                    LIVE AI INFERENCE ENGINE
                  </span>
                  <span className="text-xs font-mono text-slate-400">Model: {selectedModel.id}</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-1">
                  {selectedModel.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Wired to Dataset: <strong className="text-slate-800">{selectedModel.datasetName}</strong>
                </p>
              </div>

              <button
                onClick={() => setPlaygroundModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Playground 2-Column Grid: Sliders on Left, Live Inference on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Left Column: Interactive Input Sliders */}
              <div className="space-y-3.5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70">
                <div className="flex items-center space-x-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>Real-time Feature Inputs</span>
                </div>

                {/* Fire Sliders */}
                {selectedModel.id === 'ML-FIRE-01' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Thermal Array Temp: {inputSliders.tempC}°C</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="600"
                        step="5"
                        value={inputSliders.tempC}
                        onChange={e => handleSliderChange('tempC', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Smoke Obscuration: {inputSliders.smokePct}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={inputSliders.smokePct}
                        onChange={e => handleSliderChange('smokePct', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Solvent Tank Distance: {inputSliders.solventDistM}m</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        step="1"
                        value={inputSliders.solventDistM}
                        onChange={e => handleSliderChange('solventDistM', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                    </div>
                  </div>
                )}

                {/* Landslide Sliders */}
                {selectedModel.id === 'ML-SLOPE-03' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>InSAR Displacement: {inputSliders.displacementMm} mm</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.5"
                        value={inputSliders.displacementMm}
                        onChange={e => handleSliderChange('displacementMm', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Soil Pore Pressure: {inputSliders.porePressureKpa} kPa</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="70"
                        step="1"
                        value={inputSliders.porePressureKpa}
                        onChange={e => handleSliderChange('porePressureKpa', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* Flood Sliders */}
                {selectedModel.id === 'ML-FLOOD-02' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>River Gauge Depth: {inputSliders.gaugeDepthM}m</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="6.0"
                        step="0.1"
                        value={inputSliders.gaugeDepthM}
                        onChange={e => handleSliderChange('gaugeDepthM', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Rainfall Intensity: {inputSliders.rainRateMmh} mm/h</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        step="0.5"
                        value={inputSliders.rainRateMmh}
                        onChange={e => handleSliderChange('rainRateMmh', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                      />
                    </div>
                  </div>
                )}

                {/* Gas Sliders */}
                {selectedModel.id === 'ML-GAS-04' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Methane Concentration: {inputSliders.lelPct}% LEL</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={inputSliders.lelPct}
                        onChange={e => handleSliderChange('lelPct', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Wind Speed: {inputSliders.windSpeedKmh} km/h</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="1"
                        value={inputSliders.windSpeedKmh}
                        onChange={e => handleSliderChange('windSpeedKmh', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
                      />
                    </div>
                  </div>
                )}

                {/* Seismic Sliders */}
                {selectedModel.id === 'ML-SEIS-05' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Richter Magnitude: {inputSliders.magnitudeMl} ML</span>
                      </div>
                      <input
                        type="range"
                        min="1.0"
                        max="7.5"
                        step="0.1"
                        value={inputSliders.magnitudeMl}
                        onChange={e => handleSliderChange('magnitudeMl', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Roof Truss Microstrain: {inputSliders.microstrain} με</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="600"
                        step="10"
                        value={inputSliders.microstrain}
                        onChange={e => handleSliderChange('microstrain', Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                    </div>
                  </div>
                )}

                {/* Fallback info for other models */}
                {!['ML-FIRE-01', 'ML-SLOPE-03', 'ML-FLOOD-02', 'ML-GAS-04', 'ML-SEIS-05'].includes(selectedModel.id) && (
                  <p className="text-xs text-slate-500">
                    Model inputs mapped to continuous real-time dataset stream: {selectedModel.datasetName}.
                  </p>
                )}
              </div>

              {/* Right Column: Live Model Output */}
              <div className="space-y-3.5 p-4 bg-blue-50/40 rounded-2xl border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-xs font-extrabold text-blue-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Instant AI Prediction</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white text-blue-700 font-extrabold text-[10px] border border-blue-200 shadow-2xs">
                    {liveInference.confidence}% Confidence
                  </span>
                </div>

                {/* Primary Risk & Severity */}
                <div className="p-3 bg-white rounded-xl border border-white/80 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">PREDICTED RISK SCORE</span>
                    <span className="text-xl font-black text-rose-600">{liveInference.riskScore}/100</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">{liveInference.predictedCategory}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                    liveInference.severityLevel === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    ● {liveInference.severityLevel}
                  </span>
                </div>

                {/* Causality Breakdown */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-white/90">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider block">
                    EXPLAINABLE REASONING CHAIN (3-FACTOR)
                  </span>
                  {liveInference.causalityChain.map((reason, i) => (
                    <p key={i} className="leading-relaxed">
                      • {reason}
                    </p>
                  ))}
                </div>

                {/* Recommended Autonomous Dispatch */}
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-extrabold text-[10px] uppercase text-emerald-700 block tracking-wider">
                    RECOMMENDED AUTONOMOUS ACTION
                  </span>
                  <p className="font-semibold mt-0.5 leading-relaxed">{liveInference.recommendedAction}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default DatasetsRegistry;
