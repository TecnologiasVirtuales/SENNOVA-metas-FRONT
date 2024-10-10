import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c=>c.DashboardLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'perfil'
            },
            {
                path:'perfil',
                title:'Perfil',
                loadComponent:()=>import('@domains/dashboard/pages/profile/profile.component').then(c=>c.ProfileComponent)
            }
        ]
    },
];