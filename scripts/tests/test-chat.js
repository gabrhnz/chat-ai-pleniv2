#!/usr/bin/env node

/**
 * Chat Test Script
 * 
 * Tests the chat endpoint to verify the RAG system is working correctly.
 * This helps identify if the "No rows returned" issue is in the database or API.
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const TEST_QUERIES = [
  "¿Cómo funciona el sistema?",
  "¿Qué es una FAQ?",
  "¿Cómo puedo obtener ayuda?",
  "¿Cuáles son los horarios de atención?",
  "¿Cómo contacto soporte técnico?"
];

async function testChatEndpoint() {
  console.log('\n🤖 CHAT ENDPOINT TEST');
  console.log('='.repeat(50));
  
  for (const query of TEST_QUERIES) {
    console.log(`\n🔍 Testing query: "${query}"`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          sessionId: 'test-session-' + Date.now(),
        }),
      });
      
      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Error details:', errorText);
        continue;
      }
      
      const data = await response.json();
      
      console.log(`✅ Response received`);
      console.log(`   - Reply length: ${data.reply?.length || 0} characters`);
      console.log(`   - Sources found: ${data.sources?.length || 0}`);
      console.log(`   - Top similarity: ${data.metadata?.topSimilarity || 'N/A'}`);
      console.log(`   - Response time: ${data.metadata?.duration || 'N/A'}ms`);
      
      if (data.sources && data.sources.length > 0) {
        console.log('   📋 Sources:');
        data.sources.forEach((source, index) => {
          console.log(`      ${index + 1}. ${source.question.substring(0, 60)}... (similarity: ${source.similarity?.toFixed(3) || 'N/A'})`);
        });
      } else {
        console.log('   ⚠️  No sources found - this might be the "No rows returned" issue');
      }
      
      if (data.reply && data.reply.length > 0) {
        console.log(`   💬 Reply preview: ${data.reply.substring(0, 100)}...`);
      } else {
        console.log('   ⚠️  Empty reply - check if LLM is working');
      }
      
    } catch (error) {
      console.error(`❌ Request failed:`, error.message);
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Chat endpoint test complete!\n');
}

// Run the test
testChatEndpoint().catch(console.error);

