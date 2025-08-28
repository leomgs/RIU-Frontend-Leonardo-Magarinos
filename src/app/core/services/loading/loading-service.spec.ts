import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoadingService } from './loading-service';

describe('Loading', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created with default values', () => {
    expect(service).toBeTruthy();
    expect(service.status).toBeFalse();
    expect(service.requests.length).toBe(0);
  });

  it('should add request and emit true', () => {
    let emittedStatus: boolean | null = null;
    service.statusEvent.subscribe(status => emittedStatus = status);

    service.addRequest('req1');

    expect(service.requests).toContain('req1');
    expect(service.status).toBeTrue();
    expect(emittedStatus).toBeTrue();
  });

  it('should not emit when adding a second request (status unchanged)', () => {
    let emitCount = 0;
    service.statusEvent.subscribe(() => emitCount++);

    service.addRequest('req1');
    service.addRequest('req2');

    expect(service.requests.length).toBe(2);
    expect(service.status).toBeTrue();
    expect(emitCount).toBe(1); // only first changed status from false -> true
  });

  it('should delete request and emit false after timeout', fakeAsync(() => {
    let emittedStatus: boolean | null = null;
    service.statusEvent.subscribe(status => emittedStatus = status);

    service.addRequest('req1');
    service.deleteRequest('req1');

    // still in queue before tick
    expect(service.requests).toContain('req1');

    tick(500); // simulate timeout

    expect(service.requests).not.toContain('req1');
    expect(service.status).toBeFalse();
    expect(emittedStatus).toBeFalse();
  }));

  it('should not emit if status stays the same on deleteRequest', fakeAsync(() => {
    let emitCount = 0;
    service.statusEvent.subscribe(() => emitCount++);

    service.addRequest('req1');
    service.addRequest('req2');
    service.deleteRequest('req1');

    tick(500);

    expect(service.requests).toContain('req2');
    expect(service.status).toBeTrue();
    expect(emitCount).toBe(1); // only first transition false -> true
  }));
});
