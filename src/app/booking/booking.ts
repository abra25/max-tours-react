import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  RouterLink,
  ActivatedRoute
} from '@angular/router';

import {
  supabaseClient
} from '../lib/supabase';


/* =========================================================
   TOUR / PACKAGE MODEL
========================================================= */

export interface TourPackage {

  id: number;

  title: string;

  category: string;

  location: string;

  is_active: boolean;

}


/* =========================================================
   BOOKING FORM MODEL
   Used by Angular UI
========================================================= */

interface BookingForm {

  full_name: string;

  email: string;

  phone: string;

  service_type: string;

  package_name: string[];

  travel_date: string;

  pickup_location: string;

  adults: number;

  children: number;

  message: string;

}


/* =========================================================
   BOOKING PAYLOAD
   Used when sending data to Supabase / Email
========================================================= */

interface BookingPayload {

  full_name: string;

  email: string;

  phone: string;

  service_type: string;

  package_id: number | null;

  package_name: string;

  travel_date: string | null;

  pickup_location: string | null;

  adults: number;

  children: number;

  message: string | null;

}


/* =========================================================
   COMPONENT
========================================================= */

@Component({

  selector: 'app-booking',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    RouterLink

  ],

  templateUrl: './booking.html',

  styleUrl: './booking.css'

})


export class Booking implements OnInit {


  /* =======================================================
     GENERAL
  ======================================================= */

  currentYear =
    new Date().getFullYear();


  /* =======================================================
     NAVBAR
  ======================================================= */

  isScrolled = false;

  isMenuOpen = false;


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  showBackTop = false;


  /* =======================================================
     PACKAGES
  ======================================================= */

  allPackages: TourPackage[] = [];

  loadingPackages = true;

  packagesSource:
    'supabase' | 'empty' = 'empty';


  /* =======================================================
     BOOKING
  ======================================================= */

  sending = false;


  /* =======================================================
     FORM STATUS
  ======================================================= */

  formStatus: {

    text: string;

    type: 'success' | 'error' | '';

  } = {

    text: '',

    type: ''

  };


  /* =======================================================
     FORM DATA
  ======================================================= */

  formData: BookingForm = {

    full_name: '',

    email: '',

    phone: '',

    service_type: '',

    package_name: [],

    travel_date: '',

    pickup_location: '',

    adults: 1,

    children: 0,

    message: ''

  };


  /* =======================================================
     EMAIL NOTIFICATION
  ======================================================= */

  private readonly notificationEmail =
    'solidy789@gmail.com,maxtourandsafari@gmail.com';


  /* =======================================================
     SERVICE TYPES
  ======================================================= */

  serviceTypes = [

    {

      value: 'day_tour',

      title: 'Day Tours',

      description:
        'Short unforgettable experiences around Zanzibar.',

      icon: 'fa-solid fa-sun'

    },

    {

      value: 'holiday_package',

      title: 'Holiday Packages',

      description:
        'Multi-day escapes designed around your journey.',

      icon: 'fa-solid fa-suitcase-rolling'

    },

    {

      value: 'visit_zanzibar',

      title: 'Visit Zanzibar',

      description:
        'Tell us what you would like to discover in Zanzibar.',

      icon: 'fa-solid fa-umbrella-beach'

    },

    {

      value: 'visit_tanzania',

      title: 'Visit Tanzania',

      description:
        'Plan your Tanzania safari or mainland adventure.',

      icon: 'fa-solid fa-binoculars'

    },

    {

      value: 'general_inquiry',

      title: 'General Inquiry',

      description:
        'Have a question before planning your trip?',

      icon: 'fa-solid fa-comments'

    }

  ];


  /* =======================================================
     CONSTRUCTOR
  ======================================================= */

  constructor(

    private route: ActivatedRoute

  ) {}


  /* =======================================================
     INIT
  ======================================================= */

  ngOnInit(): void {

    this.handleScroll();

    this.loadPackages();

    /*
     * Read booking information from URL.
     *
     * Example:
     * /booking?type=day_tour&package=Kuza%20Cave%20Jambiani
     */

    this.route.queryParams.subscribe(params => {

      const type =
        params['type'] || '';

      const packageName =
        params['package'] || '';


      if (type) {

        this.formData.service_type =
          type;

      }


      if (packageName) {

        this.formData.package_name =
          [packageName];

      }

    });

  }


  /* =======================================================
     WINDOW SCROLL
  ======================================================= */

  @HostListener('window:scroll')

  handleScroll(): void {

    this.isScrolled =
      window.scrollY > 45;


    this.showBackTop =
      window.scrollY > 350;

  }


  /* =======================================================
     MOBILE MENU
  ======================================================= */

  toggleMenu(): void {

    this.isMenuOpen =
      !this.isMenuOpen;

  }


  closeMenu(): void {

    this.isMenuOpen = false;

  }


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  scrollToTop(): void {

    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }


  /* =======================================================
     LOAD TOURS FROM SUPABASE
  ======================================================= */

  async loadPackages(): Promise<void> {

    this.loadingPackages = true;

    try {

      const {

        data,

        error

      } = await supabaseClient

        .from('packages')

        .select(
          'id, title, category, location, is_active'
        )

        .eq(
          'is_active',
          true
        )

        .order(
          'title',
          {
            ascending: true
          }
        );


      if (error) {

        throw error;

      }


      if (
        Array.isArray(data)
      ) {

        this.allPackages =
          data as TourPackage[];

        this.packagesSource =
          'supabase';

      } else {

        this.allPackages = [];

        this.packagesSource =
          'empty';

      }

    } catch (error) {

      console.error(
        'Failed to load tours from Supabase:',
        error
      );

      this.allPackages = [];

      this.packagesSource =
        'empty';

    } finally {

      this.loadingPackages = false;

    }

  }


  /* =======================================================
     SELECT SERVICE
  ======================================================= */

  selectService(type: string): void {

    this.formData.service_type =
      type;


    /*
     * Clear previously selected
     * tours whenever service changes.
     */

    this.formData.package_name =
      [];


    this.clearStatus();

  }


  /* =======================================================
     GET PACKAGE OPTIONS
  ======================================================= */

  get packageOptions(): TourPackage[] {

    const service =
      this.formData.service_type;


    /*
     * No service selected
     */

    if (!service) {

      return [];

    }


    /*
     * Tanzania currently works as
     * a custom request rather than
     * a package selection.
     *
     * The user can still submit
     * "Visit Tanzania Request".
     */

    if (
      service === 'visit_tanzania'
    ) {

      return [

        {

          id: 301,

          title:
            'Visit Tanzania Request',

          category:
            'visit_tanzania',

          location:
            'Tanzania',

          is_active:
            true

        }

      ];

    }


    /*
     * General inquiry
     */

    if (
      service === 'general_inquiry'
    ) {

      return [

        {

          id: 302,

          title:
            'General Inquiry',

          category:
            'general_inquiry',

          location:
            'Zanzibar & Tanzania',

          is_active:
            true

        }

      ];

    }


    /*
     * Normal Supabase tours
     */

    return this.allPackages

      .filter(

        packageItem =>

          packageItem.category ===
          service &&

          packageItem.is_active !== false

      )

      .sort(

        (a, b) =>

          a.title.localeCompare(
            b.title
          )

      );

  }


  /* =======================================================
     TOGGLE PACKAGE
  ======================================================= */

  togglePackage(
    packageItem: TourPackage
  ): void {

    const exists =
      this.formData.package_name
        .includes(
          packageItem.title
        );


    if (exists) {

      /*
       * Remove selected package
       */

      this.formData.package_name =
        this.formData.package_name
          .filter(

            name =>
              name !==
              packageItem.title

          );

    } else {

      /*
       * Add package
       */

      this.formData.package_name = [

        ...this.formData.package_name,

        packageItem.title

      ];

    }


    this.clearStatus();

  }


  /* =======================================================
     GENERAL INQUIRY
  ======================================================= */

  selectGeneralInquiry(): void {

    this.formData.package_name = [

      'General Inquiry'

    ];

  }


  /* =======================================================
     CHECK PACKAGE SELECTED
  ======================================================= */

  isPackageSelected(
    title: string
  ): boolean {

    return this.formData.package_name
      .includes(title);

  }


  /* =======================================================
     REMOVE SELECTED PACKAGE
  ======================================================= */

  removePackage(
    title: string
  ): void {

    this.formData.package_name =
      this.formData.package_name
        .filter(

          item =>
            item !== title

        );

  }


  /* =======================================================
     RESET FORM
  ======================================================= */

  private resetForm(): void {

    this.formData = {

      full_name: '',

      email: '',

      phone: '',

      service_type: '',

      package_name: [],

      travel_date: '',

      pickup_location: '',

      adults: 1,

      children: 0,

      message: ''

    };

  }


  /* =======================================================
     CLEAR STATUS
  ======================================================= */

  private clearStatus(): void {

    this.formStatus = {

      text: '',

      type: ''

    };

  }


  /* =======================================================
     VALIDATE EMAIL
  ======================================================= */

  private isValidEmail(
    email: string
  ): boolean {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  /* =======================================================
     VALIDATION
  ======================================================= */

  private validateForm(): boolean {

    /*
     * Full name
     */

    if (
      !this.formData.full_name.trim()
    ) {

      this.showError(
        'Please enter your full name.'
      );

      return false;

    }


    /*
     * Email
     */

    if (
      !this.formData.email.trim()
    ) {

      this.showError(
        'Please enter your email address.'
      );

      return false;

    }


    if (
      !this.isValidEmail(
        this.formData.email.trim()
      )
    ) {

      this.showError(
        'Please enter a valid email address.'
      );

      return false;

    }


    /*
     * Phone
     */

    if (
      !this.formData.phone.trim()
    ) {

      this.showError(
        'Please enter your phone or WhatsApp number.'
      );

      return false;

    }


    /*
     * Service
     */

    if (
      !this.formData.service_type
    ) {

      this.showError(
        'Please select a service type.'
      );

      return false;

    }


    /*
     * Package / request
     */

    if (
      !this.formData.package_name.length
    ) {

      this.showError(
        'Please select at least one tour or package.'
      );

      return false;

    }


    /*
     * Adults
     */

    if (
      Number(this.formData.adults) < 1
    ) {

      this.showError(
        'At least one adult is required.'
      );

      return false;

    }


    /*
     * Children
     */

    if (
      Number(this.formData.children) < 0
    ) {

      this.showError(
        'Children cannot be a negative number.'
      );

      return false;

    }


    return true;

  }


  /* =======================================================
     SHOW ERROR
  ======================================================= */

  private showError(
    message: string
  ): void {

    this.formStatus = {

      text: message,

      type: 'error'

    };


    window.scrollTo({

      top: 300,

      behavior: 'smooth'

    });

  }


  /* =======================================================
     EMAIL NOTIFICATION
     
     IMPORTANT:
     This accepts BookingPayload,
     NOT BookingForm.
     
     This fixes the TS2345 error.
  ======================================================= */

  private async sendEmailNotification(
    payload: BookingPayload
  ): Promise<void> {

    const emailData =
      new FormData();


    emailData.append(

      '_subject',

      'New Booking Request - Max Tour & Safari'

    );


    emailData.append(

      '_template',

      'table'

    );


    emailData.append(

      'Full Name',

      payload.full_name

    );


    emailData.append(

      'Email',

      payload.email

    );


    emailData.append(

      'Phone',

      payload.phone

    );


    emailData.append(

      'Service',

      payload.service_type

    );


    emailData.append(

      'Package',

      payload.package_name

    );


    emailData.append(

      'Travel Date',

      payload.travel_date ||
      'Not specified'

    );


    emailData.append(

      'Pickup Location',

      payload.pickup_location ||
      'Not specified'

    );


    emailData.append(

      'Adults',

      String(payload.adults)

    );


    emailData.append(

      'Children',

      String(payload.children)

    );


    emailData.append(

      'Message',

      payload.message ||
      'No message provided'

    );


    const response =
      await fetch(

        `https://formsubmit.co/ajax/${encodeURIComponent(
          this.notificationEmail
        )}`,

        {

          method: 'POST',

          body: emailData

        }

      );


    if (!response.ok) {

      throw new Error(
        'Email notification failed'
      );

    }

  }


  /* =======================================================
     SUBMIT BOOKING
  ======================================================= */

  async handleSubmit(): Promise<void> {

    this.clearStatus();


    /*
     * Prevent duplicate submissions
     */

    if (this.sending) {

      return;

    }


    /*
     * Validate form
     */

    if (
      !this.validateForm()
    ) {

      return;

    }


    this.sending = true;


    try {

      /*
       * Selected package names
       */

      const selectedNames =
        this.formData.package_name
          .map(name => name.trim())
          .filter(Boolean);


      /*
       * Package ID
       *
       * Only store package_id when
       * exactly one real Supabase
       * package is selected.
       */

      let packageId:
        number | null = null;


      if (
        selectedNames.length === 1
      ) {

        const selectedPackage =
          this.allPackages.find(

            item =>

              item.title ===
              selectedNames[0]

          );


        if (selectedPackage) {

          packageId =
            Number(
              selectedPackage.id
            );

        }

      }


      /*
       * Build final payload.
       *
       * Notice:
       *
       * formData.package_name
       * = string[]
       *
       * payload.package_name
       * = string
       */

      const payload: BookingPayload = {

        full_name:
          this.formData.full_name.trim(),

        email:
          this.formData.email.trim(),

        phone:
          this.formData.phone.trim(),

        service_type:
          this.formData.service_type,

        package_id:
          packageId,

        package_name:
          selectedNames.join(', '),

        travel_date:
          this.formData.travel_date ||
          null,

        pickup_location:
          this.formData.pickup_location.trim() ||
          null,

        adults:
          Number(
            this.formData.adults || 1
          ),

        children:
          Number(
            this.formData.children || 0
          ),

        message:
          this.formData.message.trim() ||
          null

      };


      /* =================================================
         INSERT INTO SUPABASE
      ================================================= */

      const {

        error

      } = await supabaseClient

        .from('bookings')

        .insert([payload]);


      if (error) {

        throw error;

      }


      /* =================================================
         SEND EMAIL
         
         Email failure does NOT cancel booking.
      ================================================= */

      try {

        await this.sendEmailNotification(
          payload
        );

      } catch (emailError) {

        console.warn(

          'Booking saved but email notification failed:',

          emailError

        );

      }


      /* =================================================
         SUCCESS
      ================================================= */

      this.formStatus = {

        text:
          'Your booking request has been sent successfully. Our team will contact you soon.',

        type: 'success'

      };


      /*
       * Reset form
       */

      this.resetForm();


      /*
       * Scroll user back to
       * booking section.
       */

      setTimeout(() => {

        window.scrollTo({

          top: 300,

          behavior: 'smooth'

        });

      }, 100);


    } catch (error: any) {

      console.error(

        'Booking submission failed:',

        error

      );


      let message =
        'Something went wrong while sending your booking request. Please try again.';


      /*
       * Supabase errors
       */

      if (
        error?.message
      ) {

        message =
          `Booking failed: ${error.message}`;

      }


      this.formStatus = {

        text: message,

        type: 'error'

      };


    } finally {

      this.sending = false;

    }

  }

}