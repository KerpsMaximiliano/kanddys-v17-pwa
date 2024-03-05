/* eslint-disable @typescript-eslint/naming-convention */
export function undate(value: string): string {
	const months: { [key: string]: string } = {
		enero: '01',
		febrero: '02',
		marzo: '03',
		abril: '04',
		mayo: '05',
		junio: '06',
		julio: '07',
		agosto: '08',
		septiembre: '09',
		octubre: '10',
		noviembre: '11',
		diciembre: '12'
	};

	const parts: string[] | null = value.match(/(\d+) de (\w+)/);

	if (!parts) {
		return '00-00-0000';
	} else {
		const day: string = parts[1].padStart(2, '0');
		const month: string = months[parts[2]];
		return `2024-${month}-${day}`;
	}
}
