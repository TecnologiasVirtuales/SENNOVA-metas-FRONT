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
    }
]