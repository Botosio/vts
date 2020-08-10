import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { AssignmentDetailComponent } from './assignment-detail/assignment-detail.component';
import { AssignmentService } from './assignment.service';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

export const assignmentRoutes: Route[] = [
  {
    path: '',
    component: AssignmentListComponent,
  },
  {
    path: 'new',
    component: AssignmentDetailComponent,
  },
  {
    path: ':id',
    component: AssignmentDetailComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    RouterModule.forChild(assignmentRoutes),
  ],
  declarations: [AssignmentListComponent, AssignmentDetailComponent],
  providers: [AssignmentService],
})
export class AssignmentModule {}
