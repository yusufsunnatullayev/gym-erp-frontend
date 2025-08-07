import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  FileIcon,
  LayoutDashboard,
  Users,
  NotebookPen,
  Dumbbell,
  ShoppingBasket,
  FileType,
  Settings,
} from 'lucide-angular';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  imports: [CommonModule, RouterLink, LucideAngularModule],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  standalone: true,
})
export class SidebarComponent {
  private router = inject(Router);
  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.url)
    )
  );
  readonly FileIcon = FileIcon;
  readonly LayoutDashboard = LayoutDashboard;
  readonly Users = Users;
  readonly NotebookPen = NotebookPen;
  readonly Dumbbell = Dumbbell;
  readonly ShoppingBasket = ShoppingBasket;
  readonly FileType = FileType;
  readonly Settings = Settings;
  readonly sidebarItems = [
    {
      id: 1,
      name: 'Dashboard',
      link: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 2,
      name: 'Members',
      link: '/dashboard/members',
      icon: Users,
    },
    {
      id: 3,
      name: 'Plans',
      link: '/dashboard/plans',
      icon: NotebookPen,
    },
    {
      id: 4,
      name: 'Coaches',
      link: '/dashboard/coaches',
      icon: Dumbbell,
    },
    {
      id: 5,
      name: 'Products',
      link: '/dashboard/products',
      icon: ShoppingBasket,
    },
    {
      id: 6,
      name: 'Product types',
      link: '/dashboard/product-types',
      icon: FileType,
    },
  ];
}
