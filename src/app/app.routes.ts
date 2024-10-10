import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        pathMatch:'full',
        redirectTo:'auth'
    },
    {
        path:'auth',
        loadChildren:()=>import('@domains/auth/auth.routes').then(r=>r.routes)
    },
    {
        path:'dashboard',
        loadChildren:()=>import('@domains/dashboard/dashboard.routes').then(r=>r.routes)
    }
];
