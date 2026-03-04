import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PlatformSelector } from './components/PlatformSelector';
import { Button } from './components/Button';
import { PlatformSpec, AppState, GenerationResult } from './types';
import { adaptImage } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [platform, setPlatform] = useState<PlatformSpec | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!image || !platform) return;

    setAppState(AppState.ANALYZING); // Start with generic "working" state
    setError(null);
    setResult(null);

    try {
      // Direct call - API handles analysis and generation
      const response = await adaptImage(image, platform);
      
      setResult(response);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPlatform(null);
    setResult(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header & Sidebar (Input) */}
        <div className="lg:col-span-5 space-y-8">
          <header>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-500 p-2 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.077-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Layout Designer</h1>
            </div>
            <p className="text-slate-400">
              AI-powered image adaptation for multi-platform ad creatives.
            </p>
          </header>

          {/* Step 1: Upload */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              <span className="flex items-center justify-center w-5 h-5 rounded-full border border-indigo-500 text-[10px]">1</span>
              Input Source
            </div>
            <ImageUploader 
              onImageSelect={(file) => {
                setImage(file);
                setResult(null); // Clear previous results
              }} 
              selectedImage={image} 
            />
          </section>

          {/* Step 2: Platform */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-400 uppercase tracking-wider">
              <span className="flex items-center justify-center w-5 h-5 rounded-full border border-indigo-500 text-[10px]">2</span>
              Target Platform
            </div>
            <PlatformSelector 
              selectedPlatform={platform} 
              onSelect={setPlatform} 
              disabled={appState === AppState.ANALYZING || appState === AppState.GENERATING}
            />
          </section>

          {/* Action Area */}
          <div className="pt-4 border-t border-slate-800">
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-200 text-sm">
                Error: {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <Button 
                className="flex-1 py-3 text-lg"
                onClick={handleGenerate}
                disabled={!image || !platform}
                isLoading={appState === AppState.ANALYZING || appState === AppState.GENERATING}
              >
                Generate Adaptation
              </Button>
              {appState === AppState.COMPLETE && (
                <Button variant="secondary" onClick={handleReset}>
                  New Project
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area (Output) */}
        <div className="lg:col-span-7 bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden min-h-[600px] flex flex-col relative">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="font-semibold text-slate-200">Workspace Output</h2>
            {platform && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-full">
                <span>Target: {platform.name}</span>
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span>{platform.width}x{platform.height}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
            
            {/* Empty State */}
            {appState === AppState.IDLE && (
              <div className="text-center space-y-4 max-w-sm">
                <div className="w-16 h-16 mx-auto bg-slate-700/50 rounded-2xl flex items-center justify-center text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.327 24.327 0 01-3.25.948m8.17 8.623l-2.829-2.83a2.25 2.25 0 01-.659-1.591V6.357m4.066 10.518a24.381 24.381 0 01-4.066-1.121m0 0a24.382 24.382 0 01-4.066-1.121m8.132 2.242c.962.295 1.96.538 2.982.72m-8.132-2.242a24.382 24.382 0 01-4.066-1.121M12 5.25a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 004.5 0v-1.5a2.25 2.25 0 00-2.25-2.25z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v6" />
                  </svg>
                </div>
                <h3 className="text-slate-300 font-medium">Ready to Design</h3>
                <p className="text-slate-500 text-sm">
                  Upload an image and select a target format to begin the smart adaptation process.
                </p>
              </div>
            )}

            {/* Loading / Analyzing State */}
            {(appState === AppState.ANALYZING || appState === AppState.GENERATING) && (
              <div className="text-center space-y-6 animate-pulse">
                <div className="relative w-20 h-20 mx-auto">
                   <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white">
                    {appState === AppState.ANALYZING ? 'Analyzing Composition...' : 'Generating Layout...'}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    The AI is identifying key visual elements and calculating the optimal background extension strategy.
                  </p>
                </div>
              </div>
            )}

            {/* Results State */}
            {appState === AppState.COMPLETE && result && (
              <div className="w-full h-full flex flex-col gap-6">
                
                {/* 1. Strategy Analysis (CoT) */}
                <div className="bg-slate-900/80 rounded-xl p-5 border border-indigo-500/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-3 text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-xs font-bold uppercase tracking-wider">Design Strategy</h3>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {result.analysis}
                  </div>
                </div>

                {/* 2. Generated Image */}
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-black/40 rounded-xl border border-slate-700 overflow-hidden relative group">
                  {result.imageUrl ? (
                    <>
                      <img 
                        src={result.imageUrl} 
                        alt="Adapted Creative" 
                        className="max-w-full max-h-[500px] object-contain shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a 
                          href={result.imageUrl} 
                          download={`adapted-${platform?.name}.png`}
                          className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors transform hover:scale-105"
                        >
                          Download Image
                        </a>
                      </div>
                    </>
                  ) : (
                    <p className="text-red-400">Failed to generate image.</p>
                  )}
                </div>
                
                {/* Footer Note */}
                <div className="text-center text-xs text-slate-500">
                  * Generated with {platform?.geminiAspectRatio} base ratio. Final cropping to exactly {platform?.width}x{platform?.height} may be required.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
