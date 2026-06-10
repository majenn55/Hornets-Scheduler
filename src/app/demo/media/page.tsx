'use client';

import { useState } from 'react';
import { demoMedia } from '@/lib/demo-data';

export default function DemoMediaPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? demoMedia : demoMedia.filter((m) => m.type === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-500 text-sm">Photos and videos from games and events</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm opacity-75 cursor-not-allowed">{"\u{1F4F7}"} Take Photo</button>
          <button className="btn-secondary text-sm opacity-75 cursor-not-allowed">{"\u{1F3A5}"} Record Video</button>
          <button className="btn-primary text-sm opacity-75 cursor-not-allowed">Upload</button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'PHOTO', 'VIDEO'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f === 'all' ? 'All' : f === 'PHOTO' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="card p-0 overflow-hidden">
            <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
              {item.type === 'PHOTO' ? (
                <div className="text-center">
                  <span className="text-4xl">{"\u{1F5BC}\u{FE0F}"}</span>
                  <p className="text-xs text-gray-400 mt-2">Photo</p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-4xl">{"\u{1F3AC}"}</span>
                  <p className="text-xs text-gray-400 mt-2">Video</p>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={item.type === 'PHOTO' ? 'badge-green' : 'badge-blue'}>
                  {item.type === 'PHOTO' ? 'Photo' : 'Video'}
                </span>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{item.fileName}</p>
              <p className="text-xs text-gray-500">
                {item.uploader.firstName} {item.uploader.lastName} &bull; {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.caption && <p className="text-xs text-gray-600 mt-1 truncate">{item.caption}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
