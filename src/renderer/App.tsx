import { useState, useEffect } from 'react'
import { Search, Image as ImageIcon, Settings, SlidersHorizontal, Activity, FileText, X, CheckCircle2 } from 'lucide-react'
import { processScreenshot, getAllScreenshots } from './ocr'

// Convert a local file path to a proper file:// URL (handles Windows backslashes)
const toFileUrl = (filePath: string) => `file:///${filePath.replace(/\\/g, '/')}`

const App: React.FC = () => {
  const [search, setSearch] = useState('')
  const [screenshots, setScreenshots] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastScreenshot, setLastScreenshot] = useState<any | null>(null)
  const [showDemoModal, setShowDemoModal] = useState(false)

  useEffect(() => {
    // Load existing screenshots on mount
    loadScreenshots()
    if ((window as any).electron) {
       (window as any).electron.log('INFO', 'Renderer', 'Application started and gallery loaded')
    }

    // Listen for new screenshots from main process
    if ((window as any).electron) {
      console.log('Renderer: Listening for new screenshots...');
      (window as any).electron.onNewScreenshot(async (data: { path: string }) => {
        (window as any).electron.log('INFO', 'Watcher', `Renderer received new screenshot: ${data.path}`)
        setIsProcessing(true)
        
        // Show window for demo
        if ((window as any).electron) {
          (window as any).electron.send('show-window')
        }
        
        const screenshot = await processScreenshot(data.path)
        if (screenshot) {
          (window as any).electron.log('INFO', 'OCR', `Successfully processed: ${data.path}`)
          setLastScreenshot(screenshot)
          setShowDemoModal(true)
        }
        
        await loadScreenshots()
        setIsProcessing(false)
      })
    }
  }, [])

  const loadScreenshots = async () => {
    const data = await getAllScreenshots()
    setScreenshots(data)
  }

  const filteredScreenshots = screenshots.filter((s: any) => 
    s.text.toLowerCase().includes(search.toLowerCase()) || 
    s.path.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex bg-background h-full text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-8 border-r border-white/5 space-y-8">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
           <span className="text-white font-bold text-xl">S</span>
        </div>
        <nav className="flex flex-col space-y-6 flex-1 text-slate-400">
          <button title="Gallery" className="p-2 transition-colors hover:text-white rounded-lg">
            <ImageIcon size={24} />
          </button>
          <button title="Activity" className="p-2 transition-colors hover:text-white rounded-lg">
            <Activity size={24} />
          </button>
          <button title="Settings" className="p-2 transition-colors hover:text-white rounded-lg">
            <Settings size={24} />
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Header with Search */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">ScreenZen</h1>
            <p className="text-slate-400">Search through your digital memories instantly.</p>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-accent transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Finding a snippet, receipt, or note..."
              className="pl-12 pr-4 py-3 w-96 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-sm placeholder:text-slate-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value.length > 2) {
                  (window as any).electron?.log('INFO', 'Search', `User searched for: ${e.target.value}`)
                }
              }}
            />
          </div>
        </header>

        {/* Filters/Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-2">
            {['All', 'Today', 'Documents', 'Code', 'Meetings'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  (window as any).electron?.log('INFO', 'Navigation', `User switched to tab: ${tab}`)
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  tab === 'All' ? 'bg-white text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all">
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
        </div>

        {/* Gallery */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start pb-12">
          {filteredScreenshots.length > 0 ? (
            filteredScreenshots.map((s: any) => (
              <div key={s.id} className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-accent/50 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <div className="aspect-video bg-black/40 flex items-center justify-center overflow-hidden">
                  <img 
                    src={toFileUrl(s.path)} 
                    alt="Screenshot" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      {new Date(s.timestamp).toLocaleDateString()}
                    </span>
                    <FileText size={14} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-2 font-medium leading-relaxed">
                    {s.text.trim() || "No text detected"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            search ? (
               <div className="col-span-full py-20 text-center">
                  <Search className="mx-auto text-slate-700 mb-4" size={48} />
                  <p className="text-slate-500">No matches found for "{search}"</p>
               </div>
            ) : (
              [1,2,3,4].map(i => (
                <div key={i} className="aspect-video bg-white/5 rounded-2xl border border-white/10 animate-pulse flex items-center justify-center">
                  <ImageIcon className="text-white/10" size={32} />
                </div>
              ))
            )
          )}
        </div>

        {/* Status Indicator */}
        {isProcessing && (
          <div className="fixed bottom-8 right-8 bg-accent text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <Activity size={18} className="animate-spin" />
            <span className="font-semibold text-sm">Indexing new screenshot...</span>
          </div>
        )}

        {/* Live Demo Modal */}
        {showDemoModal && lastScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">New Screenshot Indexed</h3>
                    <p className="text-xs text-slate-500">Live Demo: Phase 1 Core Engine</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-8">
                <div className="aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden mb-6">
                  <img 
                    src={toFileUrl(lastScreenshot.path)} 
                    alt="Latest Capture" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-2">
                    <FileText size={10} />
                    <span>Extracted Text (OCR Result)</span>
                  </label>
                  <div className="p-4 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-slate-300 font-mono leading-relaxed max-h-40 overflow-y-auto">
                    {lastScreenshot.text || "Scanning..."}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white/[0.01] border-t border-white/5 text-center">
                <button 
                  onClick={() => setShowDemoModal(false)}
                  className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all shadow-lg"
                >
                  Dismiss Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
