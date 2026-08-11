import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { GalleryItem } from '../types';
import { Image as ImageIcon, X, Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useHospital();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const categories: string[] = ['All', 'Building', 'Facilities', 'ICU & OT', 'Doctors & Staff', 'Health Camps', 'Events'];

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
          Visual Campus Tour
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Khair Hospital Photo Gallery
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Take a look at our modern healthcare campus, advanced operation theatres, ICU equipment, health camps, and clinical events.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => {
          const isPdf = item.imageUrl?.startsWith('data:application/pdf') || item.imageUrl?.toLowerCase().includes('.pdf');

          return (
            <div
              key={item.id}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative bg-white border border-slate-200 text-slate-900 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="h-60 overflow-hidden relative bg-slate-100 flex items-center justify-center">
                {isPdf ? (
                  <div className="flex flex-col items-center justify-center gap-2 p-6 text-center text-rose-700 bg-rose-50 w-full h-full">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shadow-xs">
                      <ImageIcon className="w-8 h-8 hidden" />
                      <span className="font-extrabold text-lg">PDF</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</p>
                    <span className="text-[11px] font-semibold text-rose-600 bg-white border border-rose-200 px-3 py-1 rounded-full">
                      Click to Open PDF Document
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-8 h-8" />
                </div>
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm transition truncate text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {activeLightboxItem.imageUrl?.startsWith('data:application/pdf') || activeLightboxItem.imageUrl?.toLowerCase().includes('.pdf') ? (
              <div className="p-12 text-center text-white space-y-6 bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-20 h-20 rounded-2xl bg-rose-900/50 border border-rose-700 text-rose-400 flex items-center justify-center text-2xl font-bold">
                  PDF
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{activeLightboxItem.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{activeLightboxItem.caption}</p>
                </div>
                <a
                  href={activeLightboxItem.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition inline-flex items-center gap-2"
                >
                  Open PDF Document in New Tab
                </a>
              </div>
            ) : (
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="w-full max-h-[70vh] object-contain bg-slate-950"
              />
            )}

            <div className="p-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <span>{activeLightboxItem.category}</span> • <span>{activeLightboxItem.date}</span>
              </div>
              <h3 className="text-xl font-bold">{activeLightboxItem.title}</h3>
              <p className="text-sm text-slate-300">{activeLightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
