import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  private readonly api = inject(ApiService);

  form: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  submitting = false;
  submitSuccess = false;
  submitError = '';

  onSubmit() {
    this.submitError = '';

    if (!this.form.name.trim()) { this.submitError = 'Please enter your name.'; return; }
    if (!this.form.email.trim() || !this.form.email.includes('@')) { this.submitError = 'Please enter a valid email address.'; return; }
    if (!this.form.subject.trim()) { this.submitError = 'Please enter a subject.'; return; }
    if (!this.form.message.trim()) { this.submitError = 'Please enter your message.'; return; }

    this.submitting = true;

    this.api.submitContact({
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      phoneNumber: this.form.phone.trim() || undefined,
      subject: this.form.subject.trim(),
      message: this.form.message.trim(),
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
          this.submitError = 'Something went wrong. Please email us directly or call us.';
        }
      }
    });
  }

  reset() {
    this.submitSuccess = false;
    this.submitError = '';
    this.form = { name: '', email: '', phone: '', subject: '', message: '' };
  }
}
