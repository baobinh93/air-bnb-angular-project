import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { localStorageService } from 'src/app/localStorage.service';
import { ProvincesService } from 'src/app/service/provinces/provinces.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';
import Typed from 'typed.js';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  // template: `
  //   <div
  //     class="search"
  //     [ngStyle]="{ 'background-image': 'url(assets/imgs/searchBg.jpg)' }"
  //   >
  //     <div class="container text-center">
  //       <h1 class="search__header font-weight-bold">
  //         Find Nearby <span class="typed-element"></span>
  //       </h1>
  //       <p class="search__des">
  //         Explore top-rated attractions, activities and more!
  //       </p>
  //       <span class="typed-element"> </span>
  //       <form action="">
  //         <div
  //           class="search-box bg-white row align-items-center
  //         "
  //         >
  //           <input
  //             type="text"
  //             placeholder="What are you looking for ?"
  //             class="col-5 p-3 rounded-right-pill border-right search-box__input-1"
  //           />
  //           <!-- <input
  //             type="text"
  //             placeholder="All Location "
  //             class="col-5  search-box__input-2 border-right"
  //           /> -->
  //           <div class="dropdown show col-5  search-box__input-2 border-right">
  //             <a
  //               class="btn w-100 dropdown-toggle"
  //               href="#"
  //               role="button"
  //               id="dropdownMenuLink"
  //               data-toggle="dropdown"
  //               aria-haspopup="true"
  //               aria-expanded="false"
  //             >
  //               All location
  //             </a>

  //             <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
  //               <ng-container *ngFor="let province of this.allProvincesOfVn">
  //                 <a
  //                   class="dropdown-item"
  //                   href="/rooms/{{ province['codename'] }}"
  //                 >
  //                   {{ province['name'] }}
  //                 </a>
  //               </ng-container>
  //             </div>
  //           </div>
  //           <button class="col-2 btn   search-box__button">Search</button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  //   <div class="discovery">
  //     <div class="container">
  //       <div class="discovery__header text-center">
  //         Kh??m ph?? nh???ng ??i???m ?????n g???n ????y
  //       </div>
  //       <div class="discovery__content--box row">
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor ">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor ">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor ">
  //           <div
  //             class="discovery__content-box--item  rounded"
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //         <div class="col-4 col-md-3 hvr-float pointer-cursor  ">
  //           <div
  //             class="discovery__content-box--item  rounded "
  //             [ngStyle]="{ 'background-image': 'url(assets/imgs/tphcm.jpg)' }"
  //           >
  //             <div class="discovery__content-box--name">Ho Chi Minh</div>
  //             <div class="discovery__content-box--info">4 rental</div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  //   <div class="discovery">
  //     <div class="container">
  //       <div class="discovery__header text-center">
  //         Kh??m ph?? danh s??ch c???a ch??ng t??i
  //       </div>
  //       <div class="discovery__content--box row">
  //         <div class="col-6 col-md-4">
  //           <div class="card hvr-grow">
  //             <img [src]="phongNguImg" class="card-img-top rounded" alt="..." />
  //             <div class="card-body text-center">
  //               <h5 class="card-title">Card title</h5>
  //               <p class="card-text">
  //                 Some quick example text to build on the card title and make up
  //                 the bulk of the card's content.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //         <div class="col-6 col-md-4">
  //           <div class="card hvr-grow">
  //             <img [src]="phongNguImg" class="card-img-top rounded" alt="..." />
  //             <div class="card-body text-center">
  //               <h5 class="card-title">Card title</h5>
  //               <p class="card-text">
  //                 Some quick example text to build on the card title and make up
  //                 the bulk of the card's content.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //         <div class="col-6 col-md-4">
  //           <div class="card hvr-grow">
  //             <img [src]="phongNguImg" class="card-img-top rounded" alt="..." />
  //             <div class="card-body text-center">
  //               <h5 class="card-title">Card title</h5>
  //               <p class="card-text">
  //                 Some quick example text to build on the card title and make up
  //                 the bulk of the card's content.
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `,
})
// type province = {
//   codename:string;
//   name:string;
// }
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
  @ViewChild('searchForm') searchForm!: NgForm;

  constructor(
    private provinces: ProvincesService,
    private roomsServices: RoomForRentService,
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
        console.log('result', result);

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
        console.log(this.dataRoom01);
      },
      (err) => console.log(err)
    );
    this.roomsServices.getInfoRoomForRent('61698c5fefe193001c0a5baa').subscribe(
      (res) => {
        this.dataRoom02 = { ...res };
        console.log(this.dataRoom02);
      },
      (err) => console.log(err)
    );
    this.roomsServices.getInfoRoomForRent('6172397eefe193001c0a7a4a').subscribe(
      (res) => {
        this.dataRoom03 = { ...res };
        console.log(this.dataRoom03);
      },
      (err) => console.log(err)
    );
  }

  handleSearchSubmit() {
    console.log('sm ne', this.searchForm.value);
    const { location } = this.searchForm.value;

    this.router.navigate(['rooms', this.transformVn(location)]);
  }

  transformVn(str: string) {
    if (str) {
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'a');
      str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, 'e');
      str = str.replace(/??|??|???|???|??/g, 'i');
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, 'o');
      str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, 'u');
      str = str.replace(/???|??|???|???|???/g, 'y');
      str = str.replace(/??/g, 'd');
      // Some system encode vietnamese combining accent as individual utf-8 characters
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huy???n s???c h???i ng?? n???ng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ??, ??, ??, ??, ??
      str = str.replace(/\s+/g, '_');
      str = str.toLowerCase();
      return str;
    }
    return null;
  }
}
