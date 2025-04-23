import { BarbershopService } from '@/domain/barbershop/services/barbershop.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

const MODULES = [ButtonModule, CommonModule, TagModule, RouterModule];

@Component({
  selector: 'app-hero',
  imports: [...MODULES],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeroComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly barbershopService = inject(BarbershopService);

  private readonly barbershopId = 1;

  barbershopInfo = this.barbershopService.barbershopInfo;

  ngOnInit(): void {
    this.loadBarbershopStatus();
  }

  private loadBarbershopStatus(): void {
    this.barbershopService.getBarbershop(this.barbershopId).subscribe({
      next: barbershop => {
        this.barbershopService.barbershopStatus.set(barbershop.isOpen);
        this.barbershopService.accessCode.set(barbershop.accessCode || '');
      },
      error: err => {
        console.error('Erro ao carregar status da barbearia:', err);
      },
    });
  }

  navigateToQueue() {
    this.router.navigate(['/queue']);
  }
}
