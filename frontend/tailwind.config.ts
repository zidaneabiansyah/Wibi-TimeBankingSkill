import type { Config } from 'tailwindcss';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ============================================================================
         SPACING - 4px base unit system
         ============================================================================ */
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },

      /* ============================================================================
         TYPOGRAPHY - Font families and sizes
         ============================================================================ */
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        /* Display: Hero titles */
        'display': ['3.5rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em' }],
        
        /* Heading: Section titles */
        'heading': ['2.25rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        
        /* Subheading: Card/component titles */
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        
        /* Body Large: Intro/emphasis text */
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        
        /* Body: Main content (default) */
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        
        /* Body Small: Secondary text */
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        
        /* Caption: Helper text, timestamps */
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },

      /* ============================================================================
         BORDER RADIUS - Consistent radius tokens
         ============================================================================ */
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },

      /* ============================================================================
         COLORS - Wibi brand colors
         ============================================================================ */
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary) / 0.1)',
          dark: 'hsl(var(--primary) / 0.9)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          light: 'hsl(var(--secondary) / 0.1)',
          dark: 'hsl(var(--secondary) / 0.9)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        border: 'hsl(var(--border))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      /* ============================================================================
         SHADOWS - Depth system
         ============================================================================ */
      boxShadow: {
        subtle: '0 1px 2px rgba(0, 0, 0, 0.1)',
        sm: '0 4px 6px rgba(0, 0, 0, 0.1)',
        md: '0 10px 15px rgba(0, 0, 0, 0.15)',
        lg: '0 20px 25px rgba(0, 0, 0, 0.2)',
        xl: '0 25px 50px rgba(0, 0, 0, 0.3)',
        'glow-primary': '0 0 20px rgba(255, 140, 66, 0.3)',
        'glow-secondary': '0 0 20px rgba(255, 184, 77, 0.3)',
      },

      /* ============================================================================
         TRANSITIONS & ANIMATIONS
         ============================================================================ */
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '300ms',
        slower: '500ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-smooth': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 300ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-out',
        'pulse-slow': 'pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'bounce-soft': 'bounce-soft 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },

      /* ============================================================================
         UTILITIES
         ============================================================================ */
      backdropBlur: {
        xs: '2px',
        sm: '4px',
      },

      /* ============================================================================
         GRADIENTS - For CTA buttons and highlights
         ============================================================================ */
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
        'gradient-accent': 'linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--primary)) 100%)',
      },

      /* ============================================================================
         SCALE UTILITIES - For hover effects
         ============================================================================ */
      scale: {
        98: '0.98',
        102: '1.02',
      },

      /* ============================================================================
         MAX WIDTH - Container sizing
         ============================================================================ */
      maxWidth: {
        container: '1280px',
        'container-sm': '640px',
        'container-md': '896px',
        'container-lg': '1024px',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
