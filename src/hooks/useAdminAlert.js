import { useState } from 'react';

export function useAdminAlert() {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    icon: null
  });

  const showAlert = (config) => {
    setAlertConfig({
      visible: true,
      type: config.type || 'info',
      title: config.title,
      message: config.message,
      buttons: config.buttons || [],
      icon: config.icon || null
    });
  };

  const hideAlert = () => {
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  // Convenience methods for common alert types
  const showSuccess = (title, message, onPress) => {
    showAlert({
      type: 'success',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : []
    });
  };

  const showError = (title, message, onPress) => {
    showAlert({
      type: 'error',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : []
    });
  };

  const showWarning = (title, message, onPress) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : []
    });
  };

  const showConfirm = (title, message, onConfirm, onCancel) => {
    showAlert({
      type: 'confirm',
      title,
      message,
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: 'Confirm', onPress: onConfirm }
      ]
    });
  };

  const showDestructiveConfirm = (title, message, onConfirm, onCancel, confirmText = 'Delete') => {
    showAlert({
      type: 'error',
      title,
      message,
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: onCancel },
        { text: confirmText, style: 'destructive', onPress: onConfirm }
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
    showConfirm,
    showDestructiveConfirm
  };
}