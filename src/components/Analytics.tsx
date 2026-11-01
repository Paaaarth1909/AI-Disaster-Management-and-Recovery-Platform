import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, BarChart3, Activity, ShieldCheck, Box } from 'lucide-react';
import { useDisasterStore } from '../store/disaster';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const { disasters, resources, teams } = useDisasterStore();

  const sortedDisasters = [...disasters].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const disasterTrends = {
    labels: sortedDisasters.map(d => format(new Date(d.created_at), 'MMM d, HH:mm')),
    datasets: [
      {
        label: 'Disaster Threat Severity (1-5)',
        data: sortedDisasters.map(d => d.severity),
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.25)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#f43f5e',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      },
    ],
  };

  const resourceTypes = ['medical', 'food', 'water', 'shelter', 'rescue', 'transport'];
  const resourceAllocation = {
    labels: ['Medical', 'Rations', 'Water', 'Shelter', 'Rescue', 'Logistics'],
    datasets: [
      {
        label: 'Available in Reserve',
        data: resourceTypes.map(
          type => resources.filter(r => r.type === type && r.status === 'available').length
        ),
        backgroundColor: 'rgba(56, 189, 248, 0.75)',
        borderColor: '#38bdf8',
        borderWidth: 1,
        borderRadius: 6
      },
      {
        label: 'Deployed to Field',
        data: resourceTypes.map(
          type => resources.filter(r => r.type === type && r.status === 'deployed').length
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.75)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 6
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cbd5e1',
          font: { family: 'ui-sans-serif, system-ui', size: 11, weight: 'bold' as const },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#fff',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-white">
      
      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Historical Incidents</span>
            <Activity className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">{disasters.length}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Personnel In Field</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {teams.filter(t => t.status === 'responding').length} / {teams.length}
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Logistics Depots</span>
            <Box className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-cyan-400">{resources.length}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Readiness Index</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-amber-400">98.4%</span>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Disaster Severity Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Threat Severity Over Time</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              TIME-SERIES
            </span>
          </div>

          <div className="h-72 w-full">
            <Line
              data={disasterTrends}
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    max: 5,
                    ticks: {
                      ...chartOptions.scales.y.ticks,
                      stepSize: 1
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Resource Allocation Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Resource Allocation by Category</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              SUPPLY RATIO
            </span>
          </div>

          <div className="h-72 w-full">
            <Bar
              data={resourceAllocation}
              options={chartOptions}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
