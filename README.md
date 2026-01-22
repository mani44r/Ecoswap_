# 🌱 EcoSwap - AI-Powered Sustainable Shopping Platform

A modern, full-stack e-commerce platform that helps users make environmentally conscious purchasing decisions through AI-powered recommendations and gamification.

![EcoSwap Banner](https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=400&fit=crop)

## ✨ Features

### 🛍️ **Smart Shopping Experience**
- **Product Catalog** - Browse sustainable products with detailed environmental metrics
- **Advanced Search & Filtering** - Find products by category, sustainability score, and more
- **Shopping Cart** - Persistent cart with real-time calculations

### 🤖 **AI-Powered Recommendations**
- **Gemini AI Integration** - Google's advanced AI for product comparisons
- **Two-Step Algorithm** - Semantic similarity + sustainability ranking
- **Sustainable Alternatives** - AI suggests better eco-friendly options
- **Carbon Impact Analysis** - Real-time environmental impact calculations

### 🎮 **Gamification System**
- **Eco Credits** - Earn points for sustainable choices
- **Achievement System** - Unlock badges and milestones
- **Level Progression** - XP-based leveling with rewards
- **Profile Dashboard** - Track your sustainability journey

### 🔐 **User Management**
- **Firebase Authentication** - Secure login/signup with email verification
- **User Profiles** - Comprehensive profile management with preferences
- **Protected Routes** - Secure access to user-specific features

### 🎨 **Modern UI/UX**
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Theme** - Professional sustainability-focused design
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Smooth Animations** - Engaging user interactions

## 🚀 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### **Backend & Services**
- **Firebase Auth** - User authentication
- **Firestore** - NoSQL database
- **Google Gemini AI** - AI-powered recommendations
- **Server Actions** - Next.js server-side logic

### **State Management**
- **React Context** - Global state management
- **Custom Hooks** - Reusable stateful logic
- **localStorage** - Client-side persistence

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project
- Google Gemini API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mani44r/Ecoswap_.git
   cd Ecoswap_
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase and Gemini AI credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   # ... other Firebase config
   
   NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── products/          # Product catalog
│   └── profile/           # User profile
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── product/          # Product-specific components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── use-auth.tsx      # Authentication state
│   ├── use-cart.tsx      # Shopping cart state
│   └── use-profile.tsx   # User profile state
├── lib/                  # Utilities and services
│   ├── ai/              # AI recommendation engine
│   ├── firebase/        # Firebase configuration
│   ├── types/           # TypeScript definitions
│   └── utils.ts         # Helper functions
└── data/                # Mock data and constants
```

## 🔧 Key Features Implementation

### **AI Recommendation System**
```typescript
// Two-step algorithm for sustainable alternatives
1. Semantic Similarity (Top-5)
   - Category matching (+40 points)
   - Description keyword overlap (+35 points)
   - Name similarity (+15 points)
   - Semantic grouping (+10 points)

2. Sustainability Ranking (Top-2)
   - Carbon reduction vs original (60%)
   - Organic bonus (25%)
   - Category bonus (15%)
```

### **Gamification Mechanics**
```typescript
// Level calculation: level = floor(sqrt(xp / 100)) + 1
// Eco Credits awarded for:
- Sustainable product choices: 10-50 credits
- Achievement completion: 50-200 credits
- Level progression: level × 10 bonus credits
```

### **Sustainability Scoring**
```typescript
// 0-100 score based on:
- Carbon intensity impact (50%)
- Organic certification (25%)
- Category sustainability (15%)
- Additional eco factors (10%)
```

## 🎯 Usage Examples

### **Adding Products to Cart**
```typescript
// Triggers AI recommendation dialog
const handleAddToCart = (product: Product) => {
  // Shows sustainable alternatives
  // User can choose original or eco-friendly swap
  // Automatically calculates eco credits
}
```

### **Profile Management**
```typescript
// Track sustainability metrics
const profile = useProfile()
console.log(profile.ecoCredits)        // Total eco credits
console.log(profile.carbonSaved)       // kg CO₂ saved
console.log(profile.sustainabilityScore) // Overall score
```

## 🌍 Environmental Impact

EcoSwap helps users make sustainable choices by:

- **Carbon Footprint Tracking** - Monitor environmental impact
- **Sustainable Alternatives** - AI-powered eco-friendly suggestions
- **Education** - Learn about product sustainability
- **Gamification** - Rewards for green choices
- **Community** - Share sustainability achievements

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
npm run build
# Deploy to Vercel
```

### **Firebase Hosting**
```bash
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** - Advanced AI recommendations
- **Firebase** - Backend infrastructure
- **Radix UI** - Accessible component library
- **Tailwind CSS** - Utility-first styling
- **Next.js** - React framework

## 📞 Contact

**Ramineni Manikanta**
- GitHub: [@mani44r](https://github.com/mani44r)
- Email: ugs23123_aids.manikanta@cbit.org.in

---

**Building a greener future, one purchase at a time.** 🌱