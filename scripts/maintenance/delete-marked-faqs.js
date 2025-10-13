#!/usr/bin/env node

/**
 * Delete Marked FAQs
 * 
 * Lee faqs-review.json y elimina las FAQs marcadas con DELETE: true
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function deleteMarkedFAQs() {
  console.log('🗑️  Delete Marked FAQs\n');
  
  // Read review file
  const reviewPath = path.join(rootDir, 'faqs-review.json');
  
  if (!fs.existsSync(reviewPath)) {
    console.error('❌ File not found: faqs-review.json');
    console.log('Run: npm run review:faqs first');
    process.exit(1);
  }
  
  const reviewData = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));
  
  // Find FAQs marked for deletion
  const toDelete = reviewData.faqs.filter(faq => faq.DELETE === true);
  
  if (toDelete.length === 0) {
    console.log('✅ No FAQs marked for deletion');
    process.exit(0);
  }
  
  console.log(`⚠️  Found ${toDelete.length} FAQs marked for deletion:\n`);
  
  // Show what will be deleted
  toDelete.forEach((faq, idx) => {
    console.log(`${idx + 1}. [${faq.id}] ${faq.question}`);
    console.log(`   Reason: ${faq.reason || 'No reason provided'}`);
    console.log('');
  });
  
  // Confirm deletion
  console.log('⚠️  WARNING: This action cannot be undone!');
  console.log('Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log('🗑️  Deleting FAQs...\n');
  
  let deleted = 0;
  let errors = 0;
  
  for (const faq of toDelete) {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', faq.id);
    
    if (error) {
      console.error(`❌ Error deleting ${faq.id}:`, error.message);
      errors++;
    } else {
      console.log(`✅ Deleted: ${faq.question.substring(0, 60)}...`);
      deleted++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Deletion completed!`);
  console.log(`   Deleted: ${deleted}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${toDelete.length}\n`);
  
  // Archive review file
  const archivePath = path.join(rootDir, `faqs-review-${Date.now()}.json`);
  fs.renameSync(reviewPath, archivePath);
  console.log(`📦 Review file archived to: ${path.basename(archivePath)}\n`);
}

deleteMarkedFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
