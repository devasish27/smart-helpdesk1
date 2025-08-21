import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '../models/Article.js';

dotenv.config();

(async ()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    await Article.deleteMany({});
    await Article.insertMany([
      { title: 'How to update payment method', body: 'Steps to update your card on file...', tags: ['billing','payments'], status: 'published' },
      { title: 'Troubleshooting 500 errors', body: 'Check logs, verify env vars, restart service...', tags: ['tech','errors'], status: 'published' },
      { title: 'Tracking your shipment', body: 'Use the tracking ID on the courier site...', tags: ['shipping','delivery'], status: 'published' },
    ]);
    console.log('Seeded KB ✅');
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
})();