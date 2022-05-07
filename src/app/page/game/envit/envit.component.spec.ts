import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvitComponent } from './envit.component';

describe('EnvitComponent', () => {
  let component: EnvitComponent;
  let fixture: ComponentFixture<EnvitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
