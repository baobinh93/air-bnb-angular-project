import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { localStorageService } from 'src/app/localStorage.service';
import { LocationService } from 'src/app/service/location/location.service';
import { ProvincesService } from 'src/app/service/provinces/provinces.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';
import Typed from 'typed.js';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  //localStorageService;
  //userInfo: object = {};
  bgImg: string = 'assets/imgs/searchBg.jpg';
  hcmImg: string = 'assets/imgs/tphcm.jpg';
  phongNguImg: string = 'assets/imgs/phongNgu.jpeg';
  allProvincesOfVn = [];
  dataRoom01: any = {};
  dataRoom02: any = {};
  dataRoom03: any = {};

  rentalsOfHanoi: number = 0;
  rentalsOfHoChiMinh: number = 0;
  rentalsOfDaNang: number = 0;
  rentalsOfVungTau: number = 0;
  rentalsOfCanTho: number = 0;
  rentalsOfPhuQuoc: number = 0;
  rentalsOfNhaTrang: number = 0;
  rentalsOfHoiAn: number = 0;
  @ViewChild('searchForm') searchForm!: NgForm;

  constructor(
    private provinces: ProvincesService,
    private roomsServices: RoomForRentService,
    private locationService: LocationService,
    private router: Router
  ) {
    // this.localStorageService = new localStorageService();
  }

  ngOnInit() {
    const options = {
      strings: ['Cities', 'Places', 'Hotels'],
      typeSpeed: 100,
      backSpeed: 100,
      showCursor: true,
      cursorChar: '|',
      loop: true,
    };

    const typed = new Typed('.typed-element', options);

    this.provinces.getAllVNProvinces().subscribe(
      (result) => {
        //console.log('result', result);

        this.allProvincesOfVn = result;
      },
      (err) => {
        alert(err.error.message);
      }
    );

    //this.userInfo = this.localStorageService.getUserInfo();
    this.roomsServices.getInfoRoomForRent('620604c6fee2fc001cd7b8f0').subscribe(
      (res) => {
        this.dataRoom01 = { ...res };
        //console.log(this.dataRoom01);
      },
      (err) => console.log(err)
    );
    this.roomsServices.getInfoRoomForRent('61698c5fefe193001c0a5baa').subscribe(
      (res) => {
        this.dataRoom02 = { ...res };
        //console.log(this.dataRoom02);
      },
      (err) => console.log(err)
    );
    this.roomsServices.getInfoRoomForRent('6172397eefe193001c0a7a4a').subscribe(
      (res) => {
        this.dataRoom03 = { ...res };
        // console.log(this.dataRoom03);
      },
      (err) => console.log(err)
    );

    this.findRentalsOfLocation();
  }

  handleSearchSubmit() {
    //  console.log('sm ne', this.searchForm.value);
    const { location } = this.searchForm.value;

    this.router.navigate(['rooms', this.transformVn(location)]);
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
    return null;
  }

  async findRentalsOfLocation() {
    const allRooms = await this.roomsServices.getListRoomForRent().toPromise();

    console.log('allRooms', allRooms);

    allRooms.forEach((room: any) => {
      if (room['locationId'] && room['locationId']['province']) {
        this.transformVn(room['locationId']['province']) === 'ha_noi' &&
          this.rentalsOfHanoi++;
        this.transformVn(room['locationId']['province']) === 'ho_chi_minh' &&
          this.rentalsOfHoChiMinh++;
        this.transformVn(room['locationId']['province']) === 'da_nang' &&
          this.rentalsOfDaNang++;
        this.transformVn(room['locationId']['province']) === 'vung_tau' &&
          this.rentalsOfVungTau++;
        this.transformVn(room['locationId']['province']) === 'can_tho' &&
          this.rentalsOfCanTho++;
        this.transformVn(room['locationId']['province']) === 'phu_quoc' &&
          this.rentalsOfPhuQuoc++;
        this.transformVn(room['locationId']['province']) === 'nha_trang' &&
          this.rentalsOfNhaTrang++;
        this.transformVn(room['locationId']['province']) === 'hoi_an' &&
          this.rentalsOfHoiAn++;
      }
    });
    console.log('hanoi: ', this.rentalsOfHanoi);
    // const allIdLocationNeedToFindRoom = [];
    // const dataAllRooms = [];
    // const allLocation = await this.locationService.getAllLocations().subscribe(
    //   (result) => {
    //     result.forEach((location: any) => {
    //       if (this.transformVn(location['province']) == 'ha_noi'){
    //         allIdLocationNeedToFindRoom.push(location['_id']);
    //       }
    //     });
    //   },
    //   (err) => {
    //     console.warn(err.error.message);
    //   }
    // );

    // const allRooms = await this.roomsServices.getListRoomForRent().subscribe(
    //   (res) => {
    //     console.log('allRooms:', res);
    //     res.forEach((room: any) => {
    //       if (
    //         room['locationId'] &&
    //         room['locationId']['province'] &&
    //         this.transformVn(room['locationId']['province']) === 'ha_noi'
    //       ) {
    //         //console.log(this.transformVn(room['locationId']['province']));
    //         dataAllRooms.push(room);
    //       }
    //     });
    //     console.log('dataAllRooms', dataAllRooms.length);
    //     return dataAllRooms.length;
    //   },
    //   (err) => {
    //     console.warn(err.error.message);
    //     return 0;
    //   }
    // );
  }
}
