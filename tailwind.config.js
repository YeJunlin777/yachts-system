import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					1: 'hsl(var(--chart-1))',
					2: 'hsl(var(--chart-2))',
					3: 'hsl(var(--chart-3))',
					4: 'hsl(var(--chart-4))',
					5: 'hsl(var(--chart-5))'
				},
				// 游艇主题专属色
				yacht: {
					gold: 'hsl(var(--yacht-gold))',
					'gold-light': 'hsl(var(--yacht-gold-light))',
					navy: 'hsl(var(--yacht-navy))',
					ocean: 'hsl(var(--yacht-ocean))',
					foam: 'hsl(var(--yacht-foam))'
				}
			},
			animation: {
				'fade-up': 'fade-up 0.5s ease-out forwards',
				'fade-in': 'fade-in 0.3s ease-out forwards',
				'slide-in': 'slide-in 0.3s ease-out forwards',
				'breathe': 'breathe 4s ease-in-out infinite',
				'glow': 'glow-pulse 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			},
			keyframes: {
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'slide-in': {
					'0%': { opacity: '0', transform: 'translateX(-10px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'breathe': {
					'0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.02)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--yacht-gold) / 0.1)' },
					'50%': { boxShadow: '0 0 30px hsl(var(--yacht-gold) / 0.2)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
			}
		}
	},
	plugins: [animate]
}

export default config
