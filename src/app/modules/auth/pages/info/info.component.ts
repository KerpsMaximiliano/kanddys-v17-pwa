import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Material.
import { MatIconModule } from '@angular/material/icon';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-auth-info',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './info.component.html',
	styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {
	public options: { title: string; subtitle: string; icon: string; disabled: boolean }[] = [
		{
			title: 'Perfil Comercial',
			subtitle: 'Crea tu perfil comercial',
			icon: 'bar_chart_4_bars',
			disabled: false
		},
		{
			title: 'Tienda',
			subtitle: 'Configura tu tienda',
			icon: 'bar_chart_4_bars',
			disabled: false
		},
		{
			title: 'Articulos',
			subtitle: 'Adiciona tu primer articulo',
			icon: 'bar_chart_4_bars',
			disabled: false
		},
		{
			title: 'Facturas',
			subtitle: 'Iniciadas 0. En Proceso 0. Completadas 0',
			icon: 'directions_run',
			disabled: false
		},
		{
			title: 'Flujo de Caja',
			subtitle: 'Ingresos $0. Egresos $0. Beneficios $0',
			icon: 'directions_run',
			disabled: true
		},
		{
			title: 'Compradores',
			subtitle: '> 4:0. >8:0. >16:0',
			icon: 'directions_run',
			disabled: true
		},
		{
			title: 'Vendedores Afiliados',
			subtitle: '> 4:0. >8:0. >16:0',
			icon: 'directions_run',
			disabled: true
		},
		{
			title: 'Mis Acciones',
			subtitle: 'Recientes: perfil comercial',
			icon: 'directions_run',
			disabled: true
		},
		{
			title: 'Estrategias y Tácticas',
			subtitle: 'Ver posibilidades',
			icon: 'query_stats',
			disabled: true
		}
	];

	private readonly _core: CoreService = inject(CoreService);

	public ngOnInit(): void {
		localStorage.clear();
		this._core.redirect('');
	}
}
