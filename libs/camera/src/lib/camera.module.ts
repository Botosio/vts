import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CameraListComponent } from './camera-list/camera-list.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';

export const cameraRoutes: Route[] = [
  {
    path: '',
    component: CameraListComponent,
  },
  {
    path: 'new',
    component: CameraDetailComponent,
  },
  {
    path: ':id',
    component: CameraDetailComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(cameraRoutes)],
  declarations: [CameraListComponent, CameraDetailComponent],
  exports: [CameraListComponent, CameraDetailComponent],
})
export class CameraModule {}
