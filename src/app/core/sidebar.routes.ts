import { Routes } from "@angular/router";

export const sideRoutes:Routes = [
    {
        path:'perfil',
        title:'Perfil',
        data:{breadcrumb:'Perfil'},
        loadComponent:()=>import('@domains/dashboard/pages/profile/profile.component').then(c=>c.ProfileComponent)
    },
    {
        path:'home',
        title:'Home',
        data:{breadcrumb:'Home',icon:'Home'},
        loadComponent:()=>import('@domains/dashboard/pages/home/home.component').then(c=>c.HomeComponent)
    },
    {
        path:'modalidades',
        title:'Gestión de Modalidades',
        data:{breadcrumb:'Gestión de modalidades',icon:'Modalidad'},
        loadComponent:()=>import('@domains/dashboard/pages/modalidad/modalidad-page/modalidad-page.component').then(c=>c.ModalidadPageComponent)
    }
]