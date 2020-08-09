import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';
import { VehicleService } from './vehicle.service';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

export const vehicleRoutes: Route[] = [
  {
    path: '',
    component: VehicleListComponent,
  },
  {
    path: 'new',
    component: VehicleDetailComponent,
  },
  {
    path: ':id',
    component: VehicleDetailComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    RouterModule.forChild(vehicleRoutes),
  ],
  declarations: [VehicleListComponent, VehicleDetailComponent],
  providers: [VehicleService],
})
export class VehicleModule {}
