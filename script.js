const container = document.querySelector('.container');
const propertySections = document.querySelectorAll('.properties');

function getSelectedItem() {
	const selectedRadio = document.querySelector('input[name="selected-item"]:checked');
	if (!selectedRadio) return null;

	const targetId = selectedRadio.dataset.itemTarget;
	return document.getElementById(targetId);
}

function getPropertyName(optionsBlock) {
	const label = optionsBlock.querySelector('p');
	if (!label) return null;

    // Get only the property name from the label, removin)g any extra text like ":" or "(px)"
	return label.textContent.replace(':', '').replace('(px)', '').trim();
}

function formatValue(propertyName, rawValue) {
	if (propertyName === 'gap') {
		return `${rawValue}px`;
	}

	return rawValue;
}

function applyProperties(propertyName, value) {
    applyContainerProperties(propertyName, value);
    applyItemProperties(propertyName, value);
}

function applyContainerProperties(propertyName, value){ 
    container.style.setProperty(propertyName, value);
}

function applyItemProperties(propertyName, value) {
    const selectedItem = getSelectedItem();
	if (!selectedItem) return;

    selectedItem.style.setProperty(propertyName, value);
}

function setActiveOption(optionsBlock, activeAnchor) {
	const anchors = optionsBlock.querySelectorAll('a');

	anchors.forEach((anchor) => {
		anchor.classList.toggle('active', anchor === activeAnchor);
	});
}

function changeRangeValueDisplay(range) {
    if (!range) return;

    const valueDisplay = range.nextElementSibling;
    valueDisplay.textContent = range.name === 'gap' ? `${range.value}px` : range.value;
}

function resetAllProperties() {
    container.removeAttribute('style');
    const items = container.querySelectorAll('.item');
    items.forEach(item => item.removeAttribute('style'));
	setPropertiesToCode();
}

function copyItemProperties(item) {
    const selectedItem = document.getElementById(`item-${item}`);

    const formatedProperties = getProperties(selectedItem, ['flex-grow','align-self']);
    navigator.clipboard.writeText(formatedProperties);
}

function copyContainerProperties() {
    const formatedProperties = getProperties(container, ['flex-direction', 'justify-content', 'align-items', 'gap']);
    navigator.clipboard.writeText(formatedProperties);
}

function getProperties(element, propertiesToCopy) {
    const styles = window.getComputedStyle(element);
    const formatedProperties = propertiesToCopy.map(prop => `${prop}: ${styles.getPropertyValue(prop)}`).join(';\n');

    return formatedProperties;
}

function setPropertiesToCode() {
    setContainerPropertiesToCode();
    setItemPropertiesToCode();
}

function setContainerPropertiesToCode() {
    const containerCode = document.getElementById('container-code');
	if (containerCode) {
		const formatedContainerProperties = getProperties(container, ['display','flex-direction', 'justify-content', 'align-items', 'gap']);
		containerCode.textContent = `.container {\n${formatedContainerProperties};\n}`;
	}
}

function setItemPropertiesToCode() {
    const items = container.querySelectorAll('.item');
	items.forEach((item) => {
		const codeContainer = document.getElementById(`${item.id}-code`);
		if (!codeContainer) return;

		const formatedItemProperties = getProperties(item, ['flex-grow', 'align-self']);
		codeContainer.textContent = `#${item.id} {\n${formatedItemProperties};\n}`;
	});
}

propertySections.forEach((section) => {
	const optionBlocks = section.querySelectorAll('.options');

	optionBlocks.forEach((optionsBlock) => {
		const propertyName = getPropertyName(optionsBlock);
		const anchors = optionsBlock.querySelectorAll('a');
		const ranges = optionsBlock.querySelectorAll('input[type="range"]');

		anchors.forEach((anchor) => {
			anchor.addEventListener('click', () => {
				const value = anchor.textContent.trim();
				applyProperties(propertyName, value);
				setActiveOption(optionsBlock, anchor);
                setPropertiesToCode();
			});
		});

		ranges.forEach((range) => {
			const rangePropertyName = propertyName || range.name || range.id;

			range.addEventListener('input', () => {
				const value = formatValue(rangePropertyName, range.value);
				applyProperties(rangePropertyName, value);
				changeRangeValueDisplay(range);
                setPropertiesToCode();
			});

			const initialValue = formatValue(rangePropertyName, range.value);
			applyProperties(rangePropertyName, initialValue);
			changeRangeValueDisplay(range);
		});
	});
});

document.querySelectorAll('input[name="selected-item"]').forEach((radio) => {
    radio.addEventListener('change', setPropertiesToCode);
});

setPropertiesToCode();
