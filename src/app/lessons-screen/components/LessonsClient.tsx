'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import NexusPanel from './NexusPanel';
import ChallengeQuestion from './ChallengeQuestion';
import LessonContent from './LessonContent';
import LessonProgress from './LessonProgress';
import LessonCompleteModal from './LessonCompleteModal';
import XPGainAnimation from './XPGainAnimation';
import {
  completeLesson,
  ensurePlayerProfile,
  getLevelStats,
  getTotalCompletedLessons,
  readPlayerProfile,
  updatePlayerProfile,
} from '@/lib/nexus-progress';
import { useSpeech } from '@/hooks/useSpeech';
import { useSound } from '@/hooks/useSound';

// ─── LESSON DATA ──────────────────────────────────────────────────────────────
// Backend integration: GET /api/lessons?kingdom=:id

const KINGDOMS = [
  { id: 'reino-tiempo', name: 'Reino del Tiempo', color: '#f5c842', icon: '⏳' },
  { id: 'reino-logica', name: 'Reino de la Lógica', color: '#00d4aa', icon: '🧮' },
  { id: 'reino-vida', name: 'Reino de la Vida', color: '#2ecc8b', icon: '🌿' },
  { id: 'reino-palabras', name: 'Reino de las Palabras', color: '#9333ea', icon: '📖' },
  { id: 'reino-cosmos-avanzado', name: 'Cosmos Avanzado', color: '#6366f1', icon: '🌌' },
];

const LESSONS_DATA = {
  'reino-tiempo': {
    kingdomName: 'Reino del Tiempo',
    kingdomColor: '245,200,66',
    accentColor: '#f5c842',
    lessons: [
      {
        id: 'lesson-historia-001',
        title: 'Los Aztecas: Señores del Quinto Sol',
        subtitle: 'Civilización Mesoamericana · Nivel 1',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'Los aztecas, también llamados mexicas, fueron una de las civilizaciones más poderosas de Mesoamérica. Fundaron Tenochtitlán en 1325 d.C. sobre un islote en el lago Texcoco, donde hoy se encuentra la Ciudad de México.',
          },
          {
            type: 'highlight' as const,
            label: '🌆 Tenochtitlán',
            content: 'Capital del Imperio Azteca. En su apogeo tenía entre 200,000 y 300,000 habitantes — más grande que cualquier ciudad europea de la época.',
            color: '245,200,66',
          },
          {
            type: 'timeline' as const,
            year: '1325',
            label: 'Fundación',
            content: 'Fundación de Tenochtitlán según la profecía del águila devorando una serpiente sobre un nopal.',
            color: '245,200,66',
          },
          {
            type: 'timeline' as const,
            year: '1428',
            label: 'Triple Alianza',
            content: 'Tenochtitlán, Texcoco y Tlacopan forman la Triple Alianza, base del dominio azteca sobre Mesoamérica.',
            color: '245,200,66',
          },
          {
            type: 'timeline' as const,
            year: '1521',
            label: 'Caída',
            content: 'Hernán Cortés y sus aliados tlaxcaltecas conquistan Tenochtitlán después de 80 días de sitio.',
            color: '232,93,47',
          },
          {
            type: 'fact' as const,
            content: 'Los aztecas inventaron el xocolatl (chocolate) y lo consumían como bebida sagrada de los dioses. También desarrollaron la chinampas — jardines flotantes que les permitían cultivar en el lago.',
          },
        ],
        questions: [
          {
            id: 'q-hist-001-1',
            question: '¿En qué año fue fundada Tenochtitlán, la capital del Imperio Azteca?',
            options: [
              { id: 'opt-a', text: '1200 d.C.', emoji: '🏛️' },
              { id: 'opt-b', text: '1325 d.C.', emoji: '🌆' },
              { id: 'opt-c', text: '1428 d.C.', emoji: '⚔️' },
              { id: 'opt-d', text: '1521 d.C.', emoji: '🔥' },
            ],
            correctId: 'opt-b',
            xp: 80,
            hint: 'Los aztecas siguieron una profecía que los guió a un lago. Fue antes del siglo XV.',
            nexusCorrect: '¡Exacto, guerrero! 1325 d.C. Los aztecas construyeron su ciudad sobre un lago siguiendo la señal del águila. Una hazaña de ingeniería sin igual.',
            nexusIncorrect: 'No es esa. Piénsalo bien: los aztecas fundaron su ciudad sobre un lago, siguiendo una profecía divina. ¿En qué siglo crees que fue?',
            fact: 'Tenochtitlán tenía acueductos, mercados y templos que dejaron boquiabiertos a los conquistadores españoles.',
          },
          {
            id: 'q-hist-001-2',
            question: '¿Cuál fue el nombre de la alianza política que consolidó el poder azteca en 1428?',
            options: [
              { id: 'opt-a', text: 'La Alianza del Jaguar', emoji: '🐆' },
              { id: 'opt-b', text: 'Triple Alianza', emoji: '🤝' },
              { id: 'opt-c', text: 'Confederación del Sol', emoji: '☀️' },
              { id: 'opt-d', text: 'Pacto de Tlatelolco', emoji: '📜' },
            ],
            correctId: 'opt-b',
            xp: 90,
            hint: 'Fueron tres ciudades las que se unieron: Tenochtitlán, Texcoco y Tlacopan.',
            nexusCorrect: '¡Bien hecho! La Triple Alianza fue el motor político del dominio azteca. Tres ciudades, una visión de poder. Así se construyen los imperios.',
            nexusIncorrect: 'Casi. Recuerda que fueron tres ciudades las que pactaron juntas: la capital azteca y dos aliados clave. ¿Cuántas son tres ciudades?',
            fact: 'La Triple Alianza controlaba un territorio de más de 200,000 km² y recaudaba tributo de más de 400 pueblos conquistados.',
          },
          {
            id: 'q-hist-001-3',
            question: '¿Qué alimento sagrado de los aztecas conocemos hoy como chocolate?',
            options: [
              { id: 'opt-a', text: 'Tlayuda', emoji: '🫓' },
              { id: 'opt-b', text: 'Xocolatl', emoji: '🍫' },
              { id: 'opt-c', text: 'Atole', emoji: '🥛' },
              { id: 'opt-d', text: 'Pozole', emoji: '🍲' },
            ],
            correctId: 'opt-b',
            xp: 70,
            hint: 'Su nombre en náhuatl significa "agua amarga". Era una bebida de dioses y guerreros.',
            nexusCorrect: '¡Claro que sí! El xocolatl era tan valioso que los granos de cacao se usaban como moneda. Literalmente, el dinero sabía a chocolate.',
            nexusIncorrect: 'No exactamente. Los aztecas tomaban una bebida de cacao amargo que hoy conocemos de otra forma. ¿Cuál palabra suena más a cacao?',
            fact: 'Los granos de cacao eran tan valiosos en el mundo azteca que se usaban como moneda para pagar tributos y comprar bienes.',
          },
        ],
      },
      {
        id: 'lesson-historia-002',
        title: 'La Conquista: Choque de Dos Mundos',
        subtitle: 'Siglo XVI · Nivel 2',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'En 1519, Hernán Cortés desembarcó en las costas de México con apenas 500 soldados. Lo que siguió fue uno de los eventos más complejos y trágicos de la historia humana: el encuentro entre dos civilizaciones que nunca se habían conocido.',
          },
          {
            type: 'highlight' as const,
            label: '⚔️ Alianzas Estratégicas',
            content: 'Cortés no conquistó solo. Se alió con los tlaxcaltecas, enemigos históricos de los aztecas, y con otros pueblos sometidos al imperio. Sin estos aliados indígenas, la conquista habría sido imposible.',
            color: '232,93,47',
          },
          {
            type: 'fact' as const,
            content: 'La Malinche (Malintzin) fue una mujer indígena que actuó como traductora e intérprete entre Cortés y Moctezuma. Su papel fue crucial en la conquista y hasta hoy es una figura histórica muy debatida en México.',
          },
        ],
        questions: [
          {
            id: 'q-hist-002-1',
            question: '¿En qué año llegó Hernán Cortés a las costas de México?',
            options: [
              { id: 'opt-a', text: '1492', emoji: '⛵' },
              { id: 'opt-b', text: '1510', emoji: '🗺️' },
              { id: 'opt-c', text: '1519', emoji: '⚔️' },
              { id: 'opt-d', text: '1521', emoji: '🏳️' },
            ],
            correctId: 'opt-c',
            xp: 85,
            hint: 'Fue dos años antes de la caída de Tenochtitlán en 1521.',
            nexusCorrect: '¡Correcto! 1519. Cortés llegó con 500 hombres a enfrentar un imperio de millones. La audacia a veces supera los números.',
            nexusIncorrect: 'No es esa fecha. Recuerda: la caída de Tenochtitlán fue en 1521. Cortés llegó dos años antes. ¿Cuánto es 1521 menos 2?',
            fact: 'Cortés quemó sus propias naves al llegar para que sus soldados no pudieran retroceder. Literalmente, no había vuelta atrás.',
          },
          {
            id: 'q-hist-002-2',
            question: '¿Qué pueblo indígena fue el principal aliado de Cortés contra los aztecas?',
            options: [
              { id: 'opt-a', text: 'Los mayas', emoji: '🌴' },
              { id: 'opt-b', text: 'Los totonacas', emoji: '🌿' },
              { id: 'opt-c', text: 'Los tlaxcaltecas', emoji: '⚔️' },
              { id: 'opt-d', text: 'Los zapotecas', emoji: '🏔️' },
            ],
            correctId: 'opt-c',
            xp: 95,
            hint: 'Eran los grandes rivales de los aztecas. Nunca habían sido conquistados por el Imperio.',
            nexusCorrect: '¡Exacto! Los tlaxcaltecas odiaban a los aztecas porque nunca pudieron conquistarlos. Cortés los convenció de unirse. La historia siempre es más compleja de lo que parece.',
            nexusIncorrect: 'No exactamente. Piensa: ¿quiénes tenían más razones para querer derrotar a los aztecas? Sus enemigos más antiguos e invictos.',
            fact: 'Los tlaxcaltecas aportaron más de 100,000 guerreros a la alianza con Cortés. Sin ellos, la conquista habría sido imposible.',
          },
        ],
      },
    ],
  },
  'reino-logica': {
    kingdomName: 'Reino de la Lógica',
    kingdomColor: '0,212,170',
    accentColor: '#00d4aa',
    lessons: [
      {
        id: 'lesson-mat-001',
        title: 'Álgebra: El Lenguaje del Universo',
        subtitle: 'Ecuaciones Lineales · Nivel 1',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'El álgebra es el lenguaje con el que el cosmos se comunica. Una ecuación no es solo matemáticas: es una descripción perfecta de cómo funciona el universo. Desde la trayectoria de los planetas hasta el movimiento de las partículas subatómicas.',
          },
          {
            type: 'highlight' as const,
            label: '⚖️ Principio de Equilibrio',
            content: 'Una ecuación es como una balanza: lo que haces en un lado, debes hacerlo en el otro. Si sumas 5 a la izquierda, sumas 5 a la derecha. El equilibrio es la ley suprema del álgebra.',
            color: '0,212,170',
          },
          {
            type: 'highlight' as const,
            label: '🔣 Pasos para resolver 3x + 7 = 22',
            content: 'Paso 1: Restar 7 a ambos lados → 3x = 15. Paso 2: Dividir ambos lados entre 3 → x = 5. ¡Listo! La incógnita queda revelada.',
            color: '46,204,139',
          },
          {
            type: 'fact' as const,
            content: 'La palabra "álgebra" viene del árabe "al-jabr", que significa "reunión de partes rotas". Fue desarrollada por el matemático persa Al-Juarismi en el siglo IX. Los mayas ya usaban el concepto del cero siglos antes que Europa.',
          },
        ],
        questions: [
          {
            id: 'q-mat-001-1',
            question: 'Si 3x + 7 = 22, ¿cuánto vale x?',
            options: [
              { id: 'opt-a', text: 'x = 3', emoji: '🔢' },
              { id: 'opt-b', text: 'x = 5', emoji: '⭐' },
              { id: 'opt-c', text: 'x = 7', emoji: '🌟' },
              { id: 'opt-d', text: 'x = 9', emoji: '💫' },
            ],
            correctId: 'opt-b',
            xp: 100,
            hint: 'Primero resta 7 de ambos lados. Luego divide entre 3. El universo siempre se equilibra.',
            nexusCorrect: '¡Perfecto! x = 5. Restaste 7 y dividiste entre 3. Eso es exactamente cómo el cosmos resuelve sus misterios: paso a paso, con lógica pura.',
            nexusIncorrect: 'Casi. Recuerda: primero despeja el término con x. Resta 7 de ambos lados: 3x = 15. Luego divide entre 3. ¿Cuánto es 15 entre 3?',
            fact: 'Las ecuaciones lineales describen desde la velocidad de los cohetes hasta el precio de los productos. El álgebra está en todo.',
          },
          {
            id: 'q-mat-001-2',
            question: '¿Cuál es el primer paso para resolver la ecuación 2x - 4 = 10?',
            options: [
              { id: 'opt-a', text: 'Dividir entre 2 ambos lados', emoji: '÷' },
              { id: 'opt-b', text: 'Sumar 4 a ambos lados', emoji: '+' },
              { id: 'opt-c', text: 'Restar 10 de ambos lados', emoji: '-' },
              { id: 'opt-d', text: 'Multiplicar por 2 ambos lados', emoji: '×' },
            ],
            correctId: 'opt-b',
            xp: 90,
            hint: 'Quieres dejar el término con x solo. Para eliminar el -4, ¿qué operación opuesta usarías?',
            nexusCorrect: '¡Exacto! Sumas 4 para cancelar el -4. La operación inversa es tu arma. Así obtienes 2x = 14, y luego x = 7. Elegante y poderoso.',
            nexusIncorrect: 'No es ese el primer paso. Recuerda: quieres aislar el 2x primero. El -4 está sumado (restado), así que la operación contraria sería...',
            fact: 'Al-Juarismi, el padre del álgebra, también le dio nombre a los "algoritmos" — la base de toda la computación moderna. Sin él, no existiría tu celular.',
          },
          {
            id: 'q-mat-001-3',
            question: 'Una nave espacial viaja a 5x km/h. Si recorre 200 km en 1 hora con x = 8, ¿cuántos km recorre en 3 horas?',
            options: [
              { id: 'opt-a', text: '120 km', emoji: '🚀' },
              { id: 'opt-b', text: '200 km', emoji: '🛸' },
              { id: 'opt-c', text: '480 km', emoji: '⭐' },
              { id: 'opt-d', text: '600 km', emoji: '🌌' },
            ],
            correctId: 'opt-a',
            xp: 120,
            hint: 'Primero calcula la velocidad: 5 × 8 = ? km/h. Luego multiplica por 3 horas.',
            nexusCorrect: '¡Increíble, guerrero! Velocidad = 5 × 8 = 40 km/h. En 3 horas: 40 × 3 = 120 km. ¡Exacto! El cosmos premia a quienes piensan paso a paso.',
            nexusIncorrect: 'Casi. Paso a paso: velocidad = 5 × 8 = 40 km/h. Distancia en 3 horas = 40 × 3. ¿Cuánto es 40 × 3?',
            fact: 'La NASA usa ecuaciones como esta todos los días para calcular trayectorias de cohetes y satélites. Tú acabas de hacer matemáticas espaciales.',
          },
        ],
      },
    ],
  },
  'reino-vida': {
    kingdomName: 'Reino de la Vida',
    kingdomColor: '46,204,139',
    accentColor: '#2ecc8b',
    lessons: [
      {
        id: 'lesson-bio-001',
        title: 'La Célula: Unidad de la Vida',
        subtitle: 'Biología · Nivel 1',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'La célula es la unidad básica y funcional de todos los seres vivos. Todo organismo, desde una bacteria microscópica hasta una ballena azul, está formado por células. Sin células, no existe la vida tal como la conocemos.',
          },
          {
            type: 'highlight' as const,
            label: '🔬 Tipos de célula',
            content: 'Procariota: sin núcleo definido (bacterias). Eucariota: con núcleo y organelos (animales, plantas, hongos). Todas comparten membrana plasmática, citoplasma y material genético.',
            color: '46,204,139',
          },
          {
            type: 'highlight' as const,
            label: '⚡ Mitocondria',
            content: 'Conocida como "la central eléctrica de la célula". Convierte glucosa en ATP (energía) mediante la respiración celular. Una célula muscular puede tener hasta 2,000 mitocondrias.',
            color: '46,204,139',
          },
          {
            type: 'fact' as const,
            content: 'El cuerpo humano contiene aproximadamente 37 billones de células. Si las pusieras en fila, darían la vuelta a la Tierra más de 200 veces.',
          },
        ],
        questions: [
          {
            id: 'q-bio-001-1',
            question: '¿Cuál es la unidad básica y funcional de todos los seres vivos?',
            options: [
              { id: 'opt-a', text: 'El átomo', emoji: '⚛️' },
              { id: 'opt-b', text: 'La célula', emoji: '🔬' },
              { id: 'opt-c', text: 'El tejido', emoji: '🧬' },
              { id: 'opt-d', text: 'El ADN', emoji: '🧪' },
            ],
            correctId: 'opt-b',
            xp: 80,
            hint: 'Toda la vida conocida está compuesta por esta estructura.',
            nexusCorrect: '¡Exacto, guerrero! La célula es el fundamento de toda forma de vida. Sin ella, no existiría nada vivo en el universo conocido.',
            nexusIncorrect: 'Casi, pero no. La célula es la unidad básica de la vida — no el átomo ni el tejido. Los tejidos están formados por células, no al revés.',
            fact: 'Robert Hooke observó la primera célula en 1665 usando un microscopio casero. La llamó "cellula" (habitación pequeña en latín) porque le recordó las celdas de un monasterio.',
          },
          {
            id: 'q-bio-001-2',
            question: '¿Cuál es la función principal de la mitocondria?',
            options: [
              { id: 'opt-a', text: 'Producir proteínas', emoji: '🏭' },
              { id: 'opt-b', text: 'Almacenar el ADN', emoji: '🗄️' },
              { id: 'opt-c', text: 'Producir energía (ATP)', emoji: '⚡' },
              { id: 'opt-d', text: 'Proteger la célula', emoji: '🛡️' },
            ],
            correctId: 'opt-c',
            xp: 90,
            hint: 'Su apodo es "la central eléctrica de la célula".',
            nexusCorrect: '¡Brillante! La mitocondria convierte glucosa en ATP mediante respiración celular. Es literalmente la fuente de energía de cada célula de tu cuerpo.',
            nexusIncorrect: 'No es correcto. La mitocondria produce energía en forma de ATP — no fabrica proteínas (eso lo hacen los ribosomas) ni almacena ADN.',
            fact: 'El ADN mitocondrial se hereda exclusivamente de la madre. Los científicos lo usan para rastrear linajes maternos a lo largo de miles de años de historia humana.',
          },
          {
            id: 'q-bio-001-3',
            question: '¿Qué diferencia a una célula eucariota de una procariota?',
            options: [
              { id: 'opt-a', text: 'El tamaño', emoji: '📏' },
              { id: 'opt-b', text: 'Tiene núcleo definido', emoji: '🔵' },
              { id: 'opt-c', text: 'Puede reproducirse', emoji: '🔄' },
              { id: 'opt-d', text: 'Tiene membrana', emoji: '🫧' },
            ],
            correctId: 'opt-b',
            xp: 100,
            hint: 'La clave está en dónde está guardado el material genético.',
            nexusCorrect: '¡Perfecto! La célula eucariota tiene núcleo delimitado por una membrana nuclear, donde se almacena el ADN. Las procariotas no tienen núcleo definido.',
            nexusIncorrect: 'La característica definitoria es el núcleo. "Eu-karyon" en griego significa "núcleo verdadero". Las bacterias son procariotas: sin núcleo definido.',
            fact: 'Las células eucariotas surgieron hace aproximadamente 2,000 millones de años. Antes solo existían procariotas. Esta transición fue uno de los saltos evolutivos más importantes de la historia de la vida.',
          },
        ],
      },
    ],
  },

  'reino-palabras': {
    kingdomName: 'Reino de las Palabras',
    kingdomColor: '147,51,234',
    accentColor: '#9333ea',
    lessons: [
      {
        id: 'lesson-esp-001',
        title: 'La Oración: Estructura del Lenguaje',
        subtitle: 'Español · Nivel 1',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'Una oración es un conjunto de palabras con sentido completo que expresa una idea. Toda oración tiene al menos dos partes fundamentales: el sujeto (quién realiza la acción) y el predicado (qué hace o qué se dice del sujeto).',
          },
          {
            type: 'highlight' as const,
            label: '👤 Sujeto',
            content: 'Es el ser del que se habla en la oración. Puede ser una persona, animal, cosa o idea. Ejemplo: "Los estudiantes" estudian toda la noche.',
            color: '147,51,234',
          },
          {
            type: 'highlight' as const,
            label: '📢 Predicado',
            content: 'Es lo que se dice del sujeto. Incluye el verbo y sus complementos. Ejemplo: Los estudiantes "estudian toda la noche".',
            color: '147,51,234',
          },
          {
            type: 'highlight' as const,
            label: '⚡ Núcleo del predicado',
            content: 'El verbo es el corazón del predicado. Sin verbo no hay oración completa. "El sol" no es oración. "El sol brilla" sí lo es.',
            color: '147,51,234',
          },
          {
            type: 'fact' as const,
            content: 'El español tiene más de 500 millones de hablantes nativos. Es el segundo idioma más hablado del mundo por número de nativos, solo después del chino mandarín.',
          },
        ],
        questions: [
          {
            id: 'q-esp-001-1',
            question: 'En la oración "Los niños juegan en el parque", ¿cuál es el sujeto?',
            options: [
              { id: 'opt-a', text: 'juegan en el parque', emoji: '🏃' },
              { id: 'opt-b', text: 'Los niños', emoji: '👦' },
              { id: 'opt-c', text: 'el parque', emoji: '🌳' },
              { id: 'opt-d', text: 'juegan', emoji: '⚽' },
            ],
            correctId: 'opt-b',
            xp: 80,
            hint: 'El sujeto responde a la pregunta: ¿quién realiza la acción?',
            nexusCorrect: '¡Correcto, guerrero! "Los niños" es el sujeto porque responde a ¿quiénes juegan? El predicado es todo lo demás: "juegan en el parque".',
            nexusIncorrect: 'No exactamente. El sujeto es quien realiza la acción. Pregúntate: ¿quién juega? → "Los niños". Esa es tu respuesta.',
            fact: 'En español, el sujeto puede estar implícito (tácito). "Corremos todos los días" no menciona el sujeto, pero sabemos que es "nosotros" por la conjugación del verbo.',
          },
          {
            id: 'q-esp-001-2',
            question: '¿Cuál de las siguientes es una oración completa y correcta?',
            options: [
              { id: 'opt-a', text: 'La lluvia intensa', emoji: '🌧️' },
              { id: 'opt-b', text: 'Corriendo muy rápido', emoji: '🏃' },
              { id: 'opt-c', text: 'El viento sopla fuerte', emoji: '💨' },
              { id: 'opt-d', text: 'Muchas flores rojas', emoji: '🌹' },
            ],
            correctId: 'opt-c',
            xp: 90,
            hint: 'Una oración completa necesita sujeto y predicado con verbo conjugado.',
            nexusCorrect: '¡Perfecto! "El viento sopla fuerte" tiene sujeto (el viento) y predicado con verbo conjugado (sopla). Las demás opciones carecen de verbo conjugado.',
            nexusIncorrect: 'Recuerda: una oración completa necesita un verbo conjugado. "La lluvia intensa", "corriendo muy rápido" y "muchas flores rojas" no tienen verbo conjugado.',
            fact: 'La oración más corta del español es también la más poderosa. "Sé." (del verbo ser) es una oración completa con sujeto tácito "yo" y verbo conjugado.',
          },
          {
            id: 'q-esp-001-3',
            question: '¿Qué tipo de oración es: "¿Dónde está mi libro?"',
            options: [
              { id: 'opt-a', text: 'Exclamativa', emoji: '❗' },
              { id: 'opt-b', text: 'Imperativa', emoji: '👉' },
              { id: 'opt-c', text: 'Interrogativa', emoji: '❓' },
              { id: 'opt-d', text: 'Declarativa', emoji: '📢' },
            ],
            correctId: 'opt-c',
            xp: 85,
            hint: 'Observa los signos de puntuación que rodean la oración.',
            nexusCorrect: '¡Exacto! Es una oración interrogativa porque formula una pregunta. Se escribe entre signos de interrogación (¿) y expresa duda o petición de información.',
            nexusIncorrect: 'Los signos de interrogación (¿) son la clave. Esta oración pregunta algo, por lo tanto es interrogativa. No confundas con exclamativa (¡!) ni imperativa (órdenes).',
            fact: 'El español es el único idioma del mundo que usa signos de apertura de interrogación (¿) y exclamación (¡). Esta convención fue establecida por la Real Academia Española en 1754.',
          },
        ],
      },
    ],
  },

  'reino-cosmos-avanzado': {
    kingdomName: 'Cosmos Avanzado',
    kingdomColor: '99,102,241',
    accentColor: '#6366f1',
    lessons: [
      {
        id: 'lesson-cosmos-001',
        title: 'El Sistema Solar: Nuestro Vecindario Cósmico',
        subtitle: 'Ciencias · Nivel 2',
        contentBlocks: [
          {
            type: 'text' as const,
            content: 'El Sistema Solar está formado por el Sol y todos los cuerpos celestes que orbitan a su alrededor: 8 planetas, planetas enanos, lunas, asteroides y cometas. Tiene aproximadamente 4,600 millones de años de antigüedad.',
          },
          {
            type: 'highlight' as const,
            label: '☀️ El Sol',
            content: 'Contiene el 99.86% de toda la masa del Sistema Solar. Su temperatura superficial es de 5,500 °C, pero su núcleo alcanza los 15 millones de °C donde ocurre la fusión nuclear.',
            color: '99,102,241',
          },
          {
            type: 'timeline' as const,
            year: 'Mercurio',
            label: 'Más cercano',
            content: 'El planeta más pequeño y más cercano al Sol. Un año en Mercurio dura solo 88 días terrestres.',
            color: '99,102,241',
          },
          {
            type: 'timeline' as const,
            year: 'Tierra',
            label: '3er planeta',
            content: 'El único planeta conocido con vida. Tiene un satélite natural: la Luna, que estabiliza la inclinación axial de la Tierra.',
            color: '99,102,241',
          },
          {
            type: 'timeline' as const,
            year: 'Neptuno',
            label: 'Más lejano',
            content: 'El planeta más alejado del Sol. Tarda 165 años terrestres en completar una órbita. Sus vientos alcanzan 2,100 km/h — los más rápidos del Sistema Solar.',
            color: '99,102,241',
          },
          {
            type: 'fact' as const,
            content: 'Si el Sol fuera del tamaño de una pelota de playa, la Tierra sería del tamaño de un guisante situado a 26 metros de distancia. Neptuno estaría a más de 800 metros.',
          },
        ],
        questions: [
          {
            id: 'q-cosmos-001-1',
            question: '¿Cuántos planetas tiene el Sistema Solar actualmente reconocidos por la UAI?',
            options: [
              { id: 'opt-a', text: '7 planetas', emoji: '🌍' },
              { id: 'opt-b', text: '9 planetas', emoji: '🪐' },
              { id: 'opt-c', text: '8 planetas', emoji: '🌌' },
              { id: 'opt-d', text: '10 planetas', emoji: '⭐' },
            ],
            correctId: 'opt-c',
            xp: 90,
            hint: 'En 2006, un planeta conocido fue reclasificado como planeta enano.',
            nexusCorrect: '¡Correcto! Son 8 planetas desde 2006, cuando la UAI (Unión Astronómica Internacional) reclasificó a Plutón como planeta enano. Los 8 son: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.',
            nexusIncorrect: 'La respuesta es 8. En 2006 Plutón fue reclasificado como planeta enano. La Unión Astronómica Internacional definió que un planeta debe limpiar su órbita de otros cuerpos, lo cual Plutón no hace.',
            fact: 'La discusión sobre si Plutón es planeta sigue activa. Algunos científicos proponen una nueva definición que podría devolver a Plutón la categoría de planeta e incluir decenas de otros cuerpos celestes.',
          },
          {
            id: 'q-cosmos-001-2',
            question: '¿Qué planeta es conocido como "El Planeta Rojo"?',
            options: [
              { id: 'opt-a', text: 'Júpiter', emoji: '🪐' },
              { id: 'opt-b', text: 'Saturno', emoji: '💍' },
              { id: 'opt-c', text: 'Marte', emoji: '🔴' },
              { id: 'opt-d', text: 'Venus', emoji: '☁️' },
            ],
            correctId: 'opt-c',
            xp: 80,
            hint: 'Su color se debe al óxido de hierro en su superficie.',
            nexusCorrect: '¡Exacto! Marte es rojo porque su superficie está cubierta de óxido de hierro — básicamente, está cubierto de óxido. Es el planeta más similar a la Tierra y el destino favorito para la exploración humana.',
            nexusIncorrect: 'Es Marte. Su color rojizo viene del óxido de hierro (herrumbre) que cubre su superficie. La NASA ya ha enviado múltiples rovers a explorar sus llanuras y cráteres.',
            fact: 'El monte Olimpo en Marte es el volcán más grande del Sistema Solar: 22 km de altura (3 veces el Everest) y 600 km de diámetro — casi tan grande como Francia.',
          },
          {
            id: 'q-cosmos-001-3',
            question: '¿Cuánto tiempo tarda la luz del Sol en llegar a la Tierra?',
            options: [
              { id: 'opt-a', text: '1 segundo', emoji: '⚡' },
              { id: 'opt-b', text: '8 minutos aproximadamente', emoji: '☀️' },
              { id: 'opt-c', text: '1 hora', emoji: '⏰' },
              { id: 'opt-d', text: '1 día', emoji: '📅' },
            ],
            correctId: 'opt-b',
            xp: 100,
            hint: 'La luz viaja a 300,000 km/s y la Tierra está a 150 millones de km del Sol.',
            nexusCorrect: '¡Brillante! La luz tarda exactamente 8 minutos y 20 segundos en recorrer los 150 millones de km que nos separan del Sol. Esto significa que el Sol que vemos ahora es como era hace 8 minutos.',
            nexusIncorrect: 'Son aproximadamente 8 minutos. La distancia Tierra-Sol es 150 millones de km, y la luz viaja a 300,000 km/s. Dividiendo: 150,000,000 ÷ 300,000 = 500 segundos ≈ 8 min 20 seg.',
            fact: 'La luz que ves salir de las estrellas por la noche pudo haber salido hace cientos o miles de años. Algunas estrellas que observas en el cielo ya no existen — solo vemos su luz "fantasma" viajando por el espacio.',
          },
        ],
      },
    ],
  },
};

type NexusMood = 'neutral' | 'correct' | 'incorrect' | 'teaching' | 'challenge';

interface QuestionState {
  answered: boolean;
  selectedId: string | null;
  isCorrect: boolean | null;
}

export default function LessonsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { speak, stop } = useSpeech({ rate: 0.9, pitch: 0.85, lang: 'es-MX' });
  const { play } = useSound();
  const kingdomParam = searchParams.get('kingdom') || 'reino-tiempo';
  const challengeParam = searchParams.get('challenge');

  const kingdomData = LESSONS_DATA[kingdomParam as keyof typeof LESSONS_DATA] ?? null;
  const lessons = kingdomData?.lessons ?? [];

  const [lessonIndex, setLessonIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [phase, setPhase] = useState<'content' | 'challenge'>('content');
  const [questionState, setQuestionState] = useState<QuestionState>({ answered: false, selectedId: null, isCorrect: null });
  const [nexusMood, setNexusMood] = useState<NexusMood>('teaching');
  const [nexusMessage, setNexusMessage] = useState('');
  const [nexusFact, setNexusFact] = useState<string | undefined>(undefined);
  const [totalXP, setTotalXP] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showXPAnim, setShowXPAnim] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [xpAnimKey, setXPAnimKey] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevelReached, setNewLevelReached] = useState(1);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);

  useEffect(() => {
    const profile = readPlayerProfile() ?? ensurePlayerProfile();
    setTotalXP(profile.xp);
    setPlayerLevel(getLevelStats(profile.xp).level);
    setCompletedLessonsCount(getTotalCompletedLessons(profile));
  }, []);

  const currentLesson = lessons[lessonIndex];
  const currentQuestion = currentLesson?.questions[questionIndex];
  const totalQuestions = currentLesson?.questions.length || 0;

  const getInitialNexusMessage = useCallback(() => {
    const msgs = [
      `Guerrero, prepárate. Hoy dominarás "${currentLesson?.title}". El conocimiento es el arma más poderosa del cosmos.`,
      `El universo ha guardado este secreto por siglos. Hoy tú lo descubrirás. Estudia bien cada detalle.`,
      `No te distraigas. Cada palabra en esta lección es una pieza del rompecabezas cósmico. ¿Listo?`,
    ];
    return msgs[lessonIndex % msgs.length];
  }, [currentLesson?.title, lessonIndex]);

  useEffect(() => {
    setNexusMood('teaching');
    setNexusMessage(
      challengeParam
        ? 'Reto diario activado. Puedes ir directo al desafío o repasar la lección antes de responder.'
        : getInitialNexusMessage()
    );
    setNexusFact(undefined);
    setPhase(challengeParam ? 'challenge' : 'content');
    setQuestionIndex(0);
    setQuestionState({ answered: false, selectedId: null, isCorrect: null });
    setCorrectCount(0);
    setSessionXP(0);
  }, [challengeParam, lessonIndex, getInitialNexusMessage]);

  const handleStartChallenge = () => {
    setPhase('challenge');
    setNexusMood('challenge');
    setNexusMessage(`¡Ahora demuestra lo que aprendiste! Pregunta ${questionIndex + 1} de ${totalQuestions}. Piensa antes de responder — los guerreros no se apresuran.`);
    setNexusFact(undefined);
    // Auto-read first question with slight delay
    setTimeout(() => {
      if (currentLesson?.questions[0]) {
        speak(currentLesson.questions[0].question);
      }
    }, 600);
  };

  const handleAnswer = (isCorrect: boolean, optionId: string) => {
    if (!currentQuestion) return;

    setQuestionState({ answered: true, selectedId: optionId, isCorrect });

    if (isCorrect) {
      const xpGained = currentQuestion.xp;
      // FIX: Atomic update — reads freshest profile, adds XP, saves in one call.
      // Prevents race conditions from stale in-memory values.
      const prevProfile = readPlayerProfile() ?? ensurePlayerProfile();
      const prevLevel = getLevelStats(prevProfile.xp).level;
      const nextProfile = updatePlayerProfile((p) => ({ xp: p.xp + xpGained }));
      const nextLevel = getLevelStats(nextProfile.xp).level;
      setTotalXP(nextProfile.xp);
      setPlayerLevel(nextLevel);
      if (nextLevel > prevLevel) {
        setNewLevelReached(nextLevel);
        setTimeout(() => { setShowLevelUp(true); play('levelup'); }, 900);
      }
      setSessionXP((prev) => prev + xpGained);
      setCorrectCount((prev) => prev + 1);
      play('correct');
      setNexusMood('correct');
      setNexusMessage(currentQuestion.nexusCorrect);
      setNexusFact(currentQuestion.fact);
      setXPAnimKey((k) => k + 1);
      setShowXPAnim(true);
      setTimeout(() => setShowXPAnim(false), 1500);
      toast.success(`+${xpGained} XP ⚡ ¡Respuesta correcta!`);
    } else {
      play('incorrect');
      setNexusMood('incorrect');
      setNexusMessage(currentQuestion.nexusIncorrect);
      setNexusFact(undefined);
      toast.error('❌ Incorrecto — NEXUS te explica el error abajo');
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < totalQuestions) {
      const nextIdx = questionIndex + 1;
      setQuestionIndex(nextIdx);
      setQuestionState({ answered: false, selectedId: null, isCorrect: null });
      setNexusMood('challenge');
      setNexusMessage(`Pregunta ${nextIdx + 1} de ${totalQuestions}. Mantén el enfoque. El cosmos observa cada decisión.`);
      setNexusFact(undefined);
      // Auto-read next question
      setTimeout(() => {
        if (currentLesson?.questions[nextIdx]) {
          speak(currentLesson.questions[nextIdx].question);
        }
      }, 400);
    } else {
      if (currentLesson) {
        // FIX: completeLesson now reads the freshest profile internally and
        // awards LESSON_REWARD_XP only if not already completed.
        const currentProfile = readPlayerProfile() ?? ensurePlayerProfile();
        const updatedProfile = completeLesson(
          currentProfile,
          kingdomParam,
          currentLesson.id
        );
        setCompletedLessonsCount(getTotalCompletedLessons(updatedProfile));
        // Sync XP and level from the saved profile (includes bonus XP)
        setTotalXP(updatedProfile.xp);
        setPlayerLevel(getLevelStats(updatedProfile.xp).level);
      }
      play('complete');
      setShowComplete(true);
    }
  };

  const handleNextLesson = () => {
    setShowComplete(false);
    if (lessonIndex + 1 < lessons.length) {
      setLessonIndex((prev) => prev + 1);
    } else {
      toast.success('🏆 ¡Has completado todas las lecciones de este reino!');
      router.push('/kingdom-map-screen');
    }
  };


  // ── No data for this kingdom yet ──────────────────────────────────────────
  if (!kingdomData) {
    const kingdomMeta = KINGDOMS.find((k) => k.id === kingdomParam);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center" style={{ gap: '1.5rem' }}>
        <div style={{ fontSize: '4rem' }}>{kingdomMeta?.icon ?? '🔒'}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] mb-2" style={{ color: kingdomMeta?.color ?? '#6060aa' }}>
            {kingdomMeta?.name ?? 'Reino desconocido'}
          </p>
          <h2 className="text-2xl font-bold mb-3" style={{ color: '#f0f0ff' }}>
            Este reino aún está en desarrollo
          </h2>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#8080bb' }}>
            Las lecciones de este reino están siendo forjadas por los dioses del cosmos.
            Vuelve pronto para desbloquear este conocimiento.
          </p>
        </div>
        <button
          onClick={() => router.push('/kingdom-map-screen')}
          className="btn-cosmic px-6 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: `linear-gradient(135deg, ${kingdomMeta?.color ?? '#6060aa'} 0%, rgba(17,17,40,0.9) 100%)`,
            color: '#0a0a1a',
            boxShadow: `0 0 24px ${kingdomMeta?.color ?? '#6060aa'}55`,
          }}
        >
          ← Volver al mapa
        </button>
      </div>
    );
  }

  return (
    <>
      <XPGainAnimation
        key={xpAnimKey}
        xp={currentQuestion?.xp || 0}
        visible={showXPAnim}
      />

      <LessonCompleteModal
        visible={showComplete}
        xpEarned={sessionXP}
        correctAnswers={correctCount}
        totalQuestions={totalQuestions}
        lessonTitle={currentLesson?.title || ''}
        level={playerLevel}
        hasNextLesson={lessonIndex + 1 < lessons.length}
        onClose={handleNextLesson}
      />

      {/* Top bar */}
      <div className="px-4 pt-4 pb-2 md:px-6">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back */}
          <button
            onClick={() => router.push('/kingdom-map-screen')}
            className="btn-cosmic flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: 'rgba(17,17,40,0.8)',
              border: '1px solid #2a2a5a',
              color: '#a0a0cc',
            }}
          >
            <span>←</span>
            <span className="hidden sm:inline">Mapa</span>
          </button>

          {/* Kingdom label */}
          <div
            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
            style={{
              background: `rgba(${kingdomData.kingdomColor},0.1)`,
              border: `1px solid rgba(${kingdomData.kingdomColor},0.3)`,
              color: kingdomData.accentColor,
            }}
          >
            {kingdomData.kingdomName}
          </div>

          {/* XP display */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: 'rgba(245,200,66,0.08)',
              border: '1px solid rgba(245,200,66,0.2)',
            }}
          >
            <span className="text-sm">⚡</span>
            <span className="xp-font text-sm font-bold" style={{ color: '#f5c842' }}>
              {totalXP.toLocaleString('es-MX')} XP
            </span>
          </div>
          <div
            className="rounded-xl px-3 py-2 text-xs font-semibold"
            style={{
              background: 'rgba(0,212,170,0.08)',
              border: '1px solid rgba(0,212,170,0.2)',
              color: '#00d4aa',
            }}
          >
            Nivel {playerLevel}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 md:px-6 mb-4">
        <div className="max-w-screen-2xl mx-auto">
          <LessonProgress
            current={phase === 'content' ? 0 : questionState.answered ? questionIndex + 1 : questionIndex}
            total={totalQuestions}
            xpEarned={sessionXP}
            lessonTitle={currentLesson?.title || ''}
            kingdom={currentLesson?.subtitle || ''}
            kingdomColor={kingdomData.kingdomColor}
            phase={phase}
            level={playerLevel}
            completedLessons={completedLessonsCount}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-6 md:px-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT — NEXUS Panel */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div
                className="rounded-2xl p-5 sticky top-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,40,0.95) 0%, rgba(10,10,26,0.9) 100%)',
                  border: '1px solid rgba(42,42,90,0.8)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <NexusPanel
                  message={nexusMessage}
                  mood={nexusMood}
                  fact={nexusFact}
                />

                {/* Lesson selector */}
                {lessons.length > 1 && (
                  <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e1e40' }}>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#6060aa' }}>
                      LECCIONES
                    </p>
                    <div className="space-y-1.5">
                      {lessons.map((lesson, idx) => (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (idx <= lessonIndex || idx === 0) {
                              setLessonIndex(idx);
                            } else {
                              toast.error('Completa la lección anterior primero');
                            }
                          }}
                          className="btn-cosmic w-full text-left px-3 py-2 rounded-xl text-xs transition-all duration-200"
                          style={{
                            background: idx === lessonIndex
                              ? `rgba(${kingdomData.kingdomColor},0.12)`
                              : 'rgba(17,17,40,0.6)',
                            border: `1px solid ${idx === lessonIndex ? `rgba(${kingdomData.kingdomColor},0.4)` : '#1e1e40'}`,
                            color: idx === lessonIndex ? kingdomData.accentColor : '#6060aa',
                            opacity: idx > lessonIndex ? 0.5 : 1,
                          }}
                        >
                          <span className="mr-1.5">{idx < lessonIndex ? '✓' : idx === lessonIndex ? '▶' : '🔒'}</span>
                          {lesson.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Content or Challenge */}
            <div className="flex-1 min-w-0">
              {phase === 'content' ? (
                <div className="space-y-5 animate-slide-right">
                  {challengeParam && (
                    <div
                      className="rounded-2xl p-4"
                      style={{
                        background: 'rgba(245,200,66,0.08)',
                        border: '1px solid rgba(245,200,66,0.22)',
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: '#f5c842' }}>
                        Reto diario activo
                      </p>
                      <p className="mt-1 text-sm" style={{ color: '#d7d0ee' }}>
                        Puedes repasar esta lección o entrar directo al desafío para sumar XP de inmediato.
                      </p>
                    </div>
                  )}

                  <LessonContent
                    title={currentLesson?.title || ''}
                    subtitle={currentLesson?.subtitle || ''}
                    blocks={currentLesson?.contentBlocks || []}
                    kingdomColor={kingdomData.kingdomColor}
                  />

                  {/* Start challenge CTA */}
                  <div
                    className="rounded-2xl p-5 text-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(${kingdomData.kingdomColor},0.08) 0%, rgba(17,17,40,0.95) 100%)`,
                      border: `1px solid rgba(${kingdomData.kingdomColor},0.25)`,
                    }}
                  >
                    <p className="text-sm mb-1" style={{ color: '#8080bb' }}>
                      ¿Listo para demostrar lo que aprendiste?
                    </p>
                    <p className="text-xs mb-4" style={{ color: '#5050aa' }}>
                      {totalQuestions} preguntas · hasta +{currentLesson?.questions.reduce((sum, q) => sum + q.xp, 0)} XP
                    </p>
                    <button
                      onClick={handleStartChallenge}
                      className="btn-cosmic px-8 py-4 rounded-2xl font-bold text-base inline-flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${kingdomData.accentColor} 0%, rgba(${kingdomData.kingdomColor},0.7) 100%)`,
                        color: '#0a0a1a',
                        boxShadow: `0 0 30px rgba(${kingdomData.kingdomColor},0.3)`,
                      }}
                    >
                      ⚔️ ¡Iniciar Reto!
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-slide-right">
                  {/* Challenge header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      background: 'rgba(17,17,40,0.7)',
                      border: '1px solid #1e1e40',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚔️</span>
                      <span className="text-sm font-semibold" style={{ color: '#a0a0cc' }}>
                        Reto {questionIndex + 1} de {totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {currentLesson?.questions.map((_, qi) => (
                        <div
                          key={`qi-dot-${qi}`}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: qi === questionIndex ? 20 : 8,
                            height: 8,
                            background: qi < questionIndex
                              ? kingdomData.accentColor
                              : qi === questionIndex
                              ? `rgba(${kingdomData.kingdomColor},0.5)`
                              : '#1e1e40',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {currentQuestion && (
                    <ChallengeQuestion
                      question={currentQuestion.question}
                      options={currentQuestion.options}
                      correctId={currentQuestion.correctId}
                      onAnswer={handleAnswer}
                      answered={questionState.answered}
                      selectedId={questionState.selectedId}
                      hint={currentQuestion.hint}
                      kingdomColor={kingdomData.kingdomColor}
                    />
                  )}

                  {/* Post-answer feedback */}
                  {questionState.answered && (
                    <div className="animate-slide-up space-y-4">
                      {/* Result banner */}
                      <div
                        className="rounded-2xl p-4 flex items-center gap-4"
                        style={{
                          background: questionState.isCorrect
                            ? 'rgba(46,204,139,0.1)'
                            : 'rgba(232,93,47,0.1)',
                          border: `1px solid ${questionState.isCorrect ? 'rgba(46,204,139,0.4)' : 'rgba(232,93,47,0.4)'}`,
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                          style={{
                            background: questionState.isCorrect
                              ? 'rgba(46,204,139,0.2)'
                              : 'rgba(232,93,47,0.2)',
                          }}
                        >
                          {questionState.isCorrect ? '✨' : '💥'}
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-bold text-sm"
                            style={{ color: questionState.isCorrect ? '#2ecc8b' : '#e85d2f' }}
                          >
                            {questionState.isCorrect ? '¡Respuesta Correcta!' : 'No fue esa…'}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#8080bb' }}>
                            {questionState.isCorrect
                              ? `+${currentQuestion?.xp} XP añadidos a tu poder cósmico`
                              : 'Lee la explicación de NEXUS y aprende del error'}
                          </p>
                        </div>
                        {questionState.isCorrect && (
                          <div
                            className="xp-font font-bold text-lg flex-shrink-0"
                            style={{ color: '#f5c842' }}
                          >
                            +{currentQuestion?.xp}
                          </div>
                        )}
                      </div>

                      {/* Next button */}
                      <button
                        onClick={handleNextQuestion}
                        className="btn-cosmic w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
                        style={{
                          background: `linear-gradient(135deg, ${kingdomData.accentColor} 0%, rgba(${kingdomData.kingdomColor},0.7) 100%)`,
                          color: '#0a0a1a',
                          boxShadow: `0 0 20px rgba(${kingdomData.kingdomColor},0.3)`,
                        }}
                      >
                        {questionIndex + 1 < totalQuestions ? (
                          <>Siguiente Pregunta →</>
                        ) : (
                          <>🏆 Ver Resultados</>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Back to content */}
                  {!questionState.answered && (
                    <button
                      onClick={() => setPhase('content')}
                      className="w-full py-2 text-xs transition-colors"
                      style={{ color: '#4040aa' }}
                    >
                      ← Revisar la lección
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Level Up Modal ─────────────────────────────────────────────── */}
      {showLevelUp && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(5,5,15,0.85)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setShowLevelUp(false)}
        >
          <div
            style={{
              background: 'radial-gradient(ellipse at 50% 20%, #1a1a3e 0%, #0d0d22 100%)',
              border: '1px solid rgba(245,200,66,0.5)',
              borderRadius: 24,
              padding: '3rem 3.5rem',
              textAlign: 'center',
              boxShadow: '0 0 80px rgba(245,200,66,0.25)',
              animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
              maxWidth: 380,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'float 2s ease-in-out infinite' }}>⚡</div>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: '#f5c842', marginBottom: '0.5rem', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
              ¡Subiste de nivel!
            </p>
            <h2 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, margin: '0 0 0.5rem', background: 'linear-gradient(135deg,#f5c842,#ff9f43)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: 'DM Sans, sans-serif' }}>
              {newLevelReached}
            </h2>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f0ff', marginBottom: '0.25rem', fontFamily: 'DM Sans, sans-serif' }}>
              Nivel {newLevelReached} alcanzado
            </p>
            <p style={{ fontSize: '0.875rem', color: '#8080bb', marginBottom: '2rem', fontFamily: 'DM Sans, sans-serif' }}>
              El cosmos reconoce tu esfuerzo, guerrero. Nuevos reinos se abren ante ti.
            </p>
            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              {['★','★','★'].map((s, i) => (
                <span key={i} style={{ fontSize: '2rem', color: '#f5c842', animation: `starPop 0.4s ${i * 0.15}s both`, display: 'inline-block' }}>{s}</span>
              ))}
            </div>
            <button
              onClick={() => setShowLevelUp(false)}
              style={{
                padding: '0.875rem 2.5rem', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg,#f5c842,#e08b00)',
                color: '#0a0a1a', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 0 30px rgba(245,200,66,0.4)',
              }}
            >
              ¡Continuar! 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}
