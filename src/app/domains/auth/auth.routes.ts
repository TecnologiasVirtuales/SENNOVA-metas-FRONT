import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=>import('@domains/auth/auth-layout/auth-layout.component').then(c=>c.AuthLayoutComponent),
        children:[
            {
                path:'',
                pathMatch:'full',
                redirectTo:'inicio-sesion'
            },
            {
                path:'inicio-sesion',
                title:'Iniciar Sesión',
                loadComponent:()=>import('@domains/auth/pages/login/login.component').then(c=>c.LoginComponent)
            },
            {
                path:'enviar-codigo-recuperacion',
                title:'Recuperar contraseña',
                loadComponent:()=>import('@domains/auth/pages/send-recover-code/send-recover-code.component').then(c=>c.SendRecoverCodeComponent)
            },
            {
                path:'recover_password/:token',
                title:'Recuperar contraseña',
                loadComponent:()=>import('@domains/auth/pages/recover-password/recover-password.component').then(c=>c.RecoverPasswordComponent)
            }
        ]
    },
];