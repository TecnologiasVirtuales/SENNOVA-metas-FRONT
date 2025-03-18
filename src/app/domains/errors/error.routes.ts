import { Routes } from "@angular/router";
import { NotFoundComponent } from "@domains/errors/pages/not-found/not-found.component";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/errors/error-layout/error-layout.component').then(c=>c.ErrorLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'404'
            },
            {
                path:'404',
                title:'Pagina no encontrada',
                loadComponent:()=>import('@domains/errors/pages/not-found/not-found.component').then(c=>NotFoundComponent)
            },
            {
                path:'401',
                title:'Acceso no perminitdo',
                loadComponent:()=>import('@domains/errors/pages/not-allowed/not-allowed.component').then(c=>c.NotAllowedComponent)
            }
        ]
    },
];