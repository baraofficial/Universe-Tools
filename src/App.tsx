import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { TOOLS_CONFIG } from './config/tools';
import { Sparkles, Search, Star, Menu, X, Moon, Sun, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Tool Components Import
import { BackgroundRemover, ImageCompressor, ImageResizer } from './components/tools/ImageTools';
import { AiWriter, GrammarChecker, Paraphraser, Translator } from './components/tools/TextTools';
import { JsonFormatter, Base64Tool, ColorPickerTool } from './components/tools/DeveloperTools';
import { KeywordDensity, MetaTagGenerator, BacklinkChecker } from './components/tools/SeoTools';
import { YoutubeThumbnail, VideoToGif, SubtitleGenerator } from './components/tools/VideoTools';

const DashboardView = ({ onStart }: { onStart: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 w-full"
    >
      <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
        <video 
          src="https://www.image2url.com/r2/default/videos/1785285758387-52d86f87-6cce-42f8-b08b-8cb28b30c1f6.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white">Selamat Datang di Tools Universe</h1>
        <p className="text-purple-300 mt-2">15+ Tools AI Lengkap Siap Dipakai</p>
        <button 
          onClick={onStart}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-8 py-3 rounded-xl font-semibold mt-4 shadow-lg hover:scale-105 transition text-white"
        >
          Mulai Pakai Tools
        </button>
      </div>
    </motion.div>
  );
};

// Tool Renderer
const renderTool = (toolId: string, onStart: () => void) => {
  switch (toolId) {
    case 'dashboard': return <DashboardView onStart={onStart} />;
    case 'bg-remover': return <BackgroundRemover />;
    case 'image-compressor': return <ImageCompressor />;
    case 'image-resizer': return <ImageResizer />;
    case 'ai-writer': return <AiWriter />;
    case 'grammar-checker': return <GrammarChecker />;
    case 'paraphraser': return <Paraphraser />;
    case 'translator': return <Translator />;
    case 'json-formatter': return <JsonFormatter />;
    case 'base64-tool': return <Base64Tool />;
    case 'color-picker': return <ColorPickerTool />;
    case 'keyword-density': return <KeywordDensity />;
    case 'meta-tag-gen': return <MetaTagGenerator />;
    case 'backlink-checker': return <BacklinkChecker />;
    case 'yt-thumbnail': return <YoutubeThumbnail />;
    case 'video-to-gif': return <VideoToGif />;
    case 'subtitle-gen': return <SubtitleGenerator />;
    default: return <div className="text-gray-500 text-center py-20">Select a tool from the sidebar</div>;
  }
};

const MainApp = () => {
  const [activeTool, setActiveTool] = useState<string>('dashboard');
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default dark mode
  const { showToast } = useToast();

  // Trigger LIVE alert on load
  useEffect(() => {
    // Adding a slight delay for better UX
    const timer = setTimeout(() => {
      showToast('All 15 tools are now LIVE!');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tools-favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites to local storage
  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const next = prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('tools-favorites', JSON.stringify(next));
      showToast(prev.includes(toolId) ? 'Removed from favorites' : 'Added to favorites');
      return next;
    });
  };

  const getActiveToolName = () => {
    if (activeTool === 'dashboard') return 'Dashboard';
    for (const cat of TOOLS_CONFIG) {
      const tool = cat.tools.find(t => t.id === activeTool);
      if (tool) return tool.name;
    }
    return 'Tools Universe';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'} flex flex-col transition-colors duration-300`}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div id="tools-container" className="flex flex-1 w-full max-w-7xl mx-auto relative">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 ${isDarkMode ? 'bg-[#111] border-[#272727]' : 'bg-white border-gray-200'} border-r z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Tools Universe
          </span>
        </div>

        {/* Search */}
        <div className="px-6 mb-6 relative">
          <Search className="w-4 h-4 absolute left-9 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search tools..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${isDarkMode ? 'bg-[#0a0a0a] border-[#333] text-white focus:border-purple-500' : 'bg-gray-100 border-gray-200 text-gray-900 focus:border-purple-500'} border focus:outline-none transition-colors`}
          />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
          {/* Dashboard Menu Item */}
          <div>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { setActiveTool('dashboard'); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-3 ${
                    activeTool === 'dashboard'
                      ? (isDarkMode ? 'bg-purple-600/10 text-purple-400' : 'bg-purple-100 text-purple-700')
                      : (isDarkMode ? 'text-gray-400 hover:bg-[#272727] hover:text-white' : 'text-gray-600 hover:bg-gray-100')
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {TOOLS_CONFIG.map((category, idx) => {
            const filteredTools = category.tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
            if (filteredTools.length === 0) return null;

            return (
              <div key={idx}>
                <h4 className={`text-xs font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider mb-3 flex items-center gap-2 px-2`}>
                  <category.icon className="w-4 h-4" />
                  {category.category}
                </h4>
                <ul className="space-y-1">
                  {filteredTools.map(tool => (
                    <li key={tool.id}>
                      <button
                        onClick={() => { setActiveTool(tool.id); setSidebarOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-between ${
                          activeTool === tool.id 
                            ? (isDarkMode ? 'bg-purple-600/10 text-purple-400' : 'bg-purple-100 text-purple-700')
                            : (isDarkMode ? 'text-gray-400 hover:bg-[#272727] hover:text-white' : 'text-gray-600 hover:bg-gray-100')
                        }`}
                      >
                        {tool.name}
                        {favorites.includes(tool.id) && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-[#272727]' : 'border-gray-200'} flex justify-between items-center`}>
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Theme</span>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#272727] hover:bg-[#333]' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className={`sticky top-0 z-30 flex items-center justify-between p-6 ${isDarkMode ? 'bg-[#0a0a0a]/80' : 'bg-gray-50/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-[#272727]' : 'border-gray-200'}`}>
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-[#272727]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">{getActiveToolName()}</h1>
          </div>
          <button 
            onClick={() => toggleFavorite(activeTool)}
            className={`p-2 rounded-lg transition-colors ${favorites.includes(activeTool) ? 'text-yellow-500 bg-yellow-500/10' : (isDarkMode ? 'text-gray-400 hover:bg-[#272727]' : 'text-gray-500 hover:bg-gray-200')}`}
            title="Toggle Favorite"
          >
            <Star className={`w-5 h-5 ${favorites.includes(activeTool) ? 'fill-current' : ''}`} />
          </button>
        </header>

        {/* Content Area */}
        <div className="p-6 lg:p-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTool(activeTool, () => setActiveTool('bg-remover'))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}

