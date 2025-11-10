import React, { useState } from 'react';
import './FunFolder.css';
import FunFolderModal from './FunFolderModal';

// Visible label changed to Hidden Folder and password gating handled here
const FunFolder: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(true);
  const [pwAttempt, setPwAttempt] = useState('');

  const tryOpen = () => {
    if (pwAttempt === 'super') {
      setLocked(false);
      setOpen(true);
      setPwAttempt('');
    } else {
      // simple shake effect could be added via CSS class; for now clear field
      setPwAttempt('');
      // keep locked true
    }
  };

  return (
    <>
      <div className="fun-folder-container">
        <button className="fun-folder big" aria-label="Open hidden folder" onClick={() => setOpen(true)}>
          <div className="folder-body">
            <div className="folder-tab" />
            <div className="folder-face">
              <span className="folder-lock" aria-hidden="true">🔒</span>
            </div>
          </div>
        </button>

        {/* Lightweight inline password prompt - appears when user clicks the folder */}
        {open && locked && (
          <div className="hidden-prompt" role="dialog" aria-modal="true">
            <label className="hidden-prompt-label">Password:</label>
            <input
              type="password"
              value={pwAttempt}
              onChange={e => setPwAttempt(e.target.value)}
              className="hidden-prompt-input"
              aria-label="Enter folder password"
            />
            <div className="hidden-prompt-actions">
              <button onClick={tryOpen} className="hidden-prompt-ok">Unlock</button>
              <button onClick={() => { setOpen(false); setPwAttempt(''); }} className="hidden-prompt-cancel">Cancel</button>
            </div>
            <div className="hidden-prompt-help">Hint: try a short word 😉</div>
          </div>
        )}

        {/* Only show modal once unlocked */}
        {open && !locked && <FunFolderModal folder={"funny"} onClose={() => { setOpen(false); setLocked(true); }} />}
      </div>
    </>
  );
};

export default FunFolder;
