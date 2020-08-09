import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@vts/dashboard-lib').then((m) => m.DashboardModule),
  },
  {
    path: 'camera',
    // canActivate: [CanActivateRouteGuard],
    loadChildren: () => import('@vts/camera-lib').then((m) => m.CameraModule),
  },
  {
    path: 'vehicle',
    // canActivate: [CanActivateRouteGuard],
    loadChildren: () => import('@vts/vehicle-lib').then((m) => m.VehicleModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
