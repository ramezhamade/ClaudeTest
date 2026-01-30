import { useState } from 'react';
import { useCouple } from '../context/CoupleContext';

const CoupleSetup = () => {
  const { createRoom, joinRoom, error } = useCouple();
  const [mode, setMode] = useState(null); // 'create' or 'join'
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError('Please enter your name');
      return;
    }

    setLoading(true);
    setLocalError(null);

    try {
      const newCode = await createRoom(name.trim());
      setGeneratedCode(newCode);
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setLocalError('Please enter your name');
      return;
    }
    if (!code.trim() || code.trim().length !== 6) {
      setLocalError('Please enter a valid 6-character code');
      return;
    }

    setLoading(true);
    setLocalError(null);

    try {
      await joinRoom(code.trim(), name.trim());
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  if (generatedCode) {
    return (
      <div className="couple-setup">
        <div className="setup-card">
          <div className="success-icon">✓</div>
          <h2>You're all set!</h2>
          <p>Share this code with your partner:</p>

          <div className="code-display">
            <span className="couple-code">{generatedCode}</span>
            <button onClick={copyCode} className="copy-btn">Copy</button>
          </div>

          <p className="waiting-text">
            Waiting for your partner to join...
          </p>

          <div className="setup-tips">
            <p>Send this code to your partner via text, and they can join from any device!</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="couple-setup">
        <div className="setup-card">
          <h1>Our Love App</h1>
          <p className="setup-intro">Connect with your partner to track your relationship stats and play games together!</p>

          <div className="setup-options">
            <button
              className="setup-option-btn create"
              onClick={() => setMode('create')}
            >
              <span className="option-icon">+</span>
              <span className="option-title">Create Room</span>
              <span className="option-desc">Start a new couple room and invite your partner</span>
            </button>

            <button
              className="setup-option-btn join"
              onClick={() => setMode('join')}
            >
              <span className="option-icon">→</span>
              <span className="option-title">Join Room</span>
              <span className="option-desc">Enter a code from your partner</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="couple-setup">
      <div className="setup-card">
        <button className="back-link" onClick={() => setMode(null)}>
          ← Back
        </button>

        <h2>{mode === 'create' ? 'Create Room' : 'Join Room'}</h2>

        <form onSubmit={mode === 'create' ? handleCreate : handleJoin}>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          {mode === 'join' && (
            <div className="form-group">
              <label>Couple Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="code-input"
              />
            </div>
          )}

          {(localError || error) && (
            <div className="error-message">{localError || error}</div>
          )}

          <button
            type="submit"
            className="submit-setup-btn"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'create' ? 'Create Room' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CoupleSetup;
