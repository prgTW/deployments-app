import * as _ from "lodash";

export function resetAnimations() {
	let pulsatingElements = document.querySelectorAll('.pulsating');
	_.forEach(pulsatingElements, (elem) => {
		elem.classList.remove('pulsating')
	});
	setTimeout(() => {
		_.forEach(pulsatingElements, (elem) => {
			elem.classList.add('pulsating')
		})
	}, 1000);
};
