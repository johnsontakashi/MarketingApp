import { useState } from 'react';

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: '',
    message: '',
    buttons: [],
    type: 'default',
    icon: null
  });

  const showAlert = (config) => {
    setAlertConfig({
      visible: true,
      ...config
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({
      ...prev,
      visible: false
    }));
  };

  // Convenience methods for different alert types
  const showSuccess = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'success' });
  };

  const showError = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'error' });
  };

  const showWarning = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'warning' });
  };

  const showInfo = (title, message, buttons = []) => {
    showAlert({ title, message, buttons, type: 'info' });
  };

  const showConfirm = (title, message, onConfirm, onCancel = null) => {
    showAlert({
      title,
      message,
      type: 'warning',
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'Confirm', style: 'default', onPress: onConfirm }
      ]
    });
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm
  };
};

export default useCustomAlert;