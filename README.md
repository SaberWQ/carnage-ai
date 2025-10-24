# 🚀 Carnage AI - Lightweight Neural Networks Platform

**Carnage AI** is a modern SaaS platform for creating, training, and deploying lightweight neural networks optimized for mobile devices. Built with Next.js, TypeScript, and Supabase.

## 🎯 Features

- **Custom Neural Networks**: Build networks with customizable architectures
- **Real-time Training**: Monitor training progress with live updates
- **Mobile-First**: Optimized for edge AI and mobile deployment
- **Modern Stack**: Built with Next.js 15, React 19, and TypeScript
- **Secure Authentication**: Powered by Supabase Auth
- **Model Management**: Save, load, and manage multiple models
- **API Routes**: Server-side API endpoints for training and inference

## 🏗️ Architecture

\`\`\`
carnage-ai/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Main dashboard
│   ├── models/         # Model management
│   ├── train/          # Training interface
│   └── api/            # API routes
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   └── ...            # Custom components
├── lib/               # Utilities and helpers
│   ├── supabase/      # Supabase client
│   └── ai/            # Neural network engine
└── public/            # Static assets
\`\`\`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (or use provided integration)

### Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/carnage-ai.git
cd carnage-ai

# Install dependencies
npm install

# Environment variables are pre-configured via Vercel integration
# No .env file needed!

# Run development server
npm run dev

# Access the application
# http://localhost:3000
\`\`\`

### Database Setup

The project uses Supabase for database and authentication. Run the SQL scripts to set up your database:

\`\`\`bash
# Scripts are located in /scripts folder
# Execute them in order through the v0 interface or Supabase dashboard
\`\`\`

## 📚 API Documentation

### Authentication

Authentication is handled by Supabase Auth with email/password by default.

**Sign Up**
\`\`\`typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepass123'
})
\`\`\`

**Sign In**
\`\`\`typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepass123'
})
\`\`\`

### Training API

**Train Model**
\`\`\`bash
POST /api/models/train
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "XOR Network",
  "layers": [2, 10, 2],
  "activation": "relu",
  "learning_rate": 0.01,
  "epochs": 1000,
  "training_data": {
    "X": [[0,0], [0,1], [1,0], [1,1]],
    "y": [[1,0], [0,1], [0,1], [1,0]]
  }
}
\`\`\`

**Get Models**
\`\`\`bash
GET /api/models
Authorization: Bearer <token>
\`\`\`

**Predict**
\`\`\`bash
POST /api/models/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "model_id": "uuid",
  "input": [[0, 0], [1, 1]]
}
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests
npm run test:e2e
\`\`\`

## 🔧 Configuration

### Environment Variables

This project uses Vercel integrations for Supabase and Neon. Environment variables are automatically configured:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEON_DATABASE_URL` - PostgreSQL connection string

Additional variables can be added in the Vars section of the v0 sidebar.

## 📦 Deployment

### Deploy to Vercel

The easiest way to deploy is using the Vercel platform:

\`\`\`bash
# Using v0
Click "Publish" button in the top right

# Or using Vercel CLI
npm install -g vercel
vercel
\`\`\`

### Production Build

\`\`\`bash
# Build for production
npm run build

# Start production server
npm start
\`\`\`

## 🛠️ Technology Stack

**Frontend & Backend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components

**Database & Auth:**
- Supabase (PostgreSQL + Auth)
- Neon (Alternative PostgreSQL)

**State Management:**
- React Server Components
- SWR for client-side data fetching

**AI/ML:**
- Custom TypeScript neural network implementation
- Browser-based training
- Optimized for edge deployment

## 📈 Roadmap

- [x] Core neural network engine
- [x] Next.js API routes
- [x] Web dashboard
- [x] Supabase integration
- [ ] React Native mobile app
- [ ] Bluetooth P2P model sharing
- [ ] ONNX export
- [ ] TensorFlow.js integration
- [ ] WebGPU acceleration
- [ ] Model marketplace

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and Supabase
- UI components from shadcn/ui
- Inspired by edge AI and mobile ML
- Optimized for modern web standards

## 📞 Support

- Issues: [GitHub Issues](https://github.com/yourusername/carnage-ai/issues)
- Discussions: [GitHub Discussions](https://github.com/yourusername/carnage-ai/discussions)
- Email: support@carnage-ai.com

---

**Made with ❤️ by the Carnage AI Team**
