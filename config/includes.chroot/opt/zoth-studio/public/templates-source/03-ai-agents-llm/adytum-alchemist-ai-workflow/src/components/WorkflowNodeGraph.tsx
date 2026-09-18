import React, { useState } from "react";
import { Sparkles, X, CheckCircle, Lock, ArrowRight, Activity, BrainCircuit } from "lucide-react";
import { MOCK_TAROT_DATA } from "@/lib/mockEngine";
import { Button } from "@/components/ui/button";

type WorkflowNodeGraphProps = {
  currentKeyNumber: number | null;
  completedKeys: Record<number, boolean>;
  onClose: () => void;
  onJumpToKey?: (keyNum: number) => void;
};

export const WorkflowNodeGraph: React.FC<WorkflowNodeGraphProps> = ({
  currentKeyNumber,
  completedKeys,
  onClose,
  onJumpToKey,
}) => {
  const [selectedKey, setSelectedKey] = useState<number | null>(currentKeyNumber ?? 0);

  const activeLesson = selectedKey !== null ? MOCK_TAROT_DATA[selectedKey] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="node-graph-title"
    >
      <div className="relative w-full max-w-5xl bg-zinc-900/95 border border-amber-500/30 rounded-2xl p-4 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.18)] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30">
              <BrainCircuit className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 id="node-graph-title" className="text-xl sm:text-2xl font-heading text-amber-300 tracking-wide flex items-center gap-2">
                AI Alchemy Workflow Studio &amp; Node Graph
              </h2>
              <p className="text-xs text-zinc-400">
                Interactive mapping of the 22 BOTA Major Arcana Keys to Modern AI Agent &amp; LLM Architecture
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            aria-label="Close Studio"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content Container */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1">
          {/* Node Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-200/80 mb-2 px-1">
              <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> 22 Alchemical Paths
              </span>
              <span>{Object.values(completedKeys).filter(Boolean).length} / 22 Completed</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[58vh] overflow-y-auto p-1 custom-scrollbar" role="grid" aria-label="Alchemical Tarot Nodes">
              {Object.values(MOCK_TAROT_DATA).map((node) => {
                const isCurrent = currentKeyNumber === node.keyNumber;
                const isSelected = selectedKey === node.keyNumber;
                const isCompleted = !!completedKeys[node.keyNumber];

                return (
                  <button
                    key={node.keyNumber}
                    onClick={() => setSelectedKey(node.keyNumber)}
                    className={`relative text-left p-2.5 rounded-xl border transition-all duration-200 group flex flex-col justify-between ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-300"
                        : isCurrent
                        ? "border-amber-500/60 bg-amber-950/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                        : isCompleted
                        ? "border-emerald-500/40 bg-zinc-950/80 hover:border-emerald-400/60"
                        : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/60"
                    }`}
                    role="gridcell"
                    aria-selected={isSelected}
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] uppercase font-semibold text-amber-300/90 tracking-wider">
                        Key {node.keyNumber}
                      </span>
                      {isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin [animation-duration:4s] shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-zinc-600 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs font-medium text-zinc-200 group-hover:text-amber-200 line-clamp-1">
                      {node.name}
                    </p>

                    <div className="mt-1.5 text-[9px] text-zinc-400 truncate bg-zinc-900/80 rounded px-1.5 py-0.5 border border-zinc-800">
                      {node.aiLesson.split(" - ")[0].split(".")[0].replace("Key " + node.keyNumber + " represents ", "").replace("Key " + node.keyNumber + " symbolizes ", "").replace("Key " + node.keyNumber + " embodies ", "")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Details Panel (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-950/80 rounded-xl border border-amber-500/20 p-4 flex flex-col justify-between space-y-4">
            {activeLesson ? (
              <div className="space-y-4 overflow-y-auto max-h-[58vh]">
                <div className="flex items-start gap-4">
                  <img
                    src={activeLesson.imagePath}
                    alt={activeLesson.name}
                    className="w-20 h-auto rounded-lg border border-amber-400/40 shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      Key {activeLesson.keyNumber}
                    </span>
                    <h3 className="text-lg font-heading text-zinc-100 font-medium">
                      {activeLesson.name}
                    </h3>
                    <p className="text-[11px] text-amber-200/70 mt-1 leading-tight">
                      {activeLesson.attribution}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-zinc-800 pt-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5" /> AI Architecture Principle
                  </h4>
                  <p className="text-xs leading-relaxed text-zinc-300 bg-zinc-900/70 p-3 rounded-lg border border-zinc-800">
                    {activeLesson.aiLesson}
                  </p>
                </div>

                <div className="space-y-2 border-t border-zinc-800 pt-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    Alchemical Reflection Prompt
                  </h4>
                  <p className="text-xs italic text-amber-100/90 bg-amber-950/20 p-3 rounded-lg border border-amber-500/20">
                    "{activeLesson.question}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm italic">
                Select a Tarot Key node to inspect its AI chemistry attribution.
              </div>
            )}

            {activeLesson && onJumpToKey && (
              <div className="pt-2 border-t border-zinc-800">
                <Button
                  onClick={() => {
                    onJumpToKey(activeLesson.keyNumber);
                    onClose();
                  }}
                  className="w-full h-auto py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  Focus Node Key {activeLesson.keyNumber} in Initiation
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
