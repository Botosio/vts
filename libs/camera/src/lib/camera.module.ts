import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CameraListComponent } from './camera-list/camera-list.component';
import { CameraDetailComponent } from './camera-detail/camera-detail.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CameraService } from './camera.service';
import { MatTableModule } from '@angular/material/table';

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
  imports: [
    CommonModule,
    RouterModule.forChild(cameraRoutes),
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
  ],
  declarations: [CameraListComponent, CameraDetailComponent],
  exports: [CameraListComponent, CameraDetailComponent],
  providers: [CameraService],
})
export class CameraModule {}
