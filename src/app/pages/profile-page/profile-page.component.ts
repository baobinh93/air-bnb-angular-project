import { Component, OnInit } from '@angular/core';
import { localStorageService } from 'src/app/localStorage.service';
import { UserService } from 'src/app/service/user/userService.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { TicketService } from 'src/app/service/ticket/ticket.service';
@Component({
  selector: 'app-profile-page',
  // templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  template: `
    <div class="container">
      <div class="row py-5">
        <div class="col-12 col-md-4  border px-4 py-3 rounded ">
          <div
            class="user__avatar d-flex flex-column align-items-center

           "
          >
            <img
              *ngIf="this.userInfo.avatar"
              src="{{ this.userInfo.avatar }}"
              alt=""
              class="rounded-circle user__avatar--img "
              style="width: 80px; height: 80px"
            />
            <div
              *ngIf="!this.userInfo.avatar"
              class="rounded-circle user__avatar--img  bg-secondary"
              style="width: 80px; height: 80px"
            ></div>
            <button
              class="font-weight-bold w-100 user__avatar--button border-0 bg-gradient-light cursor-pointer mt-3"
              (click)="fileUpload.click()"
            >
              <u> Cập nhật ảnh </u>
              <input
                class="d-none"
                type="file"
                (change)="onFileSelected($event)"
                #fileUpload
              />
            </button>
          </div>
          <div
            class="user__authentication mt-5 d-flex flex-column align-items-center "
          >
            <i nz-icon nzType="check" nzTheme="outline"></i>
            <span><strong> Xác minh danh tính </strong></span>
            <span>
              Xác thực danh tính của bạn với huy hiệu xác minh danh tính</span
            >
            <button class="btn btn-light border border-secondary mt-4">
              Nhận huy hiệu
            </button>
            <div class="w-100 border-top mt-3 pt-4">
              <div class="mb-2">
                <strong>
                  {{ this.userInfo.email }}
                  Đã xác nhận:
                </strong>
              </div>
              <div class="font-weight-normal">
                <i nz-icon nzType="check" nzTheme="outline"></i> Địa chỉ mail
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-8">
          <h3 class="h3">Xin chào tôi tên là {{ userInfo.name }}</h3>

          <app-update-info-form
            [userInfo]="this.userInfo"
          ></app-update-info-form>
          <div class="border-bottom p-1 mt-3"></div>

          <h3 class="h3 mt-3 ">Danh sách vé của bạn</h3>
          <div class="user__tickets">
            <div
              class="user__ticket"
              *ngFor="let ticket of this.userInfo.tickets"
            >
              <app-ticket-card
                [ticketId]="ticket"
                [token]="this.userInfo.token"
              ></app-ticket-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  localStorage;
  userInfo: any = {};
  fileToUpload: File | null = null;
  dataOfTickets: any = {};
  getInfoOfTicket(_ticket: string) {
    this.ticketService.getInfoTicket(_ticket).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
    return true;
  }

  constructor(
    private userService: UserService,
    private msg: NzMessageService,
    private ticketService: TicketService
  ) {
    this.localStorage = new localStorageService();
  }

  ngOnInit() {
    this.userInfo = this.localStorage.getUserInfo();
    //   console.log(this.userInfo.tickets);
    // this.userInfo.tickets.forEach((ticket: string) => {
    //   console.log(ticket);
    // });
  }

  fileName = '';
  onFileSelected($event: any) {
    const file: File = $event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('avatar', file);
      console.log('upthanh cong', file);
      this.userService.updateAvataUser(file, this.userInfo.token).subscribe(
        (result) => {
          // console.log('result', result);
          this.localStorage.deleteUserInfo();
          this.localStorage.setUserInfo({
            token: this.userInfo.token,
            ...result,
          });

          this.userInfo = this.localStorage.getUserInfo();

          this.msg.success('Cập nhật thành công');
        },
        (err) => {
          this.msg.error('Cập nhật thất bại');
        }
      );

      //const upload$ = this.http.post("/api/thumbnail-upload", formData);

      //upload$.subscribe();
    }
  }
}
