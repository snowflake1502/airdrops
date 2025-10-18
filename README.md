# 🪂 Solana Airdrop Farming Dashboard

A comprehensive dashboard for tracking and managing Solana DeFi positions to maximize airdrop opportunities. Built with Next.js 15, TypeScript, and Supabase.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Solana](https://img.shields.io/badge/Solana-Web3.js-purple)

---

## 🌟 Features

### ✅ **Currently Available (v1.0.0)**

- **🔐 User Authentication**: Secure login with Supabase Auth (email/password + social login)
- **👛 Wallet Integration**: Connect Phantom or Solflare wallets
- **💰 Live Position Tracking**: Real-time SOL balance and SPL token holdings
- **🎯 Protocol Detection**: Automatic detection of Jupiter (JUP) and Sanctum (LST) positions
- **📊 Airdrop Scoring**: Basic eligibility scoring based on your positions
- **📱 Responsive Design**: Beautiful UI that works on desktop and mobile

### 🚧 **Coming Soon (Phase 2+)**

- Monthly airdrop farming plan builder
- Protocol management and tracking
- Daily activity checklists
- Advanced analytics and charts
- Meteora LP position tracking
- Magic Eden NFT activity tracking
- USD value calculations
- Transaction history

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+ installed
- A Solana wallet (Phantom or Solflare)
- Supabase account (free tier works)
- Alchemy account for RPC access (free tier works)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd airdrop-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Solana RPC Configuration
   NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 🔧 Configuration

### **Getting Your API Keys**

#### **Supabase Setup**
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings → API
4. Copy your:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### **Alchemy RPC Setup** (Recommended)
1. Go to [alchemy.com](https://www.alchemy.com) and sign up
2. Create a new app (Solana Mainnet)
3. Copy your API key
4. Use: `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

#### **Alternative RPC Providers**
- **Helius**: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
- **QuickNode**: Get endpoint from dashboard
- **Public** (not recommended): `https://api.mainnet-beta.solana.com`

---

## 📖 Usage

### **1. Create an Account**
- Navigate to the login page
- Click "create a new account"
- Sign up with email or use Google/GitHub

### **2. Connect Your Wallet**
- Click "Select Wallet" in the top right
- Choose Phantom or Solflare
- Approve the connection in your wallet

### **3. View Your Positions**
- Click "Positions" in the sidebar
- See your SOL balance, tokens, and protocol positions
- View your airdrop eligibility score

### **4. Explore Other Pages**
- Dashboard: Overview of airdrop opportunities
- Plans: (Coming soon) Create farming strategies
- Protocols: (Coming soon) Manage tracked protocols
- Activities: (Coming soon) Daily task checklists
- Analytics: (Coming soon) Performance tracking

---

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Blockchain**: [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- **Wallet Adapter**: [@solana/wallet-adapter-react](https://github.com/solana-labs/wallet-adapter)

---

## 📁 Project Structure

```
airdrop-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── AirdropOverview.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── WalletButton.tsx
│   │   └── WalletProvider.tsx
│   └── lib/                   # Utility functions
│       ├── supabase.ts        # Supabase client
│       └── positionTracker.ts # Position tracking logic
├── public/                    # Static assets
├── .env.local                 # Environment variables (not in git)
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🎯 Supported Protocols

### **Currently Detected**
- ✅ **Jupiter**: JUP token holdings
- ✅ **Sanctum**: Liquid staking tokens (JitoSOL, mSOL, bSOL)

### **Coming Soon**
- 🚧 **Meteora**: DLMM liquidity positions
- 🚧 **Magic Eden**: NFT trading activity
- 🚧 **Drift**: Perpetual trading positions
- 🚧 **MarginFi**: Lending positions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Roadmap

### **Phase 2: Core Features** (Q4 2025)
- [ ] Airdrop plan builder
- [ ] Protocol CRUD operations
- [ ] Daily activity tracking
- [ ] Token metadata integration
- [ ] Meteora position detection

### **Phase 3: Advanced Features** (Q1 2026)
- [ ] USD value calculations
- [ ] Transaction history
- [ ] Advanced airdrop scoring
- [ ] Portfolio analytics
- [ ] Notification system

### **Phase 4: Production** (Q2 2026)
- [ ] Performance optimization
- [ ] Mobile app
- [ ] Multi-chain support
- [ ] Community features

---

## 🐛 Known Issues

- Token metadata (names/symbols) not yet fetched
- Meteora LP positions need program-specific queries
- RPC rate limiting with demo endpoints
- No USD value calculations yet

See [RELEASE_NOTES_v1.0.0.md](./RELEASE_NOTES_v1.0.0.md) for detailed information.

---

## 📄 License

[To be added]

---

## 🙏 Acknowledgments

- [Solana Foundation](https://solana.org/) for the amazing blockchain
- [Supabase](https://supabase.com/) for authentication and database
- [Vercel](https://vercel.com/) for Next.js
- The Solana DeFi community for inspiration

---

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [Your contact info]

---

**Built with ❤️ for the Solana airdrop farming community**

**Version**: 1.0.0 | **Last Updated**: October 18, 2025
