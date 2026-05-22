import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, Layers, Maximize } from 'lucide-react';
import { useState } from 'react';
import { ChemElement, ElementGroup, LAYERS, LayerInfo } from './data';

type ViewState = 'assembled' | 'exploded' | 'detailed';

const GROUP_COLORS: Record<ElementGroup, string> = {
  alkali: 'border-[#00FF66] text-[#00FF66]',
  transition: 'border-[#FF3E00] text-[#FF3E00]',
  nonmetal: 'border-[#00D1FF] text-[#00D1FF]',
  'post-transition': 'border-[#A5A9B4] text-[#A5A9B4]',
};

const GROUP_BG: Record<ElementGroup, string> = {
  alkali: 'bg-[rgba(0,255,102,0.05)]',
  transition: 'bg-[rgba(255,62,0,0.05)]',
  nonmetal: 'bg-[rgba(0,209,255,0.05)]',
  'post-transition': 'bg-[rgba(165,169,180,0.05)]',
};

const LayerGraphic = ({ type }: { type: LayerInfo['visualType'] }) => {
  switch (type) {
    case 'outer-casing':
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A1C] to-[#2A2A2D] rounded-[16px] shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-[#A5A9B4] opacity-90 overflow-hidden">
          <div className="w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.02)_50%,rgba(255,255,255,0.02)_75%,transparent_75%,transparent)] bg-[size:16px_16px]" />
        </div>
      );
    case 'cathode-collector':
      return (
        <div className="absolute inset-0 bg-gradient-to-r from-[#949AA5] via-[#B0B3BD] to-[#949AA5] rounded-[12px] shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-[#D0D4DF]">
          <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-[#1A1A1C] font-bold opacity-60">Aluminum Collector</div>
        </div>
      );
    case 'cathode':
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#222222] to-[#111111] rounded-[12px] shadow-[0_0_20px_rgba(0,255,102,0.3)] border-2 border-[#00FF66]">
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-[#00FF66]">Active: Cathode</div>
          <div className="w-full h-full p-4 pt-12 grid grid-cols-4 md:grid-cols-6 gap-2 opacity-30">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-full border border-white/10 rounded-sm bg-white/5" />
            ))}
          </div>
        </div>
      );
    case 'electrolyte':
      return (
        <div className="absolute inset-0 rounded-[12px] bg-[radial-gradient(ellipse_at_center,rgba(0,209,255,0.3)_0%,transparent_70%)] border-2 border-dashed border-[#00D1FF] flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex flex-wrap content-start gap-4 p-4 opacity-70">
            {[...Array(32)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#00D1FF] blur-[1px] animate-pulse"
                style={{ animationDelay: `${(i % 5) * 0.2}s`, animationDuration: `${1.5 + (i % 2)}s` }}
              />
            ))}
          </div>
        </div>
      );
    case 'separator':
      return (
        <div className="absolute inset-0 rounded-[12px] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)] border-2 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-[2px]" />
      );
    case 'anode':
      return (
        <div className="absolute inset-0 bg-[#1A1A1C] rounded-[12px] border-2 border-[#B87333] shadow-[0_0_40px_rgba(184,115,51,0.2)] flex">
           <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-[#B87333]">Active: Anode</div>
           <div className="w-full h-full p-4 pt-12 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      );
    case 'anode-collector':
      return (
        <div className="absolute inset-0 bg-gradient-to-r from-[#8A5B3D] via-[#B87333] to-[#8A5B3D] rounded-[12px] shadow-[0_0_30px_rgba(0,0,0,0.6)] border border-[#EAA267]">
          <div className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-[#1A1A1C] font-bold opacity-60">Copper Collector</div>
        </div>
      );
  }
};

const ElementTile = ({ el }: { el: ChemElement }) => (
  <div className={`w-[56px] h-[68px] border flex flex-col items-center justify-center p-1 rounded-[4px] flex-shrink-0 ${GROUP_COLORS[el.group]} ${GROUP_BG[el.group]} backdrop-blur-sm`}>
    <div className="text-[10px] font-bold self-start leading-none opacity-80">{el.atomicNumber}</div>
    <div className="text-[24px] font-black leading-none">{el.symbol}</div>
    <div className="text-[8px] uppercase tracking-[1px] truncate opacity-80 mt-1">{el.name}</div>
  </div>
);

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('assembled');
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<LayerInfo | null>(null);
  const [canContinue, setCanContinue] = useState(false);

  const cardVariants = {
    assembled: ({ i }: { i: number }) => {
      const offset = (3 - i) * 20; // Tight stack
      return {
        x: "-50%",
        y: `calc(-50% + ${-offset * 0.866}px)`,
        z: -offset * 0.5,
        rotateX: 60,
        rotateZ: -15,
        scale: 1,
        opacity: 1,
        transition: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
      };
    },
    exploded: ({ i, id }: { i: number, id: string }) => {
      const offset = (3 - i) * 100; // Wide 3d separation
      return {
        x: "-50%",
        y: `calc(-50% + ${-offset * 0.866}px)`,
        z: -offset * 0.5,
        rotateX: 60,
        rotateZ: -15,
        scale: hoveredLayer === id ? 1.05 : 1, 
        opacity: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15, mass: 1 },
      };
    },
    detailed: ({ i, isSelected }: { i: number, isSelected: boolean }) => {
      const offset = (3 - i) * 100;
      return {
        x: isSelected ? "-130%" : "-50%",
        y: isSelected ? "-50%" : `calc(-50% + ${-offset * 0.866}px)`,
        z: isSelected ? 0 : -offset * 0.5,
        rotateX: isSelected ? 0 : 60,
        rotateZ: isSelected ? 0 : -15,
        scale: isSelected ? 1 : 0.6,
        opacity: isSelected ? 1 : 0.2, // dim non-selected layers
        transition: { type: 'spring', stiffness: 150, damping: 20, mass: 1 },
      };
    },
  };

  const handleLayerClick = (layer: LayerInfo) => {
    if (viewState === 'assembled') {
      setViewState('exploded');
      return;
    }
    if (viewState === 'exploded') {
      setSelectedLayer(layer);
      setViewState('detailed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white overflow-hidden relative font-sans selection:bg-emerald-500/30">
      
      {/* Background grid/glow elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_rgba(10,10,11,1)_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNHYtbGgtaXYzNGwtaHYtMzR6IiBmaWxsPSIjMWEyMDI2Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />

      {/* Global UI Headers */}
      <div className="absolute inset-x-0 top-0 z-50 pointer-events-none p-8 lg:px-12 pt-10 flex justify-between items-start">
        <div className="flex flex-col gap-6 w-full pointer-events-auto">
          <AnimatePresence>
            {viewState === 'detailed' && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => {
                  setSelectedLayer(null);
                  setViewState('exploded');
                }}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit group"
              >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} />
                </div>
                <span className="text-sm tracking-wide">Back to System</span>
              </motion.button>
            )}
          </AnimatePresence>
          
          <div className="flex items-start justify-between w-full">
            <div>
              <p className="text-xs tracking-[0.3em] text-[#00FF66] font-bold uppercase mb-2">Technical Visualization 1.04</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-white mb-2">
                WHAT'S IN A VOLT?
                <br />
                <span className="opacity-40 text-3xl">A Breakdown of a Lithium-Ion Battery</span>
              </h1>
            </div>
            
            <AnimatePresence mode="popLayout">
               {viewState !== 'detailed' && (
                 <motion.a
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   href={viewState === 'exploded' && canContinue ? 'https://shadowslayer555.my.canva.site/elements-of-a-phone-03' : undefined}
                   onClick={(e) => {
                     if (viewState === 'assembled') {
                       e.preventDefault();
                       setViewState('exploded');
                       setCanContinue(false);
                       setTimeout(() => setCanContinue(true), 1000);
                     } else if (!canContinue) {
                       e.preventDefault();
                     }
                   }}
                   className={`hidden md:flex items-center gap-3 px-8 py-4 bg-[#00FF66] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest rounded-full transition-transform ${viewState === 'exploded' && !canContinue ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                 >
                   {viewState === 'assembled' ? (
                     <>EXPLODE MODULE →</>
                   ) : (
                     <>CONTINUE →</>
                   )}
                 </motion.a>
               )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div 
        className="absolute inset-x-0 inset-y-0 md:inset-y-0 z-10 flex items-center justify-center overflow-hidden" 
        style={{ perspective: '2000px' }}
      >
        <motion.div 
          className="relative w-full h-full lg:w-3/4 lg:-ml-[20%]" 
          // @ts-ignore
          style={{ transformStyle: 'preserve-3d' }} 
          animate={{ x: viewState === 'detailed' ? '15%' : '0%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {LAYERS.map((layer, i) => {
            const isSelected = selectedLayer?.id === layer.id;
            // Provide specific hover handling based on state
            const isInteractable = viewState === 'exploded' || viewState === 'assembled';
            
            return (
              <motion.div
                key={layer.id}
                custom={{ i, isSelected, id: layer.id }}
                variants={cardVariants}
                initial="assembled"
                animate={viewState}
                onMouseEnter={() => isInteractable && setHoveredLayer(layer.id)}
                onMouseLeave={() => setHoveredLayer(null)}
                onClick={() => handleLayerClick(layer)}
                className={`absolute left-1/2 top-1/2 w-[300px] h-[300px] lg:w-[460px] lg:h-[320px] cursor-pointer group flex items-center justify-center ${
                  viewState === 'detailed' && !isSelected ? 'pointer-events-none' : 'pointer-events-auto'
                }`}
                // @ts-ignore
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 3D Content Wrapper for specific layer visuals */}
                <LayerGraphic type={layer.visualType} />

                <AnimatePresence>
                  {viewState === 'exploded' && hoveredLayer === layer.id && (
                    <motion.div 
                      className="absolute -right-[180px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                    >
                      <div className="w-16 border-t border-white/20 mr-4" />
                      <div className="bg-[#111116] border border-white/10 px-4 py-2 rounded-xl text-sm font-mono whitespace-nowrap shadow-2xl backdrop-blur-md">
                        {layer.title}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Info Card Overlay for Detailed State */}
      <AnimatePresence>
        {viewState === 'detailed' && selectedLayer && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-full md:w-[480px] lg:w-[500px] z-50 flex flex-col justify-center p-8 lg:p-12"
          >
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl h-full lg:h-auto overflow-y-auto">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-[#00FF66] text-[#0A0A0B] text-[10px] font-bold px-2 py-1 rounded uppercase">
                    LAYER {selectedLayer.id === 'outer-casing' ? '01' : selectedLayer.id === 'cathode' ? '02' : selectedLayer.id === 'electrolyte' ? '03' : selectedLayer.id === 'separator' ? '04' : '05'}
                  </div>
                  <div className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                    {selectedLayer.role}
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedLayer.title}
                </h2>
              </div>
              
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {selectedLayer.description}
              </p>
  
              <div>
                <h3 className="text-xs font-bold tracking-widest text-white/40 uppercase mb-4">
                  Elemental Composition
                </h3>
                <div className="flex flex-wrap -m-1">
                  <AnimatePresence mode="popLayout">
                    {selectedLayer.elements.map((el, index) => (
                      <motion.div
                        key={el.id}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring' }}
                      >
                        <ElementTile el={el} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-only toggle */}
      <AnimatePresence>
        {viewState !== 'detailed' && (
          <motion.div className="fixed bottom-8 inset-x-8 z-50 md:hidden flex justify-center pointer-events-auto">
             <a
               href={viewState === 'exploded' && canContinue ? 'https://shadowslayer555.my.canva.site/elements-of-a-phone-03' : undefined}
               onClick={(e) => {
                 if (viewState === 'assembled') {
                   e.preventDefault();
                   setViewState('exploded');
                   setCanContinue(false);
                   setTimeout(() => setCanContinue(true), 1000);
                 } else if (!canContinue) {
                   e.preventDefault();
                 }
               }}
               className={`w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 bg-[#00FF66] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest rounded-full shadow-xl transition-transform ${viewState === 'exploded' && !canContinue ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
             >
               {viewState === 'assembled' ? (
                 <>EXPLODE MODULE →</>
               ) : (
                 <>CONTINUE →</>
               )}
             </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}