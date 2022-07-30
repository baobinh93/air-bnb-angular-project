import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from 'src/app/service/user/userService.service';

@Component({
  selector: 'app-table-users',

  templateUrl: './table-users.component.html',
  styleUrls: ['./table-users.component.css'],
})
export class TableUsersComponent implements OnInit {
  // listOfDisplayData: any = [];
  isInfoUserModalVisible = false;
  isUpdateUserFormModalVisible = false;
  dataUser = [];
  dataUserToUpdate = {};
  dataUserToShowInModal: any = {};
  listOfDisplayData = [...this.dataUser];
  test = [];
  searchValue = '';
  visible = false;
  constructor(
    private userService: UserService,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit() {
    this.userService.getAllUsers(0, 10).subscribe(
      (res) => {
        this.dataUser = res;
        this.listOfDisplayData = [...this.dataUser];
        console.log('dataUser', this.dataUser);
      },
      (err) => console.log(err)
    );
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }
  refresh(): void {
    window.location.reload();
  }
  search() {
    this.visible = false;
    this.listOfDisplayData = this.dataUser.filter((item: any) => {
      if (typeof item.name === 'undefined') {
        return false;
      } else {
        let nameToLowerCase = item.name.toLowerCase();
        let searchValueToLowerCase = this.searchValue.toLowerCase();
        //return item.name.indexOf(this.searchValue) !== -1;
        return nameToLowerCase.indexOf(searchValueToLowerCase) !== -1;
      }
    });
  }

  showUserToModal(_user: {}) {
    this.isInfoUserModalVisible = true;
    this.dataUserToShowInModal = _user;
  }
  updateUser(_user: {}) {
    //console.log(_user);
    this.isUpdateUserFormModalVisible = true;
    this.dataUserToUpdate = _user;
  }
  deleteUser(_id: string) {
    console.log(_id);
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isInfoUserModalVisible = false;
    this.isUpdateUserFormModalVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isInfoUserModalVisible = false;
    this.isUpdateUserFormModalVisible = false;
  }
  cancelDeleteUser(): void {
    this.nzMessageService.info('click cancel');
  }

  confirmDeleteUser(_id: string): void {
    this.userService.deleteUser(_id).subscribe(
      (res) => {
        console.log(res);
        this.nzMessageService.info('Đã xoá user');
        setTimeout(this.refresh, 500);
      },
      (err) => this.nzMessageService.warning(err)
    );

    console.log('Xoa user co id', _id);
  }
}
