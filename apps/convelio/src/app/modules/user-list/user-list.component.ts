import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "./models/user.model";
import {UserService} from "./service/user.service";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {getUsers} from "./state/user-list.actions";

@Component({
  selector: 'convelio-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  displayedColumns: string[] = ['name', 'username', 'city', 'company'];
  dataSource: MatTableDataSource<User>;
  isLoading = false;
  users$: Observable<User[]> = this.store.select(state => state.users.users);


  constructor(private userService: UserService, private router: Router, private store: Store<{ users: { users: User[] } }>) {
  }

  ngOnInit(): void {
    this.loadUserList();
  }

  seeUserDetails(user: User) {
    this.router.navigate(['user-list', user.id]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private loadUserList() {
    this.isLoading = true;
    this.store.dispatch(getUsers());

    this.users$.subscribe(({
      next: (users) => {
        console.log(users)
        if (users.length > 0) {
          this.dataSource = new MatTableDataSource(users)
          this.isLoading = false;
        }
      },
      error: () =>
        this.isLoading = false
    }));
  }
}
