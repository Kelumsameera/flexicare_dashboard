// import { useState, useEffect } from 'react';
// import { database } from './firebase.'; 
// import { ref, onValue, set } from 'firebase/database'; 
// import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
// import { Activity, Clock, Server, RotateCcw } from 'lucide-react'; 
// import toast, { Toaster } from 'react-hot-toast'; 
// import { FcDecision } from 'react-icons/fc';

// interface HistoryItem {
//   id: string;
//   Count: number;
//   TimeLabel: string;
//   FullTime: string;
// }

// function App() {
//   const [liveData, setLiveData] = useState({ Count: 0, LastUpdate: 'Loading...' });
//   const [history, setHistory] = useState<HistoryItem[]>([]);

//   useEffect(() => {
//     const liveRef = ref(database, 'Machine_01/LiveStatus');
//     onValue(liveRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setLiveData(snapshot.val());
//       }
//     });

//     const historyRef = ref(database, 'Machine_01/CounterHistory');
//     onValue(historyRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const formattedData: HistoryItem[] = Object.keys(data).map(key => {
//           const dateObj = new Date(data[key].Time);
//           return {
//             id: key,
//             Count: data[key].Count,
//             TimeLabel: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//             FullTime: data[key].Time
//           };
//         });
//         setHistory(formattedData.slice(-20));
//       }
//     });
//   }, []);

//   // ⚠️  Reset Function 
//   const handleReset = () => {
//     toast.custom((t) => (
//       <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto flex flex-col p-4 border border-slate-100`}>
//         <div className="flex flex-col items-center gap-3">
//           <FcDecision size={46} />
//           <p className="text-slate-800 font-medium items-center justify-center text-sm mb-4">
          
//           ඔබට විශ්වාසද? යන්ත්‍රයේ කවුන්ටරය '0' බවට පත්වෙනු ඇත.
//           <br />if you want to proceed, click "Yes, Reset". Otherwise, click "Cancel" to keep the current count.
//         </p>

//         </div>
        
//         <div className="flex gap-2 justify-end">
//           {/* Cancel Button */}
//           <button 
//             onClick={() => toast.dismiss(t.id)} 
//             className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm transition-colors"
//           >
//             Cancel
//           </button>
          
//           {/* Confirm Button */}
//           <button 
//             onClick={() => {
//               toast.dismiss(t.id); // Popup 
//               const resetRef = ref(database, 'Machine_01/Control/ResetCommand');
//               set(resetRef, true); // Firebase 
//               toast.success("Reset command sent!"); // Notification
//             }} 
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800 font-medium text-sm transition-colors shadow-sm"
//           >
//             Yes, Reset
//           </button>
//         </div>
//       </div>
//     ), { duration: Infinity }); // 
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 font-sans">
     
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
//             <Server className="text-blue-600" />
//             Production Dashboard
//           </h1>
//           <p className="text-slate-500 mt-1">Real-time monitoring for Machine 01</p>
//         </div>
        
//         <button 
//           onClick={handleReset}
//           className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-colors border border-red-200"
//         >
//           <RotateCcw size={18} />
//           Reset Counter
//         </button>
//       </div>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center">
//           <div className="bg-blue-100 p-3 rounded-full mb-4">
//             <Activity className="w-8 h-8 text-blue-600" />
//           </div>
//           <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Count</p>
//           <h2 className="text-5xl font-extrabold text-slate-800 mt-2">{liveData.Count}</h2>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center md:col-span-2">
//           <div className="bg-emerald-100 p-3 rounded-full mb-4">
//             <Clock className="w-8 h-8 text-emerald-600" />
//           </div>
//           <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Last Sensor Detection</p>
//           <h2 className="text-2xl font-bold text-slate-700 mt-2">
//             {liveData.LastUpdate !== 'Loading...' 
//               ? new Date(liveData.LastUpdate).toLocaleString() 
//               : 'Waiting for data...'}
//           </h2>
//           <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
//             <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
//             </span>
//             System Online & Connected
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-3">
//           <h3 className="text-lg font-bold text-slate-800 mb-6">Production Rate (Last 20 Reads)</h3>
//           <div className="h-80 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
//                 <XAxis dataKey="TimeLabel" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
//                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
//                 <Tooltip 
//                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                   labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
//                 />
//                 <Area type="monotone" dataKey="Count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" animationDuration={500} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from 'react'; 
import { database } from './firebase.'; 
import { ref, onValue, set, query, limitToLast } from 'firebase/database'; 
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import { Activity, Clock, Server, RotateCcw, Timer, BarChart2, Zap } from 'lucide-react'; 
import toast, { Toaster } from 'react-hot-toast'; 

interface CycleItem {
  id: string;
  TimeLabel: string;
  CycleTime: number;
}

interface MinutePattern {
  TimeLabel: string;
  Units: number;
}

function App() {
  const [liveData, setLiveData] = useState({ Count: 0, LastUpdate: 'Loading...' });
  const [cycleHistory, setCycleHistory] = useState<CycleItem[]>([]);
  const [minutePattern, setMinutePattern] = useState<MinutePattern[]>([]);
  const [metrics, setMetrics] = useState({ currentCycle: 0, avgCycle: 0 });

  useEffect(() => {
    const liveRef = ref(database, 'Machine_01/LiveStatus');
    onValue(liveRef, (snapshot) => {
      if (snapshot.exists()) {
        setLiveData(snapshot.val());
      }
    });

    const historyRef = query(ref(database, 'Machine_01/CounterHistory'), limitToLast(60)); // අන්තිම 60 පමණක් ගනී
    
    onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const rawKeys = Object.keys(data);
        
        const recentCycles: CycleItem[] = [];
        const minuteBuckets: { [key: string]: number } = {};
        
        let totalCycleSecs = 0;
        let validCycleCount = 0;
        let lastCycleSecs = 0;

        rawKeys.forEach((key, index) => {
          const timeMs = new Date(data[key].Time).getTime();
          
          // ⚠️ 1 hour = 3600 seconds = 3600000 ms, so we check for cycles less than 30 mins (1800000 ms) to be valid
          
          const minLabel = new Date(timeMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (!minuteBuckets[minLabel]) minuteBuckets[minLabel] = 0;
          minuteBuckets[minLabel]++;

          if (index > 0) {
            const prevTimeMs = new Date(data[rawKeys[index - 1]].Time).getTime();
            const cycleSecs = Math.floor((timeMs - prevTimeMs) / 1000);
            
            // ⚠️ >= 0 and < 1800 seconds (30 mins) only to filter out erroneous spikes
            if (cycleSecs >= 0 && cycleSecs < 1800) { 
              totalCycleSecs += cycleSecs;
              validCycleCount++;
              lastCycleSecs = cycleSecs;
              
              recentCycles.push({
                id: key,
                TimeLabel: new Date(timeMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                CycleTime: cycleSecs
              });
            }
          }
        });

        const patternArray = Object.keys(minuteBuckets).map(k => ({ TimeLabel: k, Units: minuteBuckets[k] }));

        setMinutePattern(patternArray);
        setCycleHistory(recentCycles.slice(-40)); 

        setMetrics({
          currentCycle: lastCycleSecs,
          avgCycle: validCycleCount > 0 ? Number((totalCycleSecs / validCycleCount).toFixed(1)) : 0
        });
      }
    });
  }, []);

  const handleReset = () => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-sm w-full bg-white shadow-lg rounded-xl pointer-events-auto flex flex-col p-4 border border-slate-100`}>
        <p className="text-slate-800 font-medium text-sm mb-4">
          ඔබට විශ්වාසද? යන්ත්‍රයේ කවුන්ටරය '0' බවට පත්වෙනු ඇත.
        </p>
        <div className="flex gap-2 justify-end">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm">
            Cancel
          </button>
          <button onClick={() => {
              toast.dismiss(t.id); 
              const resetRef = ref(database, 'Machine_01/Control/ResetCommand');
              set(resetRef, true); 
              toast.success("Reset command sent!"); 
            }} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm shadow-sm"
          >
            Yes, Reset
          </button>
        </div>
      </div>
    ), { duration: Infinity }); 
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Server className="text-blue-600" />
            Production Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Real-time Hourly Production Pattern</p>
        </div>
        
        <button onClick={handleReset} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-colors border border-red-200">
          <RotateCcw size={18} />
          Reset Counter
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center">
          <div className="bg-blue-100 p-3 rounded-full mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">Total Count</p>
          <h2 className="text-4xl font-extrabold text-slate-800 mt-2">{liveData.Count}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center">
          <div className="bg-amber-100 p-3 rounded-full mb-4">
            <Zap className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide text-center">Last Product Took</p>
          <h2 className="text-4xl font-extrabold text-amber-600 mt-2 flex items-baseline gap-1">
            {metrics.currentCycle} <span className="text-lg text-amber-500 font-medium">sec</span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center">
          <div className="bg-purple-100 p-3 rounded-full mb-4">
            <Timer className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide text-center">Hourly Avg Cycle</p>
          <h2 className="text-4xl font-extrabold text-slate-800 mt-2 flex items-baseline gap-1">
            {metrics.avgCycle} <span className="text-lg text-slate-500 font-medium">sec</span>
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center items-center">
          <div className="bg-emerald-100 p-3 rounded-full mb-4">
            <Clock className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wide">System Status</p>
          <h2 className="text-sm font-bold text-slate-700 mt-3 text-center">
            {liveData.LastUpdate !== 'Loading...' ? new Date(liveData.LastUpdate).toLocaleTimeString() : 'Waiting...'}
          </h2>
          <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Online
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart2 size={20} className="text-blue-500"/>
            Production Pattern (Units per Minute)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={minutePattern} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="TimeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  formatter={(value) => [`${value} Units`, 'Produced']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="Units" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Timer size={20} className="text-amber-500"/>
            Time Taken per Product (Seconds)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cycleHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="TimeLabel" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value) => [`${value} Seconds`, 'Time Taken']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line type="monotone" dataKey="CycleTime" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;