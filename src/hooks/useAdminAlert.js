import { useState, useRef } from 'react';

export function useAdminAlert() {
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    buttons: [],
    icon: null
  });
  
  const timeoutRef = useRef(null);

  const showAlert = (config) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setAlertConfig({
      visible: true,
      type: config.type || 'info',
      title: config.title,
      message: config.message,
      buttons: config.buttons || [],
      icon: config.icon || null
    });

    // Auto-hide after specified duration (default 4 seconds) if no buttons
    const autoHideDelay = config.autoHideDelay || 4000;
    if (autoHideDelay > 0 && (!config.buttons || config.buttons.length === 0)) {
      timeoutRef.current = setTimeout(() => {
        hideAlert();
      }, autoHideDelay);
    }
  };

  const hideAlert = () => {
    // Clear timeout when manually hiding
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAlertConfig(prev => ({ ...prev, visible: false }));
  };

  // Convenience methods for common alert types
  const showSuccess = (title, message, onPress, autoHide = false) => {
    showAlert({
      type: 'success',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : [],
      autoHideDelay: autoHide ? 4000 : 0
    });
  };

  const showError = (title, message, onPress, autoHide = false) => {
    showAlert({
      type: 'error',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : [],
      autoHideDelay: autoHide ? 4000 : 0
    });
  };

  const showWarning = (title, message, onPress, autoHide = false) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: onPress ? [{ text: 'OK', onPress }] : [],
      autoHideDelay: autoHide ? 4000 : 0
    });
  };

  // Auto-hiding notification methods (no buttons, auto-disappear)
  const showSuccessNotification = (title, message, duration = 3000) => {
    showAlert({
      type: 'success',
      title,
      message,
      buttons: [],
      autoHideDelay: duration
    });
  };

  const showWarningNotification = (title, message, duration = 3000) => {
    showAlert({
      type: 'warning',
      title,
      message,
      buttons: [],
      autoHideDelay: duration
    });
  };

  const showInfoNotification = (title, message, duration = 3000) => {
    showAlert({
      type: 'info',
      title,
      message,
      buttons: [],
      autoHideDelay: duration
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
    showDestructiveConfirm,
    showSuccessNotification,
    showWarningNotification,
    showInfoNotification
  };
}