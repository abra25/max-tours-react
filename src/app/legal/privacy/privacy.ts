import {
  Component,
  HostListener
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';


@Component({
  selector: 'app-privacy',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})


export class Privacy {

  isScrolled = false;
  isMenuOpen = false;
  showBackTop = false;

  currentYear = new Date().getFullYear();


  constructor(
    private router: Router
  ) {}


  // =====================================================
  // MOBILE MENU
  // =====================================================

  toggleMenu(): void {

    this.isMenuOpen = !this.isMenuOpen;

    document.body.style.overflow =
      this.isMenuOpen ? 'hidden' : '';

  }


  closeMenu(): void {

    this.isMenuOpen = false;

    document.body.style.overflow = '';

  }


  // =====================================================
  // SCROLL
  // =====================================================

  @HostListener('window:scroll')
  onScroll(): void {

    const scrollY = window.scrollY;

    this.isScrolled = scrollY > 40;

    this.showBackTop = scrollY > 500;

  }


  // =====================================================
  // TOURS NAVIGATION
  // =====================================================

  scrollToSection(
    sectionId: string,
    event?: Event
  ): void {

    event?.preventDefault();

    const section =
      document.getElementById(sectionId);

    if (section) {

      const headerOffset = 90;

      const position =
        section.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });

      this.closeMenu();

      return;
    }

    this.closeMenu();

    this.router.navigate(
      ['/'],
      {
        fragment: sectionId
      }
    );

  }


  // =====================================================
  // BACK TO TOP
  // =====================================================

  scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}