const mallaDataDerecho = {
    semesters: [
        {
            number: 1,
            courses: [
                { id: "der_intro", name: "Introducción al Derecho", prerequisites: [] },
                { id: "der_romano", name: "Derecho Romano", prerequisites: [] },
                { id: "der_fund_filo", name: "Fundamentos Filosóficos del Derecho", prerequisites: [] },
                { id: "der_historia", name: "Historia del Derecho", prerequisites: [] },
                { id: "der_ingles1", name: "Inglés I", prerequisites: [] },
                { id: "der_hab_acad1", name: "Habilidades Académicas I", prerequisites: [] },
                { id: "der_taller_ident", name: "Taller de Identidad y Empoderamiento", prerequisites: [] }
            ]
        },
        {
            number: 2,
            courses: [
                { id: "der_proc_org", name: "Derecho Procesal: Orgánico", prerequisites: ["der_intro"] },
                { id: "der_civil_pers", name: "Derecho Civil: Personas", prerequisites: ["der_intro"] },
                { id: "der_teoria_est", name: "Teoría del Estado", prerequisites: ["der_historia"] },
                { id: "der_ingles2", name: "Inglés II", prerequisites: ["der_ingles1"] },
                { id: "der_hab_acad2", name: "Habilidades Académicas II", prerequisites: ["der_hab_acad1"] },
                { id: "der_soc_comp", name: "Sociedad y Complejidad", prerequisites: [] }
            ]
        },
        {
            number: 3,
            courses: [
                { id: "der_proc_ord", name: "Derecho Procesal: Juicio Ordinario", prerequisites: ["der_proc_org"] },
                { id: "der_civil_acto", name: "Derecho Civil: Acto Jurídico", prerequisites: ["der_civil_pers"] },
                { id: "der_const1", name: "Derecho Constitucional I", prerequisites: ["der_teoria_est"] },
                { id: "der_metodos_alt", name: "Métodos Alternativos de Solución de Conflictos", prerequisites: [] },
                { id: "der_ingles3", name: "Inglés III", prerequisites: ["der_ingles2"] },
                { id: "der_etica", name: "Ética y Ciudadanía", prerequisites: [] },
                { id: "der_pract1", name: "Práctica Jurídica I", prerequisites: ["der_intro", "der_civil_pers"] },
                { id: "der_deonto", name: "Deontología Jurídica", prerequisites: [] }
            ]
        },
        {
            number: 4,
            courses: [
                { id: "der_proc_ejec", name: "Derecho Procesal: Juicio Ejecutivo y Sumario", prerequisites: ["der_proc_ord"] },
                { id: "der_civil_bienes", name: "Derecho Civil: Bienes", prerequisites: ["der_civil_acto"] },
                { id: "der_const2", name: "Derecho Constitucional II", prerequisites: ["der_const1"] },
                { id: "der_tecnol", name: "Derecho Tecnológico", prerequisites: [] },
                { id: "der_ingles4", name: "Inglés IV", prerequisites: ["der_ingles3"] },
                { id: "der_resp_soc", name: "Responsabilidad Social Universitaria", prerequisites: ["der_etica"] },
                { id: "der_pract2", name: "Práctica Jurídica II", prerequisites: ["der_pract1"] }
            ]
        },
        {
            number: 5,
            courses: [
                { id: "der_penal1", name: "Derecho Penal I", prerequisites: ["der_const2"] },
                { id: "der_proc_esp1", name: "Derecho Procesal: Procedimientos Civiles Especiales I", prerequisites: ["der_proc_ejec"] },
                { id: "der_civil_oblig", name: "Derecho Civil: Obligaciones", prerequisites: ["der_civil_bienes"] },
                { id: "der_admin1", name: "Derecho Administrativo I", prerequisites: ["der_const2"] },
                { id: "der_econ1", name: "Derecho Económico I", prerequisites: [] },
                { id: "der_laboral1", name: "Derecho Laboral I", prerequisites: [] },
                { id: "der_ddhh", name: "Derechos Humanos", prerequisites: ["der_const2"] },
                { id: "der_pract3", name: "Práctica Jurídica III", prerequisites: ["der_pract2"] }
            ]
        },
        {
            number: 6,
            courses: [
                { id: "der_penal2", name: "Derecho Penal II", prerequisites: ["der_penal1"] },
                { id: "der_proc_esp2", name: "Derecho Procesal: Procedimientos Civiles Especiales II", prerequisites: ["der_proc_esp1"] },
                { id: "der_civil_contr", name: "Derecho Civil: Contratos", prerequisites: ["der_civil_oblig"] },
                { id: "der_admin2", name: "Derecho Administrativo II", prerequisites: ["der_admin1"] },
                { id: "der_econ2", name: "Derecho Económico II", prerequisites: ["der_econ1"] },
                { id: "der_laboral2", name: "Derecho Laboral II", prerequisites: ["der_laboral1"] }
            ]
        },
        {
            number: 7,
            courses: [
                { id: "der_penal3", name: "Derecho Penal III", prerequisites: ["der_penal2"] },
                { id: "der_proc_penal", name: "Derecho Procesal: Penal", prerequisites: ["der_penal2", "der_proc_esp2"] },
                { id: "der_civil_resp", name: "Derecho Civil: Responsabilidad Civil", prerequisites: ["der_civil_contr"] },
                { id: "der_rec_const", name: "Recursos Constitucionales", prerequisites: ["der_const2"] },
                { id: "der_comerc1", name: "Derecho Comercial I", prerequisites: [] },
                { id: "der_litig_lab", name: "Litigación Laboral", prerequisites: ["der_laboral2"] },
                { id: "der_elect_gen1", name: "Electivo de Formación General I", prerequisites: [] }
            ]
        },
        {
            number: 8,
            courses: [
                { id: "der_penal4", name: "Derecho Penal IV", prerequisites: ["der_penal3"] },
                { id: "der_litig_civil", name: "Litigación Procesal Civil", prerequisites: ["der_proc_penal"] },
                { id: "der_civil_fam", name: "Derecho Civil: Derecho de Familia", prerequisites: ["der_civil_resp"] },
                { id: "der_int_pub", name: "Derecho Internacional Público", prerequisites: ["der_const2"] },
                { id: "der_comerc2", name: "Derecho Comercial II", prerequisites: ["der_comerc1"] },
                { id: "der_trib1", name: "Derecho Tributario I", prerequisites: [] },
                { id: "der_elect_gen2", name: "Electivo de Formación General II", prerequisites: [] },
                { id: "der_pract4", name: "Práctica Jurídica IV", prerequisites: ["der_pract3"] }
            ]
        },
        {
            number: 9,
            courses: [
                { id: "der_litig_penal", name: "Litigación Penal", prerequisites: ["der_penal4"] },
                { id: "der_filosofia", name: "Filosofía del Derecho", prerequisites: ["der_fund_filo"] },
                { id: "der_civil_reg", name: "Derecho Civil: Regímenes Patrimoniales", prerequisites: ["der_civil_fam"] },
                { id: "der_int_priv", name: "Derecho Internacional Privado", prerequisites: ["der_int_pub"] },
                { id: "der_ambiental", name: "Derecho Ambiental", prerequisites: [] },
                { id: "der_trib2", name: "Derecho Tributario II", prerequisites: ["der_trib1"] },
                { id: "der_elect_esp1", name: "Electivo de Especialidad I", prerequisites: [] },
                { id: "der_pract_prof1", name: "Práctica Profesional I", prerequisites: ["der_pract4"] }
            ]
        },
        {
            number: 10,
            courses: [
                { id: "der_elect_esp2", name: "Electivo de Especialidad II", prerequisites: [] },
                { id: "der_sem_inv", name: "Seminario de Investigación Jurídica", prerequisites: ["der_sem8"] },
                { id: "der_civil_suc", name: "Derecho Civil: Derecho Sucesorio", prerequisites: ["der_civil_reg"] },
                { id: "der_migra", name: "Derecho Migratorio y Multiculturalidad", prerequisites: [] },
                { id: "der_elect_prof", name: "Electivo de Profundización", prerequisites: [] },
                { id: "der_pract_prof2", name: "Práctica Profesional II", prerequisites: ["der_pract_prof1"] }
            ]
        }
    ]
}; 