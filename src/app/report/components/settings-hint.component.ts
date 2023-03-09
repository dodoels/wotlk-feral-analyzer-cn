import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { format } from 'src/app/report/models/stat-utils';

@Component({
  selector: 'settings-hint-snackbar',
  templateUrl: './settings-hint.component.html',
  styleUrls: ['./settings-hint.component.scss']
})
export class SettingsHintComponent {
  public missingHaste: string;
  public description: string;
  public descriptionTier: string;

  private close: () => void;
  private callback: () => void;

  constructor (@Inject(MAT_SNACK_BAR_DATA) data: ISettingsHintData) {
    this.callback = data.openSettings;
    this.close = data.close;

    if (data.showHasteError && data.hasteError) {
      this.missingHaste = format(Math.abs(data.hasteError * 100), 1, '%');
      this.description = data.hasteError < 0 ? 'Excess' : 'Missing';
    }
    if(data.inferTier7 !== undefined){
      this.descriptionTier = `Assumed Tier 7 2-set bonus ${data.inferTier7?'active.':' disabled.'}`;
    }
  }

  openSettings(event: Event) {
    event.preventDefault();
    this.callback();
  }

  dismiss(event: Event) {
    event.preventDefault();
    this.close();
  }
}

export interface ISettingsHintData {
  showHasteError: boolean;
  hasteError: number|undefined;
  inferTier7: boolean|undefined;
  openSettings: () => void;
  close: () => void;
}
