#!/usr/bin/env node

/**
 * Web Scraper for UNC Website
 * 
 * Extrae información de https://unc.edu.ve/ y genera FAQs automáticamente
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

dotenv.config({ path: path.join(rootDir, '.env') });

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.USE_OPENROUTER === 'true' 
    ? 'https://openrouter.ai/api/v1'
    : undefined,
  defaultHeaders: process.env.USE_OPENROUTER === 'true'
    ? {
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
        'X-Title': 'UNC FAQ Generator',
      }
    : undefined,
});

/**
 * Scrape a single page
 */
async function scrapePage(url) {
  console.log(`\n🔍 Scraping: ${url}`);
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; UNC-Bot/1.0)',
      },
      timeout: 10000,
    });
    
    const $ = cheerio.load(response.data);
    
    // Remove scripts, styles, and navigation
    $('script, style, nav, header, footer, .menu, .navigation').remove();
    
    // Extract main content
    const content = {
      title: $('title').text().trim() || $('h1').first().text().trim(),
      headings: [],
      paragraphs: [],
      lists: [],
      links: [],
    };
    
    // Extract headings
    $('h1, h2, h3, h4').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 3) {
        content.headings.push({
          level: el.name,
          text: text,
        });
      }
    });
    
    // Extract paragraphs
    $('p').each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20) {
        content.paragraphs.push(text);
      }
    });
    
    // Extract lists
    $('ul, ol').each((i, el) => {
      const items = [];
      $(el).find('li').each((j, li) => {
        const text = $(li).text().trim();
        if (text) items.push(text);
      });
      if (items.length > 0) {
        content.lists.push(items);
      }
    });
    
    // Extract internal links
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text && href.includes('unc.edu.ve')) {
        content.links.push({ href, text });
      }
    });
    
    return content;
    
  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    return null;
  }
}

/**
 * Generate FAQs from scraped content using AI
 */
async function generateFAQsFromContent(content, url) {
  console.log(`\n🤖 Generating FAQs from: ${content.title}`);
  
  const prompt = `Eres un experto en crear FAQs para universidades. 

Analiza el siguiente contenido de la página web de la UNC y genera FAQs relevantes.

TÍTULO: ${content.title}

ENCABEZADOS:
${content.headings.map(h => `${h.level}: ${h.text}`).join('\n')}

CONTENIDO:
${content.paragraphs.slice(0, 10).join('\n\n')}

LISTAS:
${content.lists.slice(0, 3).map(list => list.join(', ')).join('\n')}

INSTRUCCIONES:
1. Genera entre 3-8 FAQs relevantes basadas en este contenido
2. Las preguntas deben ser naturales, como las haría un estudiante
3. Las respuestas deben ser CORTAS (máximo 20 palabras), directas y usar markdown bold para datos clave
4. Incluye un emoji relevante en cada respuesta
5. Termina cada respuesta con una pregunta de seguimiento
6. Categoriza cada FAQ (admisiones, carreras, costos, becas, vida-universitaria, etc.)

FORMATO DE SALIDA (JSON):
[
  {
    "question": "¿Pregunta del estudiante?",
    "answer": "Respuesta corta con **datos clave**. 🎓 ¿Pregunta de seguimiento?",
    "category": "categoria",
    "keywords": ["palabra1", "palabra2"]
  }
]

Genera solo el JSON, sin texto adicional.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en generar FAQs educativas. Respondes solo en formato JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    const result = response.choices[0].message.content;
    
    // Parse JSON
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('❌ No se pudo extraer JSON de la respuesta');
      return [];
    }
    
    const faqs = JSON.parse(jsonMatch[0]);
    
    // Add metadata
    faqs.forEach(faq => {
      faq.metadata = {
        source_url: url,
        source_title: content.title,
        generated_at: new Date().toISOString(),
      };
    });
    
    console.log(`✅ Generated ${faqs.length} FAQs`);
    return faqs;
    
  } catch (error) {
    console.error('❌ Error generating FAQs:', error.message);
    return [];
  }
}

/**
 * Main scraping function
 */
async function scrapeUNCWebsite() {
  console.log('🚀 Starting UNC Website Scraper\n');
  
  // URLs to scrape (solo URLs verificadas que existen)
  const urls = [
    'https://unc.edu.ve/',
    'https://unc.edu.ve/index.php/carreras-de-pregrado/',
    'https://unc.edu.ve/index.php/autoridades/',
    'https://unc.edu.ve/index.php/noticias/',
    // Agregar más URLs verificadas aquí
  ];
  
  const allFAQs = [];
  
  for (const url of urls) {
    // Scrape page
    const content = await scrapePage(url);
    
    if (!content) {
      console.log(`⏭️  Skipping ${url}`);
      continue;
    }
    
    // Generate FAQs
    const faqs = await generateFAQsFromContent(content, url);
    allFAQs.push(...faqs);
    
    // Wait to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📊 Total FAQs generated: ${allFAQs.length}`);
  
  // Save to file for review
  const fs = await import('fs');
  const outputPath = path.join(rootDir, 'generated-faqs.json');
  fs.writeFileSync(outputPath, JSON.stringify(allFAQs, null, 2));
  console.log(`\n💾 FAQs saved to: ${outputPath}`);
  
  // Ask for confirmation before inserting
  console.log('\n⚠️  Review the generated FAQs in generated-faqs.json');
  console.log('To insert them into the database, run:');
  console.log('  node scripts/insert-generated-faqs.js');
  
  return allFAQs;
}

// Run scraper
scrapeUNCWebsite()
  .then(() => {
    console.log('\n✅ Scraping completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  });
