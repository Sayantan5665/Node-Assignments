import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages.component').then((m) => m.PagesComponent),
    children: [
      { path: '', redirectTo: "home", pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
      { path: 'edit/product/:id',loadComponent: () => import('./update-product/update-product.component').then(c => c.UpdateProductComponent) },
      { path: 'add/product', loadComponent: () => import('./create-product/create-product.component').then(m => m.CreateProductComponent) },
      { path: 'profile/:id', loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
