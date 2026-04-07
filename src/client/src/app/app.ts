import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer.component';
import { NotificationToastComponent } from './shared/components/notification-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NotificationToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
