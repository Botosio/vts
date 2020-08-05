import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'vts-camera-list',
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
