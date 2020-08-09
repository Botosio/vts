import { Injectable } from '@angular/core';
import { IFormGroup, IFormBuilder } from '@rxweb/types';
import { FormBuilder, Validators } from '@angular/forms';
import { CameraDetailModel, Status } from './camera.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class CameraService {
  // private _db: AngularFirestore;
  public form: IFormGroup<CameraDetailModel>;
  public formBuilder: IFormBuilder;
  public storeCameras$: Observable<CameraDetailModel[]>;

  constructor(formBuilder: FormBuilder, private firestore: AngularFirestore) {
    // this._db = db;
    this.formBuilder = formBuilder;
  }

  public createForm() {
    return this.formBuilder.group<CameraDetailModel>({
      Id: [{ value: null, disabled: true }],
      DeviceNo: [null, Validators.required],
      Status: [{ value: Status.Open, disabled: true }],
    });
  }

  public GetAllCameras(): Observable<CameraDetailModel[]> {
    return (this.storeCameras$ = this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .valueChanges());
  }

  public GetCamera(id: string): Observable<CameraDetailModel> {
    return this.firestore
      .doc<CameraDetailModel>('Camera_DB/' + id)
      .get()
      .pipe(map((fireStore) => fireStore.data() as CameraDetailModel));
  }

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
