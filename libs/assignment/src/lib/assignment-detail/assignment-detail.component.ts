import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import {
  Status,
  AssignmentDetailModel,
  AssignmentFormModel,
} from '../assignment.model';
import { Subscription, Observable } from 'rxjs';
import { AssignmentService } from '../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, filter, tap, throwIfEmpty } from 'rxjs/operators';
import { VehicleDetailModel } from '@vts/vehicle-lib';
import { CameraDetailModel } from '@vts/camera-lib';

@Component({
  selector: 'vts-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentDetailComponent implements OnInit {
  public form: IFormGroup<AssignmentFormModel>;
  public statusEnum = Status;
  private formId: string;
  private subSubscription = new Subscription();
  public filteredVehicleOptions: Observable<VehicleDetailModel[]>;
  public filteredCameraOptions: Observable<CameraDetailModel[]>;
  private existingCameraModel: CameraDetailModel;

  constructor(
    private _vehicleDetailService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.listenForRouteId();
    this.getFilteredVehicles();
    this.getFilteredCamera();
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
   * Calls the service to create the form for Assignment detail
   * @returns void
   */
  private createForm(): void {
    this.form = this._vehicleDetailService.createForm();
  }

  private getForm(): void {
    this.subSubscription.add(
      this._vehicleDetailService
        .GetAssignment(this.formId)
        .pipe(
          map((item) => this.form.patchValue(item)),
          tap(() => this.setCameraAutoComplete()),
          tap(() => this.setVehicleAutoComplete())
        )
        .subscribe()
    );
  }

  private setCameraAutoComplete() {
    this.subSubscription.add(
      this._vehicleDetailService
        .GetCamera(this.form.controls.CameraId.value)
        .pipe(
          tap((item) => this.form.controls.CameraAutoComplete.setValue(item)),
          tap((item) =>
            this.form.controls.ExistingCameraAutoComplete.setValue(item)
          )
        )
        .subscribe()
    );
  }

  private setVehicleAutoComplete() {
    this.subSubscription.add(
      this._vehicleDetailService
        .GetVehicle(this.form.controls.VehicleId.value)
        .pipe(
          tap((item) => this.form.controls.VehicleAutoComplete.setValue(item)),
          tap((item) =>
            this.form.controls.ExistingVehicleAutoComplete.setValue(item)
          )
        )
        .subscribe()
    );
  }

  /**
   * Add a new Assignment with the AssignmentDetailModel
   * Or if ID is present, will update
   * extra step to update status on Vehicle and Camera Inventory
   * @returns void
   */
  public saveAssignment(): void {
    this._vehicleDetailService
      .SaveAssignment(this.form.getRawValue() as AssignmentFormModel)
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

  public deleteAssignment(): void {
    this._vehicleDetailService
      .DeleteAssignment(this.form.getRawValue() as AssignmentFormModel)
      .then(() => {
        this.router.navigate(['../'], {
          relativeTo: this.route,
        });
      })
      .finally(() => {
        this.snackBar.open('Form Deleted', null, {
          duration: 2000,
        });
      });
  }
  public reopenAssignment(): void {
    this.form.controls.Status.setValue(this.statusEnum.Open);
    this.saveAssignment();
  }

  private getFilteredVehicles(): void {
    this.filteredVehicleOptions = this._vehicleDetailService
      .GetAllVehicles()
      .pipe(
        map((items) => items.filter((item) => item.Status === Status.Open))
      );
  }

  private getFilteredCamera(): void {
    this.filteredCameraOptions = this._vehicleDetailService
      .GetAllCameras()
      .pipe(
        map((items) => items.filter((item) => item.Status === Status.Open))
      );
  }

  public vehicleDisplayFn(vehicle: VehicleDetailModel): string {
    return vehicle?.Name;
  }

  public onVehicleSelect($event: any): void {
    this.form.controls.VehicleId.setValue($event.option.value.Id);
  }

  public onVehicleBlur(): void {
    if (!(this.form.controls.VehicleAutoComplete.value instanceof Object)) {
      this.form.controls.VehicleId.reset();
    }
  }

  public cameraDisplayFn(camera: CameraDetailModel): string {
    return camera?.DeviceNo;
  }

  public onCameraSelect($event: any): void {
    this.form.controls.CameraId.setValue($event.option.value.Id);
  }

  public onCameraBlur(): void {
    if (!(this.form.controls.CameraAutoComplete.value instanceof Object)) {
      this.form.controls.CameraId.reset();
    }
  }
}
