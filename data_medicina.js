const mallaDataMedicina = {
    semesters: [
        {
            number: 1,
            courses: [
                { id: "med_quim", name: "Bases Químicas de la Medicina", prerequisites: [] },
                { id: "med_fis", name: "Física Médica", prerequisites: [] },
                { id: "med_biomet", name: "Biometría (Biomatemáticas)", prerequisites: [] },
                { id: "med_intro", name: "Introducción a la Medicina e Intervención Básica en Emergencias", prerequisites: [] },
                { id: "med_ing1", name: "Inglés I", prerequisites: [] },
                { id: "med_hab1", name: "Habilidades Académicas I", prerequisites: [] }
            ]
        },
        {
            number: 2,
            courses: [
                { id: "med_bio_cel", name: "Biología Celular y Molecular Médica", prerequisites: [] },
                { id: "med_morf1", name: "Morfología Integrada I", prerequisites: [] },
                { id: "med_salud_pub", name: "Salud Pública y Estadística Aplicada a la Medicina", prerequisites: ["med_biomet"] },
                { id: "med_elem_clin", name: "Elementos Clínicos Básicos", prerequisites: [] },
                { id: "med_ing2", name: "Inglés II", prerequisites: ["med_ing1"] },
                { id: "med_hab2", name: "Habilidades Académicas II", prerequisites: ["med_hab1"] }
            ]
        },
        {
            number: 3,
            courses: [
                { id: "med_bioq", name: "Bioquímica Médica y Genética Clínica", prerequisites: ["med_quim", "med_bio_cel"] },
                { id: "med_morf2", name: "Morfología Integrada II", prerequisites: ["med_morf1"] },
                { id: "med_sns1", name: "Sistema Nacional de Salud I", prerequisites: [] },
                { id: "med_ing3", name: "Inglés III", prerequisites: ["med_ing2"] },
                { id: "med_elect1", name: "Electivo de Formación General I", prerequisites: [] }
            ]
        },
        {
            number: 4,
            courses: [
                { id: "med_morf3", name: "Morfología Integrada III", prerequisites: ["med_morf2"] },
                { id: "med_sns2", name: "Sistema Nacional de Salud II", prerequisites: ["med_sns1"] },
                { id: "med_metod", name: "Metodología de la Investigación y Medicina Basada en la Evidencia", prerequisites: [] },
                { id: "med_bases1", name: "Bases y Mecanismos de la Salud y la Enfermedad I", prerequisites: ["med_morf2", "med_bioq"] },
                { id: "med_etica", name: "Ética y Ciudadanía", prerequisites: [] },
                { id: "med_integ1", name: "Integración Clínica I", prerequisites: ["med_elem_clin"] }
            ]
        },
        {
            number: 5,
            courses: [
                { id: "med_farm_gen", name: "Farmacología General", prerequisites: ["med_bioq", "med_morf3"] },
                { id: "med_sns3", name: "Sistema Nacional de Salud III", prerequisites: ["med_sns2"] },
                { id: "med_diag1", name: "Diagnóstico Clínico I", prerequisites: ["med_elem_clin"] },
                { id: "med_bases2", name: "Bases y Mecanismos de la Salud y la Enfermedad II", prerequisites: ["med_bases1"] },
                { id: "med_integ2", name: "Integración Clínica II", prerequisites: ["med_integ1"] },
                { id: "med_pract1", name: "Práctica Integrada en Medicina I", prerequisites: ["med_elem_clin"] }
            ]
        },
        {
            number: 6,
            courses: [
                { id: "med_farm_clin", name: "Farmacología Clínica", prerequisites: ["med_farm_gen"] },
                { id: "med_sns4", name: "Sistema Nacional de Salud IV", prerequisites: ["med_sns3"] },
                { id: "med_diag2", name: "Diagnóstico Clínico II", prerequisites: ["med_diag1"] },
                { id: "med_bases3", name: "Bases y Mecanismos de la Salud y la Enfermedad III", prerequisites: ["med_bases2"] },
                { id: "med_int1", name: "Medicina Interna I", prerequisites: ["med_bases2", "med_diag1"] },
                { id: "med_pract2", name: "Práctica Integrada en Medicina II", prerequisites: ["med_pract1"] }
            ]
        },
        {
            number: 7,
            courses: [
                { id: "med_bioetica", name: "Bioética Clínica y Antropología Médica", prerequisites: ["med_etica"] },
                { id: "med_sns5", name: "Sistema Nacional de Salud V", prerequisites: ["med_sns4"] },
                { id: "med_metodos", name: "Métodos Diagnósticos", prerequisites: ["med_diag2"] },
                { id: "med_legal", name: "Medicina Legal", prerequisites: ["med_int1"] },
                { id: "med_int2", name: "Medicina Interna II", prerequisites: ["med_int1"] },
                { id: "med_pract3", name: "Práctica Integrada en Medicina III", prerequisites: ["med_pract2"] }
            ]
        },
        {
            number: 8,
            courses: [
                { id: "med_onco", name: "Oncología", prerequisites: ["med_int2"] },
                { id: "med_nutri", name: "Nutrición", prerequisites: ["med_int1"] },
                { id: "med_psico", name: "Psicología", prerequisites: [] },
                { id: "med_neuro", name: "Neurología", prerequisites: ["med_int2"] },
                { id: "med_pract4", name: "Práctica Integrada en Medicina IV", prerequisites: ["med_pract3"] }
            ]
        },
        {
            number: 9,
            courses: [
                { id: "med_gine", name: "Ginecología y Obstetricia", prerequisites: ["med_int2"] },
                { id: "med_trauma", name: "Ortopedia y Traumatología", prerequisites: ["med_int2"] },
                { id: "med_psiq", name: "Psiquiatría", prerequisites: ["med_psico"] },
                { id: "med_fisiat", name: "Fisiatría", prerequisites: ["med_trauma"] },
                { id: "med_cirug", name: "Cirugía", prerequisites: ["med_int2"] },
                { id: "med_pract5", name: "Práctica Integrada en Medicina V", prerequisites: ["med_pract4"] },
                { id: "med_gestion", name: "Gestión", prerequisites: [] },
                { id: "med_rsu", name: "Responsabilidad Social Universitaria", prerequisites: ["med_etica"] }
            ]
        },
        {
            number: 10,
            courses: [
                { id: "med_pediatria", name: "Pediatría", prerequisites: ["med_int2"] },
                { id: "med_especialidades", name: "Oftalmología / Otorrinolaringología / Dermatología", prerequisites: ["med_int2"] },
                { id: "med_urgencia", name: "Medicina de Urgencia", prerequisites: ["med_int2"] },
                { id: "med_pract6", name: "Práctica Integrada en Medicina VI", prerequisites: ["med_pract5"] },
                { id: "med_elect2", name: "Electivo de Formación General II", prerequisites: [] }
            ]
        },
        {
            number: 11,
            courses: [
                { id: "med_internado1", name: "Internado I", prerequisites: ["med_ciclo_intermedio"] }
            ]
        },
        {
            number: 12,
            courses: [
                { id: "med_internado2", name: "Internado II", prerequisites: ["med_ciclo_intermedio"] }
            ]
        },
        {
            number: 13,
            courses: [
                { id: "med_internado3", name: "Internado III", prerequisites: ["med_ciclo_intermedio"] }
            ]
        },
        {
            number: 14,
            courses: [
                { id: "med_internado4", name: "Internado IV", prerequisites: ["med_ciclo_intermedio"] }
            ]
        }
    ]
}; 