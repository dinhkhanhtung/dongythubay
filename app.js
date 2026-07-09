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
          </div>
          <div class="affiliate-cta ${platformClass}">
            <span>${ctaLabel}</span>
            <i data-lucide="shopping-cart"></i>
          </div>
        </div>
      `;

      // Track click
      card.addEventListener('click', () => {
        const currentName = card.querySelector('.affiliate-name')?.textContent || name;
        trackClick('affiliate', slugify(currentName), currentName, linkUrl);
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

});
