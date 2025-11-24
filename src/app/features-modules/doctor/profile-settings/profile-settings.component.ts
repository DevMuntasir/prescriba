
import { CommonModule } from '@angular/common';
import {
  Component
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ProfileSettingsComponent {
  
}
