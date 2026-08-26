import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToursDetails } from './tours-details';

describe('ToursDetails', () => {
  let component: ToursDetails;
  let fixture: ComponentFixture<ToursDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToursDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ToursDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
