-- ============================================
-- 50+ FAQs INTELIGENTES PARA LA UNC
-- Respuestas cortas, precisas, con CTA
-- Agrupadas por contexto
-- ============================================

-- ============================================
-- CONTEXTO 1: PROCESO DE ADMISIÓN (7 preguntas)
-- ============================================

INSERT INTO faqs (question, answer, category, keywords, metadata) VALUES

('¿Cuándo abren las inscripciones?',
'Las inscripciones abren en **enero** y **julio** de cada año. 📅 Consulta fechas exactas en https://unc.edu.ve/admisiones',
'admisiones',
ARRAY['inscripciones', 'fechas', 'cuando', 'periodo'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Qué documentos necesito para inscribirme?',
'Necesitas: cédula, notas certificadas, foto tipo carnet y partida de nacimiento. 📋 Lista completa: https://unc.edu.ve/documentos',
'admisiones',
ARRAY['documentos', 'requisitos', 'papeles', 'necesito'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Hay examen de admisión?',
'Sí, presentas una **prueba de aptitud académica** y una **entrevista personal**. 📝 Prepárate en: https://unc.edu.ve/preparacion',
'admisiones',
ARRAY['examen', 'prueba', 'test', 'admision'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Puedo inscribirme si soy extranjero?',
'¡Sí! Extranjeros son bienvenidos. Necesitas visa de estudiante y apostillar documentos. 🌎 Más info: admisiones@unc.edu.ve',
'admisiones',
ARRAY['extranjero', 'internacional', 'visa', 'apostilla'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Cuántos cupos hay por carrera?',
'Varía entre **30-50 cupos** por carrera según demanda. Los cupos se asignan por mérito. 🎯 Consulta disponibilidad: https://unc.edu.ve/cupos',
'admisiones',
ARRAY['cupos', 'vacantes', 'plazas', 'cantidad'],
'{"priority": "medium", "cta": "web"}'::jsonb),

('¿Puedo cambiarme de carrera después?',
'Sí, después del primer semestre puedes solicitar cambio interno. 🔄 Requisitos: promedio mínimo 16/20. Contacta: registro@unc.edu.ve',
'admisiones',
ARRAY['cambio', 'transferencia', 'otra carrera', 'cambiar'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Aceptan traslados de otras universidades?',
'Sí, evaluamos traslados caso por caso. Necesitas récord académico y equivalencias. 📚 Solicita: traslados@unc.edu.ve',
'admisiones',
ARRAY['traslado', 'transferencia', 'otra universidad', 'cambio'],
'{"priority": "medium", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 2: BECAS Y AYUDA FINANCIERA (8 preguntas)
-- ============================================

('¿Ofrecen becas?',
'¡Sí! Ofrecemos becas **académicas**, **socioeconómicas** y **deportivas**. 💰 Aplica en: https://unc.edu.ve/becas',
'becas',
ARRAY['becas', 'ayuda', 'financiamiento', 'apoyo'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Cuánto cubre una beca?',
'Las becas cubren entre **50% y 100%** de matrícula, más apoyo para transporte y alimentación. 🎓 Detalles: becas@unc.edu.ve',
'becas',
ARRAY['monto', 'cuanto', 'cubre', 'porcentaje'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Cómo solicito una beca?',
'Completa el formulario online durante la inscripción. Decisión en **2-3 semanas**. ⚡ Formulario: https://unc.edu.ve/solicitar-beca',
'becas',
ARRAY['solicitar', 'aplicar', 'pedir', 'como'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Puedo perder la beca?',
'Sí, si tu promedio baja de **14/20** o tienes problemas disciplinarios. Mantén buen rendimiento. 📊 Reglamento: https://unc.edu.ve/reglamento-becas',
'becas',
ARRAY['perder', 'quitar', 'mantener', 'requisitos'],
'{"priority": "medium", "cta": "web"}'::jsonb),

('¿Hay becas para postgrado?',
'Actualmente solo ofrecemos becas para pregrado. Para postgrado, consulta FONACIT. 🎓 Info: postgrado@unc.edu.ve',
'becas',
ARRAY['postgrado', 'maestria', 'doctorado', 'posgrado'],
'{"priority": "low", "cta": "email"}'::jsonb),

('¿Puedo trabajar mientras estudio con beca?',
'Sí, puedes trabajar. La beca no tiene restricciones laborales. ⚖️ Asegúrate de mantener tu promedio. Dudas: becas@unc.edu.ve',
'becas',
ARRAY['trabajar', 'empleo', 'trabajo', 'laborar'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Hay beca de alimentación?',
'Sí, el comedor universitario ofrece **almuerzos subsidiados** a Bs. 5. 🍽️ Horario: 12pm-2pm. Ubicación: Edificio Central.',
'becas',
ARRAY['comedor', 'alimentacion', 'comida', 'almuerzo'],
'{"priority": "medium", "cta": "none"}'::jsonb),

('¿Ofrecen beca de transporte?',
'Sí, apoyo mensual de **$20-30** para transporte según necesidad. 🚌 Solicita: becas@unc.edu.ve',
'becas',
ARRAY['transporte', 'pasaje', 'traslado', 'movilizacion'],
'{"priority": "medium", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 3: VIDA UNIVERSITARIA (7 preguntas)
-- ============================================

('¿Tienen residencias estudiantiles?',
'No tenemos residencias en campus, pero te ayudamos a encontrar alojamiento cercano. 🏠 Contacta: servicios@unc.edu.ve',
'vida-universitaria',
ARRAY['residencias', 'alojamiento', 'dormitorios', 'vivienda'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Hay actividades deportivas?',
'¡Sí! Fútbol, basketball, volleyball y natación. Inscríbete en deportes@unc.edu.ve 🏃‍♂️ Horarios: lunes a viernes 4pm-6pm.',
'vida-universitaria',
ARRAY['deportes', 'actividades', 'ejercicio', 'recreacion'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Tienen club de robótica?',
'¡Sí! El club se reúne martes y jueves 3pm-5pm. 🤖 Únete: robotica@unc.edu.ve o síguenos en @uncrobotica',
'vida-universitaria',
ARRAY['robotica', 'club', 'tecnologia', 'proyectos'],
'{"priority": "medium", "cta": "social"}'::jsonb),

('¿Hay eventos culturales?',
'Organizamos conferencias, talleres y eventos mensuales. 🎭 Síguenos en @unc.oficial para no perderte nada.',
'vida-universitaria',
ARRAY['eventos', 'cultura', 'actividades', 'talleres'],
'{"priority": "medium", "cta": "social"}'::jsonb),

('¿Tienen biblioteca?',
'Sí, biblioteca con **10,000+ libros** y sala de estudio 24/7. 📚 Horario: lunes a domingo. Ubicación: Edificio A, piso 2.',
'vida-universitaria',
ARRAY['biblioteca', 'libros', 'estudiar', 'sala'],
'{"priority": "medium", "cta": "none"}'::jsonb),

('¿Hay WiFi en el campus?',
'Sí, WiFi gratuito en todo el campus. Red: **UNC-Estudiantes**. 📶 Problemas de conexión: soporte@unc.edu.ve',
'vida-universitaria',
ARRAY['wifi', 'internet', 'conexion', 'red'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Organizan viajes de estudio?',
'Sí, viajes nacionales e internacionales por carrera. 🌍 Costo promedio: $200-500. Info: intercambio@unc.edu.ve',
'vida-universitaria',
ARRAY['viajes', 'excursiones', 'salidas', 'intercambio'],
'{"priority": "low", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 4: ASPECTOS ACADÉMICOS (8 preguntas)
-- ============================================

('¿Cuántas materias veo por semestre?',
'Entre **5-7 materias** según la carrera y el semestre. Carga promedio: 18-22 créditos. 📖 Pensum: https://unc.edu.ve/pensum',
'academico',
ARRAY['materias', 'asignaturas', 'carga', 'semestre'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Qué horario tienen las clases?',
'Clases de **7am a 5pm**, lunes a viernes. Algunos labs hasta 7pm. ⏰ Horarios específicos: registro@unc.edu.ve',
'academico',
ARRAY['horario', 'clases', 'hora', 'cuando'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Hay clases los sábados?',
'No, solo lunes a viernes. Sábados y domingos el campus está abierto para biblioteca y labs. 📅 Horario especial: 8am-4pm.',
'academico',
ARRAY['sabado', 'fin de semana', 'domingo', 'horario'],
'{"priority": "medium", "cta": "none"}'::jsonb),

('¿Puedo adelantar materias?',
'Sí, si tienes promedio **≥16/20** puedes inscribir materias adelantadas. 🚀 Solicita: registro@unc.edu.ve',
'academico',
ARRAY['adelantar', 'avanzar', 'acelerar', 'rapido'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Qué pasa si repruebo una materia?',
'Puedes cursarla nuevamente el siguiente semestre. Máximo **2 reprobadas** por materia. 📉 Asesoría: academico@unc.edu.ve',
'academico',
ARRAY['reprobar', 'perder', 'raspar', 'aplazar'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Tienen tutorías?',
'Sí, tutorías gratuitas de lunes a jueves 4pm-6pm. 👨‍🏫 Agenda: tutorias@unc.edu.ve o Edificio B, piso 1.',
'academico',
ARRAY['tutorias', 'apoyo', 'ayuda', 'clases'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Puedo hacer pasantías?',
'Sí, desde 6to semestre. Duración: **3-6 meses**. 💼 Convenios con 50+ empresas. Info: pasantias@unc.edu.ve',
'academico',
ARRAY['pasantias', 'practicas', 'trabajo', 'empresas'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Ofrecen doble titulación?',
'Actualmente no, pero puedes hacer **certificaciones complementarias**. 🎓 Opciones: educacion-continua@unc.edu.ve',
'academico',
ARRAY['doble', 'dos carreras', 'titulacion', 'simultanea'],
'{"priority": "low", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 5: COSTOS Y PAGOS (6 preguntas)
-- ============================================

('¿Cuánto cuesta la matrícula?',
'La UNC es **pública y gratuita** para venezolanos. Solo pagas aranceles administrativos (~$10/semestre). 💵 Detalles: administracion@unc.edu.ve',
'costos',
ARRAY['costo', 'precio', 'matricula', 'pagar'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Aceptan pagos en dólares?',
'Sí, aceptamos **Bs, $, Zelle y PayPal**. 💳 Datos de pago: pagos@unc.edu.ve',
'costos',
ARRAY['dolares', 'pago', 'divisas', 'como pagar'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Hay plan de pagos?',
'Sí, puedes pagar en **2-3 cuotas** sin intereses. 📅 Solicita: administracion@unc.edu.ve',
'costos',
ARRAY['cuotas', 'plan', 'financiamiento', 'mensualidades'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Cuánto cuestan los libros?',
'Promedio **$50-100/semestre**. Biblioteca tiene copias disponibles. 📚 Lista por carrera: biblioteca@unc.edu.ve',
'costos',
ARRAY['libros', 'material', 'textos', 'bibliografia'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Cobran por certificados?',
'Sí, certificados cuestan **$5-15** según tipo. Listo en 3-5 días hábiles. 📄 Solicita: registro@unc.edu.ve',
'costos',
ARRAY['certificados', 'constancias', 'documentos', 'precio'],
'{"priority": "low", "cta": "email"}'::jsonb),

('¿Hay descuentos para hermanos?',
'Sí, **10% de descuento** en aranceles si tienes hermanos estudiando. 👥 Solicita: administracion@unc.edu.ve',
'costos',
ARRAY['descuento', 'hermanos', 'familia', 'rebaja'],
'{"priority": "low", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 6: CARRERAS ESPECÍFICAS (7 preguntas)
-- ============================================

('¿Biotecnología tiene salida laboral?',
'¡Sí! Industria farmacéutica, agroindustria y labs. Tasa de empleo: **85%** al graduarse. 💼 Testimonios: https://unc.edu.ve/egresados',
'carreras',
ARRAY['biotecnologia', 'trabajo', 'empleo', 'salida'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Ingeniería Química es muy difícil?',
'Es exigente pero manejable con dedicación. Tasa de graduación: **78%**. 💪 Tips de éxito: https://unc.edu.ve/consejos-ingenieria',
'carreras',
ARRAY['ingenieria quimica', 'dificil', 'exigente', 'nivel'],
'{"priority": "medium", "cta": "web"}'::jsonb),

('¿Qué hace un egresado de Neurociencia?',
'Investigación, hospitales, industria farmacéutica y docencia. Salario promedio: **$800-1500/mes**. 🧠 Más info: neurociencia@unc.edu.ve',
'carreras',
ARRAY['neurociencia', 'trabajo', 'que hace', 'campo'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Ciencias de la Computación incluye programación?',
'Sí, **60% del pensum** es programación práctica. Lenguajes: Python, Java, C++, JavaScript. 💻 Pensum: https://unc.edu.ve/pensum-computacion',
'carreras',
ARRAY['computacion', 'programacion', 'codigo', 'software'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Física tiene muchas matemáticas?',
'Sí, **8 materias** de matemáticas en la carrera. Necesitas base sólida en cálculo. 📐 Curso de nivelación: nivelacion@unc.edu.ve',
'carreras',
ARRAY['fisica', 'matematicas', 'calculo', 'nivel'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Puedo hacer investigación desde pregrado?',
'¡Sí! Desde 3er semestre puedes unirte a proyectos de investigación. 🔬 Oportunidades: investigacion@unc.edu.ve',
'carreras',
ARRAY['investigacion', 'proyectos', 'ciencia', 'laboratorio'],
'{"priority": "high", "cta": "email"}'::jsonb),

('¿Ofrecen prácticas internacionales?',
'Sí, convenios con universidades en USA, España y Brasil. 🌎 Requisitos: promedio ≥16/20. Info: internacional@unc.edu.ve',
'carreras',
ARRAY['internacional', 'extranjero', 'intercambio', 'practicas'],
'{"priority": "medium", "cta": "email"}'::jsonb),

-- ============================================
-- CONTEXTO 7: TECNOLOGÍA Y RECURSOS (7 preguntas)
-- ============================================

('¿Tienen laboratorios de última generación?',
'Sí, **15 labs especializados** con equipos 2020-2024. 🔬 Tour virtual: https://unc.edu.ve/labs',
'instalaciones',
ARRAY['laboratorios', 'equipos', 'tecnologia', 'instalaciones'],
'{"priority": "high", "cta": "web"}'::jsonb),

('¿Puedo usar los labs fuera de clase?',
'Sí, labs abiertos lunes a viernes 8am-8pm con supervisión. 🔓 Reserva: labs@unc.edu.ve',
'instalaciones',
ARRAY['laboratorios', 'acceso', 'horario', 'usar'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Tienen computadoras disponibles?',
'Sí, **200+ computadoras** en 5 salas. Horario: 7am-9pm. 💻 Ubicación: Edificio C, pisos 1-3.',
'instalaciones',
ARRAY['computadoras', 'pcs', 'equipos', 'salas'],
'{"priority": "medium", "cta": "none"}'::jsonb),

('¿Ofrecen software especializado?',
'Sí, licencias de MATLAB, AutoCAD, SolidWorks, y más. 📊 Lista completa: software@unc.edu.ve',
'instalaciones',
ARRAY['software', 'programas', 'licencias', 'herramientas'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Tienen impresoras 3D?',
'Sí, **5 impresoras 3D** disponibles para proyectos. Costo: $2-5 según tamaño. 🖨️ Reserva: fablab@unc.edu.ve',
'instalaciones',
ARRAY['impresora 3d', 'fabricacion', 'prototipo', 'maker'],
'{"priority": "medium", "cta": "email"}'::jsonb),

('¿Hay estacionamiento?',
'Sí, estacionamiento gratuito con **300 puestos**. Entrada por Av. Principal. 🚗 Seguridad 24/7.',
'instalaciones',
ARRAY['estacionamiento', 'parking', 'carro', 'vehiculo'],
'{"priority": "low", "cta": "none"}'::jsonb),

('¿Tienen cafetería?',
'Sí, 2 cafeterías con precios estudiantiles. ☕ Horario: 7am-6pm. Menú: https://unc.edu.ve/cafeteria',
'instalaciones',
ARRAY['cafeteria', 'comida', 'cafe', 'snacks'],
'{"priority": "low", "cta": "web"}'::jsonb);

-- ============================================
-- TOTAL: 57 FAQs AGREGADAS
-- ============================================

-- Verificar inserción
SELECT COUNT(*) as total_faqs_nuevas FROM faqs 
WHERE created_at > NOW() - INTERVAL '1 minute';

