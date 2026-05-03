import mongoose from 'mongoose';
import readline from 'readline';
import { UserRole } from '../constants/roles.constants.js';
import { User } from '../database/models/User.model.js';

// Create readline interface for terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const seedAdmin = async () => {
  try {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🛠️  Admin User Creation Tool');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Get admin credentials from terminal
    const email = await question('📧 Enter admin email: ');
    const name = await question('👤 Enter admin name: ');
    
    // Password input (hidden)
    console.log('🔑 Enter admin password: ');
    const password = await new Promise<string>((resolve) => {
      const stdin = process.stdin;
      const stdout = process.stdout;
      
      stdin.setRawMode(true);
      stdin.resume();
      stdout.write('   '); // Indent for better UX
      
      let password = '';
      const onData = (char: Buffer) => {
        const key = char.toString();
        
        if (key === '\n' || key === '\r') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          stdout.write('\n');
          resolve(password);
        } else if (key === '\u0003') { // Ctrl+C
          process.exit();
        } else {
          password += key;
          stdout.write('*');
        }
      };
      
      stdin.on('data', onData);
    });
    
    const confirmPassword = await new Promise<string>((resolve) => {
      const stdin = process.stdin;
      const stdout = process.stdout;
      
      stdin.setRawMode(true);
      stdin.resume();
      stdout.write('🔑 Confirm admin password: ');
      
      let password = '';
      const onData = (char: Buffer) => {
        const key = char.toString();
        
        if (key === '\n' || key === '\r') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          stdout.write('\n');
          resolve(password);
        } else if (key === '\u0003') { // Ctrl+C
          process.exit();
        } else {
          password += key;
          stdout.write('*');
        }
      };
      
      stdin.on('data', onData);
    });

    // Validate inputs
    if (!email || !name || !password) {
      console.log('\n❌ All fields are required!');
      rl.close();
      process.exit(1);
    }

    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      rl.close();
      process.exit(1);
    }

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
    await mongoose.connect(mongoUri);
    console.log('\n✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log(`\n⚠️ User with email ${email} already exists!`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Name: ${existingAdmin.name}`);
      rl.close();
      process.exit(0);
    }

    // Create admin user - Bypass validation only for seed script
    const admin = new User({
      name,
      email,
      password,
      role: UserRole.ADMIN,
      isActive: true,
    });

    await admin.save({ validateBeforeSave: false });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Name: ${admin.name}`);
    console.log(`👥 Role: ${admin.role}`);
    console.log(`🆔 User ID: ${admin._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('\n❌ Error seeding admin:', error);
  } finally {
    rl.close();
    process.exit(0);
  }
};

seedAdmin();