// Theme service for age-appropriate color schemes
class ThemeService {
  constructor() {
    this.isUnder18 = false;
    this.currentTheme = this.getAdultTheme();
  }

  // Adult theme (18+ users) - Light Mint TLB Diamond theme
  getAdultTheme() {
    return {
      name: 'adult',
      colors: {
        // Primary colors - Light Mint palette
        primary: '#98E4D6',        // Light mint
        primaryDark: '#5CBAA6',    // Darker mint
        primaryLight: '#B8F2E6',   // Lighter mint
        
        // Background colors - Mint-inspired neutrals
        background: '#F0FDFA',     // Very light mint background
        surface: '#FFFFFF',        // Pure white surface
        card: '#F0FDFA',          // Light mint card background
        
        // Text colors - Mint-complementary darks
        text: '#134E48',          // Dark mint-green text
        textSecondary: '#2D766E',  // Medium mint-green text
        textLight: '#4B9A90',      // Light mint-green text
        
        // Action colors
        accent: '#98E4D6',         // Light mint accent
        success: '#06D6A0',        // Bright mint green
        warning: '#F9C23C',        // Mint-friendly yellow
        error: '#EF476F',          // Mint-complementary coral
        
        // Border and divider colors
        border: '#C7F2E9',         // Light mint border
        divider: '#E6F9F4',        // Very light mint divider
        
        // Tab bar colors
        tabBarActive: '#98E4D6',    // Light mint active
        tabBarInactive: '#2D766E',  // Dark mint inactive
        tabBarBackground: '#F0FDFA', // Light mint background
        
        // Button colors
        buttonPrimary: '#98E4D6',   // Light mint button
        buttonSecondary: '#FFFFFF', // White button
        buttonText: '#134E48',      // Dark mint text
        buttonTextSecondary: '#98E4D6', // Light mint text
      }
    };
  }

  // Under 18 theme - Soft Mint theme for youth
  getUnder18Theme() {
    return {
      name: 'under18',
      colors: {
        // Primary colors - Softer, more pastel mint tones
        primary: '#87D7C6',        // Soft mint
        primaryDark: '#4A9B8E',    // Darker soft mint
        primaryLight: '#ADE2D5',   // Lighter soft mint
        
        // Background colors - Gentle mint backgrounds
        background: '#F7FCFB',     // Very soft mint background
        surface: '#FFFFFF',        // Pure white surface
        card: '#F0F9F7',          // Gentle mint card background
        
        // Text colors - Gentle mint-complementary colors
        text: '#1E5A52',          // Dark mint text (softer than adult)
        textSecondary: '#3E7B71',  // Medium mint text
        textLight: '#5B9C91',      // Light mint text
        
        // Action colors - Youth-friendly variations
        accent: '#87D7C6',         // Soft mint accent
        success: '#52D1A0',        // Gentle mint green
        warning: '#FFC857',        // Soft mint-friendly yellow
        error: '#FF8A80',          // Gentle coral (softer than adult)
        
        // Border and divider colors
        border: '#B8E6DD',         // Soft mint border
        divider: '#E0F2F0',        // Very light mint divider
        
        // Tab bar colors
        tabBarActive: '#87D7C6',    // Soft mint active
        tabBarInactive: '#3E7B71',  // Medium mint inactive
        tabBarBackground: '#F7FCFB', // Soft mint background
        
        // Button colors
        buttonPrimary: '#87D7C6',   // Soft mint button
        buttonSecondary: '#FFFFFF', // White button
        buttonText: '#1E5A52',      // Dark mint text
        buttonTextSecondary: '#87D7C6', // Soft mint text
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