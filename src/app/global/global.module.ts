import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpDialogComponent } from './components/help-dialog/help-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HelpSnackbarComponent } from './components/help-snackbar/help-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [HelpDialogComponent, HelpSnackbarComponent, SpinnerComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  exports: [HelpDialogComponent, SpinnerComponent],
})
export class GlobalModule {}
