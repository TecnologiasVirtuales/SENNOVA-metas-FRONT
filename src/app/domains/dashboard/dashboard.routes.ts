import { Routes } from "@angular/router";
import { side_routes } from "@core/sidebar.routes";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/dashboard/dashboard-layout/dashboard-layout.component').then(c=>c.DashboardLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'reportes'
            },
            ...side_routes
        ]
    },
];