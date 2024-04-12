import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
//   {
//   path: '', redirectTo: 'auth/login', pathMatch: 'full'
// },

{
  path: '', redirectTo: 'auth', pathMatch: 'full'
},
{
  path: 'auth',
  loadChildren: () => import('./auth/auth.module').then((auth: any) => auth.AuthModule)
}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
