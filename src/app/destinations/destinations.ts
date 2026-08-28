import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import {
  DESTINATIONS,
  Destination
} from '../data/destination-data';

@Component({
  selector: 'app-destinations',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './destinations.html',
  styleUrl: './destinations.css'
})
export class Destinations implements OnInit {

  // =========================================================
  // CURRENT YEAR
  // =========================================================

  currentYear = new Date().getFullYear();


  // =========================================================
  // DESTINATIONS
  // =========================================================

  destinations: Destination[] = DESTINATIONS;


  // =========================================================
  // NAVBAR
  // =========================================================

  isScrolled = false;
  isMenuOpen = false;


  // =========================================================
  // BACK TO TOP
  // =========================================================

  showBackTop = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private router: Router
  ) {}


  // =========================================================
  // LIFECYCLE
  // =========================================================

  ngOnInit(): void {
    this.handleScroll();
  }


  // =========================================================
  // WINDOW SCROLL
  // =========================================================

  @HostListener('window:scroll')
  handleScroll(): void {

    this.isScrolled = window.scrollY > 45;

    this.showBackTop = window.scrollY > 400;

    /*
     * Do NOT automatically close the menu just because
     * the header becomes scrolled.
     *
     * Otherwise mobile menu can disappear unexpectedly.
     */
  }


  // =========================================================
  // MOBILE MENU
  // =========================================================

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Prevent background scrolling while menu is open
    document.body.style.overflow =
      this.isMenuOpen ? 'hidden' : '';
  }


  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }


  // =========================================================
  // HOME SECTION NAVIGATION
  // =========================================================

  scrollToSection(
    sectionId: string,
    event?: Event
  ): void {

    event?.preventDefault();

    /*
     * Check whether the requested section
     * exists on the current page.
     */

    const section =
      document.getElementById(sectionId);

    /*
     * Section exists on current page
     */

    if (section) {

      const headerOffset = 85;

      const elementPosition =
        section.getBoundingClientRect().top;

      const offsetPosition =
        elementPosition +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      this.closeMenu();

      return;
    }

    /*
     * Section doesn't exist on this page.
     *
     * Navigate to Home and preserve the fragment.
     */

    this.closeMenu();

    this.router.navigate(
      ['/'],
      {
        fragment: sectionId
      }
    );
  }


  // =========================================================
  // BACK TO TOP
  // =========================================================

  scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}