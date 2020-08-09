import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CameraDetailModel, Status } from '../camera.model';
import { IFormGroup } from '@rxweb/types';
import { CameraService } from '../camera.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vts-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraDetailComponent implements OnInit, OnDestroy {
  public form: IFormGroup<CameraDetailModel>;
  public statusEnum = Status;
  private formId: string;
  private subSubscription = new Subscription();

  constructor(
    private _cameraDetailService: CameraService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
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
   * Calls the service to create the form for camera detail
   * @returns void
   */
  private createForm(): void {
    this.form = this._cameraDetailService.createForm();
  }

  private getForm(): void {
    this.subSubscription.add(
      this._cameraDetailService
        .GetCamera(this.formId)
        .pipe(map((item) => this.form.patchValue(item)))
        .subscribe()
    );
  }

  /**
   * Add a new Camera with the CameraDetailModel
   * Or if ID is present, will update
   * @returns void
   */
  public saveCamera(): void {
    this._cameraDetailService
      .SaveCamera(this.form.getRawValue() as CameraDetailModel)
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

  public deleteCamera(): void {
    this.form.controls.Status.setValue(this.statusEnum.Deleted);
    this.saveCamera();
  }
  public reopenCamera(): void {
    this.form.controls.Status.setValue(this.statusEnum.Open);
    this.saveCamera();
  }
}
