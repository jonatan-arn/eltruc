import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpDialogComponent } from './components/help-dialog/help-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HelpSnackbarComponent } from './components/help-snackbar/help-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [HelpDialogComponent, HelpSnackbarComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  exports: [HelpDialogComponent],
})
export class GlobalModule {}
