import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PatientProfileInputDto } from 'src/app/proxy/input-dto';

@Component({
  selector: 'app-patient-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './patient-card.component.html',
  styleUrl: './patient-card.component.scss',
})
export class PatientCardComponent {
  @Input() patient: PatientProfileInputDto = {} as PatientProfileInputDto;
  @Output() goToPatientProfile = new EventEmitter<PatientProfileInputDto>();
  randomBgClass: string = this.getRandomBgColorClass();

  getRandomBgColorClass(): string {
    const colors = [
      'bg-red-100',
      'bg-orange-100',
      'bg-yellow-100',
      'bg-green-100',
      'bg-teal-100',
      'bg-blue-100',
      'bg-indigo-100',
      'bg-purple-100',
      'bg-pink-100',
      'bg-gray-100',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}
