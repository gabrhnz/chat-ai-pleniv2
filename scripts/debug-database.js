#!/usr/bin/env node

/**
 * Database Diagnostic Script
 * 
 * Helps troubleshoot "No rows returned" issues by checking:
 * 1. Database connection
 * 2. FAQ data existence
 * 3. Embeddings status
 * 4. Similarity thresholds
 * 5. Test queries
 */

import dotenv from 'dotenv';
import { supabase, supabaseAdmin } from '../src/config/supabase.js';
import { generateEmbedding } from '../src/services/embeddings.service.js';
import logger from '../src/utils/logger.js';

// Load environment variables
dotenv.config();

const SIMILARITY_THRESHOLD = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7');
const TOP_K_RESULTS = parseInt(process.env.TOP_K_RESULTS || '5', 10);

async function runDiagnostics() {
  console.log('\n🔍 DATABASE DIAGNOSTIC TOOL');
  console.log('='.repeat(50));
  
  try {
    // 1. Test database connection
    console.log('\n1️⃣ Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('faqs')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // 2. Check FAQ data
    console.log('\n2️⃣ Checking FAQ data...');
    const { data: faqs, error: faqsError, count: totalFAQs } = await supabase
      .from('faqs')
      .select('*', { count: 'exact' });
    
    if (faqsError) {
      console.error('❌ Failed to fetch FAQs:', faqsError.message);
      return;
    }
    
    console.log(`📊 Total FAQs in database: ${totalFAQs}`);
    
    if (totalFAQs === 0) {
      console.log('⚠️  No FAQs found in database!');
      console.log('💡 You need to add some FAQs first. Use the admin API or run the sample data script.');
      return;
    }
    
    // 3. Check active FAQs
    const activeFAQs = faqs.filter(faq => faq.is_active);
    console.log(`📊 Active FAQs: ${activeFAQs.length}`);
    
    if (activeFAQs.length === 0) {
      console.log('⚠️  No active FAQs found!');
      console.log('💡 Check if FAQs are marked as active (is_active = true)');
    }
    
    // 4. Check embeddings
    console.log('\n3️⃣ Checking embeddings...');
    const faqsWithEmbeddings = faqs.filter(faq => faq.embedding && faq.embedding.length > 0);
    const faqsWithoutEmbeddings = faqs.filter(faq => !faq.embedding || faq.embedding.length === 0);
    
    console.log(`📊 FAQs with embeddings: ${faqsWithEmbeddings.length}`);
    console.log(`📊 FAQs without embeddings: ${faqsWithoutEmbeddings.length}`);
    
    if (faqsWithoutEmbeddings.length > 0) {
      console.log('⚠️  Some FAQs are missing embeddings!');
      console.log('💡 Run: npm run init-embeddings to generate missing embeddings');
      
      if (faqsWithoutEmbeddings.length <= 5) {
        console.log('\n📋 FAQs missing embeddings:');
        faqsWithoutEmbeddings.forEach(faq => {
          console.log(`   - ${faq.id}: ${faq.question.substring(0, 50)}...`);
        });
      }
    }
    
    // 5. Test similarity search
    console.log('\n4️⃣ Testing similarity search...');
    
    if (faqsWithEmbeddings.length > 0) {
      // Test with a simple query
      const testQuery = "¿Cómo funciona el sistema?";
      console.log(`🔍 Testing query: "${testQuery}"`);
      
      try {
        // Generate embedding for test query
        const queryEmbedding = await generateEmbedding(testQuery);
        console.log('✅ Query embedding generated');
        
        // Test the match_faqs function
        const { data: searchResults, error: searchError } = await supabase.rpc('match_faqs', {
          query_embedding: queryEmbedding,
          match_threshold: SIMILARITY_THRESHOLD,
          match_count: TOP_K_RESULTS,
        });
        
        if (searchError) {
          console.error('❌ Similarity search failed:', searchError.message);
          console.log('💡 Check if the match_faqs function exists in your database');
        } else {
          console.log(`📊 Search results: ${searchResults.length} matches found`);
          
          if (searchResults.length === 0) {
            console.log('⚠️  No similar FAQs found!');
            console.log('💡 This might be why you\'re getting "No rows returned"');
            console.log(`💡 Current similarity threshold: ${SIMILARITY_THRESHOLD}`);
            console.log('💡 Try lowering the threshold or check if your query is too specific');
          } else {
            console.log('\n📋 Top matches:');
            searchResults.forEach((result, index) => {
              console.log(`   ${index + 1}. Similarity: ${result.similarity.toFixed(3)} - ${result.question.substring(0, 60)}...`);
            });
          }
        }
      } catch (embeddingError) {
        console.error('❌ Failed to generate test embedding:', embeddingError.message);
        console.log('💡 Check your OpenAI API key and embedding service configuration');
      }
    } else {
      console.log('⚠️  Cannot test similarity search - no embeddings available');
    }
    
    // 6. Check categories
    console.log('\n5️⃣ Checking categories...');
    const categories = [...new Set(faqs.map(faq => faq.category).filter(Boolean))];
    console.log(`📊 Categories found: ${categories.length}`);
    if (categories.length > 0) {
      console.log('📋 Categories:', categories.join(', '));
    }
    
    // 7. Configuration summary
    console.log('\n6️⃣ Configuration Summary:');
    console.log(`   - Similarity Threshold: ${SIMILARITY_THRESHOLD}`);
    console.log(`   - Top K Results: ${TOP_K_RESULTS}`);
    console.log(`   - Max Context Length: ${process.env.MAX_CONTEXT_LENGTH || '3000'}`);
    console.log(`   - Embedding Model: ${process.env.EMBEDDING_MODEL || 'text-embedding-3-small'}`);
    
    // 8. Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (totalFAQs === 0) {
      console.log('   - Add some sample FAQs to your database');
      console.log('   - Use the admin API: POST /api/admin/faqs');
    }
    
    if (faqsWithoutEmbeddings.length > 0) {
      console.log('   - Run: npm run init-embeddings');
    }
    
    if (faqsWithEmbeddings.length > 0 && faqsWithoutEmbeddings.length === 0) {
      console.log('   - Try lowering the similarity threshold if no results found');
      console.log('   - Check if your query is too specific or uses different language');
    }
    
    console.log('\n✅ Diagnostic complete!\n');
    
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run diagnostics
runDiagnostics().catch(console.error);

