import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState(60); // 60 saniye başlangıç
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(1);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [showTimerSettings, setShowTimerSettings] = useState(false);
  
  // Kullanıcı listesi state'i
  const [users, setUsers] = useState([]);
  
  // Yeni kullanıcı ekleme modal state'i
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  
  // Takım adı düzenleme state'i
  const [teamName, setTeamName] = useState('takım adı giriniz...');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [tempTeamName, setTempTeamName] = useState('');
  
  // Aktif kullanıcı state'i
  const [activeUser, setActiveUser] = useState(null);
  
  // Kullanılmış kullanıcılar geçmişi
  const [usedUsers, setUsedUsers] = useState([]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Süre bitince aktif kullanıcıyı kullanılmış listesine ekle
      if (activeUser) {
        setUsedUsers(prev => [...prev, activeUser.id]);
        setActiveUser(null);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, activeUser]);

  // Kullanılabilir kullanıcıları filtrele (daha önce seçilmemiş olanlar)
  const getAvailableUsers = () => {
    return users.filter(user => !usedUsers.includes(user.id));
  };

  // Rastgele kullanıcı seçme fonksiyonu
  const selectRandomUser = () => {
    const availableUsers = getAvailableUsers();
    if (availableUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const selectedUser = availableUsers[randomIndex];
      return selectedUser;
    }
    return null;
  };

  const startTimer = () => {
    if (users.length > 0) {
      const availableUsers = getAvailableUsers();
      if (availableUsers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const selectedUser = availableUsers[randomIndex];
        setActiveUser(selectedUser);
        setIsRunning(true);
      } else {
        alert('Tüm kullanıcılar konuştu! Yeni tur başlatmak için sıfırla butonuna tıklayın.');
      }
    } else {
      alert('Lütfen önce kullanıcı ekleyin!');
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    // Durdurulduğunda aktif kullanıcıyı kullanılmış listesine ekle
    if (activeUser) {
      setUsedUsers(prev => [...prev, activeUser.id]);
      setActiveUser(null);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60);
    setCustomMinutes(1);
    setCustomSeconds(0);
    setActiveUser(null);
    setUsedUsers([]); // Kullanılmış kullanıcıları temizle
  };

  const setCustomTime = () => {
    const totalSeconds = (customMinutes * 60) + parseInt(customSeconds);
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsRunning(false);
      setShowTimerSettings(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Yeni kullanıcı ekleme fonksiyonu
  const addNewUser = () => {
    if (newUserName.trim()) {
      const newUser = {
        id: users.length + 1,
        name: newUserName.trim(),
        avatar: '👤'
      };
      setUsers([...users, newUser]);
      setNewUserName('');
      setShowAddUserModal(false);
    }
  };

  // Kullanıcı silme fonksiyonu
  const removeUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Takım adı düzenleme fonksiyonları
  const startEditingTeamName = () => {
    setTempTeamName(teamName);
    setIsEditingTeamName(true);
  };

  const saveTeamName = () => {
    if (tempTeamName.trim()) {
      setTeamName(tempTeamName.trim());
    }
    setIsEditingTeamName(false);
  };

  const cancelEditingTeamName = () => {
    setTempTeamName(teamName);
    setIsEditingTeamName(false);
  };

  // Soldaki alana tıklama fonksiyonu
  const handleUserAreaClick = () => {
    if (isRunning && activeUser) {
      // Önce mevcut kullanıcıyı kullanılmış listesine ekle
      const updatedUsedUsers = [...usedUsers, activeUser.id];
      setUsedUsers(updatedUsedUsers);
      
      // Kullanılabilir kullanıcıları filtrele (güncel liste ile)
      const availableUsers = users.filter(user => !updatedUsedUsers.includes(user.id));
      
      if (availableUsers.length > 0) {
        // Yeni kullanıcı seç
        const randomIndex = Math.floor(Math.random() * availableUsers.length);
        const newUser = availableUsers[randomIndex];
        
        // Yeni kullanıcıyı aktif yap ve sayacı sıfırla
        setActiveUser(newUser);
        const totalSeconds = (customMinutes * 60) + parseInt(customSeconds);
        setTimeLeft(totalSeconds > 0 ? totalSeconds : 60);
      } else {
        // Tüm kullanıcılar konuştuysa
        setIsRunning(false);
        setActiveUser(null);
        alert('Tüm kullanıcılar konuştu! Yeni tur başlatmak için sıfırla butonuna tıklayın.');
      }
    }
  };

  return (
    <div className="App">
      {/* Header - Takım Adı ve Kalan Süre */}
      <header className="app-header">
        <div className="team-info">
          <div className="team-name-section">
            <span className="team-name-label">Takım Adı:</span>
            {isEditingTeamName ? (
              <div className="team-name-edit">
                <input
                  type="text"
                  value={tempTeamName}
                  onChange={(e) => setTempTeamName(e.target.value)}
                  className="team-name-input"
                  autoFocus
                  placeholder="Takım adını girin..."
                />
                <div className="team-name-edit-buttons">
                  <button 
                    className="team-name-btn save-btn"
                    onClick={saveTeamName}
                  >
                    ✅
                  </button>
                  <button 
                    className="team-name-btn cancel-btn"
                    onClick={cancelEditingTeamName}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <div className="team-name-display">
                <span className="team-name-text">{teamName}</span>
                <button 
                  className="team-name-edit-btn"
                  onClick={startEditingTeamName}
                  title="Takım adını düzenle"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
          <div className="timer-section">
            <span className="remaining-time">Kalan Süre:</span>
            <div className="timer-display">
              <div className="timer-main">
                <span className="timer-value">{formatTime(timeLeft)}</span>
                
                {/* Timer Settings */}
                <div className="timer-settings">
                  <button 
                    className="settings-btn"
                    onClick={() => setShowTimerSettings(!showTimerSettings)}
                  >
                    ⚙️ Ayarla
                  </button>
                  
                  {showTimerSettings && (
                    <div className="settings-panel">
                      <div className="time-inputs">
                        <div className="input-group">
                          <label>Dakika:</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                            className="time-input"
                          />
                        </div>
                        <div className="input-group">
                          <label>Saniye:</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={customSeconds}
                            onChange={(e) => setCustomSeconds(parseInt(e.target.value) || 0)}
                            className="time-input"
                          />
                        </div>
                      </div>
                      <button 
                        className="apply-btn"
                        onClick={setCustomTime}
                      >
                        Uygula
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="timer-controls">
                <button 
                  className="timer-btn start-btn" 
                  onClick={startTimer}
                  disabled={isRunning}
                >
                  {isRunning ? 'Çalışıyor' : 'Başlat'}
                </button>
                <button 
                  className="timer-btn stop-btn" 
                  onClick={stopTimer}
                  disabled={!isRunning}
                >
                  Durdur
                </button>
                <button 
                  className="timer-btn reset-btn" 
                  onClick={resetTimer}
                >
                  Sıfırla
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Ana İçerik Alanı */}
      <div className="main-content">
        {/* Sol Ana Alan - Kullanıcı Adı */}
        <div className="main-user-area" onClick={handleUserAreaClick}>
          <div className="user-name-display">
            {activeUser ? (
              <div className="active-user-info">
                <div className="active-user-avatar">{activeUser.avatar}</div>
                <div className="active-user-name">{activeUser.name}</div>
                <div className="active-user-status">🎤 Konuşma Sırası</div>
              </div>
            ) : (
              <div className="no-active-user">
                <div className="no-user-icon">🎤</div>
                <div className="no-user-text">Aktif Kullanıcı Yok</div>
                <div className="no-user-subtext">Başlat butonuna tıklayın</div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Yan Çubuk - Kullanıcı Listesi */}
        <div className="user-list-sidebar">
          <div className="add-user-section">
            <button 
              className="add-user-btn"
              onClick={() => setShowAddUserModal(true)}
            >
              + Kullanıcı Ekle
            </button>
          </div>
          <div className="user-list">
            {users.map(user => (
              <div 
                key={user.id} 
                className={`user-item ${usedUsers.includes(user.id) ? 'used-user' : ''} ${activeUser?.id === user.id ? 'active-user' : ''}`}
              >
                <span className="user-avatar">{user.avatar}</span>
                <span className="user-name">{user.name}</span>
                {usedUsers.includes(user.id) && (
                  <span className="user-status">✅</span>
                )}
                {activeUser?.id === user.id && (
                  <span className="user-status">🎤</span>
                )}
                <button 
                  className="remove-user-btn"
                  onClick={() => removeUser(user.id)}
                  title="Kullanıcıyı Sil"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yeni Kullanıcı Ekleme Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yeni Kullanıcı Ekle</h3>
            <div className="modal-input-group">
              <label>Kullanıcı Adı:</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Kullanıcı adını girin..."
                className="modal-input"
                autoFocus
              />
            </div>
            <div className="modal-buttons">
              <button 
                className="modal-btn cancel-btn"
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUserName('');
                }}
              >
                İptal
              </button>
              <button 
                className="modal-btn confirm-btn"
                onClick={addNewUser}
                disabled={!newUserName.trim()}
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
