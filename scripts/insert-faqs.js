#!/usr/bin/env node

/**
 * Complete FAQ Insertion and Embedding Script
 *
 * Features:
 * - Reads FAQs from critical-faq-fixes.sql file
 * - Parses SQL INSERT statements into JSON objects
 * - Inserts FAQs into Supabase database
 * - Generates embeddings using OpenAI API
 * - Updates records with embeddings
 * - Processes in batches for performance
 * - Comprehensive error handling and progress tracking
 *
 * Usage: npm run insert:faqs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

// Configuration
const BATCH_SIZE = 20; // Process 20 FAQs at a time for embeddings
const INSERT_BATCH_SIZE = 10; // Insert 10 FAQs at a time

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Parse FAQs from JSON file
 */
function parseJSONFile(filePath) {
  const jsonContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonContent);
}

/**
 * Insert FAQs into Supabase
 */
async function insertFAQs(faqs) {
  console.log(`\n📝 Inserting ${faqs.length} FAQs into database...`);

  let successCount = 0;
  let errorCount = 0;

  // Process in batches
  for (let i = 0; i < faqs.length; i += INSERT_BATCH_SIZE) {
    const batch = faqs.slice(i, i + INSERT_BATCH_SIZE);
    const batchNumber = Math.floor(i / INSERT_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(faqs.length / INSERT_BATCH_SIZE);

    console.log(`\n📦 Processing insert batch ${batchNumber}/${totalBatches} (${batch.length} FAQs)...`);

    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert(batch)
        .select('id, question');

      if (error) {
        console.error(`❌ Batch insert failed:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully inserted ${data.length} FAQs`);
        successCount += data.length;

        // Log inserted questions
        data.forEach(faq => {
          console.log(`   ✓ "${faq.question}"`);
        });
      }
    } catch (error) {
      console.error(`❌ Batch insert error:`, error.message);
      errorCount += batch.length;
    }

    // Small delay between batches
    if (i + INSERT_BATCH_SIZE < faqs.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n📊 Insert Results: ${successCount} success, ${errorCount} errors`);
  return successCount;
}

/**
 * Generate embeddings for FAQs
 */
async function generateEmbeddings(faqs) {
  console.log(`\n🧠 Generating embeddings for ${faqs.length} FAQs...`);

  let successCount = 0;
  let errorCount = 0;

  // Process in batches
  for (let i = 0; i < faqs.length; i += BATCH_SIZE) {
    const batch = faqs.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(faqs.length / BATCH_SIZE);

    console.log(`\n🧠 Processing embedding batch ${batchNumber}/${totalBatches} (${batch.length} FAQs)...`);

    try {
      // Prepare questions for embedding
      const questions = batch.map(faq => faq.question);

      // Generate embeddings
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: questions,
      });

      console.log(`✅ Generated ${response.data.length} embeddings`);

      // Update each FAQ with its embedding
      for (let j = 0; j < batch.length; j++) {
        const faq = batch[j];
        const embedding = response.data[j].embedding;

        const { error: updateError } = await supabase
          .from('faqs')
          .update({ embedding })
          .eq('question', faq.question);

        if (updateError) {
          console.error(`❌ Failed to update embedding for: "${faq.question}"`);
          console.error(`   Error: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`   ✓ Updated embedding for: "${faq.question}"`);
          successCount++;
        }
      }

    } catch (error) {
      console.error(`❌ Embedding batch failed:`, error.message);
      errorCount += batch.length;
    }

    // Delay between batches to respect rate limits
    if (i + BATCH_SIZE < faqs.length) {
      console.log(`⏳ Waiting 2 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n📊 Embedding Results: ${successCount} success, ${errorCount} errors`);
  return successCount;
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 COMPLETE FAQ INSERTION AND EMBEDDING SCRIPT');
  console.log('=' .repeat(60));

  try {
    // Validate environment
    console.log('🔍 Validating environment...');
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }
    console.log('✅ Environment validated');

    // Read and parse JSON file
    console.log('\n📖 Reading FAQ data from JSON file...');
    const jsonFilePath = path.join(rootDir, 'critical-faqs.json');
    const faqs = parseJSONFile(jsonFilePath);

    if (faqs.length === 0) {
      throw new Error('No FAQs found in JSON file');
    }

    console.log(`✅ Parsed ${faqs.length} FAQs from JSON file`);

    // Insert FAQs
    const insertCount = await insertFAQs(faqs);
    if (insertCount === 0) {
      throw new Error('Failed to insert any FAQs');
    }

    // Generate embeddings
    const embeddingCount = await generateEmbeddings(faqs);
    if (embeddingCount === 0) {
      throw new Error('Failed to generate any embeddings');
    }

    // Final summary
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 SCRIPT COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`✅ FAQs inserted: ${insertCount}`);
    console.log(`✅ Embeddings generated: ${embeddingCount}`);
    console.log(`📊 Total processed: ${faqs.length} FAQs`);
    console.log('='.repeat(60));

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Test the system: npm start');
    console.log('2. Verify responses to critical questions');
    console.log('3. Deploy to production');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ SCRIPT FAILED:');
    console.error(error.message);
    console.error('\n🔧 TROUBLESHOOTING:');
    console.error('1. Check your .env file has all required variables');
    console.error('2. Verify Supabase connection');
    console.error('3. Check OpenAI API key is valid');
    console.error('4. Ensure critical-faqs.json exists and is valid JSON');

    process.exit(1);
  }
}

// Run the script
main();
