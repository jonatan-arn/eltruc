import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpDialogComponent } from './components/help-dialog/help-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [HelpDialogComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [HelpDialogComponent],
})
export class GlobalModule {}
