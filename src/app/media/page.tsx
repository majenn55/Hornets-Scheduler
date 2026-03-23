'use client';

import { useState, useEffect, useRef } from 'react';

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    const typeParam = filter !== 'all' ? `?type=${filter}` : '';
    const res = await fetch(`/api/media${typeParam}`);
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }

  useEffect(() => { loadMedia(); }, [filter]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);

      await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
    }

    setUploading(false);
    loadMedia();
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Gallery</h1>
          <p className="text-gray-500 text-sm">Photos and videos from games and events</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="btn-secondary text-sm"
          >
            {"\u{1F4F7}"} Take Photo
          </button>
          <button
            onClick={() => videoInputRef.current?.click()}
            className="btn-secondary text-sm"
          >
            {"\u{1F3A5}"} Record Video
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary text-sm"
          >
            Upload
          </button>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      {uploading && (
        <div className="bg-primary-50 text-primary-700 p-3 rounded-lg mb-4 text-sm">
          Uploading media...
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {['all', 'PHOTO', 'VIDEO'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'PHOTO' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      {media.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">{"\u{1F4F8}"}</p>
          <p className="text-gray-500 mb-4">No media yet. Upload photos and videos from your games!</p>
          <button onClick={() => fileInputRef.current?.click()} className="btn-primary">
            Upload Media
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="card p-0 overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                {item.type === 'PHOTO' ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                  {item.uploader?.firstName} {item.uploader?.lastName} &bull;{' '}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
                {item.caption && <p className="text-xs text-gray-600 mt-1 truncate">{item.caption}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
