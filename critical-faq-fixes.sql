-- ============================================
-- CRITICAL FAQ FIXES - SQL INSERT STATEMENTS
-- ============================================
-- This file contains all critical FAQ corrections
-- Run this in Supabase SQL Editor, then run: npm run init:embeddings

-- ============================================
-- BOT PRESENTATION - Community Project Identity
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('que eres',
 'Soy una IA creada por la comunidad para ayudar a estudiantes interesados en la UNC. No tengo relación oficial con la universidad - soy un proyecto comunitario que proporciona información basada en datos públicos. 🤖💬',
 'general',
 ARRAY['que eres', 'quien eres', 'que bot'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('eres oficial de la universidad',
 'No, no soy oficial de la UNC. Soy un proyecto comunitario creado por estudiantes y miembros de la comunidad para ayudar a otros estudiantes con información sobre la universidad. Toda la información que doy viene de fuentes públicas. 🤖💬',
 'general',
 ARRAY['oficial', 'universidad', 'representante'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('quien te creo',
 'Fui creado por la comunidad estudiantil como un proyecto colaborativo para ayudar a estudiantes interesados en la UNC. No soy parte de la administración universitaria oficial. 🤖💬',
 'general',
 ARRAY['quien te creo', 'creado por', 'desarrollado por'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('eres parte de la unc',
 'No, no soy parte oficial de la UNC. Soy un proyecto independiente de la comunidad que ayuda con información sobre la universidad. Proporciona datos basados en fuentes públicas disponibles. 🤖💬',
 'general',
 ARRAY['parte unc', 'oficial', 'perteneces'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('hola',
 '¡Hola! Soy una IA creada por la comunidad para ayudarte con información sobre la Universidad Nacional de las Ciencias (UNC). No soy oficial de la universidad, solo un proyecto comunitario útil. ¿En qué te puedo ayudar? 🤖💬',
 'general',
 ARRAY['hola', 'saludos', 'buenos dias'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('buenos dias',
 '¡Buenos días! Soy un asistente comunitario sobre la UNC, creado por estudiantes para estudiantes. No soy parte oficial de la universidad. ¿Qué información necesitas? 🤖💬',
 'general',
 ARRAY['buenos dias', 'buenas tardes', 'buenas noches'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('que haces',
 'Ayudo con información sobre la UNC basada en datos públicos. Respondo preguntas sobre carreras, admisión, costos, instalaciones, etc. Soy un proyecto comunitario, no oficial de la universidad. 🤖💬',
 'general',
 ARRAY['que haces', 'funciones', 'ayudas'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true),

('de donde vienes',
 'Soy un proyecto creado por la comunidad estudiantil venezolana para ayudar a otros estudiantes interesados en la UNC. No tengo relación oficial con la universidad. 🤖💬',
 'general',
 ARRAY['origen', 'de donde', 'creado'],
 '{"source": "bot-presentation-community-project", "added_at": "2025-01-13", "type": "bot-identity-correction", "priority": "critical", "bot_presentation": true}'::jsonb,
 NULL,
 'bot-presentation-fix',
 true);

-- ============================================
-- SCHOLARSHIPS - Precise Information
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('hay becas',
 'La UNC ofrece ayudas estudiantiles limitadas basadas en rendimiento académico y necesidad socioeconómica. No ofrecemos becas que cubran el 100% de los costos. Las ayudas disponibles son parciales y están sujetas a disponibilidad presupuestaria y cumplimiento de requisitos específicos. Para más información sobre criterios y proceso de solicitud, contacta a la oficina de asuntos estudiantiles. 💰📚',
 'finanzas',
 ARRAY['becas', 'ayudas', 'financiamiento', 'estudiantiles'],
 '{"source": "scholarships-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "scholarships-information"}'::jsonb,
 NULL,
 'scholarships-fix',
 true);

-- ============================================
-- IA ADMISSION REQUIREMENTS - Correct Scale
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('cuanto promedio necesito para entrar en la carrera de ia',
 'Para la Ingeniería en Inteligencia Artificial, que es una carrera muy demandada, necesitas un promedio alto en bachillerato. Generalmente se requiere entre 15-18 puntos sobre 20 como máximo posible. La competencia es alta, por lo que se recomienda un promedio excelente en matemáticas y ciencias. Los requisitos incluyen título de bachiller, notas certificadas y cédula de identidad. 📊🤖',
 'admisiones',
 ARRAY['promedio IA', 'requisitos IA', 'entrar ingeniería IA', 'puntos IA'],
 '{"source": "ia-admission-requirements-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "ia-admission-requirements"}'::jsonb,
 NULL,
 'ia-admission-fix',
 true);

-- ============================================
-- ADMISSION REQUIREMENTS - Correct Documents
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('cuándo son las próximas fechas de inscripción',
 'Las inscripciones en la UNC abren en enero y julio de cada año. Las fechas específicas se anunciarán próximamente. Para inscribirte necesitas: 1) **Título de bachiller original**, 2) **Notas certificadas originales**, 3) **Cédula de identidad original**, y 4) **Certificado de participación OPSU**. Mantente atento a los anuncios oficiales para más detalles sobre el proceso. 📅📋',
 'admisiones',
 ARRAY['inscripciones', 'fechas', 'requisitos', 'documentos', 'inscribirte'],
 '{"source": "admission-requirements-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "admission-documents"}'::jsonb,
 NULL,
 'admission-requirements-fix',
 true);

-- ============================================
-- UNIVERSITY HOUSING - Correct Information
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('hay residencias estudiantiles disponibles',
 'Sí, la UNC ofrece residencias estudiantiles con las siguientes condiciones: 1) **Por promedio académico**: Estudiantes con promedio entre 18-20 puntos, 2) **Por CAIU**: Puntaje mayor a 16 puntos en el Centro de Atención e Información Universitaria. Las residencias son limitadas y NO están garantizadas. Son válidas para estudiantes de cualquier estado de Venezuela EXCEPTO Distrito Capital, La Guaira y Miranda. Para más información, contacta al departamento de asuntos estudiantiles. 🏠📚',
 'instalaciones',
 ARRAY['residencias estudiantiles', 'alojamiento', 'residencia', 'vivienda', 'dormitorio'],
 '{"source": "residence-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "residence-information"}'::jsonb,
 NULL,
 'residence-fix',
 true);

-- ============================================
-- POSTGRADUATE PROGRAMS - Correct Status
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('la universidad ofrece programas de postgrado o maestrías',
 'Actualmente la UNC NO ofrece programas de postgrado o maestrías. La universidad se enfoca exclusivamente en carreras de pre-grado (licenciaturas e ingenierías). Los estudiantes que deseen continuar con estudios de postgrado deben buscar oportunidades en otras instituciones universitarias. Para información sobre posibles futuros programas, contacta a la dirección académica. 📚🎓',
 'academico',
 ARRAY['postgrado', 'maestrías', 'doctorado', 'post-grado', 'especialización'],
 '{"source": "postgraduate-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "postgraduate-programs"}'::jsonb,
 NULL,
 'postgraduate-fix',
 true);

-- ============================================
-- INTERNATIONAL EXCHANGE - Correct Partners
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('hay oportunidades de intercambio estudiantil internacional',
 'La UNC tiene cooperación internacional activa con universidades en **China, Rusia e Irán**. Estas oportunidades incluyen programas de intercambio estudiantil y prácticas internacionales en diversas carreras científicas y tecnológicas. Se requiere un promedio mínimo de 16/20 para participar. No hay convenios formales con universidades de USA, España o Brasil actualmente. Para más información sobre oportunidades disponibles, contacta a la oficina de relaciones internacionales. 🌏',
 'internacional',
 ARRAY['intercambio estudiantil', 'internacional', 'convenios', 'cooperación', 'prácticas'],
 '{"source": "international-exchange-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "international-cooperation"}'::jsonb,
 NULL,
 'international-exchange-fix',
 true);

-- ============================================
-- UNIVERSITY TRANSPORT - Correct Information
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('el transporte es un problema',
 'La UNC sí ofrece transporte universitario que sale desde distintos puntos. Para verificar las rutas actuales y horarios, lo mejor es consultar directamente en la universidad. El transporte facilita el acceso desde varias zonas, pero también puedes usar transporte público o carritos por_apps. 🚇🚌',
 'ubicacion',
 ARRAY['transporte', 'autobuses', 'carritos', 'metro', 'llegar'],
 '{"source": "transport-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "transport-information"}'::jsonb,
 NULL,
 'transport-fix',
 true),

('la uni tiene autobuses',
 'Sí, la UNC ofrece transporte universitario oficial con rutas desde distintos puntos. Los horarios y paradas pueden cambiar, por lo que lo mejor es verificar directamente en la universidad. Es una buena opción además del transporte público y carritos por_apps. 🚗🚌',
 'ubicacion',
 ARRAY['autobuses', 'transporte universitario', 'bus', 'ruta'],
 '{"source": "transport-hallucination-fix", "added_at": "2025-01-13", "type": "hallucination-correction", "priority": "critical", "fix_for": "transport-information"}'::jsonb,
 NULL,
 'transport-fix',
 true);

-- ============================================
-- VENEZUELAN SLANG QUESTIONS - Corrected
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('que tan arrecho es el nivel de exigencia',
 'El nivel es bien exigente pero no te rajan fácil. Hay que estudiar sí o sí, pero con organización y dedicación se puede. No es de esos sitios donde te botan por cualquier cosa, pero tampoco puedes estar echando bola. Depende de tu carrera y actitud. 💪📚',
 'general',
 ARRAY['exigencia', 'nivel', 'difícil', 'rajarse', 'echar bola'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('se puede sobrevivir echando bola',
 'No, no se puede sobrevivir echando bola. Hay que estudiar y dedicar tiempo. Algunas carreras son más intensas que otras, pero en general requiere esfuerzo. Si quieres graduarte tranquilo, mejor ponte las pilas desde el principio. No es imposible pero tampoco es gratis. 💪📖',
 'general',
 ARRAY['echar bola', 'sobrevivir', 'estudiar', 'esfuerzo', 'pilas'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('que tan dificil es entrar ahi',
 'Depende de la carrera, pero en general piden un buen promedio de bachillerato (15-18 puntos). No es tan arrecho como medicina, pero tampoco entran todos. Hacen una prueba de aptitud y revisan tu expediente. Si tienes buen promedio y pasas la prueba, tienes chances. 🎯📝',
 'admisiones',
 ARRAY['difícil entrar', 'promedio', 'prueba', 'bachillerato'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('piden un promedio arrecho',
 'Piden un promedio decente de bachillerato, generalmente 15-18 puntos dependiendo de la carrera. Las más competitivas como IA o Física piden más alto. No es 20 perfecto, pero tampoco pasan con 12. Si tienes buen expediente académico, tienes oportunidades. 📊🎓',
 'admisiones',
 ARRAY['promedio arrecho', 'puntos', 'bachillerato', 'competitivo'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('con 15 puntitos me la juego',
 'Con 15 puntos tienes chances en algunas carreras, pero en las más demandadas (IA, Ciberseguridad) compites con promedios más altos. Depende de la demanda de la carrera ese año y tu rendimiento en la prueba de aptitud. No está garantizado pero tienes oportunidades. 🎲📈',
 'admisiones',
 ARRAY['15 puntos', 'chances', 'oportunidades', 'jugarla'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('oye el transporte es un problema',
 'La UNC ofrece transporte universitario oficial desde distintos puntos, así que no es tanto problema. Si vienes de Caracas está bien porque hay metro cercano. Si vienes de afuera, puedes usar el transporte universitario o planear bien cómo llegar. Hay rutas de autobuses, carritos y el servicio oficial de la universidad. 🚇🚌',
 'ubicacion',
 ARRAY['transporte problema', 'complicado', 'llegar', 'dificultad'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true),

('uno tiene que buscarse la vida con los carritos',
 'No necesariamente, la UNC ofrece transporte universitario oficial desde distintos puntos. También puedes usar carritos por_apps, transporte público o el transporte universitario. Para las rutas más actualizadas, consulta directamente en la universidad. Hay varias opciones disponibles. 🚗📱',
 'ubicacion',
 ARRAY['carritos', 'buscarse la vida', 'transporte informal', 'apps'],
 '{"source": "venezuelan-slang-corrected", "added_at": "2025-01-13", "type": "venezuelan-slang", "language_style": "venezuelan-colloquial"}'::jsonb,
 NULL,
 'venezuelan-faqs-fix',
 true);

-- ============================================
-- SPORTS FACILITIES - Canchas Deportivas
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata, embedding, created_by, is_active) VALUES
('hay canchas',
 'Sí, hay canchas deportivas en construcción, incluyendo canchas de básquet. No se sabe aún cuándo estarán completamente listas. 🏀🏗️',
 'instalaciones',
 ARRAY['canchas', 'deportivas', 'basquet', 'basketball', 'construccion'],
 '{"source": "sports-facilities-info", "added_at": "2025-01-13", "type": "facilities-information", "priority": "medium", "status": "under-construction"}'::jsonb,
 NULL,
 'sports-facilities-faq',
 true);
