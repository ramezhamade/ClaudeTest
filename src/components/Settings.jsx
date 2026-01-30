import { useState } from 'react';

function Settings({ settings, onSave, onClose, coupleCode, onLogout }) {
  const [formData, setFormData] = useState({
    anniversaryDate: settings.anniversaryDate || '',
    nextVisitDate: settings.nextVisitDate || '',
    visitsCount: settings.visitsCount || 0,
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'visitsCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(coupleCode);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>Settings</h2>

        {coupleCode && (
          <div className="couple-code-section">
            <label>Your Couple Code</label>
            <div className="code-display-inline">
              <span className="code-text">{coupleCode}</span>
              <button type="button" onClick={copyCode} className="copy-code-btn">
                Copy
              </button>
            </div>
            <span className="form-help">Share this code with your partner to connect</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="anniversaryDate">Anniversary Date</label>
            <input
              type="date"
              id="anniversaryDate"
              name="anniversaryDate"
              value={formData.anniversaryDate}
              onChange={handleChange}
            />
            <span className="form-help">When did your relationship start?</span>
          </div>

          <div className="form-group">
            <label htmlFor="nextVisitDate">Next Visit Date</label>
            <input
              type="date"
              id="nextVisitDate"
              name="nextVisitDate"
              value={formData.nextVisitDate}
              onChange={handleChange}
            />
            <span className="form-help">When are you seeing each other next?</span>
          </div>

          <div className="form-group">
            <label htmlFor="visitsCount">Total Visits So Far</label>
            <input
              type="number"
              id="visitsCount"
              name="visitsCount"
              value={formData.visitsCount}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>

        {onLogout && (
          <div className="logout-section">
            {!showLogoutConfirm ? (
              <button
                type="button"
                className="logout-btn"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Log Out
              </button>
            ) : (
              <div className="logout-confirm">
                <p>Are you sure? You'll need the couple code to reconnect.</p>
                <div className="logout-buttons">
                  <button
                    type="button"
                    className="cancel-logout-btn"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="confirm-logout-btn"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;
