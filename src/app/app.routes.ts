import { Routes } from '@angular/router';
import { authenticatedGuard } from '@shared/guards/authenticated.guard';

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
        data:{breadcrumb:'Dashboard'},
        canMatch:[authenticatedGuard],
        loadChildren:()=>import('@domains/dashboard/dashboard.routes').then(r=>r.routes)
    }
];
