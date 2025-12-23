import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TransitionWrapper from "../components/TransitionWrapper";

interface FishType {
  id: string;
  name: string;
  type: "small" | "big";
}

const initialFish: FishType[] = [
  { id: "fish1", name: "Moonfish", type: "small" },
  { id: "fish2", name: "Sunfish", type: "small" },
  { id: "fish3", name: "Starfish", type: "big" },
  { id: "fish4", name: "Rainbowfish", type: "big" },
  { id: "fish5", name: "Goldfish", type: "small" },
  { id: "fish6", name: "Silverfish", type: "small" },
];

const Fish = () => {
  const [fishList, setFishList] = useState<FishType[]>(initialFish);
  const [activeTab, setActiveTab] = useState<"list" | "planner">("list");
  const [newFishName, setNewFishName] = useState("");
  const [newFishType, setNewFishType] = useState<"small" | "big">("small");

  // Aquarium dimensions
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(30);
  const [length, setLength] = useState(40);

  const handleAddFish = () => {
    if (!newFishName.trim()) return;
    const newId = `fish${Date.now()}`;
    setFishList([...fishList, { id: newId, name: newFishName, type: newFishType }]);
    setNewFishName("");
  };

  const handleDeleteFish = (id: string) => {
    setFishList(fishList.filter((f) => f.id !== id));
  };

  const smallFishCount = fishList.filter((f) => f.type === "small").length;
  const bigFishCount = fishList.filter((f) => f.type === "big").length;
  const requiredVolume = smallFishCount * 10 + bigFishCount * 20;
  const actualVolume = Math.round((width * height * length) / 1000);
  const isVolumeOk = actualVolume >= requiredVolume;

  return (
    <TransitionWrapper>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-gradient">Aquarium</span> Planner
          </h1>
          <p className="text-white/60">Manage your fish and plan your perfect aquarium</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: "list", label: "Fish List", icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
            { id: "planner", label: "Aquarium Planner", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "list" | "planner")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? "btn-neon"
                  : "btn-glass"
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card text-center">
            <div className="text-3xl font-bold text-neon-cyan">{fishList.length}</div>
            <div className="text-white/60 text-sm">Total Fish</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-bold text-neon-pink">{smallFishCount}</div>
            <div className="text-white/60 text-sm">Small (10L each)</div>
          </div>
          <div className="glass-card text-center">
            <div className="text-3xl font-bold text-neon-purple">{bigFishCount}</div>
            <div className="text-white/60 text-sm">Big (20L each)</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fish List */}
              <div className="glass-card mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Fish</h2>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  <AnimatePresence>
                    {fishList.map((fish) => (
                      <motion.div
                        key={fish.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: -100 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${fish.type === "small" ? "bg-neon-cyan" : "bg-neon-purple"}`} />
                          <span className="font-medium">{fish.name}</span>
                          <span className="text-white/40 text-sm capitalize">({fish.type})</span>
                        </div>
                        <button
                          onClick={() => handleDeleteFish(fish.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                          aria-label="Delete fish"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {fishList.length === 0 && (
                    <div className="text-center py-8 text-white/40">
                      No fish yet. Add some below!
                    </div>
                  )}
                </div>
              </div>

              {/* Add Fish Form */}
              <div className="glass-card">
                <h2 className="text-xl font-semibold mb-4">Add New Fish</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={newFishName}
                    onChange={(e) => setNewFishName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddFish()}
                    placeholder="Fish name..."
                    className="glass-input flex-1"
                  />
                  <select
                    value={newFishType}
                    onChange={(e) => setNewFishType(e.target.value as "small" | "big")}
                    className="glass-select w-full sm:w-32"
                  >
                    <option value="small">Small</option>
                    <option value="big">Big</option>
                  </select>
                  <button onClick={handleAddFish} className="btn-neon whitespace-nowrap">
                    Add Fish
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="planner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Aquarium Planner */}
              <div className="glass-card">
                <h2 className="text-xl font-semibold mb-6">Calculate Aquarium Size</h2>

                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {[
                    { label: "Width (cm)", value: width, setter: setWidth },
                    { label: "Height (cm)", value: height, setter: setHeight },
                    { label: "Length (cm)", value: length, setter: setLength },
                  ].map((dim) => (
                    <div key={dim.label}>
                      <label className="block text-white/60 text-sm mb-2">{dim.label}</label>
                      <input
                        type="number"
                        value={dim.value}
                        onChange={(e) => dim.setter(Math.max(0, parseInt(e.target.value) || 0))}
                        className="glass-input w-full text-center text-xl font-bold"
                      />
                    </div>
                  ))}
                </div>

                {/* Volume Comparison */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-xl text-center ${isVolumeOk ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                    <div className="text-4xl font-bold mb-2">{actualVolume}L</div>
                    <div className="text-white/60">Your Aquarium Volume</div>
                  </div>
                  <div className="glass p-6 rounded-xl text-center">
                    <div className="text-4xl font-bold mb-2 text-gradient">{requiredVolume}L</div>
                    <div className="text-white/60">Required for {fishList.length} fish</div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  {isVolumeOk ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Perfect! Your aquarium is big enough.</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Need {requiredVolume - actualVolume}L more volume!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TransitionWrapper>
  );
};

export default Fish;
