import { VehicleDetailModel } from '@vts/vehicle-lib';
import { CameraDetailModel } from '@vts/camera-lib';

export interface AssignmentDetailModel {
  Id: string;
  CameraId: string;
  VehicleId: string;
  Name: string;
  DateCreated: string;
  Status: Status;
}

export enum Status {
  Assigned = 'Assigned',
  Deleted = 'Deleted',
  Open = 'Open',
}

export interface AssignmentFormModel extends AssignmentDetailModel {
  CameraAutoComplete: CameraDetailModel;
  VehicleAutoComplete: VehicleDetailModel;
  ExistingCameraAutoComplete: CameraDetailModel;
  ExistingVehicleAutoComplete: VehicleDetailModel;
}
