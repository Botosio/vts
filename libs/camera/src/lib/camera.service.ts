import { Injectable } from '@angular/core';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { FormBuilder, Validators } from '@angular/forms';
import { CameraDetailModel, Status } from './camera.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CameraService {
  public form: IFormGroup<CameraDetailModel>;
  public formBuilder: IFormBuilder;
  public storeCameras$: Observable<CameraDetailModel[]>;

  constructor(formBuilder: FormBuilder, private firestore: AngularFirestore) {
    this.formBuilder = formBuilder;
  }

  /**
   * return a angular formGroup that is strongly typed to CameraDetailModel
   * @returns IFormGroup<CameraDetailModel>
   */
  public createForm(): IFormGroup<CameraDetailModel> {
    return this.formBuilder.group<CameraDetailModel>({
      Id: [{ value: null, disabled: true }],
      DeviceNo: [null, Validators.required],
      Status: [{ value: Status.Open, disabled: true }],
    });
  }
  /**
   * gets all cameras from DB and watches for change
   * @returns Observable
   */
  public GetAllCameras(): Observable<CameraDetailModel[]> {
    return (this.storeCameras$ = this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .valueChanges());
  }
  /**
   * Gets a Camera by Id
   * @param  {string} id
   * @returns Observable
   */
  public GetCamera(id: string): Observable<CameraDetailModel> {
    return this.firestore
      .doc<CameraDetailModel>('Camera_DB/' + id)
      .get()
      .pipe(map((fireStore) => fireStore.data() as CameraDetailModel));
  }

  /**
   * Save a camera object to the DB and returns the form with a new Id if null
   * @param  {CameraDetailModel} form
   * @returns Promise
   */
  public SaveCamera(form: CameraDetailModel): Promise<any> {
    if (!form.Id) form.Id = this.uuidv4();
    return this.firestore
      .collection<CameraDetailModel>('Camera_DB')
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
