import { createContext, useContext, useState, useEffect } from 'react';
import {
  generateCoupleCode,
  createCoupleRoom,
  joinCoupleRoom,
  getCoupleData,
  subscribeToCoupleData,
  saveGameResult,
  updateSettings,
  updateScores,
} from '../firebase';

const CoupleContext = createContext(null);

export const useCouple = () => {
  const context = useContext(CoupleContext);
  if (!context) {
    throw new Error('useCouple must be used within a CoupleProvider');
  }
  return context;
};

export const CoupleProvider = ({ children }) => {
  const [coupleCode, setCoupleCode] = useState(null);
  const [partnerId, setPartnerId] = useState(null);
  const [coupleData, setCoupleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load saved session from localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('coupleCode');
    const savedPartnerId = localStorage.getItem('partnerId');

    if (savedCode && savedPartnerId) {
      setCoupleCode(savedCode);
      setPartnerId(savedPartnerId);
    } else {
      setLoading(false);
    }
  }, []);

  // Subscribe to couple data when we have a code
  useEffect(() => {
    if (!coupleCode) return;

    setLoading(true);
    const unsubscribe = subscribeToCoupleData(coupleCode, (data) => {
      setCoupleData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [coupleCode]);

  const createRoom = async (partnerName) => {
    try {
      setError(null);
      const code = generateCoupleCode();
      const { partnerId: pid } = await createCoupleRoom(code, partnerName);

      localStorage.setItem('coupleCode', code);
      localStorage.setItem('partnerId', pid);

      setCoupleCode(code);
      setPartnerId(pid);

      return code;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const joinRoom = async (code, partnerName) => {
    try {
      setError(null);
      const { partnerId: pid } = await joinCoupleRoom(code.toUpperCase(), partnerName);

      localStorage.setItem('coupleCode', code.toUpperCase());
      localStorage.setItem('partnerId', pid);

      setCoupleCode(code.toUpperCase());
      setPartnerId(pid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const saveGame = async (gameType, dateKey, result) => {
    if (!coupleCode || !partnerId) return;
    try {
      await saveGameResult(coupleCode, partnerId, gameType, dateKey, result);
    } catch (err) {
      console.error('Error saving game:', err);
    }
  };

  const saveSettings = async (settings) => {
    if (!coupleCode) return;
    try {
      await updateSettings(coupleCode, settings);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const incrementScore = async (winnerId) => {
    if (!coupleCode || !coupleData) return;
    try {
      const newScores = {
        ...coupleData.scores,
        [winnerId]: (coupleData.scores?.[winnerId] || 0) + 1,
      };
      await updateScores(coupleCode, newScores);
    } catch (err) {
      console.error('Error updating scores:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('coupleCode');
    localStorage.removeItem('partnerId');
    setCoupleCode(null);
    setPartnerId(null);
    setCoupleData(null);
  };

  const getMyName = () => {
    if (!coupleData || !partnerId) return 'Me';
    return coupleData[partnerId]?.name || 'Me';
  };

  const getPartnerName = () => {
    if (!coupleData || !partnerId) return 'Partner';
    const otherPartnerId = partnerId === 'partner1' ? 'partner2' : 'partner1';
    return coupleData[otherPartnerId]?.name || 'Partner';
  };

  const getOtherPartnerId = () => {
    return partnerId === 'partner1' ? 'partner2' : 'partner1';
  };

  const isConnected = () => {
    return coupleData?.partner1 && coupleData?.partner2;
  };

  const value = {
    coupleCode,
    partnerId,
    coupleData,
    loading,
    error,
    createRoom,
    joinRoom,
    saveGame,
    saveSettings,
    incrementScore,
    logout,
    getMyName,
    getPartnerName,
    getOtherPartnerId,
    isConnected,
  };

  return (
    <CoupleContext.Provider value={value}>
      {children}
    </CoupleContext.Provider>
  );
};
