import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import { Status, VehicleDetailModel } from '../vehicle.model';
import { Subscription } from 'rxjs';
import { VehicleService } from '../vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, filter, tap } from 'rxjs/operators';
import { AuthenticationService } from '@vts/login';

@Component({
  selector: 'vts-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailComponent implements OnInit {
  public form: IFormGroup<VehicleDetailModel>;
  public statusEnum = Status;
  private formId: string;
  private subSubscription = new Subscription();

  constructor(
    private _vehicleDetailService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public _authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.listenForRouteId();
  }

  ngOnDestroy(): void {
    this.subSubscription.unsubscribe();
  }

  private listenForRouteId() {
    this.subSubscription.add(
      this.route.params
        .pipe(
          map((p) => (this.formId = p.id)),
          filter((id) => id),
          tap(() => this.getForm())
        )
        .subscribe()
    );
  }

  /**
   * Calls the service to create the form for Vehicle detail
   * @returns void
   */
  private createForm(): void {
    this.form = this._vehicleDetailService.createForm();
  }

  private getForm(): void {
    this.subSubscription.add(
      this._vehicleDetailService
        .GetVehicle(this.formId)
        .pipe(map((item) => this.form.patchValue(item)))
        .subscribe()
    );
  }

  /**
   * Add a new Vehicle with the VehicleDetailModel
   * Or if ID is present, will update
   * @returns void
   */
  public saveVehicle(): void {
    this._vehicleDetailService
      .SaveVehicle(this.form.getRawValue() as VehicleDetailModel)
      .then((item) => {
        if (this.form.controls.Id.value) {
          this.form.patchValue(item);
        } else {
          this.router.navigate(['../', item.Id], {
            relativeTo: this.route,
          });
        }
      })
      .finally(() => {
        this.snackBar.open('Form Saved', null, {
          duration: 2000,
        });
      });
  }

  public deleteVehicle(): void {
    this.form.controls.Status.setValue(this.statusEnum.Deleted);
    this.saveVehicle();
  }
  public reopenVehicle(): void {
    this.form.controls.Status.setValue(this.statusEnum.Open);
    this.saveVehicle();
  }
}
