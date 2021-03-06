import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AssignmentService } from '../assignment.service';
import { AssignmentDetailModel } from '../assignment.model';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationService } from '@vts/login';
@Component({
  selector: 'vts-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentListComponent implements OnInit {
  public assignments: Observable<AssignmentDetailModel[]>;
  public displayedColumns: string[] = ['Id', 'Name', 'Status'];

  constructor(private _assignmentDetailService: AssignmentService, public _authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.getAssignmentList();
  }

  private getAssignmentList(): void {
    this.assignments = this._assignmentDetailService.GetAllAssignments();
  }
}
