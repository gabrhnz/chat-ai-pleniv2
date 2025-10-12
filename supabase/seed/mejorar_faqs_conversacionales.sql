-- ============================================
-- MEJORAR FAQs: MÁS CORTAS Y CONVERSACIONALES
-- Respuestas directas + CTA conversacional
-- ============================================

-- ADMISIONES
UPDATE faqs SET answer = 'Abren en **enero** y **julio** cada año. 📅 ¿Quieres saber qué documentos necesitas para inscribirte?', updated_at = NOW() WHERE question = '¿Cuándo abren las inscripciones?';

UPDATE faqs SET answer = 'Necesitas: cédula, notas certificadas, foto tipo carnet y partida de nacimiento. 📋 ¿Te gustaría conocer el proceso completo de admisión?', updated_at = NOW() WHERE question = '¿Qué documentos necesito para inscribirme?';

UPDATE faqs SET answer = 'Sí, presentas una **prueba de aptitud académica** y una **entrevista personal**. 📝 ¿Necesitas tips para prepararte?', updated_at = NOW() WHERE question = '¿Hay examen de admisión?';

UPDATE faqs SET answer = '¡Sí! Extranjeros son bienvenidos. Necesitas visa de estudiante y apostillar documentos. 🌎 ¿Quieres más detalles del proceso?', updated_at = NOW() WHERE question = '¿Puedo inscribirme si soy extranjero?';

UPDATE faqs SET answer = 'Varía entre **30-50 cupos** por carrera según demanda. Los cupos se asignan por mérito. 🎯 ¿Te interesa aplicar? Puedo contarte sobre becas.', updated_at = NOW() WHERE question = '¿Cuántos cupos hay por carrera?';

UPDATE faqs SET answer = 'Sí, después del primer semestre con promedio mínimo **16/20**. 🔄 ¿Quieres saber qué carreras ofrecemos?', updated_at = NOW() WHERE question = '¿Puedo cambiarme de carrera después?';

UPDATE faqs SET answer = 'Sí, evaluamos traslados caso por caso. Necesitas récord académico y equivalencias. 📚 ¿Te gustaría iniciar el proceso?', updated_at = NOW() WHERE question = '¿Aceptan traslados de otras universidades?';

-- BECAS
UPDATE faqs SET answer = '¡Sí! Ofrecemos becas **académicas**, **socioeconómicas** y **deportivas**. 💰 ¿Quieres saber cuánto cubren?', updated_at = NOW() WHERE question = '¿Ofrecen becas?';

UPDATE faqs SET answer = 'Cubren entre **50% y 100%** de matrícula, más apoyo para transporte y alimentación. 🎓 ¿Te interesa aplicar a una?', updated_at = NOW() WHERE question = '¿Cuánto cubre una beca?';

UPDATE faqs SET answer = 'Completa el formulario online durante la inscripción. Decisión en **2-3 semanas**. ⚡ ¿Necesitas ayuda con los requisitos?', updated_at = NOW() WHERE question = '¿Cómo solicito una beca?';

UPDATE faqs SET answer = 'Sí, si tu promedio baja de **14/20** o tienes problemas disciplinarios. 📊 ¿Quieres tips para mantener buen rendimiento?', updated_at = NOW() WHERE question = '¿Puedo perder la beca?';

UPDATE faqs SET answer = 'Actualmente solo para pregrado. Para postgrado, consulta FONACIT. 🎓 ¿Te interesa alguna carrera de pregrado?', updated_at = NOW() WHERE question = '¿Hay becas para postgrado?';

UPDATE faqs SET answer = 'Sí, puedes trabajar. La beca no tiene restricciones laborales. ⚖️ ¿Quieres saber sobre los horarios de clase?', updated_at = NOW() WHERE question = '¿Puedo trabajar mientras estudio con beca?';

UPDATE faqs SET answer = 'Sí, el comedor ofrece **almuerzos subsidiados** a Bs. 5. 🍽️ Horario: 12pm-2pm. ¿Te interesa saber sobre otras facilidades del campus?', updated_at = NOW() WHERE question = '¿Hay beca de alimentación?';

UPDATE faqs SET answer = 'Sí, apoyo mensual de **$20-30** según necesidad. 🚌 ¿Quieres aplicar a una beca integral?', updated_at = NOW() WHERE question = '¿Ofrecen beca de transporte?';

-- VIDA UNIVERSITARIA
UPDATE faqs SET answer = 'No tenemos residencias en campus, pero te ayudamos a encontrar alojamiento cercano. 🏠 ¿Necesitas recomendaciones de zonas?', updated_at = NOW() WHERE question = '¿Tienen residencias estudiantiles?';

UPDATE faqs SET answer = '¡Sí! Fútbol, basketball, volleyball y natación. 🏃‍♂️ Horarios: lunes a viernes 4pm-6pm. ¿Practicas algún deporte?', updated_at = NOW() WHERE question = '¿Hay actividades deportivas?';

UPDATE faqs SET answer = '¡Sí! El club se reúne martes y jueves 3pm-5pm. 🤖 ¿Te gustaría unirte? Puedo darte más info.', updated_at = NOW() WHERE question = '¿Tienen club de robótica?';

UPDATE faqs SET answer = 'Organizamos conferencias, talleres y eventos mensuales. 🎭 ¿Quieres que te avise sobre el próximo evento?', updated_at = NOW() WHERE question = '¿Hay eventos culturales?';

UPDATE faqs SET answer = 'Sí, biblioteca con **10,000+ libros** y sala de estudio 24/7. 📚 Ubicación: Edificio A, piso 2. ¿Necesitas info sobre otras instalaciones?', updated_at = NOW() WHERE question = '¿Tienen biblioteca?';

UPDATE faqs SET answer = 'Sí, WiFi gratuito en todo el campus. Red: **UNC-Estudiantes**. 📶 ¿Quieres saber sobre los labs de computación?', updated_at = NOW() WHERE question = '¿Hay WiFi en el campus?';

UPDATE faqs SET answer = 'Sí, viajes nacionales e internacionales por carrera. 🌍 Costo promedio: $200-500. ¿Te interesa un intercambio?', updated_at = NOW() WHERE question = '¿Organizan viajes de estudio?';

-- ACADÉMICO
UPDATE faqs SET answer = 'Entre **5-7 materias** según carrera. Carga promedio: 18-22 créditos. 📖 ¿Quieres ver el pensum de alguna carrera?', updated_at = NOW() WHERE question = '¿Cuántas materias veo por semestre?';

UPDATE faqs SET answer = 'Clases de **7am a 5pm**, lunes a viernes. Algunos labs hasta 7pm. ⏰ ¿Te preocupa el horario? Puedo explicarte la flexibilidad.', updated_at = NOW() WHERE question = '¿Qué horario tienen las clases?';

UPDATE faqs SET answer = 'No, solo lunes a viernes. Sábados y domingos: biblioteca y labs abiertos 8am-4pm. 📅 ¿Planeas usar las instalaciones en fin de semana?', updated_at = NOW() WHERE question = '¿Hay clases los sábados?';

UPDATE faqs SET answer = 'Sí, con promedio **≥16/20** puedes inscribir materias adelantadas. 🚀 ¿Quieres graduarte más rápido?', updated_at = NOW() WHERE question = '¿Puedo adelantar materias?';

UPDATE faqs SET answer = 'Puedes cursarla nuevamente. Máximo **2 reprobadas** por materia. 📉 ¿Necesitas info sobre tutorías?', updated_at = NOW() WHERE question = '¿Qué pasa si repruebo una materia?';

UPDATE faqs SET answer = 'Sí, tutorías gratuitas lunes a jueves 4pm-6pm. 👨‍🏫 Edificio B, piso 1. ¿En qué materia necesitas apoyo?', updated_at = NOW() WHERE question = '¿Tienen tutorías?';

UPDATE faqs SET answer = 'Sí, desde 6to semestre. Duración: **3-6 meses**. 💼 Convenios con 50+ empresas. ¿Quieres saber en qué áreas?', updated_at = NOW() WHERE question = '¿Puedo hacer pasantías?';

UPDATE faqs SET answer = 'Actualmente no, pero puedes hacer **certificaciones complementarias**. 🎓 ¿Te interesa especializarte en algo?', updated_at = NOW() WHERE question = '¿Ofrecen doble titulación?';

-- COSTOS
UPDATE faqs SET answer = 'La UNC es **pública y gratuita** para venezolanos. Solo aranceles administrativos ~$10/semestre. 💵 ¿Quieres info sobre becas adicionales?', updated_at = NOW() WHERE question = '¿Cuánto cuesta la matrícula?';

UPDATE faqs SET answer = 'Sí, aceptamos **Bs, $, Zelle y PayPal**. 💳 ¿Necesitas los datos de pago?', updated_at = NOW() WHERE question = '¿Aceptan pagos en dólares?';

UPDATE faqs SET answer = 'Sí, puedes pagar en **2-3 cuotas** sin intereses. 📅 ¿Quieres solicitar un plan de pagos?', updated_at = NOW() WHERE question = '¿Hay plan de pagos?';

UPDATE faqs SET answer = 'Promedio **$50-100/semestre**. Biblioteca tiene copias disponibles. 📚 ¿Quieres tips para ahorrar en materiales?', updated_at = NOW() WHERE question = '¿Cuánto cuestan los libros?';

UPDATE faqs SET answer = 'Sí, certificados cuestan **$5-15** según tipo. Listo en 3-5 días. 📄 ¿Necesitas solicitar alguno?', updated_at = NOW() WHERE question = '¿Cobran por certificados?';

UPDATE faqs SET answer = 'Sí, **10% de descuento** en aranceles si tienes hermanos estudiando. 👥 ¿Tienes hermanos que quieran aplicar?', updated_at = NOW() WHERE question = '¿Hay descuentos para hermanos?';

-- CARRERAS
UPDATE faqs SET answer = '¡Sí! Industria farmacéutica, agroindustria y labs. Tasa de empleo: **85%** al graduarse. 💼 ¿Te interesa esta carrera?', updated_at = NOW() WHERE question = '¿Biotecnología tiene salida laboral?';

UPDATE faqs SET answer = 'Es exigente pero manejable con dedicación. Tasa de graduación: **78%**. 💪 ¿Quieres tips de estudiantes actuales?', updated_at = NOW() WHERE question = '¿Ingeniería Química es muy difícil?';

UPDATE faqs SET answer = 'Investigación, hospitales, industria farmacéutica y docencia. Salario: **$800-1500/mes**. 🧠 ¿Te apasiona el cerebro?', updated_at = NOW() WHERE question = '¿Qué hace un egresado de Neurociencia?';

UPDATE faqs SET answer = 'Sí, **60% del pensum** es programación práctica. Lenguajes: Python, Java, C++, JavaScript. 💻 ¿Ya programas algo?', updated_at = NOW() WHERE question = '¿Ciencias de la Computación incluye programación?';

UPDATE faqs SET answer = 'Sí, **8 materias** de matemáticas. Necesitas base sólida en cálculo. 📐 ¿Quieres info sobre el curso de nivelación?', updated_at = NOW() WHERE question = '¿Física tiene muchas matemáticas?';

UPDATE faqs SET answer = '¡Sí! Desde 3er semestre puedes unirte a proyectos. 🔬 ¿Qué área de investigación te interesa?', updated_at = NOW() WHERE question = '¿Puedo hacer investigación desde pregrado?';

UPDATE faqs SET answer = 'Sí, convenios con universidades en USA, España y Brasil. 🌎 Requisitos: promedio ≥16/20. ¿Te interesa un intercambio?', updated_at = NOW() WHERE question = '¿Ofrecen prácticas internacionales?';

-- INSTALACIONES
UPDATE faqs SET answer = 'Sí, **15 labs especializados** con equipos 2020-2024. 🔬 ¿Quieres hacer un tour virtual?', updated_at = NOW() WHERE question = '¿Tienen laboratorios de última generación?';

UPDATE faqs SET answer = 'Sí, labs abiertos lunes a viernes 8am-8pm con supervisión. 🔓 ¿Tienes algún proyecto en mente?', updated_at = NOW() WHERE question = '¿Puedo usar los labs fuera de clase?';

UPDATE faqs SET answer = 'Sí, **200+ computadoras** en 5 salas. Horario: 7am-9pm. 💻 Ubicación: Edificio C, pisos 1-3. ¿Necesitas software especializado?', updated_at = NOW() WHERE question = '¿Tienen computadoras disponibles?';

UPDATE faqs SET answer = 'Sí, licencias de MATLAB, AutoCAD, SolidWorks, y más. 📊 ¿Qué software necesitas para tu carrera?', updated_at = NOW() WHERE question = '¿Ofrecen software especializado?';

UPDATE faqs SET answer = 'Sí, **5 impresoras 3D** disponibles. Costo: $2-5 según tamaño. 🖨️ ¿Tienes un proyecto de prototipado?', updated_at = NOW() WHERE question = '¿Tienen impresoras 3D?';

UPDATE faqs SET answer = 'Sí, estacionamiento gratuito con **300 puestos**. 🚗 Entrada por Av. Principal. Seguridad 24/7. ¿Vienes en carro?', updated_at = NOW() WHERE question = '¿Hay estacionamiento?';

UPDATE faqs SET answer = 'Sí, 2 cafeterías con precios estudiantiles. ☕ Horario: 7am-6pm. ¿Quieres saber sobre el comedor universitario?', updated_at = NOW() WHERE question = '¿Tienen cafetería?';

-- Verificar cambios
SELECT COUNT(*) as faqs_actualizadas FROM faqs WHERE updated_at > NOW() - INTERVAL '1 minute';

