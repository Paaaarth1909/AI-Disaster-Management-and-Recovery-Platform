import { useState } from 'react';
import { Brain, FileText, Shield, Sparkles, Loader2, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { analyzeSeverity, predictResourceNeeds, detectMisinformation, generateSituationReport } from '../lib/gemini';
import { useDisasterStore } from '../store/disaster';

export default function AIAnalysis() {
  const { disasters, reports } = useDisasterStore();
  const [selectedDisasterId, setSelectedDisasterId] = useState<string>(disasters[0]?.id || '');
  const [customClaim, setCustomClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<string>('');

  const [analysis, setAnalysis] = useState<{
    severity?: string;
    resources?: string;
    misinformation?: string;
    situationReport?: string;
  }>({
    severity: "RECOMMENDATION: Priority Stage 2.\n- Establish emergency drainage pumps in Kochi coastal flats.\n- Divert non-essential traffic away from National Highway 66.\n- Stage NDRF watercraft at Kalamassery base.",
    resources: "PREDICTED LOGISTICS:\n- 1,200 High-calorie emergency food rations\n- 85,000 Liters potable drinking water\n- 25 Inflatable motorized rescue rafts\n- 35 Trauma and orthopaedic triage kits"
  });

  const activeDisaster = disasters.find(d => d.id === selectedDisasterId) || disasters[0];

  const handleAnalyzeDisaster = async () => {
    if (!activeDisaster) return;
    setLoading(true);
    setAnalysisType('diagnostics');
    try {
      const [severityAnalysis, resourcePrediction] = await Promise.all([
        analyzeSeverity({
          type: activeDisaster.type,
          description: activeDisaster.description || '',
          location: activeDisaster.location_name,
          affectedPopulation: activeDisaster.affected_population || undefined
        }),
        predictResourceNeeds({
          type: activeDisaster.type,
          severity: activeDisaster.severity,
          location: activeDisaster.location_name,
          affectedPopulation: activeDisaster.affected_population || undefined
        })
      ]);

      setAnalysis(prev => ({
        ...prev,
        severity: severityAnalysis,
        resources: resourcePrediction
      }));
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoading(false);
      setAnalysisType('');
    }
  };

  const handleCheckMisinformation = async (claimText?: string) => {
    const textToCheck = claimText || customClaim;
    if (!textToCheck.trim()) return;
    setLoading(true);
    setAnalysisType('rumors');
    try {
      const misinformationAnalysis = await detectMisinformation({
        title: textToCheck.slice(0, 40),
        description: textToCheck,
        source: 'Citizen Broadcast Feed'
      });

      setAnalysis(prev => ({
        ...prev,
        misinformation: misinformationAnalysis
      }));
    } catch (error) {
      console.error('Misinformation check failed:', error);
    } finally {
      setLoading(false);
      setAnalysisType('');
    }
  };

  const handleGenerateSituationReport = async () => {
    if (!activeDisaster) return;
    setLoading(true);
    setAnalysisType('sitrep');
    try {
      const relatedReports = reports.filter(r => r.disaster_id === activeDisaster.id);
      
      const situationReport = await generateSituationReport({
        location: activeDisaster.location_name,
        timeframe: 'Past 24 Hours',
        incidents: relatedReports.length > 0 
          ? relatedReports.map(r => ({
              type: r.type,
              description: r.description,
              timestamp: r.created_at
            }))
          : [
              {
                type: activeDisaster.type,
                description: activeDisaster.description || 'Emergency conditions actively monitored',
                timestamp: activeDisaster.created_at
              }
            ]
      });

      setAnalysis(prev => ({
        ...prev,
        situationReport
      }));
    } catch (error) {
      console.error('Situation report generation failed:', error);
    } finally {
      setLoading(false);
      setAnalysisType('');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto text-white font-sans">
      
      {/* Top Banner & Incident Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center space-x-2">
              <span>Gemini AI Tactical Diagnostics</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <p className="text-xs text-slate-400">Time-series forecasting, resource allocation & rumor intelligence</p>
          </div>
        </div>

        {/* Disaster Dropdown & Trigger Action */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedDisasterId}
            onChange={(e) => setSelectedDisasterId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
          >
            {disasters.map(d => (
              <option key={d.id} value={d.id}>
                {d.title} (Level {d.severity})
              </option>
            ))}
          </select>

          <button
            onClick={handleAnalyzeDisaster}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading && analysisType === 'diagnostics' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Brain className="w-3.5 h-3.5" />
            )}
            <span>Analyze Incident</span>
          </button>
        </div>
      </div>

      {/* Grid: Severity Analysis & Predicted Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Severity Diagnostics Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Severity & Immediate Actions</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                PRO 1.5 DEEP REASONING
              </span>
            </div>
            
            {loading && analysisType === 'diagnostics' ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <span>Synthesizing threat vector matrix...</span>
              </div>
            ) : (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {analysis.severity || 'Select a disaster above and click "Analyze Incident" to generate deep diagnostics.'}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: {activeDisaster?.title}</span>
            <span className="text-emerald-400">Status: Verified</span>
          </div>
        </div>

        {/* Resource Demand Forecasting Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Projected Logistics & Triage Needs</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                LOGISTICS AI
              </span>
            </div>

            {loading && analysisType === 'diagnostics' ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-xs space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                <span>Forecasting population triage requirements...</span>
              </div>
            ) : (
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {analysis.resources || 'Select a disaster and click "Analyze Incident" to predict required relief aid.'}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Affected Pop: {activeDisaster?.affected_population?.toLocaleString() || 'Unknown'}</span>
            <span className="text-blue-400">Supply Pipeline: Linked</span>
          </div>
        </div>

      </div>

      {/* Rumor & Misinformation Detector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-white">Social Media Rumor & Misinformation Fact-Checker</h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ANTI-DISINFORMATION ENGINE
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Paste citizen report, rumor, or panic claim to check credibility with Gemini AI..."
            value={customClaim}
            onChange={(e) => setCustomClaim(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleCheckMisinformation()}
            disabled={loading || !customClaim.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading && analysisType === 'rumors' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
            <span>Verify Claim</span>
          </button>
        </div>

        {/* Quick Sample Rumors */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] text-slate-500 font-mono">Sample Rumors:</span>
          {[
            "Chembarambakkam dam gates opened without warning",
            "Drinking water contaminated across Ernakulam district",
            "Airport runway completely submerged under 4m flood"
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setCustomClaim(sample);
                handleCheckMisinformation(sample);
              }}
              className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
            >
              &ldquo;{sample}&rdquo;
            </button>
          ))}
        </div>

        {/* Misinformation Result */}
        {analysis.misinformation && (
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line font-mono leading-relaxed mt-2 animate-in fade-in duration-200">
            {analysis.misinformation}
          </div>
        )}
      </div>

      {/* Comprehensive Situation Report (SitRep) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Full EOC Executive Situation Report (SitRep)</h3>
          </div>
          <button
            onClick={handleGenerateSituationReport}
            disabled={loading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading && analysisType === 'sitrep' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5" />
            )}
            <span>Generate Executive SitRep</span>
          </button>
        </div>

        {analysis.situationReport ? (
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line font-mono leading-relaxed animate-in fade-in duration-200">
            {analysis.situationReport}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            Click &ldquo;Generate Executive SitRep&rdquo; to draft a full briefing for government officials and response agencies.
          </div>
        )}
      </div>

    </div>
  );
}
