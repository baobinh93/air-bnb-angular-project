import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TicketService } from 'src/app/service/ticket/ticket.service';

@Component({
  selector: 'app-ticket-card',
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css'],
  template: ``,
})
export class TicketCardComponent implements OnInit {
  @Input() ticketId!: string;
  @Input() token!: string;
  dataInfoticket: any = {};
  cancel(): void {}

  confirm(): void {
    this.ticketService.deleteTickets(this.ticketId, this.token).subscribe(
      (res) => {
        this.nzMessageService.success('Đã huỷ vé');
        this.dataInfoticket = {};
      },
      (err) => {
        this.nzMessageService.error('Huỷ vé không thành công');
      }
    );
  }
  constructor(
    private ticketService: TicketService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit() {
    this.ticketService.getInfoTicket(this.ticketId).subscribe(
      (res) => {
        this.dataInfoticket = res;
        // console.log(res);
      },
      (err) => console.log(err)
    );
  }
}
