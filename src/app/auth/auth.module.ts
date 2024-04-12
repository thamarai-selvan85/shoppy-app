import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { MatMenuModule } from '@angular/material/menu';
import {MatButtonModule} from'@angular/material/button'

const routes: Routes = [

  {
    path: '', component: AuthComponent,

    children: [
     ]

  }];

@NgModule({
  declarations: [
    AuthComponent,    
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatMenuModule,
  ]
})

export class AuthModule { }
