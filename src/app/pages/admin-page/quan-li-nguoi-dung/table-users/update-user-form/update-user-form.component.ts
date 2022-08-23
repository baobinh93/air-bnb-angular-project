import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/service/user/userService.service';
import { Variable } from 'src/app/service/variable';
@Component({
  selector: 'app-update-user-form',
  // templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.css'],
  template: `
    <form
      nz-form
      [formGroup]="validateForm"
      (ngSubmit)="submitForm()"
      v
      class="py-5 "
    >
      <nz-form-item class="position-relative">
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="name" nzRequired
          >Name</nz-form-label
        >
        <nz-form-control
          [nzSm]="14"
          [nzXs]="24"
          nzErrorTip="Please input your name!"
        >
          <input
            formControlName="name"
            id="name"
            type="text"
            nz-input
            (ngModelChange)="changeOpenUpdateBtn()"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="phoneNumber" nzRequired
          >Phone
        </nz-form-label>
        <nz-form-control
          [nzSm]="14"
          [nzXs]="24"
          [nzValidateStatus]="validateForm.controls['phoneNumber']"
          [nzErrorTip]="errorTpl2"
        >
          <input
            formControlName="phone"
            id="'phoneNumber'"
            nz-input
            (ngModelChange)="changeOpenUpdateBtn()"
          />

          <ng-template #errorTpl2 let-control>
            <ng-container *ngIf="control.hasError('required')"
              >Please input your phone number!</ng-container
            >
            <ng-container *ngIf="control.hasError('pattern')">
              Phone number is invalid!
            </ng-container>
          </ng-template>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item class="position-relative">
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="birthday" nzRequired
          >Birthday</nz-form-label
        >
        <nz-form-control
          [nzSm]="14"
          [nzXs]="24"
          nzErrorTip="Please input your birthday!"
        >
          <input
            formControlName="birthday"
            id="birthday"
            type="date"
            nz-input
            (ngModelChange)="changeOpenUpdateBtn()"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item class="position-relative">
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="address" nzRequired
          >Address</nz-form-label
        >
        <nz-form-control
          [nzSm]="14"
          [nzXs]="24"
          nzErrorTip="Please input your address!"
        >
          <input
            formControlName="address"
            id="address"
            type="text"
            nz-input
            (ngModelChange)="changeOpenUpdateBtn()"
          />
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="gender" nzRequired
          >Gender</nz-form-label
        >
        <nz-form-control [nzSm]="14" [nzXs]="24">
          <nz-radio-group
            formControlName="gender"
            (ngModelChange)="changeOpenUpdateBtn()"
          >
            <label nz-radio [nzValue]="true">Male</label>
            <label nz-radio [nzValue]="false">Female</label>
          </nz-radio-group>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="type" nzRequired
          >Type</nz-form-label
        >
        <nz-form-control [nzSm]="6" [nzXs]="12">
          <!-- <nz-radio-group
            formControlName="type"
            (ngModelChange)="changeOpenUpdateBtn()"
          >
            <label nz-radio [nzValue]="'ADMIN'">ADMIN</label>
            <label nz-radio [nzValue]="'CLIENT'">CLIENT</label>
          </nz-radio-group> -->
          <nz-select
            formControlName="type"
            (ngModelChange)="changeOpenUpdateBtn()"
          >
            <nz-option [nzValue]="'ADMIN'" nzLabel="Admin"></nz-option>
            <nz-option [nzValue]="'CLIENT'" nzLabel="Client"></nz-option>
          </nz-select>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item nz-row class="register-area">
        <nz-form-control [nzSpan]="14" [nzOffset]="10">
          <button [disabled]="this.openUpdateBtn" nz-button nzType="primary">
            Update
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
})
export class UpdateUserFormComponent implements OnInit {
  @Input() dataUserToUpdate: any = {};
  @Output() updateUserInfo = new EventEmitter();
  sendDataToParent(_userInfo: {}) {
    this.updateUserInfo.emit(_userInfo);
  }
  openUpdateBtn = true;
  validateForm!: FormGroup;
  Variable: Variable;
  changeOpenUpdateBtn() {
    if (this.validateForm.valid) {
      return (this.openUpdateBtn = false);
    } else {
      return (this.openUpdateBtn = true);
    }
  }
  refresh(): void {
    window.location.reload();
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      let { name, email, phone, birthday, gender, address, type } =
        this.validateForm.value;
      console.log('dataSend', {
        name,
        email,
        phone,
        birthday,
        gender,
        address,
        type,
      });
      this.userService
        .updateUserInfo(
          this.dataUserToUpdate._id,
          name,
          email,
          phone,
          birthday,
          gender,
          type,
          address,
          this.Variable.tokenAdmin
        )
        .subscribe(
          (res) => {
            this.message.info('Cập nhật thành công');
            //setTimeout(this.refresh, 500);
            this.sendDataToParent(res);
            console.log(res);
          },
          (err) => {
            this.message.warning(err.message);
          }
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private message: NzMessageService
  ) {
    this.Variable = new Variable();
  }

  ngOnInit() {
    // console.log(this.Variable);
    const dataUser = this.dataUserToUpdate;
    this.validateForm = this.fb.group({
      phone: [
        dataUser.phone,
        [Validators.required, Validators.pattern('^[0-9-+]{9,15}$')],
      ],

      birthday: [dataUser.birthday.split('T')[0], [Validators.required]],
      address: [dataUser.address, [Validators.required]],
      gender: [dataUser.gender],
      type: [dataUser.type],
      name: [dataUser.name, [Validators.required]],
      email: [dataUser.email],
    });
  }
}
