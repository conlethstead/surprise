import React, { useEffect, useState } from 'react';
import photoManifest from '../data/photo-manifest.json';
import './FunFolderModal.css';

interface Props {
  folder: string; // date folder or 'funny'
  onClose: () => void;
}

const FunFolderModal: React.FC<Props> = ({ folder, onClose }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Load photos from manifest; if folder is not a date, attempt to use it as a key
    const manifestKey = folder;
    const list: string[] = (photoManifest as any)[manifestKey] || [];
    // If the manifest didn't have this key, and folder is 'funny', try '/pictures/funny' in public
    if (!list.length && folder === 'funny') {
      // Try to discover files in build/public pictures directory by using predictable names
      // We'll attempt a small set of common names to avoid network calls. The gallery will show whatever exists.
      // Fallback: show at least one placeholder if none found
    }

    setPhotos(list.map((p: string) => `/pictures/${manifestKey}/${p}`));
  }, [folder]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => Math.min(i + 1, photos.length - 1));
      if (e.key === 'ArrowLeft') setIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos.length, onClose]);

  if (!photos.length) return (
    <div className="ff-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ff-modal" onClick={e => e.stopPropagation()}>
        <button className="ff-close" onClick={onClose} aria-label="Close gallery">✕</button>
        <div className="ff-empty">No photos found in this folder.</div>
      </div>
    </div>
  );

  return (
    <div className="ff-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="ff-modal" onClick={e => e.stopPropagation()}>
        <button className="ff-close" onClick={onClose} aria-label="Close gallery">✕</button>
        <div className="ff-gallery">
          <button className="ff-nav left" onClick={() => setIndex(i => Math.max(i - 1, 0))} aria-label="Previous">◀</button>
          <img src={photos[index]} alt={`Funny ${index + 1}`} className="ff-photo" />
          <button className="ff-nav right" onClick={() => setIndex(i => Math.min(i + 1, photos.length - 1))} aria-label="Next">▶</button>
        </div>
        <div className="ff-caption">{index + 1} / {photos.length}</div>
      </div>
    </div>
  );
};

export default FunFolderModal;
