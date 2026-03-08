import { Component, signal, HostListener, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonModule, RippleModule, TranslocoModule],
    templateUrl: './landing.html',
    styleUrl: './landing.scss',
})
export class LandingComponent implements OnInit, OnDestroy {
    constructor(
        private translocoService: TranslocoService,
        @Inject(DOCUMENT) private document: Document,
    ) {}

    scrolled = signal(false);
    activeTestimonial = signal(0);
    currentLang = signal('en');
    private testimonialInterval: ReturnType<typeof setInterval> | null = null;

    testimonialKeys = [
        { quoteKey: 'testimonials.quote1', authorKey: 'testimonials.author1', roleKey: 'testimonials.role1' },
        { quoteKey: 'testimonials.quote2', authorKey: 'testimonials.author2', roleKey: 'testimonials.role2' },
        { quoteKey: 'testimonials.quote3', authorKey: 'testimonials.author3', roleKey: 'testimonials.role3' },
    ];

    doctors = [
        { name: 'Dr. Layla Hassan', specialty: 'Dermatology', rating: 4.9, available: true, initials: 'LH' },
        { name: 'Dr. Omar Farouk', specialty: 'Cardiology', rating: 4.8, available: true, initials: 'OF' },
        { name: 'Dr. Nina Patel', specialty: 'Pediatrics', rating: 5.0, available: false, initials: 'NP' },
        { name: 'Dr. Marcus Chen', specialty: 'Orthopedics', rating: 4.7, available: true, initials: 'MC' },
        { name: 'Dr. Amira Soliman', specialty: 'Neurology', rating: 4.9, available: true, initials: 'AS' },
        { name: 'Dr. David Brooks', specialty: 'General Practice', rating: 4.6, available: true, initials: 'DB' },
    ];

    steps = [
        { number: '01', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc', icon: 'search' },
        { number: '02', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc', icon: 'calendar' },
        { number: '03', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc', icon: 'heart' },
    ];

    @HostListener('window:scroll')
    onScroll(): void {
        this.scrolled.set(window.scrollY > 60);
    }

    ngOnInit(): void {
        this.testimonialInterval = setInterval(() => {
            this.activeTestimonial.update(v => (v + 1) % this.testimonialKeys.length);
        }, 5000);
    }

    ngOnDestroy(): void {
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
        }
    }

    setTestimonial(index: number): void {
        this.activeTestimonial.set(index);
    }

    renderStars(rating: number): string[] {
        return Array(Math.floor(rating)).fill('★');
    }

    switchLang(): void {
        const newLang = this.currentLang() === 'en' ? 'ar' : 'en';
        this.currentLang.set(newLang);
        this.translocoService.setActiveLang(newLang);

        // Set RTL direction for Arabic
        const htmlEl = this.document.documentElement;
        if (newLang === 'ar') {
            htmlEl.setAttribute('dir', 'rtl');
            htmlEl.setAttribute('lang', 'ar');
        } else {
            htmlEl.setAttribute('dir', 'ltr');
            htmlEl.setAttribute('lang', 'en');
        }
    }
}
