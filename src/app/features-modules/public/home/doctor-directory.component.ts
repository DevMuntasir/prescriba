import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

type SortOption = 'rating' | 'experience' | 'nextAvailable';

interface DoctorProfile {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  phone: string;
  location: string;
  nextAvailable: string;
  tags: string[];
}

@Component({
  selector: 'app-doctor-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-directory.component.html',
  styleUrls: ['./doctor-directory.component.scss'],
})
export class DoctorDirectoryComponent {
  searchTerm = '';
  selectedSpecialization = 'all';
  sortOption: SortOption = 'rating';
  private readonly phoneSanitisePattern = /[^0-9+]/g;

  readonly specializations = [
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Family Medicine',
    'Neurology',
    'Pediatrics',
  ];

  private readonly doctorProfiles: DoctorProfile[] = [
    {
      id: 1,
      name: 'Dr. Olivia Shah',
      specialization: 'Cardiology',
      experience: 12,
      rating: 4.9,
      phone: '+880 123-456-789',
      location: 'Dhaka Medical City',
      nextAvailable: 'Today, 4:00 PM',
      tags: ['Heart Checkup', 'Teleconsultation'],
    },
    {
      id: 2,
      name: 'Dr. Ayaan Rahman',
      specialization: 'Family Medicine',
      experience: 9,
      rating: 4.8,
      phone: '+880 987-654-321',
      location: 'Green Valley Clinic, Gulshan',
      nextAvailable: 'Tomorrow, 11:30 AM',
      tags: ['General Consultation', 'Home Visit'],
    },
    {
      id: 3,
      name: 'Dr. Zinia Karim',
      specialization: 'Dermatology',
      experience: 7,
      rating: 4.7,
      phone: '+880 555-233-789',
      location: 'Skin Wellness Centre, Banani',
      nextAvailable: 'Today, 6:15 PM',
      tags: ['Laser Treatment', 'Skin Care'],
    },
    {
      id: 4,
      name: 'Dr. Farhan Chowdhury',
      specialization: 'Neurology',
      experience: 15,
      rating: 5.0,
      phone: '+880 778-901-234',
      location: 'Neuro Focus Institute',
      nextAvailable: 'Friday, 2:45 PM',
      tags: ['Neuro Therapy', 'Emergency Care'],
    },
  ];

  get filteredDoctors(): DoctorProfile[] {
    const term = this.searchTerm.trim().toLowerCase();
    const selected = this.selectedSpecialization;

    const filtered = this.doctorProfiles.filter((doctor) => {
      const matchesSpecialization =
        selected === 'all' ||
        doctor.specialization.toLowerCase() === selected.toLowerCase();

      if (!term) {
        return matchesSpecialization;
      }

      const searchTarget = [
        doctor.name,
        doctor.specialization,
        doctor.location,
        ...doctor.tags,
      ]
        .join(' ')
        .toLowerCase();

      return matchesSpecialization && searchTarget.includes(term);
    });

    return filtered.sort((a, b) => {
      switch (this.sortOption) {
        case 'experience':
          return b.experience - a.experience;
        case 'nextAvailable':
          return this.compareAvailability(a.nextAvailable, b.nextAvailable);
        case 'rating':
        default:
          return b.rating - a.rating;
      }
    });
  }

  trackByDoctor(_: number, doctor: DoctorProfile): number {
    return doctor.id;
  }

  createTelLink(phone: string): string {
    const sanitized = this.sanitisePhoneNumber(phone);

    if (!sanitized) {
      return '#';
    }

    return `tel:${sanitized}`;
  }

  createCallLabel(doctor: DoctorProfile): string {
    return `Call ${doctor.name} at ${doctor.phone}`;
  }

  private compareAvailability(first: string, second: string): number {
    const parse = (value: string): number => {
      // attempt to prioritize "Today" and "Tomorrow"
      if (value.toLowerCase().startsWith('today')) {
        return 0;
      }
      if (value.toLowerCase().startsWith('tomorrow')) {
        return 1;
      }
      return 2;
    };

    const baseDifference = parse(first) - parse(second);
    if (baseDifference !== 0) {
      return baseDifference;
    }

    return first.localeCompare(second);
  }

  private sanitisePhoneNumber(value: string): string {
    return (value || '').replace(this.phoneSanitisePattern, '');
  }
}
