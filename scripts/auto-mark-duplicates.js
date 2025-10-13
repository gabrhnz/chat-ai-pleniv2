#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const reviewPath = path.join(process.cwd(), 'faqs-review.json');
const data = JSON.parse(fs.readFileSync(reviewPath, 'utf-8'));

// Agrupar por pregunta normalizada
const groups = {};
data.faqs.forEach(faq => {
  const key = faq.question.toLowerCase().trim();
  if (!groups[key]) groups[key] = [];
  groups[key].push(faq);
});

// Marcar duplicados (mantener el más reciente)
let marked = 0;
Object.values(groups).forEach(group => {
  if (group.length > 1) {
    // Ordenar por fecha (más reciente primero)
    group.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    // Marcar todos excepto el primero
    for (let i = 1; i < group.length; i++) {
      const faq = data.faqs.find(f => f.id === group[i].id);
      if (faq) {
        faq.DELETE = true;
        faq.reason = 'Duplicada - versión más reciente existe';
        marked++;
      }
    }
  }
});

fs.writeFileSync(reviewPath, JSON.stringify(data, null, 2));
console.log(`✅ Marcados ${marked} duplicados para eliminar`);
