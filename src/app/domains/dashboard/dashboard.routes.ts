import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c=>c.DashboardLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'home'
            },
            {
                path:'perfil',
                title:'Perfil',
                data:{breadcrumb:'Perfil'},
                loadComponent:()=>import('@domains/dashboard/pages/profile/profile.component').then(c=>c.ProfileComponent)
            },
            {
                path:'home',
                title:'Home',
                data:{breadcrumb:'Home'},
                loadComponent:()=>import('@domains/dashboard/pages/home/home.component').then(c=>c.HomeComponent)
            }
        ]
    },
];