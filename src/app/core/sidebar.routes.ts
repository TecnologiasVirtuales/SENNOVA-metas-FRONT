import { Routes } from "@angular/router";

export const sideRoutes:Routes = [
    {
        path:'home',
        title:'Home',
        data:{breadcrumb:'Home',icon:'heroHomeModernSolid'},
        loadComponent:()=>import('@domains/dashboard/pages/home/home.component').then(c=>c.HomeComponent)
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
        loadComponent:()=>import('@domains/dashboard/pages/regional/regional-layout/regional-layout.component').then(c=>c.RegionalLayoutComponent),
        children:[
            {
                path:'',
                data:{breadcrumb:'Gestión de regionales',icon:'heroMapSolid'},
                loadComponent:()=>import('@domains/dashboard/pages/regional/regional-page/regional-page.component').then(c=>c.RegionalPageComponent),
            },
            {
                path:':codigo_regional/centros-formacion',
                data:{breadcrumb:'Gestión Centros de formación',icon:'lucideSchool'},
                loadComponent:()=>import('@domains/dashboard/pages/centro-formacion/centro-formacion-page/centro-formacion-page.component').then(c=>c.CentroFormacionPageComponent)
            }
        ]
    },
    {
        path:'centros-formacion',
        title:'Gestión Centros de formación',
        data:{breadcrumb:'Gestión Centros de formación',icon:'lucideSchool'},
        loadComponent:()=>import('@domains/dashboard/pages/centro-formacion/centro-formacion-page/centro-formacion-page.component').then(c=>c.CentroFormacionPageComponent)
    },
    {
        path:'niveles-formacion',
        title:'Gestión niveles de formación',
        data:{breadcrumb:'Gestión niveles de formación',icon:'simpleLevelsdotfyi'},
        loadComponent:()=>import('@domains/dashboard/pages/nivel-formacion/nivel-formacion-page/nivel-formacion-page.component').then(c=>c.NivelFormacionPageComponent)
    }
]