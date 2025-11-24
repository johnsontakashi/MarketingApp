// Theme service for age-appropriate color schemes
class ThemeService {
  constructor() {
    this.isUnder18 = false;
    this.currentTheme = this.getAdultTheme();
  }

  // Adult theme (18+ users) - Golden TLB Diamond theme
  getAdultTheme() {
    return {
      name: 'adult',
      colors: {
        // Primary colors
        primary: '#D4AF37',        // Gold
        primaryDark: '#B8860B',    // Darker gold
        primaryLight: '#F5E6A3',   // Light gold
        
        // Background colors
        background: '#FFF8E7',     // Cream background
        surface: '#FFFFFF',        // White surface
        card: '#FFF8E7',          // Card background
        
        // Text colors
        text: '#2C1810',          // Dark brown text
        textSecondary: '#8B4513',  // Medium brown text
        textLight: '#A0522D',      // Light brown text
        
        // Action colors
        accent: '#D4AF37',         // Gold accent
        success: '#10B981',        // Green
        warning: '#F59E0B',        // Orange
        error: '#EF4444',          // Red
        
        // Border and divider colors
        border: '#E5E7EB',         // Light gray border
        divider: '#F3F4F6',        // Divider
        
        // Tab bar colors
        tabBarActive: '#D4AF37',    // Gold active
        tabBarInactive: '#8B4513',  // Brown inactive
        tabBarBackground: '#FFF8E7', // Cream background
        
        // Button colors
        buttonPrimary: '#D4AF37',   // Gold button
        buttonSecondary: '#FFFFFF', // White button
        buttonText: '#FFFFFF',      // White text
        buttonTextSecondary: '#D4AF37', // Gold text
      }
    };
  }

  // Under 18 theme - Light Beige + Brown theme
  getUnder18Theme() {
    return {
      name: 'under18',
      colors: {
        // Primary colors - Brown tones
        primary: '#8B4513',        // Saddle brown
        primaryDark: '#654321',    // Dark brown
        primaryLight: '#A0522D',   // Sienna brown
        
        // Background colors - Light beige tones
        background: '#F5F5DC',     // Beige
        surface: '#FFFEF7',        // Off-white beige
        card: '#FAF0E6',          // Linen beige
        
        // Text colors
        text: '#3E2723',          // Dark brown text
        textSecondary: '#5D4037',  // Medium brown text
        textLight: '#6D4C41',      // Light brown text
        
        // Action colors
        accent: '#8B4513',         // Brown accent
        success: '#689F38',        // Muted green
        warning: '#F57C00',        // Muted orange
        error: '#D32F2F',          // Muted red
        
        // Border and divider colors
        border: '#D7CCC8',         // Light brown border
        divider: '#EFEBE9',        // Light beige divider
        
        // Tab bar colors
        tabBarActive: '#8B4513',    // Brown active
        tabBarInactive: '#A1887F',  // Light brown inactive
        tabBarBackground: '#F5F5DC', // Beige background
        
        // Button colors
        buttonPrimary: '#8B4513',   // Brown button
        buttonSecondary: '#FFFEF7', // Off-white button
        buttonText: '#FFFFFF',      // White text
        buttonTextSecondary: '#8B4513', // Brown text
      }
    };
  }

  // Set user age and update theme accordingly
  setUserAge(age) {
    const wasUnder18 = this.isUnder18;
    this.isUnder18 = age < 18;
    
    if (wasUnder18 !== this.isUnder18) {
      this.updateTheme();
      console.log(`Theme updated for ${this.isUnder18 ? 'under 18' : '18+ adult'} user`);
    }
  }

  // Update current theme based on age
  updateTheme() {
    this.currentTheme = this.isUnder18 ? this.getUnder18Theme() : this.getAdultTheme();
  }

  // Get current theme
  getCurrentTheme() {
    return this.currentTheme;
  }

  // Get theme colors
  getColors() {
    return this.currentTheme.colors;
  }

  // Check if user is under 18
  isUserUnder18() {
    return this.isUnder18;
  }

  // Calculate age from birthday string (MM/DD/YYYY format)
  calculateAge(birthday) {
    if (!birthday) return null;
    
    try {
      const [month, day, year] = birthday.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return null;
    }
  }

  // Set theme from user data
  setThemeFromUserData(userData) {
    if (userData && userData.birthday) {
      const age = this.calculateAge(userData.birthday);
      if (age !== null) {
        this.setUserAge(age);
        console.log(`User age: ${age}, Theme: ${this.currentTheme.name}`);
      }
    }
  }

  // Get age-appropriate styling for components
  getComponentStyles() {
    const colors = this.getColors();
    
    return {
      // Tab navigator styles
      tabBar: {
        activeTintColor: colors.tabBarActive,
        inactiveTintColor: colors.tabBarInactive,
        style: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.primary,
          borderTopWidth: 1,
        },
      },
      
      // Header styles
      header: {
        style: {
          backgroundColor: colors.background,
        },
        tintColor: colors.text,
        titleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
      },
      
      // Button styles
      button: {
        primary: {
          backgroundColor: colors.buttonPrimary,
          color: colors.buttonText,
        },
        secondary: {
          backgroundColor: colors.buttonSecondary,
          color: colors.buttonTextSecondary,
          borderColor: colors.primary,
          borderWidth: 2,
        },
      },
      
      // Modal styles
      modal: {
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
        container: {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
        },
        header: {
          backgroundColor: colors.background,
          borderBottomColor: colors.primaryLight,
        },
        content: {
          backgroundColor: colors.surface,
        },
      },
    };
  }
}

// Export singleton instance
const themeService = new ThemeService();
export default themeService;