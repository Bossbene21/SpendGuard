import React, { useState } from 'react';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoScenarioTour: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedAnomalyId,
    setIsAddModalOpen,
    setIsWhySpendGuardOpen
  } = useApp();

  const [isOpen, setIsOpen] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      title: 'Step 1: Executive Dashboard',
      description: 'Review overall spending trajectory, KPI metrics, and category envelopes calibrated against historical baselines.',
      actionLabel: 'Go to Dashboard',
      action: () => {
        setActiveTab('dashboard');
        setSelectedAnomalyId(null);
      }
    },
    {
      title: 'Step 2: Anomaly Center & Flagship Case',
      description: 'Observe multi-factor anomaly detection. Click the ₹8,750 TechZone Electronics case flagged with Critical 89/100 score.',
      actionLabel: 'Inspect TechZone Anomaly',
      action: () => {
        setActiveTab('anomalies');
        setSelectedAnomalyId('tx-anomaly-01');
      }
    },
    {
      title: 'Step 3: Test Real-Time Evaluation',
      description: 'Open the Add Expense dialog to simulate an instant anomaly evaluation with duplicate detection or extreme outliers.',
      actionLabel: 'Open Add Expense Modal',
      action: () => {
        setIsAddModalOpen(true);
      }
    },
    {
      title: 'Step 4: Predictive What-If Simulation',
      description: 'Forecast the impact of a hypothetical ₹5,000 expense before making it to assess overrun risk and predicted anomaly score.',
      actionLabel: 'Open What-If Simulator',
      action: () => {
        setActiveTab('whatif');
      }
    },
    {
      title: 'Step 5: Synthesized AI Insights',
      description: 'Review deterministic behavioral telemetry (weekend spending premium, trend persistence, and budget velocity alerts).',
      actionLabel: 'View AI Insights',
      action: () => {
        setActiveTab('insights');
      }
    }
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-glow-sm shadow-indigo-500/30 flex items-center gap-2 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Judge Demo Guide</span>
      </button>
    );
  }

  const currentStep = steps[currentStepIndex];

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-md w-full bg-[#0F172A] border border-indigo-500/40 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            IEEE Judge Tour ({currentStepIndex + 1}/{steps.length})
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-2.5">
        <h4 className="text-xs font-bold text-indigo-300">{currentStep.title}</h4>
        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
          {currentStep.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center gap-1">
          <button
            disabled={currentStepIndex === 0}
            onClick={() => {
              const prev = currentStepIndex - 1;
              setCurrentStepIndex(prev);
              steps[prev].action();
            }}
            className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={currentStepIndex === steps.length - 1}
            onClick={() => {
              const next = currentStepIndex + 1;
              setCurrentStepIndex(next);
              steps[next].action();
            }}
            className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-700"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => {
            currentStep.action();
            if (currentStepIndex < steps.length - 1) {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all"
        >
          <span>{currentStep.actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
