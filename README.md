

# Agentic Wander 🧳

**AI-Powered Budget Travel Intelligence**

An intelligent travel planning application that helps users create optimal itineraries within their budget constraints using AI-powered cost predictions and smart recommendations.

## ✨ Features

- **🔐 Authentication** - Secure login/signup with demo access
- **📍 Geolocation** - Auto-detect current location with one click
- **🤖 AI Trip Planning** - Google Gemini-powered itinerary generation
- **💰 Smart Budget Analysis** - ML-based cost predictions vs actual budget
- **📊 Cost Breakdown** - Visual breakdown of expenses (Transport, Stay, Food, Activities)
- **⚡ Real-time Optimization** - Dynamic budget status indicators (OK, WARNING, CRITICAL)
- **🎯 Daily Itinerary** - Hour-by-hour travel plan with cost-saving tips
- **🌙 Dark Mode** - Premium glassmorphism UI with smooth animations
- **📱 Responsive Design** - Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

**Frontend:**
- **React 19.2.4** - UI framework with hooks and functional components
- **TypeScript 5.8** - Type-safe development
- **Tailwind CSS** - Utility-first styling with glassmorphism effects
- **Vite 6.2.0** - Lightning-fast build tool with HMR

**Libraries:**
- **Recharts 3.7.0** - Beautiful interactive charts
- **Lucide-React 0.563.0** - Icon library (60+ icons)
- **Google Generative AI** - Gemini API integration

**APIs:**
- **Google Gemini API** - AI-powered trip planning logic
- **OpenStreetMap Nominatim** - Reverse geocoding for locations
- **Browser Geolocation API** - User location detection

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd trave-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

4. **Start development server**
```bash
npm run dev
```

Open `http://localhost:3000/` in your browser.

## 📖 How to Use

### 1. Login/Signup
- Sign up with email and password (min 6 characters)
- Or click "Try Demo" for quick testing
- Demo: `demo@example.com` / `demo123`

### 2. Configure Trip
- **Origin**: Enter location or click location icon to auto-detect
- **Destination**: Where you want to travel
- **Duration**: Number of days
- **Budget**: Amount in INR (₹)

### 3. Generate Itinerary
- Click "Generate Itinerary"
- Watch premium loading animations while AI analyzes
- Results appear in 5-15 seconds

### 4. Review Results
- **Budget Status**: OK ✅ / WARNING ⚠️ / CRITICAL 🔴
- **Cost Analysis**: ML prediction vs your budget
- **Cost Breakdown**: Donut chart with expense categories
- **Daily Itinerary**: Hour-by-hour plan with tips

## 📁 Project Structure

```
trave ai/
├── components/
│   ├── LoadingScreen.tsx      # Premium animations
│   └── AuthPage.tsx           # Login/signup
├── services/
│   └── geminiService.ts       # Gemini API
├── App.tsx                    # Main dashboard
├── types.ts                   # TypeScript types
├── .env.local                 # API key
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🔑 Environment Variables

```env
VITE_GEMINI_API_KEY=<your-gemini-api-key>
```

[Get your API key](https://ai.google.dev/) from Google AI Studio.

## 🎨 UI Features

### Three-Column Dashboard
- **Left**: Trip configuration form
- **Middle**: Budget analysis & summary
- **Right**: Cost breakdown chart

### Loading Animations
- **Budget Column**: 3 spinning rings
- **Cost Column**: 4 bouncing bars
- Perfectly synchronized heights

## 🔒 Security

- Passwords hashed locally (demo)
- No backend required
- User data in browser localStorage only
- Gemini API key should be private

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🚧 Future Enhancements

- [ ] Backend database
- [ ] Real-time pricing
- [ ] PDF export
- [ ] Multi-language
- [ ] Social sharing
- [ ] Offline mode

## 🐛 Troubleshooting

### "API quota exceeded"
- Check [Google Cloud Console](https://console.cloud.google.com/)
- Upgrade plan or wait for reset
- Verify API key in `.env.local`

### Geolocation not working
- Enable location permissions
- Must use HTTPS or localhost
- Check browser console

### Styles not showing
- Hard refresh: `Ctrl+Shift+R`
- Restart server: `npm run dev`

## 📝 Build Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

MIT License - Open source and free to use.

---

**Built for Hackathon | Made with ❤️ | Happy Wandering! 🌍**

