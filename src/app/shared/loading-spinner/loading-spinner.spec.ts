import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSpinner } from './loading-spinner';
import { LoadingService } from '../../core/services/loading/loading-service';

describe('LoadingSpinner', () => {
  let component: LoadingSpinner;
  let fixture: ComponentFixture<LoadingSpinner>;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinner],
      providers: [LoadingService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinner);
    component = fixture.componentInstance;
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with statusLoadingRef = false', () => {
    expect(component.statusLoadingRef).toBeFalse();
  });

  it('should update statusLoadingRef when LoadingService emits true', () => {
    loadingService.statusEvent.emit(true);
    expect(component.statusLoadingRef).toBeTrue();
  });

  it('should update statusLoadingRef when LoadingService emits false', () => {
    loadingService.statusEvent.emit(false);
    expect(component.statusLoadingRef).toBeFalse();
  });

  it('should subscribe to statusEvent on ngAfterViewInit', () => {
    spyOn(loadingService.statusEvent, 'subscribe').and.callThrough();
    component.ngAfterViewInit();
    expect(loadingService.statusEvent.subscribe).toHaveBeenCalled();
  });
});
