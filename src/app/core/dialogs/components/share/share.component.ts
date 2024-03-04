import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';

// * CDK's.
import { Clipboard } from '@angular/cdk/clipboard';

// * QR.
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
type IMode = 'COPY' | 'INITIAL' | 'QR';

// * Material.
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-dialog-content-share',
	standalone: true,
	imports: [QRCodeModule, ButtonComponent],
	templateUrl: './share.component.html',
	styleUrl: './share.component.scss'
})
export class ShareComponent {
	@ViewChild('qrCode') public qrCode?: QRCodeComponent;

	private readonly _data: { title: string; descripcion: string; url?: string } = inject(MAT_DIALOG_DATA);
	private readonly _document: Document = inject(DOCUMENT);
	private readonly _clip: Clipboard = inject(Clipboard);
	private readonly _ref: MatDialogRef<ShareComponent> = inject(MatDialogRef);
	private readonly _core: CoreService = inject(CoreService);
	private readonly _qrData: string = this._data.url ?? this._document.location.href;

	private _mode: IMode = 'INITIAL';

	public get mode(): IMode {
		return this._mode;
	}

	public get qrData(): string {
		return this._qrData;
	}

	public set mode(mode: IMode) {
		this._mode = mode;
	}

	public share(qr: boolean): void {
		navigator
			.share({
				title: this._data.title,
				text: this._data.descripcion,
				url: qr ? this._qrData : this._document.location.href
			})
			.then(() => {
				console.log('Contenido compartido exitosamente');
			})
			.catch((error) => {
				console.log('Hubo un error al compartir', error);
			});
	}

	public copy(): void {
		this._core.height = 117;
		this._clip.copy(this._document.location.href);
		setTimeout(() => {
			this.close();
		}, 3000);
	}

	public qr(): void {
		this._core.height = 450;
		this.mode = 'QR';
	}

	public download(): void {
		if (this.qrCode) {
			const canvas = this.qrCode.qrcElement.nativeElement.querySelector('canvas');
			const downloadLink = document.createElement('a');
			downloadLink.download = 'qr-code.png';
			downloadLink.href = canvas.toDataURL();
			downloadLink.click();
		} else {
			console.log('share.component.ts => download => QrCode Error');
		}
	}

	public close(): void {
		this._ref.close();
	}
}
