# Carnage AI - Setup Instructions

## Prerequisites

- Node.js 20.9.0 or higher
- npm or yarn
- Supabase account

## Installation

1. **Install dependencies:**
   \`\`\`bash
   npm install vaul@latest
   npm install
   \`\`\`

2. **Set up Supabase:**
   - The Supabase integration is already connected
   - Run the database migration scripts in order:
     \`\`\`bash
     # These scripts will create the necessary tables
     # Run them from the v0 interface or Supabase dashboard
     scripts/001_create_models_table.sql
     scripts/002_create_training_sessions_table.sql
     scripts/003_create_profiles_table.sql
     \`\`\`

3. **Build the project:**
   \`\`\`bash
   npm run build
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   Navigate to http://localhost:3000

## Features Implemented

### Authentication
- Email/password sign up and login
- Protected routes with middleware
- Automatic profile creation on signup

### Dashboard
- View all your neural network models
- Quick actions for creating, training, and exporting models
- Recent models overview

### Model Builder
- Visual neural network builder
- Support for multiple layer types:
  - Dense (fully connected)
  - Conv2D (convolutional)
  - MaxPooling
  - Dropout
  - Flatten
- Real-time architecture preview
- Layer configuration with custom parameters

### Database Schema
- **models**: Store neural network architectures
- **training_sessions**: Track model training progress
- **profiles**: User profile information
- Row Level Security (RLS) enabled on all tables

## Next Steps

1. **Add Training Functionality:**
   - Implement training API endpoints
   - Add dataset upload
   - Real-time training metrics

2. **Add Export Functionality:**
   - ONNX export
   - TFLite export
   - CoreML export

3. **Add Mobile App:**
   - React Native mobile app
   - Bluetooth offline sync
   - On-device training

4. **Add Analytics:**
   - Model performance tracking
   - Usage statistics
   - Training history

## Project Structure

\`\`\`
carnage-ai/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and model management
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── lib/
│   └── supabase/         # Supabase client configuration
├── scripts/              # Database migration scripts
└── middleware.ts         # Authentication middleware
\`\`\`

## Environment Variables

The following environment variables are automatically configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (for development)

## Troubleshooting

If you encounter issues:

1. **Database tables not created:**
   - Run the SQL scripts in the correct order
   - Check Supabase dashboard for errors

2. **Authentication not working:**
   - Verify environment variables are set
   - Check middleware configuration

3. **Build errors:**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
