// Theme service for age-appropriate color schemes
class ThemeService {
  constructor() {
    this.isUnder18 = false;
    this.currentTheme = this.getAdultTheme();
  }

  // Adult theme (18+ users) - Teal TLB Diamond theme
  getAdultTheme() {
    return {
      name: 'adult',
      colors: {
        // Primary colors - RGB(5, 165, 181) = #05A5B5 Teal palette
        primary: '#05A5B5',        // Main teal color
        primaryDark: '#037A86',    // Darker teal
        primaryLight: '#4BC4D1',   // Lighter teal
        
        // Background colors - Teal-inspired neutrals
        background: '#F0FCFD',     // Very light teal background
        surface: '#FFFFFF',        // Pure white surface
        card: '#F0FCFD',          // Light teal card background
        
        // Text colors - Teal-complementary darks
        text: '#0A4B52',          // Dark teal-blue text
        textSecondary: '#1F6B75',  // Medium teal-blue text
        textLight: '#358B96',      // Light teal-blue text
        
        // Action colors
        accent: '#05A5B5',         // Teal accent
        success: '#00B894',        // Bright teal green
        warning: '#FDCB6E',        // Teal-friendly yellow
        error: '#E17055',          // Teal-complementary coral
        
        // Border and divider colors
        border: '#B8E6EA',         // Light teal border
        divider: '#E1F5F7',        // Very light teal divider
        
        // Tab bar colors
        tabBarActive: '#05A5B5',    // Teal active
        tabBarInactive: '#1F6B75',  // Dark teal inactive
        tabBarBackground: '#F0FCFD', // Light teal background
        
        // Button colors
        buttonPrimary: '#05A5B5',   // Teal button
        buttonSecondary: '#FFFFFF', // White button
        buttonText: '#FFFFFF',      // White text on teal
        buttonTextSecondary: '#05A5B5', // Teal text
      }
    };
  }

  // Under 18 theme - Soft Teal theme for youth
  getUnder18Theme() {
    return {
      name: 'under18',
      colors: {
        // Primary colors - Softer, more pastel teal tones
        primary: '#42C4D6',        // Soft teal (lighter variation of main teal)
        primaryDark: '#2A9FB0',    // Darker soft teal
        primaryLight: '#7DD3E0',   // Lighter soft teal
        
        // Background colors - Gentle teal backgrounds
        background: '#F7FDFE',     // Very soft teal background
        surface: '#FFFFFF',        // Pure white surface
        card: '#F0FBFC',          // Gentle teal card background
        
        // Text colors - Gentle teal-complementary colors
        text: '#0D5157',          // Dark teal text (softer than adult)
        textSecondary: '#257A85',  // Medium teal text
        textLight: '#4A9FA8',      // Light teal text
        
        // Action colors - Youth-friendly variations
        accent: '#42C4D6',         // Soft teal accent
        success: '#26D0CE',        // Gentle teal green
        warning: '#FFD93D',        // Soft teal-friendly yellow
        error: '#FF7675',          // Gentle coral (softer than adult)
        
        // Border and divider colors
        border: '#A8E0E5',         // Soft teal border
        divider: '#DCF2F4',        // Very light teal divider
        
        // Tab bar colors
        tabBarActive: '#42C4D6',    // Soft teal active
        tabBarInactive: '#257A85',  // Medium teal inactive
        tabBarBackground: '#F7FDFE', // Soft teal background
        
        // Button colors
        buttonPrimary: '#42C4D6',   // Soft teal button
        buttonSecondary: '#FFFFFF', // White button
        buttonText: '#FFFFFF',      // White text on teal
        buttonTextSecondary: '#42C4D6', // Soft teal text
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