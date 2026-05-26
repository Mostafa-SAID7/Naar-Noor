import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Chef } from '../../services/api.service';

interface ChefView {
  name: string;
  role: string;
  image: string;
  bio: string;
  specialty: string;
}

@Component({
  selector: 'app-chefs',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './chefs.component.html',
  styleUrls: ['./chefs.component.css']
})
export class ChefsComponent implements OnInit {
  private readonly api = inject(ApiService);

  chefs: ChefView[] = [];
  loading = true;
  error = false;

  ngOnInit(): void {
    this.api.getChefs().subscribe({
      next: (chefs: Chef[]) => {
        const images = ['assets/chefs/chef-arjun.jpg', 'assets/chefs/chef-maya.jpg'];
        this.chefs = chefs.map((chef, idx) => ({
          name: chef.name,
          role: chef.title,
          image: chef.imageUrl || images[idx % images.length],
          bio: chef.bio,
          specialty: chef.specialty
        }));
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
