import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { localStorageService } from 'src/app/localStorage.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ProvincesService } from 'src/app/service/provinces/provinces.service';
import { Variable } from 'src/app/service/variable';

@Component({
  selector: 'app-table-locations',
  // templateUrl: './table-locations.component.html',
  styleUrls: ['./table-locations.component.css'],
  template: `
    <button class="btn btn-light mb-2" (click)="showModalCreateLocationForm()">
      <u>Tạo địa điểm </u>
    </button>
    <nz-table
      #basicTable
      [nzData]="dataOfAllLocation"
      [nzPageSize]="6"
      nzTableLayout="auto"
    >
      <thead>
        <tr>
          <th>Image</th>
          <th>Infomation</th>

          <th>Rate</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of basicTable.data">
          <td class="position-relative">
            <img
              loading="lazy"
              [ngStyle]="{ width: '200px' }"
              alt="{{ data['name'] }}"
              src="{{ data['image'] }}"
            />
            <button
              class="btn position-absolute  btn-primary btn-sm py-0"
              style="bottom: 5px; left: 15px"
              (click)="fileUpload.click()"
            >
              <u> Thay đổi ảnh </u>
              <input
                class="d-none"
                type="file"
                (change)="onFileSelected($event, data['_id'])"
                #fileUpload
              />
            </button>
          </td>
          <td>
            <span class="h6">{{ data['name'] }} </span>
            <br />
            {{ data['province'] }} ,{{ data['country'] }}
          </td>

          <td>
            <nz-rate
              ngModel="{{ data['valueate'] / 2 + 0.5 }}"
              nzDisabled
            ></nz-rate>
          </td>
          <td>
            <button
              class="btn btn-info btn-sm my-1"
              (click)="showModalUpdateModal(data)"
            >
              Sửa
            </button>
            <button class="btn btn-danger btn-sm my-1">
              <a
                nz-popconfirm
                nzPopconfirmTitle="Bạn có chăc muốn xoá điạ điểm này?"
                nzPopconfirmPlacement="bottom"
                (nzOnConfirm)="confirmDeleteLocation(data['_id'])"
                (nzOnCancel)="cancelDeleteLocation()"
              >
                Xoá
              </a>
            </button>
          </td>
        </tr>
      </tbody>
    </nz-table>
    <nz-modal
      [(nzVisible)]="isVisibleUpdateModal"
      [nzTitle]="this.modalTitle"
      (nzOnCancel)="handleCancelUpdateModal()"
      [nzFooter]="modalFooter"
    >
      <ng-container *nzModalContent>
        <form
          nz-form
          [formGroup]="validateUpdateForm"
          (ngSubmit)="submitUpdateForm()"
        >
          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="name"
              >Name</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <input
                nz-input
                formControlName="name"
                id="name"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="province"
              >Province</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <input
                nz-input
                formControlName="province"
                id="province"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="country"
              >Country</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <input
                nz-input
                formControlName="country"
                id="country"
                readonly
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="valueate"
              >Valueate</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <input
                type="number"
                max="10"
                min="0"
                nz-input
                formControlName="valueate"
                id="valueate"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>
        </form>
      </ng-container>
      <ng-template #modalFooter>
        <button
          nz-button
          nzType="default"
          (click)="submitUpdateForm()"
          disabled="{{ this.isDisable }}"
          *ngIf="this.isModalUpdateForm"
        >
          Cập nhật
        </button>
        <button
          nz-button
          nzType="default"
          (click)="submitCreateForm()"
          disabled="{{ !this.validateUpdateForm.valid }}"
          *ngIf="!this.isModalUpdateForm"
        >
          Tạo địa điểm
        </button>
      </ng-template>
    </nz-modal>
  `,
})
export class TableLocationsComponent implements OnInit {
  dataOfAllLocation: any = [];
  validateUpdateForm!: FormGroup;
  dataOfAllProvinceOfVn: any;
  modalTitle = '';
  isModalUpdateForm = false;
  idLocation: string = '';
  Variable: Variable;
  tokenUser: string = '';
  refresh(): void {
    window.location.reload();
  }
  // ---- start Disabled button submit ----

  isDisable = true;

  changeIsDisable() {
    // this.isDisable = false;
    if (this.validateUpdateForm.valid) {
      return (this.isDisable = false);
    } else {
      return (this.isDisable = true);
    }
  }

  // ---- end Disabled button submit ----

  // --- start handle Update Modal ---
  isVisibleUpdateModal = false;
  showModalUpdateModal(_locationInfo: any): void {
    this.isVisibleUpdateModal = true;
    this.isModalUpdateForm = true;
    this.modalTitle = ' Cập nhật thông tin địa điểm';
    this.isDisable = true;
    this.idLocation = _locationInfo._id;
    this.validateUpdateForm.get('name')?.setValue(_locationInfo.name);
    this.validateUpdateForm.get('province')?.setValue(_locationInfo.province);
    this.validateUpdateForm.get('valueate')?.setValue(_locationInfo.valueate);

    console.log(this.idLocation);
  }
  showModalCreateLocationForm() {
    this.isVisibleUpdateModal = true;
    this.modalTitle = ' Tạo điạ điểm';
    this.isModalUpdateForm = false;

    this.validateUpdateForm.get('name')?.setValue(null);
    this.validateUpdateForm.get('province')?.setValue(null);
    this.validateUpdateForm.get('valueate')?.setValue(null);
  }
  handleOkUpdateModal(): void {
    console.log('Button ok clicked!');
    this.isVisibleUpdateModal = false;
  }

  handleCancelUpdateModal(): void {
    console.log('Button cancel clicked!');
    this.isVisibleUpdateModal = false;
  }

  updateLocationInfo(_locationInfo: any) {
    this.updateLocationInfo = _locationInfo;
  }
  // --- end handle Update Modal ---

  // --- start handle Update Form ---
  submitUpdateForm(): void {
    if (this.validateUpdateForm.valid) {
      console.log('submit', this.validateUpdateForm.value);
      const { name, province, country, valueate } =
        this.validateUpdateForm.value;
      console.log(this.validateUpdateForm.value);
      console.log(this.idLocation);

      this.locationService
        .updateInfoLocation(
          this.idLocation,
          name,
          province,
          country,
          valueate,
          this.Variable.tokenAdmin
        )
        .subscribe(
          (res) => {
            this.message.info('Cập nhật  thành công');
            this.isVisibleUpdateModal = false;
            // setTimeout(this.refresh, 500);
            console.log(res);
            this.dataOfAllLocation = this.dataOfAllLocation.map(
              (location: any) => {
                if (location['_id'] === res['_id']) {
                  return (location = res);
                } else {
                  return location;
                }
              }
            );
          },
          (err) => {
            console.log(err);

            this.message.warning(err.error.message);
          }
        );
    } else {
      Object.values(this.validateUpdateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  // --- end handle Update Form ---

  // --- start handle Create Form ---
  submitCreateForm(): void {
    if (this.validateUpdateForm.valid) {
      console.log('submit', this.validateUpdateForm.value);
      const { name, province, country, valueate } =
        this.validateUpdateForm.value;
      this.locationService
        .createNewLocation(
          name,
          province,
          country,
          valueate,
          this.Variable.tokenAdmin
        )
        .subscribe(
          (res) => {
            this.message.info('Tạo địa điểm  thành công');
            setTimeout(this.refresh, 500);
          },
          (err) => {
            console.log(err);

            this.message.warning(err.error.message);
          }
        );
    } else {
      Object.values(this.validateUpdateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  // --- end handle Create Form ---

  // --- start handle Delete location ---

  confirmDeleteLocation(_idLocation: string): void {
    //this.message.info('click ok');
    console.log(_idLocation);
    this.locationService
      .deleteLocation(_idLocation, this.Variable.tokenAdmin)
      .subscribe(
        (res) => {
          this.message.info('Xoá  thành công');
          this.dataOfAllLocation = this.dataOfAllLocation.filter(
            (location: any) => {
              return location['_id'] !== _idLocation;
            }
          );
        },
        (err) => {
          console.log(err);

          this.message.warning(err.error.message);
        }
      );
  }
  cancelDeleteLocation(): void {
    //this.message.info('click cancel');
  }
  // --- end handle Delete location ---

  // --- start Image upload ---
  fileToUpload: File | null = null;
  fileName = '';
  onFileSelected($event: any, _idLocation: string) {
    const file: File = $event.target.files[0];
    if (file) {
      this.locationService
        .updateImgLocation(file, _idLocation, this.Variable.tokenAdmin)
        .subscribe(
          (res) => {
            console.log(res);
            this.message.info('Cập nhật  thành công');
            setTimeout(this.refresh, 500);
          },
          (err) => {
            console.log(err);
            this.message.warning('Cập nhật không thành công');
          }
        );
    }
  }
  constructor(
    private locationService: LocationService,
    private fb: FormBuilder,
    private provinceService: ProvincesService,
    private message: NzMessageService
  ) {
    this.Variable = new Variable();
  }
  // --- end Image Upload ---
  ngOnInit() {
    this.locationService.getAllLocations().subscribe(
      (res) => {
        this.dataOfAllLocation = res;

        console.log(this.dataOfAllLocation);
      },
      (err) => {
        alert(err.message);
      }
    );

    this.validateUpdateForm = this.fb.group({
      name: [null, [Validators.required]],
      province: [null, [Validators.required]],
      country: ['Việt Nam', [Validators.required]],
      valueate: [null, [Validators.required]],
    });

    // const user = this.localService.getUserInfo();
    // console.log(user);
  }
  convertParamLocation(str: string | null) {
    if (str) {
      str = str.replace('Tỉnh', '');
      str = str.replace('Thành phố', '').trim();
      str = str.replace('tinh_', '');
      str = str.replace('thanh_pho_', '');
      return str.trim().toLowerCase();
    } else {
      return null;
    }
  }
}
