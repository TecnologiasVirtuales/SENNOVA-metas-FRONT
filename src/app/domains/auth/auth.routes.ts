import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/auth/auth-layout/auth-layout.component').then(c=>c.AuthLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'login'
            },
            {
                path:'login',
                loadComponent:()=>import('@domains/auth/pages/login/login.component').then(c=>c.LoginComponent)
            }
        ]
    },
    // {
    //     path:'login',
    //     loadComponent:()=>import('@domains/auth/pages/login/login.component')
    // }
];