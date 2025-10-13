/**
 * Initialize Embeddings Script
 * 
 * Generates embeddings for all FAQs that don't have one yet.
 * Run this after importing FAQs to enable semantic search.
 * 
 * Usage:
 *   node scripts/init-embeddings.js
 *   node scripts/init-embeddings.js --force (regenerate all)
 */

import dotenv from 'dotenv';
import { supabaseAdmin } from '../../src/config/supabase.js';
import { generateEmbeddingsBatch } from '../../src/services/embeddings.service.js';
import logger from '../../src/utils/logger.js';

// Load environment variables
dotenv.config();

const BATCH_SIZE = 50; // Process 50 FAQs at a time
const forceRegenerate = process.argv.includes('--force');

async function initEmbeddings() {
  console.log('\n🚀 Initializing embeddings for FAQs...\n');
  
  try {
    // Fetch FAQs without embeddings (or all if --force)
    let query = supabaseAdmin
      .from('faqs')
      .select('id, question')
      .eq('is_active', true);
    
    if (!forceRegenerate) {
      query = query.is('embedding', null);
    }
    
    const { data: faqs, error } = await query;
    
    if (error) {
      console.error('❌ Failed to fetch FAQs:', error.message);
      process.exit(1);
    }
    
    if (!faqs || faqs.length === 0) {
      console.log('✅ All FAQs already have embeddings!');
      console.log('\n💡 Tip: Use --force flag to regenerate all embeddings\n');
      process.exit(0);
    }
    
    console.log(`📊 Found ${faqs.length} FAQs to process`);
    console.log(`📦 Batch size: ${BATCH_SIZE}\n`);
    
    // Process in batches
    let processedCount = 0;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < faqs.length; i += BATCH_SIZE) {
      const batch = faqs.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(faqs.length / BATCH_SIZE);
      
      console.log(`\n📍 Processing batch ${batchNumber}/${totalBatches} (${batch.length} FAQs)...`);
      
      try {
        // Generate embeddings
        const questions = batch.map(faq => faq.question);
        console.log('   ⏳ Generating embeddings...');
        const embeddings = await generateEmbeddingsBatch(questions, batch.length);
        
        // Update FAQs
        console.log('   ⏳ Updating database...');
        for (let j = 0; j < batch.length; j++) {
          const faq = batch[j];
          const embedding = embeddings[j];
          
          const { error: updateError } = await supabaseAdmin
            .from('faqs')
            .update({ embedding })
            .eq('id', faq.id);
          
          if (updateError) {
            console.error(`   ❌ Error updating FAQ ${faq.id}:`, updateError.message);
            errorCount++;
          } else {
            successCount++;
          }
          
          processedCount++;
          
          // Show progress
          const percent = Math.round((processedCount / faqs.length) * 100);
          process.stdout.write(`   📈 Progress: ${percent}% (${processedCount}/${faqs.length})\r`);
        }
        
        console.log('\n   ✅ Batch completed');
        
        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < faqs.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (batchError) {
        console.error(`   ❌ Batch failed:`, batchError.message);
        errorCount += batch.length;
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Success: ${successCount} FAQs`);
    console.log(`❌ Errors:  ${errorCount} FAQs`);
    console.log(`📈 Total:   ${processedCount} FAQs processed`);
    console.log('='.repeat(50) + '\n');
    
    if (successCount > 0) {
      console.log('🎉 Embeddings initialized successfully!');
      console.log('\n💡 Next steps:');
      console.log('   1. Start the server: npm start');
      console.log('   2. Test RAG: curl -X POST http://localhost:3000/api/chat \\');
      console.log('                  -H "Content-Type: application/json" \\');
      console.log('                  -d \'{"message": "¿Cuándo son las inscripciones?"}\'');
      console.log('   3. Create vector index (if >100 FAQs):\n');
      console.log('      CREATE INDEX faqs_embedding_idx ON faqs');
      console.log('      USING ivfflat (embedding vector_cosine_ops)');
      console.log('      WITH (lists = 100);\n');
    }
    
    if (errorCount > 0) {
      console.log('⚠️  Some errors occurred. Check logs above.');
      process.exit(1);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run
initEmbeddings();

