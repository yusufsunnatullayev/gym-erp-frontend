import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { LucideAngularModule, Moon, Sun, User } from 'lucide-angular';
import { AuthService } from '../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  imports: [CommonModule, ButtonModule, PopoverModule, LucideAngularModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  @ViewChild('op') popover!: Popover;
  readonly Moon = Moon;
  readonly Sun = Sun;
  readonly User = User;
  adminData = toSignal(this.authService.profile$);
  isDarkMode = signal(localStorage.getItem('mode') === 'dark');

  ngOnInit(): void {
    const savedMode = localStorage.getItem('mode');
    const html = document.querySelector('html');

    if (html && savedMode === 'dark') {
      html.classList.add('my-app-dark');
    }
  }

  togglePopover(event: Event) {
    this.popover.toggle({ currentTarget: event.currentTarget as HTMLElement });
  }

  logout() {
    localStorage.removeItem('adminProfile');
    sessionStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  toggleDarkMode() {
    const html = document.querySelector('html');
    if (!html) return;

    const isDark = html.classList.toggle('my-app-dark');
    this.isDarkMode.set(isDark);
    localStorage.setItem('mode', isDark ? 'dark' : 'light');
  }
}
