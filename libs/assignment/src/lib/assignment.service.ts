import { Injectable } from '@angular/core';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { FormBuilder, Validators } from '@angular/forms';
import {
  AssignmentDetailModel,
  Status,
  AssignmentFormModel,
} from './assignment.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleDetailModel } from '@vts/vehicle-lib';
import { CameraDetailModel } from '@vts/camera-lib';

@Injectable()
export class AssignmentService {
  public form: IFormGroup<AssignmentFormModel>;
  public formBuilder: IFormBuilder;
  public storeAssignments$: Observable<AssignmentDetailModel[]>;

  constructor(formBuilder: FormBuilder, private firestore: AngularFirestore) {
    this.formBuilder = formBuilder;
  }

  /**
   * return a angular formGroup that is strongly typed to AssignmentFormModel
   * @returns IFormGroup<AssignmentFormModel>
   */
  public createForm(): IFormGroup<AssignmentFormModel> {
    return this.formBuilder.group<AssignmentFormModel>({
      Id: [{ value: null, disabled: true }],
      Name: [null, Validators.required],
      Status: [{ value: Status.Open, disabled: true }],
      CameraId: [null, Validators.required],
      VehicleId: [null, Validators.required],
      DateCreated: [{ value: new Date().toString(), disabled: true }],
      CameraAutoComplete: [null],
      VehicleAutoComplete: [null],
      ExistingCameraAutoComplete: [null],
      ExistingVehicleAutoComplete: [null],
    });
  }

  /**
   * Retrieves all assignments for a list view and watches for any changes on the database side
   * @returns Observable
   */
  public GetAllAssignments(): Observable<AssignmentDetailModel[]> {
    return (this.storeAssignments$ = this.firestore
      .collection<AssignmentDetailModel>('Assignment_DB')
      .valueChanges());
  }

  /**
   * Gets an assignment by Id
   * @param  {string} id
   * @returns Observable
   */
  public GetAssignment(id: string): Observable<AssignmentDetailModel> {
    return this.firestore
      .doc<AssignmentDetailModel>('Assignment_DB/' + id)
      .get()
      .pipe(map((fireStore) => fireStore.data() as AssignmentDetailModel));
  }

  public DeleteAssignment(assignment: AssignmentFormModel): Promise<any> {
    return new Promise((resolve, reject) => {
      let firestoreBatch = this.firestore.firestore.batch();
      this.batchAssignmentDetailDelete(assignment).then(() => {
        firestoreBatch = this.batchCameraDetailDelete(
          firestoreBatch,
          assignment
        );
        firestoreBatch = this.batchVehicleDetailDelete(
          firestoreBatch,
          assignment
        );

        resolve(firestoreBatch.commit());
      });
    });
  }

  /**
   * firestore batch process to delete assignment by id
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchAssignmentDetailDelete(
    assignment: AssignmentFormModel
  ): Promise<any> {
    return this.firestore
      .collection<AssignmentDetailModel>('Assignment_DB')
      .doc(assignment.Id)
      .delete();
  }

  /**
   * Saves the assignment, creates a GUID if Id is null
   * @param  {AssignmentFormModel} form
   * @returns Promise
   */
  public SaveAssignment(form: AssignmentFormModel): Promise<any> {
    if (!form.Id) form.Id = this.uuidv4();
    return this.batchAssignmentSave(form);
  }

  /**
   * Save at the most 5 records or at the least 3, all at the same time.
   * Will assign and open camera/vehicle inventory
   * Will update assignment also.
   * @param  {AssignmentFormModel} assignment
   * @returns Promise
   */
  private batchAssignmentSave(assignment: AssignmentFormModel): Promise<any> {
    return new Promise((resolve, reject) => {
      let firestoreBatch = this.firestore.firestore.batch();

      firestoreBatch = this.batchCameraDetailSave(firestoreBatch, assignment);
      firestoreBatch = this.batchVehicleDetailSave(firestoreBatch, assignment);
      firestoreBatch = this.batchAssignmentDetailSave(
        firestoreBatch,
        assignment
      );

      resolve(firestoreBatch.commit().then(() => assignment));
    });
  }

  /**
   * firestore batch process to save all data or nothing
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchCameraDetailSave(
    firestoreBatch: firebase.firestore.WriteBatch,
    assignment: AssignmentFormModel
  ): firebase.firestore.WriteBatch {
    assignment.CameraAutoComplete.Status = Status.Assigned;
    let fireStoreCollectionRef = this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .doc(assignment.CameraAutoComplete.Id).ref;
    firestoreBatch.set(fireStoreCollectionRef, assignment.CameraAutoComplete, {
      merge: true,
    });
    if (assignment.ExistingCameraAutoComplete) {
      assignment.ExistingCameraAutoComplete.Status = Status.Open;
      fireStoreCollectionRef = this.firestore
        .collection<CameraDetailModel>('Camera_DB')
        .doc(assignment.ExistingCameraAutoComplete.Id).ref;
      firestoreBatch.set(
        fireStoreCollectionRef,
        assignment.ExistingCameraAutoComplete,
        { merge: true }
      );
    }

    return firestoreBatch;
  }

  /**
   * firestore batch process to save all data or nothing
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchVehicleDetailSave(
    firestoreBatch: firebase.firestore.WriteBatch,
    assignment: AssignmentFormModel
  ): firebase.firestore.WriteBatch {
    assignment.VehicleAutoComplete.Status = Status.Assigned;
    assignment.DateCreated = assignment.DateCreated.toString();
    let fireStoreCollectionRef = this.firestore
      .collection<VehicleDetailModel>('Vehicle_DB')
      .doc(assignment.VehicleAutoComplete.Id).ref;
    firestoreBatch.set(fireStoreCollectionRef, assignment.VehicleAutoComplete, {
      merge: true,
    });
    if (assignment.ExistingVehicleAutoComplete) {
      assignment.ExistingVehicleAutoComplete.Status = Status.Open;
      fireStoreCollectionRef = this.firestore
        .collection<VehicleDetailModel>('Vehicle_DB')
        .doc(assignment.ExistingVehicleAutoComplete.Id).ref;
      firestoreBatch.set(
        fireStoreCollectionRef,
        assignment.ExistingVehicleAutoComplete,
        { merge: true }
      );
    }

    return firestoreBatch;
  }

  /**
   * firestore batch process to save all data or nothing
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchAssignmentDetailSave(
    firestoreBatch: firebase.firestore.WriteBatch,
    assignment: AssignmentFormModel
  ): firebase.firestore.WriteBatch {
    let fireStoreCollectionRef = this.firestore
      .collection<AssignmentDetailModel>('Assignment_DB')
      .doc(assignment.Id).ref;
    const {
      CameraAutoComplete,
      VehicleAutoComplete,
      ExistingCameraAutoComplete,
      ExistingVehicleAutoComplete,
      ...coreAssignment
    } = assignment;
    firestoreBatch.set(fireStoreCollectionRef, coreAssignment, {
      merge: true,
    });

    return firestoreBatch;
  }

  /**
   * firestore batch process to update status to open for Camera
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchCameraDetailDelete(
    firestoreBatch: firebase.firestore.WriteBatch,
    assignment: AssignmentFormModel
  ): firebase.firestore.WriteBatch {
    assignment.CameraAutoComplete.Status = Status.Open;
    let fireStoreCollectionRef = this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .doc(assignment.CameraAutoComplete.Id).ref;
    firestoreBatch.set(fireStoreCollectionRef, assignment.CameraAutoComplete, {
      merge: true,
    });
    return firestoreBatch;
  }

  /**
   * firestore batch process to update status to open for Vehicle
   * @param  {firebase.firestore.WriteBatch} firestoreBatch
   * @param  {AssignmentFormModel} assignment
   * @returns firebase
   */
  private batchVehicleDetailDelete(
    firestoreBatch: firebase.firestore.WriteBatch,
    assignment: AssignmentFormModel
  ): firebase.firestore.WriteBatch {
    assignment.VehicleAutoComplete.Status = Status.Open;
    let fireStoreCollectionRef = this.firestore
      .collection<CameraDetailModel>('Vehicle_DB')
      .doc(assignment.VehicleAutoComplete.Id).ref;
    firestoreBatch.set(fireStoreCollectionRef, assignment.VehicleAutoComplete, {
      merge: true,
    });
    return firestoreBatch;
  }

  /**
   * Creates a Javascript GUID, you shouldn't do this.
   * This is only for a demo
   */
  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
      c
    ) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  /**
   * Gets all Vehicles
   * @returns Observable
   */
  public GetAllVehicles(): Observable<VehicleDetailModel[]> {
    return this.firestore
      .collection<VehicleDetailModel>('Vehicle_DB')
      .valueChanges();
  }
  /**
   * Get a single vehicle by Id
   * @param  {string} id
   * @returns Observable
   */
  public GetVehicle(id: string): Observable<VehicleDetailModel> {
    return this.firestore
      .doc<VehicleDetailModel>('Vehicle_DB/' + id)
      .get()
      .pipe(map((fireStore) => fireStore.data() as VehicleDetailModel));
  }
  /**
   * Gets all Cameras
   * @returns Observable
   */
  public GetAllCameras(): Observable<CameraDetailModel[]> {
    return this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .valueChanges();
  }
  /**
   * Gets a single Camera by Id
   * @param  {string} id
   * @returns Observable
   */
  public GetCamera(id: string): Observable<CameraDetailModel> {
    return this.firestore
      .doc<CameraDetailModel>('Camera_DB/' + id)
      .get()
      .pipe(map((fireStore) => fireStore.data() as CameraDetailModel));
  }
}
