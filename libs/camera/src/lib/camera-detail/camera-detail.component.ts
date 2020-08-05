import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vts-camera-detail',
  templateUrl: './camera-detail.component.html',
  styleUrls: ['./camera-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
