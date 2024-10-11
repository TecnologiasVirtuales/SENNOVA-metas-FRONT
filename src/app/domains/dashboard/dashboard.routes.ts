import { Routes } from "@angular/router";
import { sideRoutes } from "@core/sidebar.routes";

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
            ...sideRoutes
        ]
    },
];