import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';

import { CameraDetailModel } from '../camera.model';
import { IFormGroup } from '@rxweb/types';
import { CameraService } from '../camera.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap, filter } from 'rxjs/operators';

@Component({
  selector: 'vts-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraDetailComponent implements OnInit, OnDestroy {
  public form: IFormGroup<CameraDetailModel>;
  private formId: string;
  private subSubscription = new Subscription();

  constructor(
    private _cameraDetailService: CameraService,
    private route: ActivatedRoute
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
      this.route.params.pipe(map((p) => (this.formId = p.id))).subscribe()
    );
  }

  /**
   * Calls the service to create the form for camera detail
   * @returns void
   */
  private createForm(): void {
    this.form = this._cameraDetailService.createForm();
    console.log('count:');
  }

  /**
   * Add a new Camera with the CameraDetailModel
   * @returns void
   */
  private addCamera(): void {
    this._cameraDetailService
      .AddCamera(this.form.getRawValue() as CameraDetailModel)
      .finally(() => {
        console.log('saved'); // TODO pop toast message
      });
  }

  public onSubmit() {
    this.addCamera();
  }
}
