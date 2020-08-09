export interface VehicleDetailModel {
  Id: string;
  Name: string;
  Status: Status;
}

export enum Status {
  Assigned = 'Assigned',
  Deleted = 'Deleted',
  Open = 'Open',
}
