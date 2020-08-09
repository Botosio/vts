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
      Id: [null],
      DeviceNo: [null, Validators.required],
      Status: [Status.Open],
    });
  }

  public GetAllCameras(): Observable<CameraDetailModel[]> {
    return (this.storeCameras$ = this.firestore
      .collection<CameraDetailModel>('Camera_DB')
      .valueChanges());
  }

  public AddCamera(form: CameraDetailModel): Promise<any> {
    return this.firestore.collection<CameraDetailModel>('Camera_DB').add(form);
  }
}
