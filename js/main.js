/* ============================================
   Atelier — Main JS
   Vanilla JS, no dependencies
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // — Search overlay —
    const searchOpen = document.getElementById('searchOpen');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;

    if (searchOpen && searchOverlay) {
        searchOpen.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            if (searchInput) searchInput.focus();
        });
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchOverlay.classList.remove('active');
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // — Smooth scroll for anchor links —
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // — Reading progress bar (article pages) —
    const progressBar = document.getElementById('readingProgress');
    const articleBody = document.querySelector('.article-body');

    if (progressBar && articleBody) {
        const updateProgress = () => {
            const articleTop = articleBody.offsetTop;
            const articleHeight = articleBody.offsetHeight;
            const scrolled = window.scrollY - articleTop;
            const windowHeight = window.innerHeight;
            const progress = Math.min(Math.max(scrolled / (articleHeight - windowHeight), 0), 1);
            progressBar.style.width = (progress * 100) + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // — Sidebar TOC with scroll tracking (article pages) —
    const sidebar = document.getElementById('articleSidebar');

    if (articleBody && sidebar) {
        const headings = articleBody.querySelectorAll('h2');

        if (headings.length >= 3) {
            const toc = document.createElement('nav');
            toc.className = 'toc';
            toc.innerHTML = '<p class="toc__title">Sommaire</p>';
            const list = document.createElement('ul');
            list.className = 'toc__list';
            const tocLinks = [];

            headings.forEach((heading, i) => {
                const id = 'section-' + i;
                heading.id = id;
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + id;
                a.textContent = heading.textContent.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]\s*/gu, '').trim();
                li.appendChild(a);
                list.appendChild(li);
                tocLinks.push({ el: a, id: id });
            });

            toc.appendChild(list);
            sidebar.appendChild(toc);

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        tocLinks.forEach(link => {
                            link.el.classList.toggle('toc--active', link.id === activeId);
                        });
                    }
                });
            }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

            headings.forEach(heading => observer.observe(heading));
        }
    }

    // — Inline newsletter after first paragraph —
    const articleBody = document.getElementById('articleBody');
    if (articleBody) {
        const firstP = articleBody.querySelector('p');
        if (firstP) {
            const bar = document.createElement('div');
            bar.className = 'article-inline-newsletter';
            bar.innerHTML = '<div class="article-inline-newsletter__text"><strong>Restez à l\'atelier</strong> — Recevez le meilleur chaque semaine.</div><form><input type="email" placeholder="votre@email.com" required><button type="submit">S\'abonner</button></form>';
            firstP.after(bar);
            bar.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault();
                bar.innerHTML = '<div class="article-inline-newsletter__text"><strong>Merci !</strong> Vous êtes inscrit(e).</div>';
            });
        }
    }

    // — Newsletter form —
    const newsletterForms = document.querySelectorAll('.cta__form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                form.innerHTML = '<p style="color: #fff; font-weight: 600; font-size: 1.1rem;">Merci ! Vous êtes inscrit(e).</p>';
            }
        });
    });

});
