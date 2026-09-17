import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  Package,
  PackageService
} from '../../services/package.service';

import { supabaseClient } from '../../lib/supabase';


@Component({
  selector: 'app-admin',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  // =========================================================
  // FILE INPUT REFERENCES
  // =========================================================

  @ViewChild('heroImageInput')
  heroImageInput?: ElementRef<HTMLInputElement>;

  @ViewChild('galleryImageInput')
  galleryImageInput?: ElementRef<HTMLInputElement>;


  // =========================================================
  // ADMIN
  // =========================================================

  adminUser = '@maxtours';

  activeSection:
    'dashboard' |
    'bookings' |
    'packages' = 'dashboard';

  sidebarOpen = false;

  showBackTop = false;


  // =========================================================
  // DASHBOARD
  // =========================================================

  totalBookings = 0;

  totalPackages = 0;

  activePackages = 0;

  recentBookings: Booking[] = [];


  // =========================================================
  // PACKAGES
  // =========================================================

  allPackages: Package[] = [];

  packageSearch = '';

  loadingPackages = false;

  packageStatusMessage = '';

  packageStatusType:
    'success' |
    'error' |
    '' = '';


  // =========================================================
  // PACKAGE MODAL
  // =========================================================

  packageModalOpen = false;

  editingPackage = false;

  savingPackage = false;

  packageEditorMessage = '';

  packageEditorMessageType:
    'success' |
    'error' |
    '' = '';


  // =========================================================
  // VIEW PACKAGE MODAL
  // =========================================================

  viewPackageModalOpen = false;

  selectedPackage: Package | null = null;


  // =========================================================
  // CONFIRMATION MODAL
  // =========================================================

  confirmationModalOpen = false;

  confirmationType:
    'package' |
    'booking' |
    null = null;

  confirmationId: number | null = null;

  confirmationMessage = '';

  confirmingDelete = false;


  // =========================================================
  // PACKAGE FORM
  // =========================================================

  packageForm = {

    id: null as number | null,

    title: '',
    slug: '',

    category: '',

    location: '',

    price: '',

    child_price: '',

    duration: '',

    rating: '',

    image_url: '',

    gallery: '',

    short_description: '',

    full_description: '',

    details: '',

    features: '',

    highlights: '',

    itinerary: '',

    inclusions: '',

    essentials: '',

    is_featured: false,

    is_active: true

  };


  // =========================================================
  // BOOKINGS
  // =========================================================

  allBookings: Booking[] = [];

  bookingSearch = '';

  loadingBookings = false;

  bookingStatusMessage = '';

  bookingStatusType:
    'success' |
    'error' |
    '' = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private readonly packageService: PackageService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  async ngOnInit(): Promise<void> {

    const loggedIn =
      localStorage.getItem(
        'max_admin_logged_in'
      );

    if (loggedIn !== 'true') {

      await this.router.navigate([
        '/admin-login'
      ]);

      return;
    }

    this.adminUser =
      localStorage.getItem(
        'max_admin_user'
      ) || '@maxtours';

    await this.loadDashboard();

    this.refreshView();
  }


  // =========================================================
  // CHANGE DETECTION
  // =========================================================

  private refreshView(): void {

    this.cdr.detectChanges();

  }


  // =========================================================
  // DASHBOARD
  // =========================================================

  async loadDashboard(): Promise<void> {

    try {

      await Promise.all([
        this.loadPackages(),
        this.loadBookings()
      ]);

      this.updateDashboardStats();

      this.refreshView();

    } catch (error) {

      console.error(
        'Dashboard loading error:',
        error
      );

      this.refreshView();

    }

  }


  updateDashboardStats(): void {

    this.totalBookings =
      this.allBookings.length;

    this.totalPackages =
      this.allPackages.length;

    this.activePackages =
      this.allPackages.filter(
        pkg =>
          pkg.is_active === true
      ).length;

    this.recentBookings =
      [...this.allBookings]
        .sort(
          (a, b) =>
            new Date(
              b.created_at || 0
            ).getTime()
            -
            new Date(
              a.created_at || 0
            ).getTime()
        )
        .slice(0, 5);

  }


  // =========================================================
  // NAVIGATION
  // =========================================================

  openSection(
    section:
      'dashboard' |
      'bookings' |
      'packages'
  ): void {

    this.activeSection = section;

    this.sidebarOpen = false;

    this.refreshView();

    if (section === 'dashboard') {

      void this.loadDashboard();

    }

    if (section === 'packages') {

      void this.loadPackages();

    }

    if (section === 'bookings') {

      void this.loadBookings();

    }

  }


  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

    this.refreshView();

  }


  closeSidebar(): void {

    this.sidebarOpen = false;

    this.refreshView();

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  async logout(): Promise<void> {

    localStorage.removeItem(
      'max_admin_logged_in'
    );

    localStorage.removeItem(
      'max_admin_user'
    );

    await this.router.navigate([
      '/admin-login'
    ]);

  }


  // =========================================================
  // PACKAGES - LOAD
  // =========================================================

  async loadPackages(): Promise<void> {

    this.loadingPackages = true;

    this.packageStatusMessage =
      'Loading packages...';

    this.packageStatusType = '';

    this.refreshView();

    try {

      this.allPackages =
        await this.packageService
          .getAllPackages();

      this.packageStatusMessage =
        `Loaded ${this.allPackages.length} package(s).`;

      this.packageStatusType =
        'success';

      this.updateDashboardStats();

    } catch (error: any) {

      console.error(
        'Failed to load packages:',
        error
      );

      this.allPackages = [];

      this.packageStatusMessage =
        error?.message ||
        'Failed to load packages.';

      this.packageStatusType =
        'error';

    } finally {

      this.loadingPackages = false;

      this.updateDashboardStats();

      this.refreshView();

    }

  }


  // =========================================================
  // PACKAGES - SEARCH
  // =========================================================

  get filteredPackages(): Package[] {

    const query =
      this.packageSearch
        .trim()
        .toLowerCase();

    if (!query) {

      return this.allPackages;

    }

    return this.allPackages.filter(
      pkg =>
        [
          pkg.title,
          pkg.slug,
          pkg.category,
          pkg.location,
          pkg.price,
          pkg.duration,
          pkg.short_description,
          pkg.rating
        ]
          .filter(Boolean)
          .some(value =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
    );

  }


  // =========================================================
  // PACKAGE FORM - RESET
  // =========================================================

  resetPackageForm(): void {

    this.packageForm = {

      id: null,

      title: '',
      slug: '',

      category: '',

      location: '',

      price: '',

      child_price: '',

      duration: '',

      rating: '',

      image_url: '',

      gallery: '',

      short_description: '',

      full_description: '',

      details: '',

      features: '',

      highlights: '',

      itinerary: '',

      inclusions: '',

      essentials: '',

      is_featured: false,

      is_active: true

    };

    this.editingPackage = false;

    this.packageEditorMessage = '';

    this.packageEditorMessageType = '';

    this.clearFileInputs();

    this.refreshView();

  }


  // =========================================================
  // CLEAR FILE INPUTS
  // =========================================================

  private clearFileInputs(): void {

    if (this.heroImageInput?.nativeElement) {

      this.heroImageInput
        .nativeElement
        .value = '';

    }

    if (this.galleryImageInput?.nativeElement) {

      this.galleryImageInput
        .nativeElement
        .value = '';

    }

  }


  // =========================================================
  // PACKAGE MODAL
  // =========================================================

  openAddPackage(): void {

    this.resetPackageForm();

    this.packageModalOpen = true;

    document.body.style.overflow =
      'hidden';

    this.refreshView();

  }


  closePackageModal(): void {

    this.packageModalOpen = false;

    document.body.style.overflow = '';

    this.clearFileInputs();

    this.refreshView();

  }


  // =========================================================
  // VIEW PACKAGE
  // =========================================================

  viewPackage(pkg: Package): void {

    this.selectedPackage = pkg;

    this.viewPackageModalOpen = true;

    document.body.style.overflow =
      'hidden';

    this.refreshView();

  }


  closeViewPackageModal(): void {

    this.viewPackageModalOpen = false;

    this.selectedPackage = null;

    document.body.style.overflow = '';

    this.refreshView();

  }


  // =========================================================
  // VIEW PACKAGE HELPERS
  // =========================================================

  getPackageGallery(pkg: Package | null): string[] {

    if (!pkg || !Array.isArray(pkg.gallery)) {

      return [];

    }

    return pkg.gallery.filter(Boolean);

  }


  getPackageHighlights(pkg: Package | null): string[] {

    if (!pkg || !Array.isArray(pkg.highlights)) {

      return [];

    }

    return pkg.highlights.filter(Boolean);

  }


  getPackageInclusions(pkg: Package | null): string[] {

    if (!pkg || !Array.isArray(pkg.inclusions)) {

      return [];

    }

    return pkg.inclusions.filter(Boolean);

  }


  getPackageEssentials(pkg: Package | null): string[] {

    if (!pkg || !Array.isArray(pkg.essentials)) {

      return [];

    }

    return pkg.essentials.filter(Boolean);

  }


  getPackageFeatures(pkg: Package | null): string[] {

    if (!pkg || !Array.isArray(pkg.features)) {

      return [];

    }

    return pkg.features.filter(Boolean);

  }


  // =========================================================
  // PACKAGE EDIT
  // =========================================================

  editPackage(pkg: Package): void {

    this.packageForm = {

      id: pkg.id ?? null,

      title:
        pkg.title ?? '',

      slug:
        pkg.slug ?? '',

      category:
        pkg.category ?? '',

      location:
        pkg.location ?? '',

      price:
        pkg.price ?? '',

      child_price:
        pkg.child_price ?? '',

      duration:
        pkg.duration ?? '',

      rating:
        pkg.rating ?? '',

      image_url:
        pkg.image_url ?? '',

      gallery:
        Array.isArray(pkg.gallery)
          ? pkg.gallery.join('\n')
          : '',

      short_description:
        pkg.short_description ?? '',

      full_description:
        pkg.full_description ?? '',

      details:
        pkg.details ?? '',

      features:
        Array.isArray(pkg.features)
          ? pkg.features.join('\n')
          : '',

      highlights:
        Array.isArray(pkg.highlights)
          ? pkg.highlights.join('\n')
          : '',

      itinerary:
        this.stringifyItinerary(
          pkg.itinerary
        ),

      inclusions:
        Array.isArray(pkg.inclusions)
          ? pkg.inclusions.join('\n')
          : '',

      essentials:
        Array.isArray(pkg.essentials)
          ? pkg.essentials.join('\n')
          : '',

      is_featured:
        pkg.is_featured === true,

      is_active:
        pkg.is_active !== false

    };

    this.clearFileInputs();

    this.editingPackage = true;

    this.packageEditorMessage =
      `Editing package #${pkg.id}.`;

    this.packageEditorMessageType =
      'success';

    this.packageModalOpen = true;

    document.body.style.overflow =
      'hidden';

    this.refreshView();

  }


  // =========================================================
  // SLUG
  // =========================================================

  slugify(text: string): string {

    return String(text)

      .toLowerCase()

      .trim()

      .replace(
        /[^a-z0-9\s-]/g,
        ''
      )

      .replace(
        /\s+/g,
        '-'
      )

      .replace(
        /-+/g,
        '-'
      );

  }


  // =========================================================
  // TEXT → ARRAY
  // =========================================================

  parseLines(
    text: string
  ): string[] {

    return String(text || '')

      .split('\n')

      .map(
        item =>
          item.trim()
      )

      .filter(Boolean);

  }


  // =========================================================
  // ITINERARY
  // =========================================================

  parseItinerary(
    text: string
  ): any[] {

    return String(text || '')

      .split('\n')

      .map(
        line =>
          line.trim()
      )

      .filter(Boolean)

      .map(
        (line, index) => {

          const [
            day,
            title,
            ...rest
          ] = line.split('|');

          return {

            day:
              Number(day)
              || index + 1,

            title:
              (
                title
                ||
                `Step ${index + 1}`
              ).trim(),

            desc:
              rest
                .join('|')
                .trim()

          };

        }
      );

  }


  stringifyItinerary(
    items:
      any[] |
      undefined
  ): string {

    if (!Array.isArray(items)) {

      return '';

    }

    return items

      .map(
        (item, index) =>
          `${item?.day || index + 1}|${item?.title || ''}|${item?.desc || ''}`
      )

      .join('\n');

  }


  // =========================================================
  // GET SELECTED HERO IMAGE
  // =========================================================

  private getSelectedHeroFile(): File | null {

    const input =
      this.heroImageInput
        ?.nativeElement;

    if (!input?.files?.length) {

      return null;

    }

    return input.files[0];

  }


  // =========================================================
  // GET SELECTED GALLERY IMAGES
  // =========================================================

  private getSelectedGalleryFiles(): File[] {

    const input =
      this.galleryImageInput
        ?.nativeElement;

    if (!input?.files?.length) {

      return [];

    }

    return Array.from(
      input.files
    );

  }


  // =========================================================
  // VALIDATE IMAGE FILE
  // =========================================================

  private validateImageFile(
    file: File
  ): void {

    if (!file.type.startsWith('image/')) {

      throw new Error(
        `"${file.name}" is not a valid image file.`
      );

    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      throw new Error(
        `"${file.name}" is too large. Maximum image size is 10MB.`
      );

    }

  }


  // =========================================================
  // UPLOAD HERO IMAGE
  // =========================================================

  private async uploadHeroImage(
    file: File
  ): Promise<string> {

    this.validateImageFile(file);

    this.packageEditorMessage =
      'Uploading main package image...';

    this.packageEditorMessageType = '';

    this.refreshView();

    const url =
      await this.packageService
        .uploadPackageImage(
          file,
          'hero'
        );

    return url;

  }


  // =========================================================
  // UPLOAD GALLERY IMAGES
  // =========================================================

  private async uploadGalleryImages(
    files: File[]
  ): Promise<string[]> {

    if (!files.length) {

      return [];

    }

    const uploadedUrls: string[] = [];

    for (
      let index = 0;
      index < files.length;
      index++
    ) {

      const file =
        files[index];

      this.validateImageFile(file);

      this.packageEditorMessage =
        `Uploading gallery image ${index + 1} of ${files.length}...`;

      this.packageEditorMessageType = '';

      this.refreshView();

      const url =
        await this.packageService
          .uploadPackageImage(
            file,
            'gallery'
          );

      uploadedUrls.push(url);

    }

    return uploadedUrls;

  }


  // =========================================================
  // PACKAGE SAVE
  // =========================================================

  async savePackage(): Promise<void> {

    if (this.savingPackage) {

      return;

    }

    this.packageEditorMessage = '';

    this.packageEditorMessageType = '';

    const title =
      this.packageForm.title.trim();

    const category =
      this.packageForm.category;

    const location =
      this.packageForm.location;

    if (
      !title ||
      !category ||
      !location
    ) {

      this.packageEditorMessage =
        'Please complete title, category, and location.';

      this.packageEditorMessageType =
        'error';

      this.refreshView();

      return;

    }

    this.savingPackage = true;

    this.packageEditorMessage =
      'Preparing package...';

    this.packageEditorMessageType = '';

    this.refreshView();

    try {

      // -------------------------------------------------------
      // EXISTING GALLERY
      // -------------------------------------------------------

      let galleryUrls =
        this.parseLines(
          this.packageForm.gallery
        );


      // -------------------------------------------------------
      // HERO IMAGE
      // -------------------------------------------------------

      const selectedHeroFile =
        this.getSelectedHeroFile();

      if (selectedHeroFile) {

        const heroUrl =
          await this.uploadHeroImage(
            selectedHeroFile
          );

        this.packageForm.image_url =
          heroUrl;

      }


      // -------------------------------------------------------
      // GALLERY IMAGES
      // -------------------------------------------------------

      const selectedGalleryFiles =
        this.getSelectedGalleryFiles();

      if (
        selectedGalleryFiles.length
      ) {

        const newGalleryUrls =
          await this.uploadGalleryImages(
            selectedGalleryFiles
          );

        galleryUrls = [
          ...galleryUrls,
          ...newGalleryUrls
        ];

      }


      // -------------------------------------------------------
      // FINAL PAYLOAD
      // -------------------------------------------------------

      const payload = {

        title,

        slug:
          this.packageForm.slug.trim()
          ||
          this.slugify(title),

        category,

        location,

        price:
          this.packageForm.price.trim()
          ||
          null,

        child_price:
          this.packageForm.child_price.trim()
          ||
          null,

        duration:
          this.packageForm.duration.trim()
          ||
          null,

        rating:
          this.packageForm.rating.trim()
          ||
          null,

        image_url:
          this.packageForm.image_url.trim()
          ||
          null,

        gallery:
          galleryUrls,

        short_description:
          this.packageForm
            .short_description
            .trim()
          ||
          null,

        full_description:
          this.packageForm
            .full_description
            .trim()
          ||
          null,

        details:
          this.packageForm
            .details
            .trim()
          ||
          null,

        features:
          this.parseLines(
            this.packageForm.features
          ),

        highlights:
          this.parseLines(
            this.packageForm.highlights
          ),

        itinerary:
          this.parseItinerary(
            this.packageForm.itinerary
          ),

        inclusions:
          this.parseLines(
            this.packageForm.inclusions
          ),

        essentials:
          this.parseLines(
            this.packageForm.essentials
          ),

        is_featured:
          this.packageForm.is_featured,

        is_active:
          this.packageForm.is_active

      };


      // -------------------------------------------------------
      // UPDATE EXISTING PACKAGE
      // -------------------------------------------------------

      if (this.packageForm.id) {

        this.packageEditorMessage =
          'Updating package...';

        this.packageEditorMessageType = '';

        this.refreshView();

        await this.packageService
          .updatePackage(
            this.packageForm.id,
            payload
          );

        this.packageEditorMessage =
          `Package #${this.packageForm.id} updated successfully.`;

      }


      // -------------------------------------------------------
      // CREATE NEW PACKAGE
      // -------------------------------------------------------

      else {

        this.packageEditorMessage =
          'Creating package...';

        this.packageEditorMessageType = '';

        this.refreshView();

        await this.packageService
          .createPackage(
            payload
          );

        this.packageEditorMessage =
          'Package added successfully.';

      }


      // -------------------------------------------------------
      // SUCCESS
      // -------------------------------------------------------

      this.packageEditorMessageType =
        'success';

      this.refreshView();


      // -------------------------------------------------------
      // REFRESH PACKAGES
      // -------------------------------------------------------

      await this.loadPackages();


      // -------------------------------------------------------
      // CLOSE MODAL
      // -------------------------------------------------------

      this.closePackageModal();

      this.resetPackageForm();

      this.updateDashboardStats();

      this.refreshView();

    } catch (error: any) {

      console.error(
        'Failed to save package:',
        error
      );

      this.packageEditorMessage =
        error?.message
        ||
        'Failed to save package.';

      this.packageEditorMessageType =
        'error';

      this.refreshView();

    } finally {

      this.savingPackage = false;

      this.refreshView();

    }

  }


  // =========================================================
  // PACKAGE DELETE - OPEN CONFIRMATION
  // =========================================================

  deletePackage(
    packageId:
      number |
      undefined
  ): void {

    if (!packageId) {

      return;

    }

    this.confirmationType = 'package';

    this.confirmationId = packageId;

    this.confirmationMessage =
      `Delete package #${packageId}? This action cannot be undone.`;

    this.confirmationModalOpen = true;

    document.body.style.overflow =
      'hidden';

    this.refreshView();

  }


  // =========================================================
  // BOOKING DELETE - OPEN CONFIRMATION
  // =========================================================

  deleteBooking(
    bookingId: number
  ): void {

    this.confirmationType = 'booking';

    this.confirmationId = bookingId;

    this.confirmationMessage =
      `Delete booking #${bookingId}? This action cannot be undone.`;

    this.confirmationModalOpen = true;

    document.body.style.overflow =
      'hidden';

    this.refreshView();

  }


  // =========================================================
  // CLOSE CONFIRMATION
  // =========================================================

  closeConfirmationModal(): void {

    if (this.confirmingDelete) {

      return;

    }

    this.confirmationModalOpen = false;

    this.confirmationType = null;

    this.confirmationId = null;

    this.confirmationMessage = '';

    document.body.style.overflow = '';

    this.refreshView();

  }


  // =========================================================
  // CONFIRM DELETE
  // =========================================================

  async confirmDelete(): Promise<void> {

    if (
      this.confirmingDelete ||
      !this.confirmationType ||
      !this.confirmationId
    ) {

      return;

    }

    const type =
      this.confirmationType;

    const id =
      this.confirmationId;

    this.confirmingDelete = true;

    this.refreshView();

    try {

      if (type === 'package') {

        this.packageStatusMessage =
          'Deleting package...';

        this.packageStatusType = '';

        this.refreshView();

        await this.packageService
          .deletePackage(id);

        this.packageStatusMessage =
          `Package #${id} deleted successfully.`;

        this.packageStatusType =
          'success';

        await this.loadPackages();

        this.updateDashboardStats();

      }


      if (type === 'booking') {

        this.bookingStatusMessage =
          'Deleting booking...';

        this.bookingStatusType = '';

        this.refreshView();

        const {
          error
        } = await supabaseClient

          .from('bookings')

          .delete()

          .eq(
            'id',
            id
          );

        if (error) {

          throw error;

        }

        this.bookingStatusMessage =
          `Booking #${id} deleted successfully.`;

        this.bookingStatusType =
          'success';

        await this.loadBookings();

        this.updateDashboardStats();

      }

      this.confirmationModalOpen = false;

      this.confirmationType = null;

      this.confirmationId = null;

      this.confirmationMessage = '';

      document.body.style.overflow = '';

      this.refreshView();

    } catch (error: any) {

      console.error(
        `Failed to delete ${type}:`,
        error
      );

      if (type === 'package') {

        this.packageStatusMessage =
          error?.message
          ||
          'Failed to delete package.';

        this.packageStatusType =
          'error';

      } else {

        this.bookingStatusMessage =
          error?.message
          ||
          'Failed to delete booking.';

        this.bookingStatusType =
          'error';

      }

      this.confirmationModalOpen = false;

      this.confirmationType = null;

      this.confirmationId = null;

      this.confirmationMessage = '';

      document.body.style.overflow = '';

      this.refreshView();

    } finally {

      this.confirmingDelete = false;

      this.refreshView();

    }

  }


  // =========================================================
  // BOOKINGS - LOAD
  // =========================================================

  async loadBookings(): Promise<void> {

    this.loadingBookings = true;

    this.bookingStatusMessage =
      'Loading bookings...';

    this.bookingStatusType = '';

    this.refreshView();

    try {

      const {
        data,
        error
      } = await supabaseClient

        .from('bookings')

        .select('*')

        .order(
          'created_at',
          {
            ascending: false
          }
        );

      if (error) {

        throw error;

      }

      this.allBookings =
        Array.isArray(data)
          ? data as Booking[]
          : [];

      this.bookingStatusMessage =
        `Loaded ${this.allBookings.length} booking(s).`;

      this.bookingStatusType =
        'success';

      this.updateDashboardStats();

    } catch (error: any) {

      console.error(
        'Failed to load bookings:',
        error
      );

      this.allBookings = [];

      this.bookingStatusMessage =
        error?.message
        ||
        'Failed to load bookings.';

      this.bookingStatusType =
        'error';

    } finally {

      this.loadingBookings = false;

      this.updateDashboardStats();

      this.refreshView();

    }

  }


  // =========================================================
  // BOOKINGS SEARCH
  // =========================================================

  get filteredBookings(): Booking[] {

    const query =
      this.bookingSearch
        .trim()
        .toLowerCase();

    if (!query) {

      return this.allBookings;

    }

    return this.allBookings.filter(
      booking =>
        [
          booking.full_name,
          booking.email,
          booking.phone,
          booking.package_name,
          booking.service_type,
          booking.status
        ]
          .filter(Boolean)
          .some(value =>
            String(value)
              .toLowerCase()
              .includes(query)
          )
    );

  }


  // =========================================================
  // BOOKING STATUS
  // =========================================================

  async updateBookingStatus(
    bookingId: number,
    status: string
  ): Promise<void> {

    try {

      this.bookingStatusMessage =
        'Updating booking...';

      this.bookingStatusType = '';

      this.refreshView();

      const {
        error
      } = await supabaseClient

        .from('bookings')

        .update({
          status
        })

        .eq(
          'id',
          bookingId
        );

      if (error) {

        throw error;

      }

      this.bookingStatusMessage =
        `Booking #${bookingId} updated to ${status}.`;

      this.bookingStatusType =
        'success';

      await this.loadBookings();

      this.updateDashboardStats();

      this.refreshView();

    } catch (error: any) {

      console.error(
        'Failed to update booking:',
        error
      );

      this.bookingStatusMessage =
        error?.message
        ||
        'Failed to update booking.';

      this.bookingStatusType =
        'error';

      this.refreshView();

    }

  }


  // =========================================================
  // WHATSAPP
  // =========================================================

  normalizePhoneForWhatsApp(
    phone: string = ''
  ): string {

    let digits =
      String(phone)
        .replace(
          /\D/g,
          ''
        );

    if (!digits) {

      return '';

    }

    if (
      digits.startsWith('00')
    ) {

      digits =
        digits.slice(2);

    }

    if (
      digits.startsWith('255')
    ) {

      return digits;

    }

    if (
      digits.startsWith('0')
    ) {

      return `255${digits.slice(1)}`;

    }

    return digits;

  }


  getBookingWhatsAppLink(
    booking: Booking
  ): string {

    const phone =
      this.normalizePhoneForWhatsApp(
        booking.phone || ''
      );

    if (!phone) {

      return '#';

    }

    const text =
      `Hello ${booking.full_name || ''}, this is Max Tour & Safari regarding your booking for ${booking.package_name || 'your tour'}.`;

    return (
      `https://wa.me/${phone}` +
      `?text=${encodeURIComponent(text)}`
    );

  }


  // =========================================================
  // DATE FORMATTING
  // =========================================================

  formatDate(
    value:
      string |
      null |
      undefined
  ): string {

    if (!value) {

      return '—';

    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }

    return date.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  formatDateTime(
    value:
      string |
      null |
      undefined
  ): string {

    if (!value) {

      return '—';

    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return value;

    }

    return date.toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // =========================================================
  // BACK TO TOP
  // =========================================================

  @HostListener(
    'window:scroll'
  )
  onWindowScroll(): void {

    this.showBackTop =
      window.scrollY > 350;

    this.refreshView();

  }


  scrollToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}


// ===========================================================
// BOOKING INTERFACE
// ===========================================================

interface Booking {

  id: number;

  full_name?: string;

  email?: string;

  phone?: string;

  package_name?: string;

  service_type?: string;

  travel_date?: string;

  adults?: number;

  children?: number;

  status?: string;

  created_at?: string;

}