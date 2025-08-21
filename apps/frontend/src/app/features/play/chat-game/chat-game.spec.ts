import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGame } from './chat-game';

describe('ChatGame', () => {
  let component: ChatGame;
  let fixture: ComponentFixture<ChatGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
