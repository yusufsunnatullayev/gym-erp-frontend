import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  template: `
    <p-toast />
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'frontend';
}
