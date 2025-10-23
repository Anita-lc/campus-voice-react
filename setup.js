const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Campus Voice Setup Script');
console.log('============================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/campus_voice?schema=public"

# JWT Secret
JWT_SECRET="campus_voice_jwt_secret_key_2025"

# Server Port
PORT=3001

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USERNAME="your_email@gmail.com"
SMTP_PASSWORD="your_email_password"
SMTP_FROM_EMAIL="noreply@campusvoice.edu"
SMTP_FROM_NAME="Campus Voice"

# Social Media API Configuration (Optional)
TWITTER_API_KEY="your_twitter_api_key"
TWITTER_API_SECRET="your_twitter_api_secret"
TWITTER_BEARER_TOKEN="your_twitter_bearer_token"

INSTAGRAM_ACCESS_TOKEN="your_instagram_access_token"
INSTAGRAM_CLIENT_ID="your_instagram_client_id"

TIKTOK_API_KEY="your_tiktok_api_key"

# AI/NLP Configuration (Optional)
AI_API_ENDPOINT="http://localhost:5000/api/check-duplicate"
AI_API_KEY="your_ai_api_key"
SIMILARITY_THRESHOLD=0.75

# Campus Hashtags to Monitor
CAMPUS_HASHTAGS="#Strathmore,#StrathmoreUniversity,#CampusVoice,#StudentFeedback"`;

  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created successfully!\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Create uploads directory
if (!fs.existsSync('uploads')) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync('uploads', { recursive: true });
  console.log('✅ uploads directory created\n');
} else {
  console.log('✅ uploads directory already exists\n');
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.error('❌ Error generating Prisma client:', error.message);
  process.exit(1);
}

// Push database schema
console.log('🗄️  Pushing database schema...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully\n');
} catch (error) {
  console.error('❌ Error pushing database schema:', error.message);
  console.log('💡 Make sure PostgreSQL is running and the DATABASE_URL is correct\n');
  process.exit(1);
}

// Seed database
console.log('🌱 Seeding database...');
try {
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully\n');
} catch (error) {
  console.error('❌ Error seeding database:', error.message);
  process.exit(1);
}

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure PostgreSQL is running on your system');
console.log('2. Update the DATABASE_URL in .env if needed');
console.log('3. Run "npm run dev" to start both frontend and backend');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n🔑 Default login credentials:');
console.log('Admin: admin@campusvoice.edu / admin123');
console.log('Student: student@campusvoice.edu / student123');
console.log('\n📚 For more information, check the README.md file');
