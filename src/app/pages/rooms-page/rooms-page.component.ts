import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LocationService } from 'src/app/service/location/location.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';

@Component({
  selector: 'app-rooms-page',
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.css'],
})
export class RoomsPageComponent implements OnInit {
  public paramsLocationToFindRooms: string | null = '';
  dataAllLocation = [];
  allIdLocationNeedToFindRoom: any[] = [];
  dataAllRooms: any[] = [];
  test: any;
  isLoading = true;
  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private roomsService: RoomForRentService
  ) {}
  convertParamLocation(str: string | null) {
    if (str) {
      str = str.replace('Tỉnh', '');
      str = str.replace('Thành phố', '').trim();
      str = str.replace('tinh_', '');
      str = str.replace('thanh_pho_', '');
      return str;
    } else {
      return null;
    }
  }
  transformVn(str: string) {
    if (str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
      str = str.replace(/đ/g, 'd');
      // Some system encode vietnamese combining accent as individual utf-8 characters
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
      str = str.replace(/\s+/g, '_');
      str = str.toLowerCase();
      return str;
    }
    return 'no';
  }
  async getRoomsList() {
    this.paramsLocationToFindRooms = this.convertParamLocation(
      this.route.snapshot.paramMap.get('locationCodeName')
    );
    // const allLocation = await this.locationService
    //   .getAllLocations()
    //   // .toPromise();
    //   .subscribe(
    //     (result) => {
    //       this.dataAllLocation = result;
    //       //  console.log('dataAllLocation:', this.dataAllLocation);

    //       this.dataAllLocation.forEach((location, index) => {
    //         if (
    //           this.transformVn(location['province']) ==
    //           this.paramsLocationToFindRooms
    //         ) {
    //           this.allIdLocationNeedToFindRoom.push(location['_id']);
    //           // console.log(this.allIdLocationNeedToFindRoom);
    //         }
    //       });

    //     },
    //     (err) => {
    //       console.warn(err.error.message);
    //       this.isLoading = false;
    //       console.log('loading', this.isLoading);
    //     }
    //   );

    const allRooms = await this.roomsService.getListRoomForRent().subscribe(
      (res) => {
        const allRooms = res;
        console.log('allRooms:', res);
        allRooms.forEach((room: any) => {
          if (
            room['locationId'] &&
            room['locationId']['province'] &&
            this.transformVn(room['locationId']['province']) ===
              this.paramsLocationToFindRooms
          ) {
            //console.log(this.transformVn(room['locationId']['province']));
            this.dataAllRooms.push(room);
          }
        });
        this.isLoading = false;
      },
      (err) => {
        console.warn(err.error.message);
        this.isLoading = false;
      }
    );
  }
  ngOnInit() {
    this.paramsLocationToFindRooms = this.convertParamLocation(
      this.route.snapshot.paramMap.get('locationCodeName')
    );

    console.log('get code name on url :', this.paramsLocationToFindRooms);

    // this.locationService.getAllLocations().subscribe(
    //   (result) => {
    //     this.dataAllLocation = result;
    //     console.log('dataAllLocation:', this.dataAllLocation);

    //     this.dataAllLocation.forEach((location, index) => {
    //       if (
    //         this.transformVn(location['province']) ==
    //         this.paramsLocationToFindRooms
    //       ) {
    //         this.allIdLocationNeedToFindRoom.push(location['_id']);
    //         console.log(this.allIdLocationNeedToFindRoom);
    //       }
    //     });
    //     setTimeout(() => (this.isLoading = false), 1000);
    //   },
    //   (err) => {
    //     console.warn(err.error.message);
    //     this.isLoading = false;
    //     console.log('loading', this.isLoading);
    //   }
    // );

    // this.roomsService.getListRoomForRent().subscribe(
    //   (result) => {
    //     this.dataAllRooms = result;
    //     console.log(this.dataAllRooms);
    //   },
    //   (err) => {
    //     console.warn(err.error.message);
    //   }
    // );

    this.getRoomsList();
  }
}
