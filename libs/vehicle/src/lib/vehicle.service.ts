import { Injectable } from '@angular/core';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { FormBuilder, Validators } from '@angular/forms';
import { VehicleDetailModel, Status } from './vehicle.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VehicleService {
  public form: IFormGroup<VehicleDetailModel>;
  public formBuilder: IFormBuilder;
  public storeVehicles$: Observable<VehicleDetailModel[]>;

  constructor(formBuilder: FormBuilder, private firestore: AngularFirestore) {
    this.formBuilder = formBuilder;
  }
  /**
   * return a angular formGroup that is strongly typed to VehicleDetailModel
   * @returns IFormGroup<VehicleDetailModel>
   */
  public createForm(): IFormGroup<VehicleDetailModel> {
    return this.formBuilder.group<VehicleDetailModel>({
      Id: [{ value: null, disabled: true }],
      Name: [null, Validators.required],
      Status: [{ value: Status.Open, disabled: true }],
    });
  }
  /**
   * Gets all Vehicles from DB and watches for change
   * @returns Observable
   */
  public GetAllVehicles(): Observable<VehicleDetailModel[]> {
    return (this.storeVehicles$ = this.firestore
      .collection<VehicleDetailModel>('Vehicle_DB')
      .valueChanges());
  }
  /**
   * Gets a Vehicle by Id
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
   * Save a Vehicle object to the DB and returns the form with a new Id if null
   * @param  {VehicleDetailModel} form
   * @returns Promise
   */
  public SaveVehicle(form: VehicleDetailModel): Promise<any> {
    if (!form.Id) form.Id = this.uuidv4();
    return this.firestore
      .collection<VehicleDetailModel>('Vehicle_DB')
      .doc(form.Id)
      .set(form)
      .then(() => {
        return form;
      });
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
}
