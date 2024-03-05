export function date(value?: string, from?: string, to?: string): string | null {
	if (value) {
		const date = new Date(value);
		let month = date.toLocaleString('es', { month: 'long' });
		month = month.charAt(0).toUpperCase() + month.slice(1);
		if (from && to) {
			let parts: string[] = from.split(':');
			const fromHour: string = `${parts[0]}:${parts[1]}`;
			parts = to.split(':');
			const toHour = `${parts[0]}:${parts[1]}`;
			return `${date.getUTCDate()} de ${month.toLowerCase()} entre las ${fromHour} y las ${toHour} hs`;
		} else {
			return `${date.getUTCDate()} de ${month.toLowerCase()}`;
		}
	} else {
		return null;
	}
}
