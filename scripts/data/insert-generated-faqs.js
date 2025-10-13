#!/usr/bin/env node

/**
 * Insert Generated FAQs into Database
 * 
 * Lee el archivo generated-faqs.json y los inserta en Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as embeddingsLocal from '../../src/services/embeddings.service.js';
import * as embeddingsCloud from '../../src/services/embeddings.service.cloud.js';
import config from '../../src/config/environment.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..');

dotenv.config({ path: path.join(rootDir, '.env') });

// Select embedding service
const embeddingsService = config.server.isProduction ? embeddingsCloud : embeddingsLocal;
const { generateEmbeddingsBatch } = embeddingsService;

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function insertGeneratedFAQs() {
  console.log('🚀 Inserting Generated FAQs\n');
  
  // Read generated FAQs
  const faqsPath = path.join(rootDir, 'generated-faqs.json');
  
  if (!fs.existsSync(faqsPath)) {
    console.error('❌ File not found: generated-faqs.json');
    console.log('Run: node scripts/scrape-unc-website.js first');
    process.exit(1);
  }
  
  const faqs = JSON.parse(fs.readFileSync(faqsPath, 'utf-8'));
  console.log(`📋 Found ${faqs.length} FAQs to insert\n`);
  
  // Generate embeddings for all questions
  console.log('🔢 Generating embeddings...');
  const questions = faqs.map(faq => faq.question);
  const embeddings = await generateEmbeddingsBatch(questions);
  console.log('✅ Embeddings generated\n');
  
  // Prepare FAQs for insertion
  const faqsToInsert = faqs.map((faq, idx) => ({
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    keywords: faq.keywords || [],
    metadata: faq.metadata || {},
    embedding: embeddings[idx],
    created_by: 'web-scraper',
    is_active: true,
  }));
  
  // Insert in batches of 10
  const batchSize = 10;
  let inserted = 0;
  let errors = 0;
  
  for (let i = 0; i < faqsToInsert.length; i += batchSize) {
    const batch = faqsToInsert.slice(i, i + batchSize);
    
    console.log(`📤 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(faqsToInsert.length / batchSize)}...`);
    
    const { data, error } = await supabase
      .from('faqs')
      .insert(batch)
      .select();
    
    if (error) {
      console.error(`❌ Error inserting batch:`, error.message);
      errors += batch.length;
    } else {
      inserted += data.length;
      console.log(`✅ Inserted ${data.length} FAQs`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Insertion completed!`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${faqsToInsert.length}\n`);
  
  // Archive the file
  const archivePath = path.join(rootDir, `generated-faqs-${Date.now()}.json`);
  fs.renameSync(faqsPath, archivePath);
  console.log(`📦 Original file archived to: ${path.basename(archivePath)}\n`);
}

insertGeneratedFAQs()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
