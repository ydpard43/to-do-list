import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() config!: {
    TEXTS: {
      WELCOME: string;
    };
    BUTTONS: {
      ADD: {
        TEXT: string;
      };
    };
  };

  @Output() action = new EventEmitter<void>();

  public currentDate: Date = new Date();

  onClick(): void {
    this.action.emit();
  }
}
