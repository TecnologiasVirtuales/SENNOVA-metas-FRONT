import { Routes } from "@angular/router";
import { rolesGuard } from "@shared/guards/roles.guard";

const roles_gestion:string[] = ['admin'];
const roles_reportes:string[] = ['admin','reporteador','consulta'];

export const side_routes:Routes = [
    {
        path:'gestion',
        title:'Gestión',
        canActivate:[rolesGuard],
        data:{breadcrumb:'Gestión',icon:'heroHomeModernSolid',roles:roles_gestion},
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'modalidades'
            },
            {
                path:'usuarios',
                title:'Gestión de usuarios',
                data:{breadcrumb:'Gestión de usuarios',icon:'heroUserGroupSolid',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/usuario/usuario-page/usuario-page.component').then(c=>c.UsuarioPageComponent)
            },
            {
                path:'modalidades',
                title:'Gestión de Modalidades',
                data:{breadcrumb:'Gestión de modalidades',icon:'heroAcademicCapSolid',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/modalidad/modalidad-page/modalidad-page.component').then(c=>c.ModalidadPageComponent)
            },
            {
                path:'regionales',
                title:'Gestión de Regionales',
                data:{breadcrumb:'Gestión de regionales',icon:'heroMapSolid',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/regional/regional-page/regional-page.component').then(c=>c.RegionalPageComponent),
            },
            {
                path:'centros-formacion',
                title:'Gestión Centros de formación',
                data:{breadcrumb:'Gestión Centros de formación',icon:'lucideSchool',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/centro-formacion/centro-formacion-page/centro-formacion-page.component').then(c=>c.CentroFormacionPageComponent)
            },
            {
                path:'bilinguismo',
                title:'Gestión Programas Bilingüismo',
                data:{breadcrumb:'Gestión Programas Bilingüismo',icon:'heroLanguage',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/bilinguismo/bilinguismo-page/bilinguismo-page.component').then(c=>c.BilinguismoPageComponent)
            },
            {
                path:'niveles-formacion',
                title:'Gestión niveles de formación',
                data:{breadcrumb:'Gestión niveles de formación',icon:'simpleLevelsdotfyi',roles:roles_gestion},
                loadComponent:()=>import('@domains/dashboard/pages/nivel-formacion/nivel-formacion-page/nivel-formacion-page.component').then(c=>c.NivelFormacionPageComponent)
            },
            {
                path:'metas',
                title:'Gestión de Metas',
                data:{breadcrumb:'Metas',icon:'lucideGoal',roles:roles_gestion},
                children:[
                    {
                        path:'',
                        pathMatch:'full',
                        redirectTo:'gestion-metas'
                    },
                    {
                        path:'gestion-metas',
                        title:'Metas',
                        data:{breadcrumb:'Gestión de metas',icon:'lucideGoal',roles:roles_gestion},
                        loadComponent:()=>import('@domains/dashboard/pages/metas/metas-page/metas-page.component').then(c=>c.MetasPageComponent)
                    },
                    {
                        path:'formacion-regular',
                        title:'Formación regular',
                        data:{breadcrumb:'Formación regular',icon:'lucideGoal',roles:roles_gestion},
                        loadComponent:()=>import('@domains/dashboard/pages/metas-formacion/metas-formacion-page/metas-formacion-page.component').then(c=>c.MetasFormacionPageComponent)
                    },
                    {
                        path:'estrategias-institucionales',
                        title:'Estrategias institucionales',
                        data:{breadcrumb:'Estrategias institucionales',icon:'lucideCheckCheck',roles:roles_gestion},
                        loadComponent:()=>import('@domains/dashboard/pages/estrategias/estrategias-page/estrategias-page.component').then(c=>c.EstrategiasPageComponent)
                    },
                ]
            }
        ]
    },
    {
        path:'subir-documentos',
        title:'Subir documentos',
        canActivate:[rolesGuard],
        data:{breadcrumb:'Subir socumentos',icon:'lucideSchool',roles:['admin','reporteador']},
        loadComponent:()=>import('@domains/dashboard/pages/subir-documentos/subir-documentos.component').then(c=>c.SubirDocumentosComponent)
    },
    {
        path:'reportes',
        title:'Reportes',
        canActivate:[rolesGuard],
        data:{breadcrumb:'Reportes',icon:'heroChartPie',roles:roles_reportes},
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
                data:{breadcrumb:'Estado de los aprendices sena',icon:'heroChartPie',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-aprendices/reporte-aprendices-page/reporte-aprendices-page.component').then(c=>c.ReporteAprendicesPageComponent),
            },
            {
                path:'estado-fichas',
                title:'Estado de las fichas sena',
                data:{breadcrumb:'Estado de las fichas sena', icon:'heroChartPie',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-fichas/reporte-fichas-page/reporte-fichas-page.component').then(c=>c.ReporteFichasPageComponent)
            },
            {
                path:'retiros',
                title:'Retiros',
                data:{breadcrumb:'Retiros', icon:'lucideTable2',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-retirados/reporte-retirados-page/reporte-retirados-page.component').then(c=>c.ReporteRetiradosPageComponent)
            },
            {
                path:'programas',
                title:'Programas',
                data:{breadcrumb:'Programas', icon:'lucideTable2',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-programas/reporte-programas-page/reporte-programas-page.component').then(c=>c.ReporteProgramasPageComponent)
            },
            {
                path:'cobertura',
                title:'Cobertura',
                data:{breadcrumb:'Cobertura', icon:'lucideGlobe',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-cobertura/reporte-cobertura-page/reporte-cobertura-page.component').then(c=>c.ReporteCoberturaPageComponent)
            },
            {
                path:'estrategias',
                title:'Estrategias',
                data:{breadcrumb:'Estrategias', icon:'lucideChartColumn',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-estrategia/reporte-estrategia-page/reporte-estrategia-page.component').then(c=>c.ReporteEstrategiaPageComponent)
            },
            {
                path:'general',
                title:'General',
                data:{breadcrumb:'General', icon:'lucideChartColumn',roles:roles_reportes},
                loadComponent:()=>import('@domains/dashboard/pages/reportes/pages/reporte-general/reporte-general-page/reporte-general-page.component').then(c=>c.ReporteGeneralPageComponent)
            }
        ]
    }
]