import { useState } from 'react';

function Settings({ settings, onSave, onClose }) {
  const [formData, setFormData] = useState({
    partner1Name: settings.partner1Name || '',
    partner2Name: settings.partner2Name || '',
    anniversaryDate: settings.anniversaryDate || '',
    nextVisitDate: settings.nextVisitDate || '',
    visitsCount: settings.visitsCount || 0,
  });

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

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <h2>Settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="partner1Name">Your Name</label>
            <input
              type="text"
              id="partner1Name"
              name="partner1Name"
              value={formData.partner1Name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="partner2Name">Partner's Name</label>
            <input
              type="text"
              id="partner2Name"
              name="partner2Name"
              value={formData.partner2Name}
              onChange={handleChange}
              placeholder="Enter your partner's name"
            />
          </div>

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
      </div>
    </div>
  );
}

export default Settings;
