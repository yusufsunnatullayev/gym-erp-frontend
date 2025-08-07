import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
})
export class LayoutComponent implements OnInit {
  ngOnInit(): void {}
}
