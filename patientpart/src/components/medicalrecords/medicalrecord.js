import React, { useState } from 'react';
import { ArrowLeft, Plus, Pill, Scissors, AlertTriangle, X } from 'lucide-react';
import './medicalrecords.css';

const MedicalRecords = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('allergies');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState({
    allergies: ['Penicillin', 'Peanuts'],
    medications: ['Aspirin 100mg', 'Lisinopril 10mg'],
    surgeries: ['Appendectomy (2018)', 'Knee Arthroscopy (2020)']
  });

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems({
        ...items,
        [activeTab]: [...items[activeTab], newItem]
      });
      setNewItem('');
      setShowAddModal(false);
    }
  };

  const handleRemoveItem = (index) => {
    setItems({
      ...items,
      [activeTab]: items[activeTab].filter((_, i) => i !== index)
    });
  };

  const getIcon = () => {
    switch (activeTab) {
      case 'allergies': return <AlertTriangle className="section-icon" />;
      case 'medications': return <Pill className="section-icon" />;
      case 'surgeries': return <Scissors className="section-icon" />;
      default: return null;
    }
  };

  return (
    <div className="medical-records-container">
      <div className="header-section">
        <div className="header-top">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="icon" />
          </button>
          <h1>Medical Records</h1>
        </div>
      </div>

      <div className="content-section">
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'allergies' ? 'active' : ''}`}
            onClick={() => setActiveTab('allergies')}
          >
            Allergies
          </button>
          <button 
            className={`tab-button ${activeTab === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveTab('medications')}
          >
            Medications
          </button>
          <button 
            className={`tab-button ${activeTab === 'surgeries' ? 'active' : ''}`}
            onClick={() => setActiveTab('surgeries')}
          >
            Surgeries
          </button>
        </div>

        <div className="medical-section">
          <div className="section-header">
            {getIcon()}
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button className="add-button" onClick={() => setShowAddModal(true)}>
              <Plus className="add-icon" />
            </button>
          </div>

          <div className="items-list">
            {items[activeTab].length > 0 ? (
              items[activeTab].map((item, index) => (
                <div key={index} className="item-card">
                  <span>{item}</span>
                  <button 
                    className="remove-button"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <X className="remove-icon" />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No {activeTab} recorded</p>
                <button className="add-empty-button" onClick={() => setShowAddModal(true)}>
                  Add {activeTab.slice(0, -1)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Add New {activeTab.slice(0, -1)}</h3>
            <input
              type="text"
              placeholder={`Enter ${activeTab.slice(0, -1)} details`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="modal-input"
            />
            <div className="modal-buttons">
              <button 
                className="modal-cancel"
                onClick={() => {
                  setShowAddModal(false);
                  setNewItem('');
                }}
              >
                Cancel
              </button>
              <button 
                className="modal-add"
                onClick={handleAddItem}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;