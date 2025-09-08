document.addEventListener("DOMContentLoaded", function () {

	const form = document.querySelector(".interior-vision-brief-page__wrap-form");
	if (!form) return;

	const tabButtons = form.querySelectorAll(".tab-name");
	const tabContents = form.querySelectorAll(".tabContent");
	const fieldsBlock = form.querySelector("#fields");

	// === Переключение по верхним табам ===
	tabButtons.forEach(function (tabBtn) {
		tabBtn.addEventListener("click", function () {
			const targetTabId = this.getAttribute("data-tab");
			const correspondingContent = form.querySelector('.tabContent[data-tabcontent="' + targetTabId + '"]');
			tabButtons.forEach(btn => btn.classList.remove("tab-active"));
			tabContents.forEach(content => content.classList.remove("content-active"));
			this.classList.add("tab-active");
			if (correspondingContent) {
				correspondingContent.classList.add("content-active");
			}
		});
	});

	// === Переключение по кнопкам внизу вкладок ===
	const scrollButtons = form.querySelectorAll(".wrap-button .button");
	if (fieldsBlock) {
		scrollButtons.forEach(btn => {
			btn.addEventListener("click", function () {

				const targetTabId = this.getAttribute("data-tab");
				if (targetTabId) {
					const targetButton = form.querySelector('button.tab-name[data-tab="' + targetTabId + '"]');
					if (targetButton) {
						targetButton.click();
					}
				}
				fieldsBlock.scrollIntoView({ behavior: "smooth", block: "start" });
			});
		});
	}

	/*
	var parentTabs = document.querySelectorAll('.interior-vision-brief-page__wrap-form .tab-name');
	parentTabs.forEach(function (parentTab) {
		parentTab.addEventListener('click', function () {
			var parentTabId = this.getAttribute('data-tab');
			var correspondingParentTabContent = document.querySelector('.tabContent[data-tabcontent="' + parentTabId + '"]');
			document.querySelectorAll('.interior-vision-brief-page__wrap-form .tab-name').forEach(function (tab) {
				tab.classList.remove('tab-active');
			});
			document.querySelectorAll('.tabContent').forEach(function (content) {
				content.classList.remove('content-active');
			});
			this.classList.add('tab-active');
			correspondingParentTabContent.classList.add('content-active');
		});
	});
	*/

	// отслеживание первой кнопки на активный класс
	const ul = document.querySelector(".list-tabs-buttons");
	if (!ul) return;
	const firstButton = ul.querySelector("li:first-child .tab-name");
	if (!firstButton) return;
	function checkFirstButton() {
		if (!firstButton.classList.contains("tab-active")) {
			ul.classList.add("first-button-no-active");
		} else {
			ul.classList.remove("first-button-no-active");
		}
	}
	checkFirstButton();
	const observer = new MutationObserver(() => {
		checkFirstButton();
	});
	observer.observe(firstButton, {
		attributes: true,
		attributeFilter: ["class"]
	});

	// Отслеживание второй кнопки
	const secondButton = document.querySelector('.list-tabs-buttons button[data-tab="step2"]');
	if (secondButton) {
		function checkSecondButton() {
			if (secondButton.classList.contains("tab-active")) {
				if (!document.body.classList.contains("second-tab-is-active")) {
					document.body.classList.add("second-tab-is-active");
				}
			} else {
				document.body.classList.remove("second-tab-is-active");
			}
		}
		checkSecondButton();
		const observer2 = new MutationObserver(() => {
			checkSecondButton();
		});
		observer2.observe(secondButton, {
			attributes: true,
			attributeFilter: ["class"]
		});
	}

	// отслеживание активного класса кнопки для класса active-button-here у тега li
	const tabsList = document.querySelector(".list-tabs-buttons");
	if (!tabsList) return;
	const tabButtons2 = tabsList.querySelectorAll("button.tab-name");
	function updateActiveListItem() {
		tabsList.querySelectorAll("li").forEach(item => item.classList.remove("active-button-here"));
		const activeButton = tabsList.querySelector("button.tab-name.tab-active");
		if (activeButton) {
			activeButton.closest("li").classList.add("active-button-here");
		}
	}
	updateActiveListItem();
	tabButtons2.forEach(button => {
		const observer = new MutationObserver(() => {
			updateActiveListItem();
		});
		observer.observe(button, {
			attributes: true,
			attributeFilter: ["class"]
		});
	});

});