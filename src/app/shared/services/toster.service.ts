import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TosterService {
  constructor(private snackBar: MatSnackBar) { }

  public customToast(msg: string, type: 'success' | 'error' | 'warning') {
    const config = this.getSnackBarConfig(type);
    this.snackBar.open(msg, 'Close', config);
  }

  private getSnackBarConfig(type: 'success' | 'error' | 'warning'): MatSnackBarConfig {
    return {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: this.getPanelClass(type),
    };
  }

  private getPanelClass(type: 'success' | 'error' | 'warning'): string[] {
    switch (type) {
      case 'success':
        return ['toast-success'];
      case 'error':
        return ['toast-error'];
      case 'warning':
        return ['toast-warning'];
      default:
        return ['toast-success'];
    }
  }
}
