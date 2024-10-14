import { Routes } from "@angular/router";

export const sideRoutes:Routes = [
    {
        path:'home',
        title:'Home',
        data:{breadcrumb:'Home',icon:'heroHomeModernSolid'},
        loadComponent:()=>import('@domains/dashboard/pages/home/home.component').then(c=>c.HomeComponent)
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
        loadComponent:()=>import('@domains/dashboard/pages/regional/regional-page/regional-page.component').then(c=>c.RegionalPageComponent)
    },
    {
        path:'centros-formacion',
        title:'Gestión Centros de formación',
        data:{breadcrumb:'Gestión Centros de formación',icon:'lucideSchool'},
        loadComponent:()=>import('@domains/dashboard/pages/centro-formacion/centro-formacion-page/centro-formacion-page.component').then(c=>c.CentroFormacionPageComponent)
    }
]