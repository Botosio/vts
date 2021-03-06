import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { VehicleService } from '../vehicle.service';
import { Observable } from 'rxjs';
import { VehicleDetailModel } from '../vehicle.model';
import { AuthenticationService } from '@vts/login';

@Component({
  selector: 'vts-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent implements OnInit {
  public vehicles: Observable<VehicleDetailModel[]>;
  public displayedColumns: string[] = ['Id', 'Name', 'Status'];

  constructor(private _vehicleDetailService: VehicleService, public _authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.getVehicleList();
  }

  private getVehicleList(): void {
    this.vehicles = this._vehicleDetailService.GetAllVehicles();
  }
}
