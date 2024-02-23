import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * Material.
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	selector: 'app-resizable',
	templateUrl: './resize-dialog.component.html',
	styleUrl: './resize-dialog.component.scss'
})
export class ResizeDialogComponent {
	public ht: number = 208;
	public y: number = 0;
	public dy: number = 0;

	private _dialogRef: MatDialogRef<ResizeDialogComponent> = inject(MatDialogRef);

	public touchstart(event: TouchEvent): void {
		this.y = event.changedTouches[0].screenY;
	}

	public touchmove(event: TouchEvent): void {
		this.dy = event.changedTouches[0].screenY - this.y;
		this.y = event.changedTouches[0].screenY;
		this.ht -= this.dy;
		if (this.ht < 208) this._dialogRef.close();
	}

	public close(): void {
		this._dialogRef.close();
	}
}
