import { Routes } from "@angular/router";

export const side_routes:Routes = [
    {
        path:'home',
        title:'Home',
        data:{breadcrumb:'Home',icon:'heroHomeModernSolid'},
        loadComponent:()=>import('@domains/dashboard/pages/home/home.component').then(c=>c.HomeComponent)
    },
    {
        path:'gestion',
        title:'Gestión',
        data:{breadcrumb:'Gestión',icon:'heroHomeModernSolid'},
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'modalidades'
            },
            {
                path:'usuarios',
                title:'Gestión de usuarios',
                data:{breadcrumb:'Gestión de usuarios',icon:'heroUserGroupSolid'},
                loadComponent:()=>import('@domains/dashboard/pages/usuario/usuario-page/usuario-page.component').then(c=>c.UsuarioPageComponent)
            },
            {
                path:'modalidades',
                title:'Gestión de Modalidades',
                data:{breadcrumb:'Gestión de modalidades',icon:'heroAcademicCapSolid'},
                loadComponent:()=>import('@domains/dashboard/pages/modalidad/modalidad-page/modalidad-page.component').then(c=>c.ModalidadPageComponent)
            },
            {
                path:'regionales',
                title:'Gestión de Regionales',
                data:{breadcrumb:'Gestión de regionales',icon:'heroMapSolid'},
                loadComponent:()=>import('@domains/dashboard/pages/regional/regional-page/regional-page.component').then(c=>c.RegionalPageComponent),
            },
            {
                path:'centros-formacion',
                title:'Gestión Centros de formación',
                data:{breadcrumb:'Gestión Centros de formación',icon:'lucideSchool'},
                loadComponent:()=>import('@domains/dashboard/pages/centro-formacion/centro-formacion-page/centro-formacion-page.component').then(c=>c.CentroFormacionPageComponent)
            },
            {
                path:'bilinguismo',
                title:'Gestión Programas Bilingüismo',
                data:{breadcrumb:'Gestión Programas Bilingüismo',icon:'heroLanguage'},
                loadComponent:()=>import('@domains/dashboard/pages/bilinguismo/bilinguismo-page/bilinguismo-page.component').then(c=>c.BilinguismoPageComponent)
            },
            {
                path:'niveles-formacion',
                title:'Gestión niveles de formación',
                data:{breadcrumb:'Gestión niveles de formación',icon:'simpleLevelsdotfyi'},
                loadComponent:()=>import('@domains/dashboard/pages/nivel-formacion/nivel-formacion-page/nivel-formacion-page.component').then(c=>c.NivelFormacionPageComponent)
            },
            {
                path:'metas',
                title:'Gestión de Metas',
                data:{breadcrumb:'Metas',icon:'lucideGoal'},
                children:[
                    {
                        path:'',
                        pathMatch:'full',
                        redirectTo:'gestion-metas'
                    },
                    {
                        path:'gestion-metas',
                        title:'Metas',
                        data:{breadcrumb:'Gestión de metas',icon:'lucideGoal'},
                        loadComponent:()=>import('@domains/dashboard/pages/metas/metas-page/metas-page.component').then(c=>c.MetasPageComponent)
                    },
                    {
                        path:'formacion-regular',
                        title:'Formación regular',
                        data:{breadcrumb:'Formación regular',icon:'lucideGoal'},
                        loadComponent:()=>import('@domains/dashboard/pages/metas-formacion/metas-formacion-page/metas-formacion-page.component').then(c=>c.MetasFormacionPageComponent)
                    },
                    {
                        path:'estrategias-institucionales',
                        title:'Estrategias institucionales',
                        data:{breadcrumb:'Estrategias institucionales',icon:'lucideCheckCheck'},
                        loadComponent:()=>import('@domains/dashboard/pages/estrategias/estrategias-page/estrategias-page.component').then(c=>c.EstrategiasPageComponent)
                    },
                ]
            }
        ]
    },
    {
        path:'subir-documentos',
        title:'Subir documentos',
        data:{breadcrumb:'Subir socumentos',icon:'lucideSchool'},
        loadComponent:()=>import('@domains/dashboard/pages/subir-documentos/subir-documentos.component').then(c=>c.SubirDocumentosComponent)
    },
    {
        path:'reportes',
        title:'Reportes',
        data:{breadcrumb:'Reportes',icon:'heroChartPie'},
        loadComponent:()=>import('@domains/dashboard/pages/reportes/reportes-layout/reportes-layout.component').then(c=>c.ReportesLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'general'
            },
            {
                path:'estado-aprendices',
                title:'Estado de los aprendices sena',
                data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-aprendices/reporte-aprendices-page/reporte-aprendices-page.component').then(c=>c.ReporteAprendicesPageComponent),
            },
            {
                path:'estado-fichas',
                title:'Estado de las fichas sena',
                data:{breadcrumb:'Estado de las fichas sena', icon:'heroChartPie'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-fichas/reporte-fichas-page/reporte-fichas-page.component').then(c=>c.ReporteFichasPageComponent)
            },
            {
                path:'retiros',
                title:'Retiros',
                data:{breadcrumb:'Retiros', icon:'lucideTable2'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-retirados/reporte-retirados-page/reporte-retirados-page.component').then(c=>c.ReporteRetiradosPageComponent)
            },
            {
                path:'programas',
                title:'Programas',
                data:{breadcrumb:'Programas', icon:'lucideTable2'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-programas/reporte-programas-page/reporte-programas-page.component').then(c=>c.ReporteProgramasPageComponent)
            },
            {
                path:'cobertura',
                title:'Cobertura',
                data:{breadcrumb:'Cobertura', icon:'lucideGlobe'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-cobertura/reporte-cobertura-page/reporte-cobertura-page.component').then(c=>c.ReporteCoberturaPageComponent)
            },
            {
                path:'estrategias',
                title:'Estrategias',
                data:{breadcrumb:'Estrategias', icon:'lucideChartColumn'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-estrategia/reporte-estrategia-page/reporte-estrategia-page.component').then(c=>c.ReporteEstrategiaPageComponent)
            },
            {
                path:'general',
                title:'General',
                data:{breadcrumb:'General', icon:'lucideChartColumn'},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-general/reporte-general-page/reporte-general-page.component').then(c=>c.ReporteGeneralPageComponent)
            }
        ]
    }
]