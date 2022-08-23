import { Component, OnInit, OnChanges } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from 'src/app/service/review/review.service';
import { RoomForRentService } from 'src/app/service/room-for-rent/roomForRent.service';

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css'],
})
export class DetailPageComponent implements OnInit {
  public idRoom!: string | null;
  dataRoom: any = {};
  dataReviews: any = {};
  todayDate: Date = new Date();
  selectedDateRange: DateRange<Date> | null = null;
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  value = 4.5;
  isCollapse = true;
  changeIsCollape() {
    this.isCollapse = !this.isCollapse;
  }
  _onSelectedChange(date: Date): void {
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  getData(date: any) {
    // console.log('Nhan Data', date);

    this.selectedDateRange = new DateRange(date[0], date[1]);
  }
  constructor(
    private route: ActivatedRoute,
    private roomsService: RoomForRentService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.idRoom = this.route.snapshot.paramMap.get('idRoom');

    console.log('Id Room: ', this.idRoom);

    this.idRoom &&
      this.roomsService.getInfoRoomForRent(this.idRoom).subscribe(
        (result) => {
          console.log('Data room: ', result);
          this.dataRoom = result;
        },
        (err) => {}
      );
    this.idRoom &&
      this.reviewService.getListReviewByRoom(this.idRoom).subscribe(
        (result) => {
          // console.log(result);

          this.dataReviews = result.filter((review: any) => {
            return review['userId'];
          });
          //console.log(this.dataReviews);
        },
        (err) => {}
      );
  }
}
