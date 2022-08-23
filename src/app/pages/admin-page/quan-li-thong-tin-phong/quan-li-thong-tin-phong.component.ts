import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from 'src/app/service/location/location.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';
import { Variable } from 'src/app/service/variable';

@Component({
  selector: 'app-quan-li-thong-tin-phong',
  // templateUrl: './quan-li-thong-tin-phong.component.html',

  styleUrls: ['./quan-li-thong-tin-phong.component.css'],
  template: `
    <div class="my-2">
      <button class="btn btn-light mb-2" (click)="showModalCreateRoomForm()">
        <u>Tạo phòng cho thuê </u>
      </button>

      <nz-table
        #basicTable
        [nzData]="dataOfAllRoom"
        [nzPageSize]="6"
        nzTableLayout="auto"
      >
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>

            <th>Location</th>
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
            </td>

            <td>
              {{ data['locationId']['province'] }}
            </td>
            <td>
              <button
                class="btn btn-info btn-sm my-1 mr-1"
                (click)="showModalUpdateForm(data)"
              >
                Sửa
              </button>
              <button class="btn btn-danger btn-sm my-1">
                <a
                  nz-popconfirm
                  nzPopconfirmTitle="Bạn có chăc muốn xoá phòng này?"
                  nzPopconfirmPlacement="bottom"
                  (nzOnConfirm)="confirmDeleteRoom(data['_id'])"
                >
                  Xoá
                </a>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
    <nz-modal
      [(nzVisible)]="isModalFormShow"
      [nzTitle]="this.modalTitle"
      [nzFooter]="modalFooter"
      (nzOnCancel)="handleCancelModal()"
    >
      <ng-container *nzModalContent>
        <form nz-form [formGroup]="validateForm">
          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="name"
              >Name</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <input
                type="text"
                nz-input
                formControlName="name"
                id="name"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative ">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="locationId"
              >Location</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <nz-select
                formControlName="locationId"
                nzPlaceHolder="Select location"
                nzAllowClear
                nzShowSearch
              >
                <nz-option
                  *ngFor="let location of dataAllLocation"
                  [nzValue]="location['_id']"
                  [nzLabel]="location['province']"
                ></nz-option>
              </nz-select>
            </nz-form-control>

            <ng-template #renderTemplate>
              <nz-spin *ngIf="isLoading"></nz-spin>
            </ng-template>
          </nz-form-item>
          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="guests"
              >Guests</nz-form-label
            >
            <nz-form-control [nzSm]="4" [nzXs]="24">
              <input
                type="number"
                min="0"
                nz-input
                formControlName="guests"
                id="guests"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>

            <nz-form-label
              [nzSm]="4"
              [nzXs]="24"
              nzRequired
              nzFor="bedRoom"
              nzOffset="2"
              >Bedroom</nz-form-label
            >
            <nz-form-control [nzSm]="4" [nzXs]="24">
              <input
                type="number"
                min="0"
                nz-input
                formControlName="bedRoom"
                id="bedRoom"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="bath"
              >Bath</nz-form-label
            >
            <nz-form-control [nzSm]="4" [nzXs]="24">
              <input
                type="number"
                min="0"
                nz-input
                formControlName="bath"
                id="bath"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzRequired nzFor="price"
              >Price</nz-form-label
            >
            <nz-form-control [nzSm]="6" [nzXs]="24">
              <input
                type="number"
                min="0"
                nz-input
                formControlName="price"
                id="price"
                (ngModelChange)="changeIsDisable()"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="facilities"
              >Facilities</nz-form-label
            >
            <nz-form-control [nzSm]="20" [nzXs]="24">
              <nz-checkbox-wrapper (nzOnChange)="changeIsDisable()">
                <div nz-row>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="elevator"
                      class="text-capitalize"
                      >elevator</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="hotTub"
                      class="text-capitalize"
                      >Hot tub</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="pool"
                      class="text-capitalize"
                      >pool</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="indoorFireplace"
                      class="text-capitalize"
                      >indoor fireplace</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="dryer"
                      class="text-capitalize"
                      >dryer</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="gym"
                      class="text-capitalize"
                      >gym</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="kitchen"
                      class="text-capitalize"
                      >kitchen</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="wifi"
                      class="text-capitalize"
                      >wifi</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="heating"
                      class="text-capitalize"
                      >heating</label
                    >
                  </div>
                  <div nz-col nzSpan="8">
                    <label
                      nz-checkbox
                      formControlName="cableTV"
                      class="text-capitalize"
                      >Cable TV</label
                    >
                  </div>
                </div>
              </nz-checkbox-wrapper>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item class="position-relative">
            <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="description"
              >Description</nz-form-label
            >
            <nz-form-control [nzSm]="14" [nzXs]="24">
              <textarea
                nz-input
                formControlName="description"
                id="description"
                (ngModelChange)="changeIsDisable()"
              ></textarea>
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
          disabled="{{ !this.validateForm.valid }}"
          *ngIf="!this.isModalUpdateForm"
        >
          Tạo phòng
        </button>
      </ng-template>
    </nz-modal>
  `,
})
export class QuanLiThongTinPhongComponent implements OnInit {
  isModalFormShow = false;
  isDisable = true;
  modalTitle = '';
  dataOfAllRoom: any = [];
  Variable: Variable;
  validateForm!: FormGroup;
  isModalUpdateForm = true;
  isLoading = false;
  selectedLocation = null;
  dataAllLocation = [];
  idRoomUpdate: string = '';
  idLocationId: any;
  constructor(
    private roomService: RoomForRentService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.Variable = new Variable();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      guests: [null, [Validators.required]],
      bedRoom: [null, [Validators.required]],
      bath: [null, [Validators.required]],
      description: [null],
      price: [null, [Validators.required]],
      elevator: [false],
      hotTub: [false],
      pool: [false],
      indoorFireplace: [false],
      dryer: [false],
      gym: [false],
      kitchen: [false],
      wifi: [false],
      heating: [false],
      cableTV: [false],
      locationId: [null, [Validators.required]],
    });
    this.roomService.getListRoomForRent().subscribe(
      (res) => {
        this.dataOfAllRoom = res.filter((room: any) => room['locationId']);

        console.log(this.dataOfAllRoom);
      },
      (err) => {
        alert(err.message);
      }
    );
    this.locationService.getAllLocations().subscribe(
      (res) => {
        this.isLoading = false;
        this.dataAllLocation = res;
        console.log(this.dataAllLocation);
      },
      (err) => alert(err.error.message)
    );
  }

  // --- start Image upload ---
  fileToUpload: File | null = null;
  fileName = '';
  refresh(): void {
    window.location.reload();
  }
  changeIsDisable() {
    this.isDisable = false;
  }
  onFileSelected($event: any, _idRoom: string) {
    const file: File = $event.target.files[0];
    if (file) {
      this.roomService
        .updateImgRoomForRent(file, _idRoom, this.Variable.tokenAdmin)
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
  // --- Create Room Form ---
  showModalCreateRoomForm() {
    this.validateForm.reset();
    this.isModalFormShow = true;
    this.isModalUpdateForm = false;
    this.modalTitle = 'Tạo phòng cho thuê';
    this.validateForm.get('dryer')?.setValue(false);
    this.validateForm.get('kitchen')?.setValue(false);
    this.validateForm.get('wifi')?.setValue(false);
    this.validateForm.get('heating')?.setValue(false);
    this.validateForm.get('cableTV')?.setValue(false);
    this.validateForm.get('elevator')?.setValue(false);
    this.validateForm.get('hotTub')?.setValue(false);
    this.validateForm.get('pool')?.setValue(false);
    this.validateForm.get('indoorFireplace')?.setValue(false);
    this.validateForm.get('gym')?.setValue(false);
  }
  showModalUpdateForm(_room: any) {
    this.isModalFormShow = true;
    this.isModalUpdateForm = true;
    this.idRoomUpdate = _room['_id'];
    console.log(_room['locationId']);

    this.idLocationId = this.findIdLocationFormLocation(_room['locationId']);
    //console.log(this.idLocationId);

    this.modalTitle = 'Sửa thông tin phòng cho thuê';
    this.validateForm.get('name')?.setValue(_room.name);
    this.validateForm.get('locationId')?.setValue(this.idLocationId);
    this.validateForm.get('guests')?.setValue(_room.guests);
    this.validateForm.get('bedRoom')?.setValue(_room.bedRoom);
    this.validateForm.get('bath')?.setValue(_room.bath);
    this.validateForm.get('description')?.setValue(_room.description);
    this.validateForm.get('price')?.setValue(_room.price);
    this.validateForm.get('elevator')?.setValue(_room.elevator);
    this.validateForm.get('hotTub')?.setValue(_room.hotTub);
    this.validateForm.get('pool')?.setValue(_room.pool);
    this.validateForm.get('indoorFireplace')?.setValue(_room.indoorFireplace);
    this.validateForm.get('dryer')?.setValue(_room.dryer);
    this.validateForm.get('kitchen')?.setValue(_room.kitchen);
    this.validateForm.get('wifi')?.setValue(_room.wifi);
    this.validateForm.get('heating')?.setValue(_room.heating);
    this.validateForm.get('cableTV')?.setValue(_room.cableTV);
    this.validateForm.get('gym')?.setValue(_room.gym);
  }

  confirmDeleteRoom(_idRoom: string) {
    console.log(_idRoom);
    this.roomService
      .deleteRoomForRent(_idRoom, this.Variable.tokenAdmin)
      .subscribe(
        (res) => {
          this.message.success('Xoá  thành công');
          this.dataOfAllRoom = this.dataOfAllRoom.filter(
            (room: any) => room['_id'] !== _idRoom
          );
        },
        (err) => {
          this.message.warning('Xoá thất bại');
        }
      );

    //console.log(this.dataOfAllRoom);
  }

  submitUpdateForm(): void {
    if (this.validateForm.valid) {
      console.log('submit Update Form', this.validateForm.value);
      const {
        name,
        guests,
        bedRoom,
        bath,
        description,
        price,
        elevator,
        hotTub,
        pool,
        indoorFireplace,
        dryer,
        gym,
        kitchen,
        wifi,
        heating,
        cableTV,
        locationId,
      } = this.validateForm.value;
      this.roomService
        .updateInforRoomForRent(
          name,
          guests,
          bedRoom,
          bath,
          description,
          price,
          elevator,
          hotTub,
          pool,
          indoorFireplace,
          dryer,
          gym,
          kitchen,
          wifi,
          heating,
          cableTV,
          locationId,
          this.idRoomUpdate,
          this.Variable.tokenAdmin
        )
        .subscribe(
          (resUserservice) => {
            this.message.info('Cập nhật  thành công');
            this.isModalUpdateForm = false;
            this.isModalFormShow = false;

            console.log(resUserservice);
            this.locationService
              .getInfoLocation(resUserservice['locationId'])
              .subscribe((resLocationService) => {
                resUserservice['locationId'] = resLocationService;
                console.log(resUserservice);
                this.dataOfAllRoom = this.dataOfAllRoom.map((room: any) => {
                  if (room['_id'] === resUserservice['_id']) {
                    return (room = { ...resUserservice });
                  } else {
                    return room;
                  }
                });
              });
          },
          (err) => this.message.warning(err.error.message)
        );
    } else {
      console.log('loi update form');
    }
  }

  submitCreateForm(): void {
    if (this.validateForm.valid) {
      console.log('submit Create Form', this.validateForm.value);
      const {
        name,
        guests,
        bedRoom,
        bath,
        description,
        price,
        elevator,
        hotTub,
        pool,
        indoorFireplace,
        dryer,
        gym,
        kitchen,
        wifi,
        heating,
        cableTV,
        locationId,
      } = this.validateForm.value;
      this.roomService
        .createNewRoomForRent(
          name,
          guests,
          bedRoom,
          bath,
          description,
          price,
          elevator,
          hotTub,
          pool,
          indoorFireplace,
          dryer,
          gym,
          kitchen,
          wifi,
          heating,
          cableTV,
          locationId,
          this.Variable.tokenAdmin
        )
        .subscribe(
          (res) => {
            this.message.info('Tạo phòng  thành công');
            setTimeout(this.refresh, 500);
          },
          (err) => this.message.warning(err.error.message)
        );
    } else {
      console.log('loi Create form');
    }
  }

  handleCancelModal() {
    this.isModalFormShow = false;
  }

  // loadMore(): void {
  //   this.isLoading = true;
  //   this.roomService.getListRoomForRent().subscribe(
  //     (res) => {
  //       this.dataOfAllRoom = res.filter((room: any) => room['locationId']);

  //       console.log(this.dataOfAllRoom);
  //     },
  //     (err) => {
  //       alert(err.message);
  //     }
  //   );
  //   // this.locationService.getAllLocations().subscribe(
  //   //   (res) => {
  //   //     this.isLoading = false;
  //   //     this.dataAllLocation = res;
  //   //     console.log(this.dataAllLocation);
  //   //   },
  //   //   (err) => alert(err.error.message)
  //   // );
  // }

  findIdLocationFormLocation(_locationIdInRoom: any) {
    let result = '';
    this.dataAllLocation.forEach((location) => {
      if (
        location['name'] === _locationIdInRoom['name'] &&
        location['province'] === _locationIdInRoom['province']
      ) {
        //console.log(location['_id']);
        result = location['_id'];
      }
    });
    return result;
  }

  // onSearch(value: string): void {
  //   this.isLoading = true;
  //   console.log(value);
  //   this.dataOfAllRoom = this.dataOfAllRoom.filter((location: any) => {
  //     if (location['province'] === undefined) {
  //       return false;
  //     } else {
  //       console.log('11');

  //       return location['province'].indexOf(value) !== -1;
  //     }
  //   });
  // }
}
