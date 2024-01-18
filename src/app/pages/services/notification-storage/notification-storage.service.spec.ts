import { TestBed } from '@angular/core/testing';

import { NotificationStorageService } from './notification-storage.service';

describe('NotificationStorageService', () => {
  let service: NotificationStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
