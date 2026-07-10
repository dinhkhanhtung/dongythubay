document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Check if configuration exists
  if (!window.CONFIG) {
    console.error('Configuration file (config.js) not found or not loaded.');
    document.getElementById('dynamic-sections').innerHTML = `
      <div class="text-block-card">
        <p class="text-block-content" style="color: #dc2626; text-align: center;">
          Lỗi: Không tìm thấy file cấu hình <strong>config.js</strong>. Vui lòng kiểm tra lại.
        </p>
      </div>
    `;
    return;
  }

  const config = window.CONFIG;

  // 1. Populate SEO Meta Tags
  if (config.seo) {
    document.title = config.seo.title || document.title;
    
    const setMetaTag = (property, content, attrName = 'property') => {
      let meta = document.querySelector(`meta[${attrName}="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (config.seo.description) {
      setMetaTag('description', config.seo.description, 'name');
      setMetaTag('og:description', config.seo.description);
    }
    if (config.seo.title) {
      setMetaTag('og:title', config.seo.title);
    }
    if (config.seo.ogImage) {
      setMetaTag('og:image', config.seo.ogImage);
    }
    if (config.seo.keywords) {
      setMetaTag('keywords', config.seo.keywords, 'name');
    }
  }

  // 2. Populate Profile Information
  if (config.profile) {
    const profile = config.profile;
    const avatarImg = document.getElementById('profile-avatar');
    const nameEl = document.getElementById('profile-name');
    const titleEl = document.getElementById('profile-title');
    const tiktokEl = document.getElementById('profile-tiktok');
    const bioEl = document.getElementById('profile-bio');

    if (profile.avatar) avatarImg.src = profile.avatar;
    if (profile.name) nameEl.textContent = profile.name;
    
    if (profile.subtitle) {
      titleEl.innerHTML = `${profile.title ? profile.title + '<br>' : ''} <span style="font-weight: 500; font-size: 15px; color: var(--text-secondary);">${profile.subtitle}</span>`;
    } else if (profile.title) {
      titleEl.textContent = profile.title;
    } else {
      titleEl.style.display = 'none';
    }

    if (profile.tiktokHandle) {
      tiktokEl.querySelector('span').textContent = profile.tiktokHandle;
      tiktokEl.addEventListener('click', () => {
        const url = `https://www.tiktok.com/${profile.tiktokHandle}`;
        trackClick('tiktok_handle', 'profile', profile.tiktokHandle, url);
        window.open(url, '_blank', 'noopener,noreferrer');
      });
    } else {
      tiktokEl.style.display = 'none';
    }

    if (profile.bio) {
      bioEl.textContent = profile.bio;
    } else {
      bioEl.style.display = 'none';
    }
  }

  // 2.5. Page View Counter Integration (Using api.counterapi.dev)
  const incrementPageView = () => {
    const hasVisited = sessionStorage.getItem('visited_dongythubay');
    const url = hasVisited 
      ? 'https://api.counterapi.dev/v1/dongythubay/views'
      : 'https://api.counterapi.dev/v1/dongythubay/views/up';

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count !== 'undefined') {
          sessionStorage.setItem('visited_dongythubay', 'true');
          const realCount = data.count;
          // Calculate high-credibility virtual count for public view (Multiplier: x12 + 8400)
          const virtualCount = realCount * 12 + 8400;
          const formattedCount = new Intl.NumberFormat('vi-VN').format(virtualCount);
          
          // 1. Render bottom footer counter
          const footer = document.querySelector('.app-footer');
          if (footer) {
            let counterEl = document.getElementById('public-page-counter');
            if (!counterEl) {
              counterEl = document.createElement('p');
              counterEl.id = 'public-page-counter';
              counterEl.style.fontSize = '12px';
              counterEl.style.color = 'var(--text-muted)';
              counterEl.style.marginTop = '8px';
              counterEl.style.display = 'flex';
              counterEl.style.alignItems = 'center';
              counterEl.style.justifyContent = 'center';
              counterEl.style.gap = '4px';
              footer.appendChild(counterEl);
            }
            counterEl.innerHTML = `<i data-lucide="eye" style="width: 14px; height: 14px; opacity: 0.8;"></i><span>${formattedCount} lượt truy cập</span>`;
          }

          // 2. Render top profile counter (Pill-style) for high social proof
          const bioEl = document.getElementById('profile-bio');
          if (bioEl) {
            let topCounter = document.getElementById('top-page-counter');
            if (!topCounter) {
              topCounter = document.createElement('div');
              topCounter.id = 'top-page-counter';
              topCounter.style.fontSize = '12px';
              topCounter.style.color = 'var(--text-secondary)';
              topCounter.style.marginTop = '10px';
              topCounter.style.display = 'flex';
              topCounter.style.alignItems = 'center';
              topCounter.style.justifyContent = 'center';
              topCounter.style.gap = '5px';
              topCounter.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
              topCounter.style.padding = '4px 12px';
              topCounter.style.borderRadius = '20px';
              topCounter.style.border = '1px solid rgba(255, 255, 255, 0.06)';
              topCounter.style.width = 'fit-content';
              topCounter.style.margin = '10px auto 0 auto';
              bioEl.parentNode.insertBefore(topCounter, bioEl.nextSibling);
            }
            topCounter.innerHTML = `<i data-lucide="eye" style="width: 13px; height: 13px; color: var(--color-primary);"></i><span style="font-weight: 600; letter-spacing: 0.3px;">${formattedCount} lượt truy cập</span>`;
          }

          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      })
      .catch(err => console.warn('CounterAPI error:', err));
  };

  incrementPageView();

  // 3. Theme Toggle (Dark/Light mode)
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
    }
    localStorage.setItem('theme', theme);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || getPreferredTheme();
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // Initialize theme
  setTheme(getPreferredTheme());

  // 4. Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 5. Click Tracking Utility
  const trackClick = (type, id, name, url) => {
    try {
      const clickData = JSON.parse(localStorage.getItem('linktree_clicks') || '{}');
      const key = `${type}::${id}`;
      
      if (!clickData[key]) {
        clickData[key] = {
          type: type,
          id: id,
          name: name,
          url: url,
          clicks: 0,
          lastClicked: null
        };
      }
      
      clickData[key].clicks += 1;
      clickData[key].lastClicked = new Date().toISOString();
      
      localStorage.setItem('linktree_clicks', JSON.stringify(clickData));
      console.log(`[Tracking] Click recorded for: ${name} (${type})`);
    } catch (e) {
      console.error('Error saving tracking data:', e);
    }
  };

  // Helper to generate a safe ID if not present
  const slugify = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  // --- 6. DYNAMIC LINK UNFUHLING (METADATA SCRAPER CLIENT-SIDE) ---
  const unfurlCache = {};
  
  async function unfurlLink(url) {
    if (!url) return null;
    
    // Check in-memory cache
    if (unfurlCache[url]) return unfurlCache[url];
    
    // Check localStorage cache
    const cacheKey = `unfurl::${url}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        unfurlCache[url] = parsed;
        return parsed;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    // Try parsing TikTok Shop parameters directly from URL to avoid bot blocking
    try {
      const urlObj = new URL(url);
      const ogInfoParam = urlObj.searchParams.get('og_info');
      if (ogInfoParam) {
        const decodedInfo = JSON.parse(decodeURIComponent(ogInfoParam));
        if (decodedInfo && (decodedInfo.title || decodedInfo.image)) {
          const metadata = {
            title: decodedInfo.title || 'Sản phẩm TikTok Shop',
            description: 'Sản phẩm chính hãng khuyên dùng trên TikTok Shop.',
            image: decodedInfo.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=600&q=80'
          };
          localStorage.setItem(cacheKey, JSON.stringify(metadata));
          unfurlCache[url] = metadata;
          return metadata;
        }
      }
    } catch (e) {
      console.warn('[Unfurl] Error parsing URL query params:', e);
    }
    
    // Scrape via Microlink API (no CORS issue) with 3.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API fetch failed');
      const json = await response.json();
      
      if (json.status === 'success' && json.data) {
        const metadata = {
          title: json.data.title || '',
          description: json.data.description || '',
          image: json.data.image?.url || json.data.logo?.url || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4='
        };
        
        // Cache data
        localStorage.setItem(cacheKey, JSON.stringify(metadata));
        unfurlCache[url] = metadata;
        return metadata;
      }
    } catch (e) {
      console.warn(`[Unfurl] Failed to fetch metadata for ${url}:`, e);
    }
    
    // Fallback if scraping fails
    try {
      const hostname = new URL(url).hostname;
      return {
        title: hostname,
        description: 'Bấm vào nút để truy cập liên kết.',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4='
      };
    } catch(e) {
      return {
        title: 'Liên kết',
        description: 'Bấm vào nút để truy cập liên kết.',
        image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4='
      };
    }
  }

  // 7. Dynamically Render Sections
  const sectionsContainer = document.getElementById('dynamic-sections');
  
  if (config.sections && config.sections.length > 0) {
    sectionsContainer.innerHTML = '';

    // Filter enabled sections and sort by order
    const activeSections = config.sections
      .filter(sec => sec.enabled !== false)
      .sort((a, b) => (a.order || 99) - (b.order || 99));

    activeSections.forEach(section => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'section-wrapper';
      sectionEl.id = `section-${section.id}`;

      // Section Title
      if (section.title) {
        const titleEl = document.createElement('h2');
        titleEl.className = 'section-title';
        titleEl.textContent = section.title;
        sectionEl.appendChild(titleEl);
      }

      // Render based on Section Type
      switch (section.type) {
        case 'social-links':
          renderSocialLinks(section, sectionEl);
          break;
        case 'text-block':
          renderTextBlock(section, sectionEl);
          break;
        case 'project-grid':
          renderProjectGrid(section, sectionEl);
          break;
        case 'affiliate-list':
          renderAffiliateList(section, sectionEl);
          break;
        case 'bank-transfer':
          renderBankTransfer(section, sectionEl);
          break;
        case 'booking':
          renderBookingForm(section, sectionEl);
          break;
        case 'reviews':
          renderPatientReviews(section, sectionEl);
          break;
        default:
          console.warn(`Unknown section type: ${section.type}`);
          break;
      }

      sectionsContainer.appendChild(sectionEl);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  } else {
    sectionsContainer.innerHTML = `
      <div class="text-block-card">
        <p class="text-block-content" style="text-align: center;">Chưa có phần nội dung nào được bật.</p>
      </div>
    `;
  }

  // --- RENDERING FUNCTIONS FOR EACH COMPONENT TYPE ---

  // 1. Social Links Component
  function renderSocialLinks(section, container) {
    const grid = document.createElement('div');
    grid.className = 'social-links-grid';

    section.items.forEach(item => {
      const link = document.createElement('a');
      link.className = 'social-btn';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      if (item.icon) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = item.label;
        img.loading = 'lazy';
        link.appendChild(img);
      } else {
        const iconContainer = document.createElement('i');
        iconContainer.setAttribute('data-lucide', 'external-link');
        link.appendChild(iconContainer);
      }

      const labelSpan = document.createElement('span');
      labelSpan.className = 'platform-label';
      labelSpan.textContent = item.label;
      link.appendChild(labelSpan);

      const arrowIcon = document.createElement('i');
      arrowIcon.setAttribute('data-lucide', 'chevron-right');
      link.appendChild(arrowIcon);

      link.addEventListener('click', () => {
        trackClick('social_link', item.platform, item.label, item.url);
      });

      grid.appendChild(link);
    });

    container.appendChild(grid);
  }

  // 2. Text Block Component
  function renderTextBlock(section, container) {
    const card = document.createElement('div');
    card.className = 'text-block-card';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'text-block-content';
    contentDiv.innerHTML = section.content;
    
    card.appendChild(contentDiv);
    container.appendChild(card);
  }

  // Helper to generate virtual usage count for apps
  function getVirtualUsage(title) {
    if (!title || title === 'Đang tải...') return '1.2k+';
    const score = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (score % 750) + 1200; // 1200 - 1950
    return new Intl.NumberFormat('vi-VN').format(count);
  }

  // Helper to generate virtual sales count for products
  function getVirtualSales(name) {
    if (!name || name === 'Đang tải...') return '850+';
    const score = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sales = (score % 550) + 680; // 680 - 1230
    return new Intl.NumberFormat('vi-VN').format(sales);
  }

  // 3. Project Grid Component (Full Width Image Card for App display)
  function renderProjectGrid(section, container) {
    const grid = document.createElement('div');
    grid.className = 'project-bento-grid';

    section.items.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'project-card';
      card.id = `project-card-${section.id}-${index}`;
      
      const title = item.title || 'Đang tải...';
      const description = item.description || 'Vui lòng đợi giây lát...';
      const image = item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
      const tag = item.tag || 'Ứng dụng';
      const linkUrl = item.previewUrl;

      card.href = linkUrl;
      card.target = '_blank';
      card.setAttribute('rel', 'noopener noreferrer');

      card.innerHTML = `
        <div class="project-image-wrapper">
          <img src="${image}" alt="${title}" class="project-image" loading="lazy">
          <span class="project-tag">${tag}</span>
        </div>
        <div class="project-info">
          <div>
            <h3>${title}</h3>
            <p>${description}</p>
            <div style="font-size: 11.5px; color: var(--color-primary); font-weight: 700; display: inline-flex; align-items: center; gap: 4px; margin-top: 6px;">
              <i data-lucide="users" style="width: 12px; height: 12px;"></i>
              <span>${getVirtualUsage(title)} lượt sử dụng</span>
            </div>
          </div>
          <div class="project-cta">
            <span>Sử dụng ngay</span>
            <i data-lucide="arrow-up-right"></i>
          </div>
        </div>
      `;

      // Track click
      card.addEventListener('click', () => {
        const currentTitle = card.querySelector('h3')?.textContent || title;
        trackClick('project', slugify(currentTitle), currentTitle, linkUrl);
      });

      // Link Unfurling Trigger if metadata is missing
      if (!item.title || !item.description || !item.image) {
        unfurlLink(linkUrl).then(meta => {
          if (meta) {
            const imgEl = card.querySelector('.project-image');
            const titleEl = card.querySelector('h3');
            const descEl = card.querySelector('p');
            
            if (imgEl && !item.image && meta.image) imgEl.src = meta.image;
            if (titleEl && !item.title && meta.title) {
              titleEl.textContent = meta.title;
              if (imgEl) imgEl.alt = meta.title;
            }
            if (descEl && !item.description && meta.description) descEl.textContent = meta.description;
          }
        });
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  // 4. Affiliate List Component (E-commerce Style Grid 2 Columns like TikTok Shop)
  function renderAffiliateList(section, container) {
    const list = document.createElement('div');
    list.className = 'affiliate-container';

    section.items.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'affiliate-card';
      card.id = `affiliate-card-${section.id}-${index}`;
      
      const name = item.name || 'Đang tải...';
      const price = item.priceNote || '';
      const discount = item.discountNote || 'Nhấp xem chi tiết ưu đãi';
      const image = item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
      const linkUrl = item.affiliateUrl;
      
      const isTikTok = linkUrl.includes('tiktok.com');
      const isShopee = linkUrl.includes('shopee.vn') || linkUrl.includes('shope.ee');
      const isLazada = linkUrl.includes('lazada.vn');

      let platformClass = 'other';
      let defaultCta = 'Mua ngay';
      let targetAttr = '_blank';
      let relAttr = 'rel="noopener noreferrer"';

      if (isTikTok) {
        platformClass = 'tiktok';
        defaultCta = 'Mua trên TikTok';
        targetAttr = '_self';
        relAttr = '';
      } else if (isShopee) {
        platformClass = 'shopee';
        defaultCta = 'Mua trên Shopee';
      } else if (isLazada) {
        platformClass = 'lazada';
        defaultCta = 'Mua trên Lazada';
      }

      const ctaLabel = item.ctaLabel || defaultCta;

      card.href = linkUrl;
      card.target = targetAttr;
      if (relAttr) {
        card.setAttribute('rel', 'noopener noreferrer');
      } else {
        card.removeAttribute('rel');
      }

      card.innerHTML = `
        <div class="affiliate-image-wrapper">
          <img src="${image}" alt="${name}" class="affiliate-image" loading="lazy">
        </div>
        <div class="affiliate-info">
          <div class="affiliate-text">
            <h3 class="affiliate-name">${name}</h3>
            <div class="affiliate-price">${price}</div>
            <div class="affiliate-discount">${discount}</div>
            <div style="font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-top: 6px;">
              <span style="color: #eab308; display: flex; align-items: center; gap: 2px; font-weight: 700;">
                <i data-lucide="star" style="width: 11px; height: 11px; fill: #eab308;"></i> 4.9
              </span>
              <span style="opacity: 0.4;">|</span>
              <span style="opacity: 0.85; font-weight: 500;">Đã bán ${getVirtualSales(name)}</span>
            </div>
          </div>
          <div class="affiliate-cta ${platformClass}">
            <span>${ctaLabel}</span>
            <i data-lucide="shopping-cart"></i>
          </div>
        </div>
      `;

      // Track click & Smart TikTok Deep-linking for seamless purchase
      card.addEventListener('click', (e) => {
        const currentName = card.querySelector('.affiliate-name')?.textContent || name;
        trackClick('affiliate', slugify(currentName), currentName, linkUrl);

        if (isTikTok) {
          const match = linkUrl.match(/\/product\/(\d+)/);
          if (match && match[1]) {
            const productId = match[1];
            // TikTok native PDP schema
            const deepLink = `tiktok://ecommerce/product/detail?product_id=${productId}`;
            
            // Prevent normal browser navigation to avoid WebView error/popup loop
            e.preventDefault();
            
            // Try to open deep link directly
            window.location.href = deepLink;
            
            // Fallback to normal URL if deep link fails (after 1.2s)
            setTimeout(() => {
              window.location.href = linkUrl;
            }, 1200);
          }
        }
      });

      // Link Unfurling Trigger if metadata is missing
      if (!item.name || !item.image) {
        unfurlLink(linkUrl).then(meta => {
          if (meta) {
            const imgEl = card.querySelector('.affiliate-image');
            const nameEl = card.querySelector('.affiliate-name');
            const descEl = card.querySelector('.affiliate-discount');
            
            if (imgEl && !item.image && meta.image) imgEl.src = meta.image;
            if (nameEl && !item.name && meta.title) {
              nameEl.textContent = meta.title;
              if (imgEl) imgEl.alt = meta.title;
            }
            if (descEl && !item.discountNote && meta.description) {
              descEl.textContent = meta.description;
            }
          }
        });
      }

      list.appendChild(card);
    });

    container.appendChild(list);
  }

  // 5. Bank Transfer Component ( VietQR dynamic API )
  function renderBankTransfer(section, container) {
    const card = document.createElement('div');
    card.className = 'bank-transfer-card';

    card.innerHTML = `
      <div class="bank-qr-wrapper">
        <img src="${section.qrUrl}" alt="QR Thanh toán BIDV" class="bank-qr-img" loading="lazy">
      </div>
      <div class="bank-details">
        <div class="bank-row">
          <span class="bank-label">Ngân hàng</span>
          <span class="bank-value">${section.bankName}</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Số tài khoản</span>
          <span class="bank-value">
            <span id="bank-acc-num">${section.accountNumber}</span>
            <button class="copy-btn" id="btn-copy-acc" title="Sao chép số tài khoản">
              <i data-lucide="copy"></i>
            </button>
          </span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Chủ tài khoản</span>
          <span class="bank-value">${section.accountName}</span>
        </div>
      </div>
      ${section.note ? `<p class="bank-note">${section.note}</p>` : ''}
    `;

    // Copy Account Number Logic
    const copyBtn = card.querySelector('#btn-copy-acc');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(section.accountNumber).then(() => {
        trackClick('bank_copy', 'account_number', `Copy STK: ${section.accountNumber}`, '#');
        
        // Show temporary checkmark
        copyBtn.innerHTML = '<i data-lucide="check" style="color: var(--color-primary);"></i>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        
        setTimeout(() => {
          copyBtn.innerHTML = '<i data-lucide="copy"></i>';
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }, 2000);
      }).catch(err => {
        console.error('Không thể sao chép: ', err);
      });
    });

    container.appendChild(card);
  }

  // --- ADMIN VIEW & STATISTICS LOGIC ---
  
  // Show admin statistics if query param `?admin=stats` exists
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.get('admin') === 'stats';
  const adminBtn = document.getElementById('admin-trigger');
  
  if (isAdmin) {
    adminBtn.style.display = 'flex';
  }

  const modal = document.getElementById('stats-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const statsTableBody = document.getElementById('stats-data');
  const resetStatsBtn = document.getElementById('reset-stats');
  const exportStatsBtn = document.getElementById('export-stats');

  const showStatsModal = () => {
    // Populate table
    const clickData = JSON.parse(localStorage.getItem('linktree_clicks') || '{}');
    const items = Object.values(clickData);
    
    if (items.length > 0) {
      statsTableBody.innerHTML = '';
      // Sort items by click count (descending)
      items.sort((a, b) => b.clicks - a.clicks);
      
      items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <strong>${item.name}</strong><br>
            <span style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${item.type}</span>
          </td>
          <td>
            <a href="${item.url}" target="_blank" style="color: var(--color-primary); text-decoration: underline;">
              ${item.url.substring(0, 30)}${item.url.length > 30 ? '...' : ''}
            </a>
          </td>
          <td style="font-weight: 700; text-align: center;">${item.clicks}</td>
        `;
        statsTableBody.appendChild(row);
      });
    } else {
      statsTableBody.innerHTML = `
        <tr>
          <td colspan="3" class="no-data">Chưa có dữ liệu tracking nào được lưu. Hãy thử bấm vào các liên kết!</td>
        </tr>
      `;
    }
    
    modal.classList.add('show');
  };

  adminBtn.addEventListener('click', showStatsModal);
  closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
  
  // Close modal when clicking outside content
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });

  // Reset Stats Clicked
  resetStatsBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thống kê số lượt bấm không?')) {
      localStorage.removeItem('linktree_clicks');
      showStatsModal();
    }
  });

  // Export Stats as JSON
  exportStatsBtn.addEventListener('click', () => {
    const clickData = localStorage.getItem('linktree_clicks') || '{}';
    const blob = new Blob([clickData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linktree_clicks_stats_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 6. Booking Form Component
  function renderBookingForm(section, container) {
    const card = document.createElement('div');
    card.className = 'booking-card';

    const titleText = section.title || 'Đặt Lịch Tư Vấn & Hẹn Khám';
    const subtitleText = section.subtitle || 'Vui lòng điền thông tin bên dưới, phòng khám sẽ liên hệ tư vấn sớm nhất.';

    // Helper for clipboard copy
    function copyTextToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(err => {
          return fallbackCopyText(text);
        });
      } else {
        return Promise.resolve(fallbackCopyText(text));
      }
    }

    function fallbackCopyText(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        console.error('[Booking Clipboard] Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
      return successful;
    }

    // Dropdown list for diseases
    const diseaseOptions = [
      'Dạ dày / HP',
      'Sỏi thận / Sỏi mật',
      'Cường dương / Yếu sinh lý',
      'Rụng tóc / Bạc tóc',
      'Hiếm muộn / Vô sinh',
      'Trĩ (Nội, Ngoại)',
      'Xương khớp / Gút',
      'Phụ khoa / Nam khoa',
      'Khác'
    ];

    card.innerHTML = `
      <div id="booking-form-wrapper">
        <p style="font-size: 13.5px; color: var(--text-secondary); line-height: 1.45; text-align: center; margin-bottom: 8px;">
          ${subtitleText}
        </p>
        <form class="booking-form" id="appointment-form">
          <div class="booking-field">
            <label for="book-name">Họ và Tên <span style="color:#ef4444">*</span></label>
            <input type="text" id="book-name" class="booking-input" required placeholder="Nhập tên của bạn...">
          </div>
          <div class="booking-field">
            <label for="book-phone">Số điện thoại <span style="color:#ef4444">*</span></label>
            <input type="tel" id="book-phone" class="booking-input" required placeholder="Nhập số điện thoại...">
          </div>
          <div class="booking-field">
            <label for="book-disease">Bệnh lý cần khám</label>
            <select id="book-disease" class="booking-select">
              ${diseaseOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
          </div>
          <div class="booking-field">
            <label for="book-message">Lời nhắn / Triệu chứng</label>
            <textarea id="book-message" class="booking-textarea" placeholder="Ghi chú triệu chứng hoặc thời gian tiện nghe điện thoại..."></textarea>
          </div>
          <button type="submit" class="booking-submit-btn" id="book-submit">
            <i data-lucide="send" style="width: 16px; height: 16px;"></i>
            <span>Gửi Đăng Ký Ngay</span>
          </button>
        </form>
      </div>
    `;

    const form = card.querySelector('#appointment-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = card.querySelector('#book-submit');
      const name = card.querySelector('#book-name').value.trim();
      const phone = card.querySelector('#book-phone').value.trim();
      const disease = card.querySelector('#book-disease').value;
      const message = card.querySelector('#book-message').value.trim();

      if (!name || !phone) return alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại!');

      // Set Loading
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="spinner-inline" style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <span>Đang gửi đăng ký...</span>
      `;

      // Prepare text to copy
      const textToCopy = `Chào Tùng, mình đăng ký đặt lịch tư vấn:\n` +
        `- Họ tên: ${name}\n` +
        `- Số điện thoại: ${phone}\n` +
        `- Bệnh lý: ${disease}\n` +
        `- Lời nhắn: ${message || 'Không có'}`;

      // Copy to Clipboard immediately on user interaction to avoid browser block
      copyTextToClipboard(textToCopy);

      try {
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, disease, message })
        });

        const resData = await response.json();

        if (response.ok && resData.success) {
          // Track booking click
          trackClick('booking', slugify(disease), `Đăng ký khám: ${disease}`, '#');

          // Render Success Screen
          card.querySelector('#booking-form-wrapper').innerHTML = `
            <div class="booking-success-message">
              <div class="booking-success-icon">
                <i data-lucide="check" style="width: 28px; height: 28px;"></i>
              </div>
              <h3 class="booking-success-title">Đăng Ký Thành Công!</h3>
              <p class="booking-success-desc" style="margin-bottom: 8px;">
                Đã gửi thông tin đến Telegram của Tùng.<br>
                Đồng thời, nội dung đã được <strong>tự động sao chép vào bộ nhớ đệm</strong> của bạn.
              </p>
              <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
                Bạn đang được chuyển hướng sang Zalo... Hãy <strong>DÁN (PASTE)</strong> tin nhắn vào ô chat để gửi đi.
              </p>
              <a href="https://zalo.me/0982581222" class="booking-submit-btn" style="background-color: #0068ff; color: #ffffff; text-decoration: none; width: 100%; border-radius: var(--radius-sm); font-size: 14.5px; font-weight: 700; margin-top: 0; min-height: 48px;">
                <i data-lucide="message-square" style="width: 18px; height: 18px;"></i>
                <span>Mở Zalo và Dán gửi ngay</span>
              </a>
            </div>
          `;
          if (typeof lucide !== 'undefined') lucide.createIcons();

          // Auto redirect to Zalo after 2 seconds
          setTimeout(() => {
            window.location.href = 'https://zalo.me/0982581222';
          }, 2000);

        } else {
          alert(resData.error || 'Có lỗi xảy ra khi gửi lịch hẹn. Vui lòng thử lại!');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i data-lucide="send" style="width: 16px; height: 16px;"></i><span>Gửi Đăng Ký Ngay</span>`;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền của bạn!');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="send" style="width: 16px; height: 16px;"></i><span>Gửi Đăng Ký Ngay</span>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });

    container.appendChild(card);
  }

  // 7. Patient Reviews (Testimonials) Component with Zoom Lightbox
  function renderPatientReviews(section, container) {
    const slider = document.createElement('div');
    slider.className = 'reviews-container';

    // Populate reviews
    section.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      
      const image = item.image;
      const caption = item.caption || `Đánh giá bệnh nhân #${index + 1}`;

      card.innerHTML = `
        <div class="review-image-wrapper">
          <img src="${image}" alt="${caption}" class="review-image" loading="lazy">
        </div>
        <div class="review-info">
          <div class="review-caption">${caption}</div>
        </div>
      `;

      // Zoom click handler (open lightbox)
      card.addEventListener('click', () => {
        openLightbox(image, caption);
      });

      slider.appendChild(card);
    });

    container.appendChild(slider);
  }

  // Lightbox utility function
  function openLightbox(src, caption) {
    let lightbox = document.getElementById('review-lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'review-lightbox-modal';
      lightbox.className = 'review-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content-wrapper">
          <img src="" alt="" class="lightbox-img" id="lightbox-img-el">
          <div class="lightbox-caption" id="lightbox-caption-el"></div>
        </div>
      `;
      
      // Close lightbox on click
      lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
      });

      document.body.appendChild(lightbox);
    }

    const imgEl = lightbox.querySelector('#lightbox-img-el');
    const captionEl = lightbox.querySelector('#lightbox-caption-el');

    imgEl.src = src;
    imgEl.alt = caption;
    captionEl.textContent = caption;

    // Show Lightbox with transition
    lightbox.getBoundingClientRect();
    lightbox.classList.add('show');
  }

});
