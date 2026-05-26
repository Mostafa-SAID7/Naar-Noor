import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomCalendarComponent } from '../../components/custom-calendar/custom-calendar.component';
import { CustomDropdownComponent } from '../../components/custom-dropdown/custom-dropdown.component';
import { ApiService } from '../../services/api.service';

interface ReservationForm {
  fullName: string;
  email: string;
  phone: string;
  date: Date | null;
  time: string;
  guests: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomCalendarComponent, CustomDropdownComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  private readonly api = inject(ApiService);

  reservation: ReservationForm = {
    fullName: '',
    email: '',
    phone: '',
    date: null,
    time: '18:00',
    guests: '2 People'
  };

  submitting = false;
  submitSuccess = false;
  submitError = '';

  timeSlots = ['12:00', '12:30', '13:00', '13:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];
  guestOptions = ['1 Person', '2 People', '3 People', '4 People', '5 People', '6 People', '7 People', '8 People'];

  onDateSelected(date: Date) {
    this.reservation.date = date;
  }

  onTimeSelected(time: string) {
    this.reservation.time = time;
  }

  onGuestsSelected(guests: string) {
    this.reservation.guests = guests;
  }

  private parsePartySize(guests: string): number {
    const match = guests.match(/\d+/);
    return match ? parseInt(match[0], 10) : 2;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onSubmit() {
    this.submitError = '';

    if (!this.reservation.fullName.trim()) {
      this.submitError = 'Please enter your full name.';
      return;
    }
    if (!this.reservation.email.trim() || !this.reservation.email.includes('@')) {
      this.submitError = 'Please enter a valid email address.';
      return;
    }
    if (!this.reservation.phone.trim()) {
      this.submitError = 'Please enter your phone number.';
      return;
    }
    if (!this.reservation.date) {
      this.submitError = 'Please select a date.';
      return;
    }

    this.submitting = true;

    this.api.createReservation({
      customerName: this.reservation.fullName.trim(),
      email: this.reservation.email.trim(),
      phoneNumber: this.reservation.phone.trim(),
      reservationDate: this.formatDate(this.reservation.date),
      reservationTime: this.reservation.time,
      partySize: this.parsePartySize(this.reservation.guests),
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
      },
      error: (err) => {
        this.submitting = false;
        if (err.status === 400 && err.error?.errors) {
          const messages = Object.values(err.error.errors).flat();
          this.submitError = (messages as string[]).join(' ');
        } else {
          this.submitError = 'Something went wrong. Please call us directly to reserve your table.';
        }
      }
    });
  }

  resetForm() {
    this.submitSuccess = false;
    this.submitError = '';
    this.reservation = { fullName: '', email: '', phone: '', date: null, time: '18:00', guests: '2 People' };
  }
}
