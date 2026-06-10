/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronRight, Globe, Shield, Star, Video, Upload, RefreshCw, Volume2, VolumeX, Eye, EyeOff, Sparkles, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- IndexedDB Video Storage Helpers for Permanent Client-Side Restores ---
const DB_NAME = 'AtmosphericVideoDB';
const STORE_NAME = 'videos';
const DB_VERSION = 1;

function getIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveVideoToStore(blob: Blob, name: string): Promise<void> {
  try {
    const db = await getIndexedDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put({ blob, name, savedAt: Date.now() }, 'background_video');
  } catch (err) {
    console.error('Failed to save video to local database:', err);
  }
}

function OnlyFansLogo({ className, size = 20 }: { className?: string, size?: number }) {
  return (
    <svg 
      role="img" 
      viewBox="0 0 24 24" 
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OnlyFans</title>
      <path d="M24 4.003h-4.015c-3.45 0-5.3.197-6.748 1.957a7.996 7.996 0 1 0 2.103 9.211c3.182-.231 5.39-2.134 6.085-5.173 0 0-2.399.585-4.43 0 4.018-.777 6.333-3.037 7.005-5.995zM5.61 11.999A2.391 2.391 0 0 1 9.28 9.97a2.966 2.966 0 0 1 2.998-2.528h.008c-.92 1.778-1.407 3.352-1.998 5.263A2.392 2.392 0 0 1 5.61 12Zm2.386-7.996a7.996 7.996 0 1 0 7.996 7.996 7.996 7.996 0 0 0-7.996-7.996Zm0 10.394A2.399 2.399 0 1 1 10.395 12a2.396 2.396 0 0 1-2.399 2.398Z"/>
    </svg>
  );
}

async function loadVideoFromStore(): Promise<{ blob: Blob; name: string } | null> {
  try {
    const db = await getIndexedDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('background_video');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Failed to read video from local database:', err);
    return null;
  }
}

function ConsultationForm() {
  const [formData, setFormData] = useState({ name: '', email: '', preferredDate: '', message: '', type: 'Physiotherapy' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', preferredDate: '', message: '', type: 'Physiotherapy' });
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Book a Consultation</h3>
        <p className="text-[11px] text-zinc-500 font-light leading-relaxed">Book a clinical or exploratory session. Confirmation will be sent via email.</p>
      </div>

      {isSubmitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-950/20 text-zinc-300 p-6 border border-cyan-500/10 text-center flex flex-col items-center gap-3"
        >
          <span className="text-cyan-400 text-lg">✓</span>
          <p className="font-light tracking-wide text-xs uppercase text-white">Booking Request Sent</p>
          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">Thank you. I will reach out shortly to schedule your consultation.</p>
          <button 
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="mt-2 text-[10px] tracking-wider text-cyan-500 uppercase hover:text-cyan-400 transition-colors"
          >
            [ Send another request ]
          </button>
        </motion.div>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Your Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. John Doe"
              className="py-2 bg-transparent border-b border-zinc-800 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/40 transition-colors font-light text-xs tracking-wide"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="e.g. john@example.com"
              className="py-2 bg-transparent border-b border-zinc-800 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/40 transition-colors font-light text-xs tracking-wide"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Service</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="py-2 bg-transparent border-b border-zinc-800 text-zinc-300 focus:outline-none focus:border-cyan-500/40 transition-colors font-light text-xs tracking-wide h-[36px]"
              >
                <option value="Physiotherapy" className="bg-[#030508] text-zinc-300">Physiotherapy</option>
                <option value="Rehabilitation" className="bg-[#030508] text-zinc-300">Rehabilitation</option>
                <option value="Collaboration" className="bg-[#030508] text-zinc-300">Collaboration</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Preferred Date</label>
              <input 
                type="date" 
                required
                value={formData.preferredDate}
                onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                className="py-1 bg-transparent border-b border-zinc-800 text-zinc-300 focus:outline-none focus:border-cyan-500/40 transition-colors font-light text-xs tracking-wide h-[36px]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Message / Recovery Goals</label>
            <textarea 
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Describe rehabilitation concerns or wellness goals..."
              className="py-2 bg-transparent border-b border-zinc-800 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-cyan-500/40 transition-colors font-light text-xs tracking-wide resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-2 py-3.5 bg-zinc-900 border border-white/10 hover:border-white/25 text-white font-light tracking-[0.2em] text-[10px] transition-all duration-300 active:scale-95 disabled:bg-zinc-950/20 disabled:text-zinc-650 flex items-center justify-center gap-2 cursor-pointer uppercase"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={12} className="animate-spin text-zinc-400" />
                <span>SUBMITTING...</span>
              </>
            ) : (
              <span>SUBMIT REQUEST</span>
            )}
          </button>
        </>
      )}
    </form>
  );
}

const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'What I Do', href: '#what-i-do' },
  { name: 'Expertise', href: '#expertise' },
  { name: 'Contact', href: '#contact' }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Restore layout parameters from localStorage on load
  const [bgSource, setBgSource] = useState<'clouds' | 'flight' | 'custom'>(() => {
    return (localStorage.getItem('skyelite_bg_source') as any) || 'clouds';
  });
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [isMuted] = useState(true);
  const [overlayStyle, setOverlayStyle] = useState<'pure-video' | 'cyber-dark' | 'bright-glass'>(() => {
    return (localStorage.getItem('skyelite_overlay_style') as any) || 'pure-video';
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSavedVideo, setHasSavedVideo] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load saved video from IndexedDB on initial mount
  useEffect(() => {
    async function initSavedVideo() {
      const saved = await loadVideoFromStore();
      if (saved) {
        const url = URL.createObjectURL(saved.blob);
        setCustomVideoUrl(url);
        setCustomFileName(saved.name);
        setHasSavedVideo(true);
      }
    }
    initSavedVideo();
  }, []);

  // Sync preferences to localStorage
  useEffect(() => {
    localStorage.setItem('skyelite_bg_source', bgSource);
  }, [bgSource]);

  useEffect(() => {
    localStorage.setItem('skyelite_overlay_style', overlayStyle);
  }, [overlayStyle]);

  // Sync mute/unmute and playback safely without throwing uncaught console warnings
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      
      // Let the browser evaluate and play the video natively as sources swap or unmute
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Playback warnings (e.g. autoplay restriction when unmuted) are normal and handled here gracefully.
          console.log("Background video status info:", err.message);
        });
      }
    }
  }, [bgSource, customVideoUrl]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsSaving(true);
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomFileName(file.name);
      setBgSource('custom');
      
      // Save permanently to the IndexedDB local database
      await saveVideoToStore(file, file.name);
      setHasSavedVideo(true);
      setIsSaving(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setIsSaving(true);
      if (customVideoUrl) {
        URL.revokeObjectURL(customVideoUrl);
      }
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomFileName(file.name);
      setBgSource('custom');
      
      // Save permanently to IndexedDB
      await saveVideoToStore(file, file.name);
      setHasSavedVideo(true);
      setIsSaving(false);
    }
  };

  const selectPreset = (type: 'clouds' | 'flight') => {
    setBgSource(type);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="min-h-screen bg-gray-950 flex flex-col font-sans selection:bg-[#202A36] selection:text-white relative"
    >
      {/* Full Screen Drag and Drop Visual Hints */}
      <AnimatePresence>
        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#202A36]/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center text-white border-8 border-dashed border-white/20 rounded-3xl"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="p-6 bg-white/10 rounded-full mb-6"
            >
              <Upload size={64} className="text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Drop your Jersey/Glasses Video Here!</h2>
            <p className="text-xl text-white/70 max-w-lg">We will instantly play your video as the interactive fullscreen atmosphere background with audio unmuted.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section Container */}
      <section id="home" className="relative h-screen overflow-hidden w-full flex flex-col">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={videoRef}
            key={bgSource + '-' + (customVideoUrl ? 'custom' : 'preset')}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
            src={
              bgSource === 'custom' && customVideoUrl
                ? customVideoUrl
                : bgSource === 'flight'
                ? "https://assets.mixkit.co/videos/preview/mixkit-flying-over-clouds-21985-large.mp4"
                : "https://assets.mixkit.co/videos/preview/mixkit-private-jet-flying-above-the-clouds-40280-large.mp4"
            }
          />

          {/* Interactive Screen Overlay: Toggle between full high-visibility, dark mode, or bright mode */}
          {overlayStyle === 'pure-video' && (
            <div className="absolute inset-0 bg-black/10 mix-blend-normal pointer-events-none transition-all duration-500" />
          )}
          {overlayStyle === 'cyber-dark' && (
            <div className="absolute inset-0 bg-black/40 mix-blend-normal pointer-events-none transition-all duration-500" />
          )}
          {overlayStyle === 'bright-glass' && (
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/45 to-white/60 mix-blend-normal pointer-events-none transition-all duration-500" />
          )}
        </div>

        {/* Content Wrapper */}
        <div className="relative h-full flex flex-col z-10 w-full">
          {/* Navigation Bar */}
          <header className="w-full">
            <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
              {/* Brand Name */}
              <motion.div 
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-lg font-light text-white tracking-[0.25em] uppercase select-none"
              >
                <span>MUZZAMMIL</span>
              </motion.div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex items-center gap-10">
                {NAV_ITEMS.map((item, i) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                    className="text-white hover:text-white/80 font-medium text-sm transition-colors duration-200 tracking-wide relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#202A36] hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile Hamburger Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-white/80 transition-colors p-2 rounded-lg hover:bg-white/10 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={24} className="transition-colors" /> : <Menu size={24} className="transition-colors" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="absolute top-20 left-8 right-8 p-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-50 border border-white/40 max-w-7xl mx-auto"
              >
                <div className="flex flex-col gap-4">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-900 hover:text-cyan-700 transition-colors duration-200 font-medium text-base py-2 border-b border-gray-100 last:border-b-0"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex items-end justify-center pb-4">
            <div className="text-center px-8 max-w-5xl flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
                className="flex flex-col items-center justify-center select-none"
              >
                {/* Line 1 */}
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extralight text-white tracking-[0.3em] leading-tight uppercase">
                  MUZZAMMIL PM.
                </h1>
                {/* Line 2 with elegant spacing and minimalist weight */}
                <h2 className="text-[10px] md:text-xs font-light tracking-[0.4em] text-[#202A36] uppercase mt-2">
                  ENTREPRENEUR • PHYSIOTHERAPIST
                </h2>
              </motion.div>
            </div>
          </main>

        </div>
      </section>

      {/* Main Portfolio Layout Content */}
      <div className="bg-[#030508] text-zinc-300 overflow-hidden relative z-10 border-t border-white/5">
        
        {/* Intro/Summary Card Section */}
        <section id="intro" className="py-32 px-8 bg-[#030508] border-b border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.02)_0%,transparent_60%)] pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-5"
            >
              <h2 className="text-3xl md:text-4xl font-extralight tracking-[0.2em] text-white uppercase">
                MUZAMMIL
              </h2>
              <p className="text-base md:text-lg text-zinc-400 max-w-xl font-light leading-relaxed mt-2">
                A physiotherapist and entrepreneur dedicated to human performance, precision rehabilitation, and building meaningful healthcare innovations.
              </p>
              
              <button 
                onClick={() => {
                  const contactSec = document.getElementById('contact');
                  if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="mt-6 px-7 py-3 bg-zinc-900 hover:bg-zinc-850 text-white border border-white/10 hover:border-white/25 rounded-none font-light tracking-[0.15em] text-xs transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>BOOK A CONSULTATION</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 px-8 bg-[#030508] border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
                <div className="md:col-span-4 flex flex-col gap-2">
                  <h3 className="text-2xl font-light tracking-wide text-white">About Me</h3>
                </div>
              <div className="md:col-span-8 flex flex-col gap-8">
                <p className="text-base text-zinc-400 font-light leading-relaxed">
                  I'm <strong className="font-normal text-white">Muzammil</strong>, combining clinical expertise with strategic entrepreneurial drive. I focus on structural recovery, optimized natural movement, and digital healthcare products that help communities live healthier.
                </p>
                <div className="p-6 bg-zinc-950/40 border border-white/5 rounded-none relative">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-500" />
                  <p className="text-zinc-400 italic font-light text-sm leading-relaxed pl-4">
                    "High-quality healthcare thrives at the intersection of clinical excellence, empathy, and persistent exploration."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What I Do Section */}
        <section id="what-i-do" className="py-32 px-8 bg-[#030508] border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="mb-20 text-center flex flex-col items-center">
              <h3 className="text-2xl md:text-3xl font-light tracking-wider text-white mt-2">What I Do</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Physiotherapy */}
              <div className="p-8 bg-zinc-950/20 border border-white/5 hover:border-white/10 transition-colors duration-300 flex flex-col gap-5">
                <div className="text-cyan-400">
                  <Star size={18} className="stroke-[1.25]" />
                </div>
                <h4 className="text-sm font-medium tracking-wider text-white uppercase">Physiotherapy</h4>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Bespoke recovery and mobility planning aimed at structural longevity and dynamic physical wellness.
                </p>
              </div>

              {/* Card 2: Rehabilitation */}
              <div className="p-8 bg-zinc-950/20 border border-white/5 hover:border-white/10 transition-colors duration-300 flex flex-col gap-5">
                <div className="text-cyan-400">
                  <Shield size={18} className="stroke-[1.25]" />
                </div>
                <h4 className="text-sm font-medium tracking-wider text-white uppercase">Rehabilitation</h4>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Evidence-based physical programs designed to safely rebuild athletic movement after trauma or surgery.
                </p>
              </div>

              {/* Card 3: Entrepreneurship */}
              <div className="p-8 bg-zinc-950/20 border border-white/5 hover:border-white/10 transition-colors duration-300 flex flex-col gap-5">
                <div className="text-cyan-400">
                  <Globe size={18} className="stroke-[1.25]" />
                </div>
                <h4 className="text-sm font-medium tracking-wider text-white uppercase">Entrepreneurship</h4>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Creating human-centric solutions, digital platforms, and health tech projects with local and global impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section id="expertise" className="py-32 px-8 bg-[#030508] border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-5 flex flex-col gap-3">
                <h3 className="text-2xl font-light tracking-wide text-white">Expertise</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed mt-2">
                  Applying analytical sports perspectives to posture, clinical rehabilitation, and product-focused health ventures.
                </p>
              </div>
              <div className="md:col-span-7">
                <div className="flex flex-col gap-2">
                  {[
                    "Sports Rehabilitation",
                    "Pain Management & Recovery",
                    "Exercise Prescription",
                    "Soft Tissue & Joint Mobility",
                    "Healthcare Digital Innovation"
                  ].map((skill, index) => (
                    <div 
                      key={skill}
                      className="flex items-center justify-between bg-zinc-950/30 p-4 border border-white/5 hover:border-white/10 transition-colors duration-200"
                    >
                      <p className="font-light text-zinc-300 text-xs tracking-wide uppercase">{skill}</p>
                      <span className="text-[10px] font-mono text-zinc-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Unlock More Section */}
        <section id="unlock-more" className="py-32 px-8 bg-[#030508] border-b border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden border border-cyan-500/10 bg-zinc-950/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col gap-3 text-left max-w-xl relative z-10">
                <span className="text-[10px] font-semibold tracking-[0.3em] text-cyan-500 uppercase">Exclusive Content</span>
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-white leading-snug">
                  Unlock premium health updates, training programs, and exclusive support feeds.
                </h3>
                <p className="text-zinc-500 font-light text-xs leading-relaxed">
                  Connect on a direct channel, request tailor-made routines, and support new projects.
                </p>
              </div>
              
              <div className="flex-shrink-0 relative z-10">
                <a 
                  href="https://onlyfans.com/muzammil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 bg-zinc-900 border border-white/10 hover:border-cyan-500/40 text-white font-light tracking-[0.15em] text-xs transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <OnlyFansLogo size={14} />
                  <span>SUBSCRIBE NOW</span>
                  <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 px-8 bg-[#030508]">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              {/* Contact Information */}
              <div className="flex flex-col gap-10 justify-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-light tracking-wide text-white">Let's Connect</h3>
                </div>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">
                  For advisory, personalized consultations, wellness strategies, or strategic collaboration opportunities. Leave a request or connect directly.
                </p>
                <div className="flex flex-col gap-3">
                  <a 
                    href="mailto:hello@muzammil.com"
                    className="flex items-center justify-between p-4 bg-zinc-950/20 hover:bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">Email Address</span>
                      <span className="text-zinc-300 font-normal text-xs mt-1 transition-colors group-hover:text-cyan-400">hello@muzammil.com</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-650 group-hover:text-cyan-400 transition-colors" />
                  </a>
                  
                  <a 
                    href="tel:+919447630221"
                    className="flex items-center justify-between p-4 bg-zinc-950/20 hover:bg-zinc-950/40 border border-white/5 hover:border-white/10 transition-all duration-300 group"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">Direct Phone</span>
                      <span className="text-zinc-300 font-normal text-xs mt-1 transition-colors group-hover:text-cyan-400">+91 9447630221</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-650 group-hover:text-cyan-400 transition-colors" />
                  </a>

                  <a 
                    href="https://onlyfans.com/muzammil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-zinc-950/20 hover:bg-zinc-950/40 border border-cyan-500/5 hover:border-cyan-500/20 transition-all duration-300 group"
                  >
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-zinc-500 font-medium uppercase tracking-wider">Unlock Support Feed</span>
                      <span className="text-zinc-300 font-normal text-xs mt-1 transition-colors group-hover:text-cyan-400">OnlyFans Profile</span>
                    </div>
                    <OnlyFansLogo size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Consultation Booking Form Container */}
              <div className="bg-zinc-950/30 p-8 border border-white/5">
                <ConsultationForm />
              </div>

            </div>
          </div>
        </section>

        {/* Global Footer */}
        <footer className="bg-[#020305] text-zinc-500 py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-8 text-center flex flex-col items-center gap-4">
            <h4 className="text-white text-xs font-light tracking-[0.3em] uppercase">Muzammil</h4>
            <p className="text-[9px] text-zinc-600 font-light tracking-widest uppercase mt-1">
              Physiotherapist • Entrepreneur
            </p>
            <div className="w-8 h-px bg-white/5 my-3" />
            <p className="text-[10px] text-zinc-600 font-light max-w-md leading-relaxed">
              &copy; {new Date().getFullYear()} Muzammil. All rights reserved. Precision movement, personalized healthcare, and digital discovery.
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}

