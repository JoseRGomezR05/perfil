/* ═══════════════════════════════════════════════
   PLACA MÉDICA DE EMERGENCIA — script.js
   Funciones: edad, idioma, ubicación, toast
   ═══════════════════════════════════════════════ */

/* ── CALCULAR EDAD AUTOMÁTICAMENTE ── */
function calcularEdad() {
  const nacimiento = new Date("1992-12-05"); // ← Cambia esta fecha
  const hoy        = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const meses = hoy.getMonth() - nacimiento.getMonth();

  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  const el = document.getElementById("edad");
  if (el) el.textContent = edad;
}

/* ── ENVIAR UBICACIÓN AL CONTACTO ── */
function sendLocation() {
  const btn = document.getElementById("loc_btn");

  if (!navigator.geolocation) {
    showToast("Geolocalización no disponible en este dispositivo", true);
    return;
  }

  // Feedback visual mientras obtiene ubicación
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Buscando...</span>';
    btn.disabled = true;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat  = position.coords.latitude;
      const lon  = position.coords.longitude;
      const maps = "https://www.google.com/maps?q=" + lat + "," + lon;

      // Intentar compartir con Web Share API (celulares)
      if (navigator.share) {
        navigator.share({
          title: "📍 Ubicación de emergencia — José Rafael Gómez",
          text:  "⚕ EMERGENCIA MÉDICA — Ubicación del paciente:",
          url:   maps
        }).then(() => {
          showToast("✓ Ubicación compartida");
        }).catch(() => {
          // Si cancela, abrir en Maps
          window.open(maps, "_blank");
        });
      } else {
        // Fallback: abrir en nueva pestaña + copiar al portapapeles
        window.open(maps, "_blank");
        if (navigator.clipboard) {
          navigator.clipboard.writeText(maps).then(() => {
            showToast("📍 Link de ubicación copiado");
          });
        } else {
          showToast("📍 Ubicación obtenida — abriendo Maps");
        }
      }

      // Restaurar botón
      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-location-dot"></i><span>' +
          (currentLang === 'en' ? 'Location' : 'Ubicación') + '</span>';
        btn.disabled = false;
      }
    },
    function(error) {
      let msg = "No se pudo obtener la ubicación";
      if (error.code === 1) msg = "Permiso de ubicación denegado";
      if (error.code === 2) msg = "Ubicación no disponible";
      if (error.code === 3) msg = "Tiempo de espera agotado";
      showToast(msg, true);

      if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-location-dot"></i><span>' +
          (currentLang === 'en' ? 'Location' : 'Ubicación') + '</span>';
        btn.disabled = false;
      }
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

/* ── SISTEMA DE IDIOMAS ── */
let currentLang = 'es';

const translations = {
  es: {
    sos_text:              "🆘 INFORMACIÓN MÉDICA DE EMERGENCIA",
    alerta_text:           "ALÉRGICO A LOS AINEs — NO ADMINISTRAR",
    blood_label_card:      "TIPO",
    sec_personal:          "Datos Personales",
    birth_label:           "Fecha de nacimiento",
    age_label:             "Edad",
    years_label:           "años",
    id_label:              "Cédula",
    nat_label:             "Nacionalidad",
    eps_label:             "EPS / Seguro",
    doc_label:             "Médico tratante",
    sec_conditions:        "Condiciones Médicas",
    tag_aines:             "⚠ AINEs",
    sec_meds:              "Medicamentos Actuales",
    sec_notes:             "Notas para el Médico",
    notes_text:            "Paciente alérgico a AINEs (ibuprofeno, diclofenaco). Hipertenso controlado. Diabético tipo 2. Evitar AINEs y corticoides sin evaluación previa. Donante de órganos registrado.",
    sec_contact:           "Contacto de Emergencia",
    relation_text:         "(Familiar)",
    call_label:            "Llamar",
    loc_label:             "Ubicación",
    emergency_call_label:  "LLAMAR EMERGENCIAS — 123",
    footer_text:           "Placa Médica de Emergencia · MediQR",
  },
  en: {
    sos_text:              "🆘 MEDICAL EMERGENCY INFORMATION",
    alerta_text:           "ALLERGIC TO NSAIDs — DO NOT ADMINISTER",
    blood_label_card:      "TYPE",
    sec_personal:          "Personal Data",
    birth_label:           "Date of birth",
    age_label:             "Age",
    years_label:           "years old",
    id_label:              "ID / Document",
    nat_label:             "Nationality",
    eps_label:             "Insurance / EPS",
    doc_label:             "Primary physician",
    sec_conditions:        "Medical Conditions",
    tag_aines:             "⚠ NSAIDs",
    sec_meds:              "Current Medications",
    sec_notes:             "Notes for Medical Staff",
    notes_text:            "Patient allergic to NSAIDs (ibuprofen, diclofenac). Controlled hypertension. Type 2 diabetic. Avoid NSAIDs and corticosteroids without prior evaluation. Registered organ donor.",
    sec_contact:           "Emergency Contact",
    relation_text:         "(Family)",
    call_label:            "Call",
    loc_label:             "Location",
    emergency_call_label:  "CALL EMERGENCY — 123 / 911",
    footer_text:           "Medical Emergency Card · MediQR",
  }
};

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Actualizar todos los elementos con id en el diccionario
  Object.keys(t).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[id];
  });

  // Botones activos
  document.getElementById("btn_es").classList.toggle("active", lang === 'es');
  document.getElementById("btn_en").classList.toggle("active", lang === 'en');

  // Actualizar label del botón de ubicación (si no está en modo "buscando")
  const locBtn = document.getElementById("loc_btn");
  if (locBtn && !locBtn.disabled) {
    locBtn.innerHTML =
      '<i class="fa-solid fa-location-dot"></i>' +
      '<span id="loc_label">' + t.loc_label + '</span>';
  }
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(message, isError = false) {
  // Remover toast previo si existe
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  calcularEdad();

  // Detectar idioma del navegador automáticamente
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && !browserLang.startsWith('es')) {
    setLanguage('en');
  }
});
