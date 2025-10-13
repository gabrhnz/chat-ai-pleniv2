#!/usr/bin/env node

/**
 * Review and Clean FAQs
 * 
 * Revisa todas las FAQs en la base de datos y permite eliminar duplicadas o no verificadas
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

/**
 * Get all FAQs from database
 */
async function getAllFAQs() {
  console.log('📋 Fetching all FAQs from database...\n');
  
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error fetching FAQs:', error.message);
    process.exit(1);
  }
  
  return data;
}

/**
 * Find duplicate FAQs (similar questions)
 */
function findDuplicates(faqs) {
  console.log('🔍 Searching for duplicates...\n');
  
  const duplicates = [];
  const seen = new Map();
  
  for (const faq of faqs) {
    const normalizedQuestion = faq.question.toLowerCase().trim();
    
    if (seen.has(normalizedQuestion)) {
      duplicates.push({
        original: seen.get(normalizedQuestion),
        duplicate: faq,
      });
    } else {
      seen.set(normalizedQuestion, faq);
    }
  }
  
  return duplicates;
}

/**
 * Group FAQs by category
 */
function groupByCategory(faqs) {
  const groups = {};
  
  for (const faq of faqs) {
    const category = faq.category || 'sin-categoria';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(faq);
  }
  
  return groups;
}

/**
 * Generate review report
 */
function generateReport(faqs) {
  console.log('📊 Generating review report...\n');
  
  const duplicates = findDuplicates(faqs);
  const byCategory = groupByCategory(faqs);
  const bySource = {};
  
  // Group by source
  for (const faq of faqs) {
    const source = faq.created_by || 'unknown';
    if (!bySource[source]) {
      bySource[source] = [];
    }
    bySource[source].push(faq);
  }
  
  // Generate report
  const report = {
    summary: {
      total: faqs.length,
      duplicates: duplicates.length,
      categories: Object.keys(byCategory).length,
      sources: Object.keys(bySource).length,
    },
    byCategory: Object.entries(byCategory).map(([category, items]) => ({
      category,
      count: items.length,
    })).sort((a, b) => b.count - a.count),
    bySource: Object.entries(bySource).map(([source, items]) => ({
      source,
      count: items.length,
    })).sort((a, b) => b.count - a.count),
    duplicates: duplicates.map(d => ({
      original_id: d.original.id,
      original_question: d.original.question,
      duplicate_id: d.duplicate.id,
      duplicate_question: d.duplicate.question,
      original_created: d.original.created_at,
      duplicate_created: d.duplicate.created_at,
    })),
  };
  
  return report;
}

/**
 * Save FAQs to review file
 */
function saveFAQsForReview(faqs, report) {
  const reviewData = {
    generated_at: new Date().toISOString(),
    summary: report.summary,
    instructions: {
      message: 'Revisa las FAQs y marca las que quieres eliminar',
      how_to: 'Agrega "DELETE": true a las FAQs que quieras eliminar',
      example: {
        id: 'uuid-here',
        question: '¿Pregunta?',
        answer: 'Respuesta',
        DELETE: true,
        reason: 'Duplicada / No verificada / Incorrecta',
      },
    },
    faqs: faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      created_by: faq.created_by,
      created_at: faq.created_at,
      metadata: faq.metadata,
      DELETE: false,
      reason: '',
    })),
  };
  
  const filePath = path.join(rootDir, 'faqs-review.json');
  fs.writeFileSync(filePath, JSON.stringify(reviewData, null, 2));
  
  console.log(`\n💾 FAQs saved for review: ${filePath}`);
  console.log('\n📝 Instructions:');
  console.log('   1. Open faqs-review.json');
  console.log('   2. Set "DELETE": true for FAQs you want to remove');
  console.log('   3. Add a "reason" explaining why');
  console.log('   4. Run: npm run delete:marked');
  console.log('');
}

/**
 * Display report
 */
function displayReport(report) {
  console.log('='.repeat(60));
  console.log('\n📊 FAQ DATABASE REPORT\n');
  console.log('='.repeat(60));
  
  console.log('\n📈 SUMMARY:');
  console.log(`   Total FAQs: ${report.summary.total}`);
  console.log(`   Duplicates found: ${report.summary.duplicates}`);
  console.log(`   Categories: ${report.summary.categories}`);
  console.log(`   Sources: ${report.summary.sources}`);
  
  console.log('\n📂 BY CATEGORY:');
  report.byCategory.forEach(cat => {
    console.log(`   ${cat.category.padEnd(25)} ${cat.count} FAQs`);
  });
  
  console.log('\n🏷️  BY SOURCE:');
  report.bySource.forEach(src => {
    console.log(`   ${src.source.padEnd(25)} ${src.count} FAQs`);
  });
  
  if (report.duplicates.length > 0) {
    console.log('\n⚠️  DUPLICATES FOUND:');
    report.duplicates.forEach((dup, idx) => {
      console.log(`\n   ${idx + 1}. "${dup.original_question}"`);
      console.log(`      Original ID: ${dup.original_id} (${dup.original_created})`);
      console.log(`      Duplicate ID: ${dup.duplicate_id} (${dup.duplicate_created})`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Main function
 */
async function reviewAndClean() {
  console.log('🔍 FAQ Review and Cleanup Tool\n');
  
  // Get all FAQs
  const faqs = await getAllFAQs();
  console.log(`✅ Found ${faqs.length} FAQs\n`);
  
  // Generate report
  const report = generateReport(faqs);
  
  // Display report
  displayReport(report);
  
  // Save for manual review
  saveFAQsForReview(faqs, report);
}

reviewAndClean()
  .then(() => {
    console.log('\n✅ Review completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
