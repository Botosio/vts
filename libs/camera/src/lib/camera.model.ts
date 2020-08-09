export interface CameraDetailModel {
  Id: string;
  DeviceNo: string;
  Status: Status;
}

export enum Status {
  Assigned = 'Assigned',
  Deleted = 'Deleted',
  Open = 'Open',
}
