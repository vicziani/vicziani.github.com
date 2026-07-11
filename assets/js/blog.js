function initArchiveTagFilter() {
	var tagButtons = document.querySelectorAll('.archive-tag[data-filter-tag]');
	var postItems = document.querySelectorAll('.archive-post-item[data-tags]');

	if (!tagButtons.length || !postItems.length) {
		return;
	}

	function normalize(value) {
		return (value || '').toString().trim().toLowerCase();
	}

	function setActiveButton(activeButton) {
		tagButtons.forEach(function (button) {
			button.classList.toggle('is-active', button === activeButton);
		});
	}

	function updateYearVisibility() {
		var archiveHeadings = document.querySelectorAll('.blog-main h2');

		archiveHeadings.forEach(function (heading) {
			var nextElement = heading.nextElementSibling;

			if (!nextElement || nextElement.tagName !== 'UL') {
				return;
			}

			var hasVisiblePosts = Array.prototype.some.call(nextElement.children, function (child) {
				return child.tagName === 'LI' && child.style.display !== 'none';
			});

			heading.style.display = hasVisiblePosts ? '' : 'none';
			nextElement.style.display = hasVisiblePosts ? '' : 'none';
		});
	}

	function filterPostsByTag(rawTag) {
		var selectedTag = normalize(rawTag);
		var showAll = selectedTag === normalize('Összes');

		postItems.forEach(function (item) {
			if (showAll) {
				item.style.display = '';
				return;
			}

			var tags = (item.getAttribute('data-tags') || '')
				.split(',')
				.map(normalize)
				.filter(Boolean);

			item.style.display = tags.indexOf(selectedTag) !== -1 ? '' : 'none';
		});

		updateYearVisibility();
	}

	tagButtons.forEach(function (button) {
		button.addEventListener('click', function () {
			var selectedTag = button.getAttribute('data-filter-tag');

			setActiveButton(button);
			filterPostsByTag(selectedTag);
		});
	});

	var defaultButton = document.querySelector('.archive-tag.is-active') || tagButtons[0];
	setActiveButton(defaultButton);
	filterPostsByTag(defaultButton.getAttribute('data-filter-tag'));
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initArchiveTagFilter);
} else {
	initArchiveTagFilter();
}
