import { formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { localStorageService } from 'src/app/localStorage.service';
import { ReviewService } from 'src/app/service/review/review.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private roomsService: RoomForRentService,
    private localStorageService: localStorageService, //private localStorageService: localStorageService

    private nzMessageService: NzMessageService
  ) {}
  @Input() dateStart: any;
  @Input() dateEnd: any;
  // @Input() dataDay!: DateRange<Date> | null;
  @Input() roomId!: string | null;
  @Input() roomPrice!: number;
  validateForm!: FormGroup;
  date!: Date;
  todayDate: Date = new Date();
  selectedDateRange!: DateRange<Date>;
  tokenUser!: string;
  numberOfDate: number = 0;
  counter: number = 0;
  @Output() setDayStart = new EventEmitter();
  sendDataToParent(_dateStart: any, _dateEnd: any) {
    //  console.log('give data');

    this.setDayStart.emit([_dateStart, _dateEnd]);
  }
  // sendDataToParent(date: Date) {
  //   this.setDayStart.emit(date);
  // }
  // _onSelectedChange(date: Date): void {
  //   if (
  //     this.selectedDateRange &&
  //     this.selectedDateRange.start &&
  //     date > this.selectedDateRange.start &&
  //     !this.selectedDateRange.end
  //   ) {
  //     this.selectedDateRange = new DateRange(
  //       this.selectedDateRange.start,
  //       date
  //     );
  //   } else {
  //     this.selectedDateRange = new DateRange(date, null);
  //   }
  // }
  numberWithCommas(x: Number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);

      this.roomId &&
        this.roomsService
          .bookingRoomForRent(
            this.roomId,
            this.validateForm.value['dateStart'],
            this.validateForm.value['dateEnd'],
            this.tokenUser
          )
          .subscribe(
            (res) => {
              this.nzMessageService.success('Đặt phòng thành công');
              this.validateForm.reset();
              console.log(res);
              this.localStorageService.setUserInfo({
                token: this.tokenUser,
                ...res.userDetail,
              });
            },
            (err) => console.log(err)
          );
      this.numberOfDate = 0;
    } else {
      // console.log(this.validateForm.value['dateStart']);

      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      // alert('Vui lòng chọn ngày');
      this.nzMessageService.warning('Vui lòng chọn ngày');
    }
  }

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    //console.log(dateRangeStart.value);
    //console.log(dateRangeEnd.value);
    let dateStart = new Date(dateRangeStart.value);

    let dateEnd = new Date(dateRangeEnd.value);
    //  console.log(dateEnd.toString() === 'Invalid Date');
    if (dateEnd.toString() !== 'Invalid Date') {
      //console.log(dateEnd);

      this.sendDataToParent(dateStart, dateEnd);
    } else {
      this.sendDataToParent(dateStart, null);
    }

    //this.sendDataToParent(dateStart, dateEnd);
    let dateNum =
      (dateEnd.getTime() - dateStart.getTime()) / (1000 * 3600 * 24);
    if (dateNum) {
      this.numberOfDate = dateNum;
    } else {
      this.numberOfDate = 0;
    }
  }
  ngOnInit(): void {
    //console.log('roomId;', this.roomId);

    this.validateForm = this.fb.group({
      dateStart: [null, [Validators.required]],
      dateEnd: [null, [Validators.required]],

      // guest: [null, [Validators.required]],
    });

    let userInfo = this.localStorageService.getUserInfo();
    this.tokenUser = userInfo.token;
    // console.log('token ne', this.tokenUser);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('dateStart' in changes) {
      if (this.dateStart) {
        this.validateForm.controls['dateStart'].setValue(
          new Date(this.dateStart)
        );
      } else {
        this.validateForm.controls['dateStart'].setValue(null);
      }
    }
    if ('dateEnd' in changes) {
      if (this.dateEnd) {
        this.validateForm.controls['dateEnd'].setValue(new Date(this.dateEnd));
      } else {
        this.validateForm.controls['dateEnd'].setValue(null);
      }
    }
  }
}
