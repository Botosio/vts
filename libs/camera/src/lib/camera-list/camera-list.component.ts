import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { CameraDetailModel } from '../camera.model';
import { CameraService } from '../camera.service';
import { AuthenticationService } from '@vts/login';
@Component({
  selector: 'vts-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CameraListComponent implements OnInit {
  public cameras: Observable<CameraDetailModel[]>;
  public displayedColumns: string[] = ['Id', 'DeviceNo', 'Status'];

  constructor(private _cameraDetailService: CameraService, public _authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.getCameraList();
  }

  private getCameraList(): void {
    this.cameras = this._cameraDetailService.GetAllCameras();
  }
}
