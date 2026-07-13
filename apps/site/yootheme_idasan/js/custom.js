(function () {
  var roots = document.querySelectorAll('.cbdas-landing');

  if (!roots.length) {
    return;
  }

  roots.forEach(function (root) {
    var header = root.querySelector('[data-cbdas-header]');
    var menu = root.querySelector('[data-cbdas-menu]');
    var menuToggle = root.querySelector('[data-cbdas-menu-toggle]');
    var actionsMenu = root.querySelector('[data-cbdas-actions-menu]');
    var actionsToggle = root.querySelector('[data-cbdas-actions-toggle]');

    if (header) {
      var updateHeader = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 48);
      };

      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }

    if (menu && menuToggle) {
      menuToggle.addEventListener('click', function () {
        var isOpen = menu.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('is-open');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    if (actionsMenu && actionsToggle) {
      actionsToggle.addEventListener('click', function () {
        var isOpen = actionsMenu.classList.toggle('is-open');
        actionsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    root.querySelectorAll('[data-cbdas-schedule-tab]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var index = tab.getAttribute('data-cbdas-schedule-tab');

        root.querySelectorAll('[data-cbdas-schedule-tab]').forEach(function (otherTab) {
          var isActive = otherTab === tab;
          otherTab.classList.toggle('is-active', isActive);
          otherTab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        root.querySelectorAll('[data-cbdas-schedule-panel]').forEach(function (panel) {
          panel.classList.toggle(
            'is-active',
            panel.getAttribute('data-cbdas-schedule-panel') === index
          );
        });
      });
    });

    root.querySelectorAll('[data-cbdas-copy]').forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-cbdas-copy') || '';
        var originalText = button.textContent;

        if (!value || !navigator.clipboard) {
          return;
        }

        navigator.clipboard.writeText(value).then(function () {
          button.textContent = 'Copiado';

          window.setTimeout(function () {
            button.textContent = originalText || 'Copiar';
          }, 1800);
        });
      });
    });
  });
})();
