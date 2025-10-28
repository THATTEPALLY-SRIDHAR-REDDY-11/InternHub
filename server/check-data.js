import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection:', MONGODB_URI);
    
    const db = mongoose.connection.db;
    
    // List all databases first
    const admin = db.admin();
    const dbs = await admin.listDatabases();
    console.log('\n🗄️  All databases on this MongoDB instance:');
    dbs.databases.forEach(database => {
      console.log(`  - ${database.name} (${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // List all collections in current database
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Collections in "${mongoose.connection.db.databaseName}" database:`);
    if (collections.length === 0) {
      console.log('  (No collections yet)');
    } else {
      collections.forEach(col => console.log(`  - ${col.name}`));
    }
    
    // Check each collection for data
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`\n📊 ${col.name}: ${count} documents`);
      
      if (count > 0) {
        const sample = await db.collection(col.name).findOne();
        console.log(`   Sample document:`, JSON.stringify(sample, null, 2));
      }
    }
    
    // If no collections exist, show what will be created
    if (collections.length === 0) {
      console.log('\n📝 No collections yet. Collections will be created when you:');
      console.log('  - Save a resume → creates "resumes" collection');
      console.log('  - Create a profile → creates "profiles" collection');
      console.log('  - Post an internship → creates "internships" collection');
      console.log('  - Create a project → creates "projects" collection');
      console.log('  - Add a review → creates "reviews" collection');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkData();