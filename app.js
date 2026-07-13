// ==========================================================================
// IN-APP BROWSER WARNING BANNER FOR TIKTOK, FACEBOOK, ZALO
// ==========================================================================

function showInAppBrowserBanner() {
  if (document.getElementById('inapp-warning-banner')) return;

  // 1. Tạo style keyframe nếu chưa có
  if (!document.getElementById('inapp-banner-style')) {
    const style = document.createElement('style');
    style.id = 'inapp-banner-style';
    style.innerHTML = `
      @keyframes inappBounceDiagonal {
        from { transform: translate(0, 0); }
        to { transform: translate(6px, -6px); }
      }
      @keyframes inappPulse {
        from { filter: drop-shadow(0 0 2px rgba(46, 204, 113, 0.4)); }
        to { filter: drop-shadow(0 0 8px rgba(46, 204, 113, 0.8)); }
      }
      /*
       * ============================================================
       * THIẾT KẾ WHITELIST — In-App Browser Lock
       * ============================================================
       * Mặc định: TOÀN BỘ tương tác bị khóa trong TikTok/Facebook/Zalo webview.
       * Khách phải bấm 3 chấm → "Mở bằng trình duyệt ngoài" để dùng.
       *
       * CHỈ NHỮNG MỤC NÀO ĐƯỢC LIỆT KÊ BÊN DƯỚI mới cho phép click trong webview:
       *  ✅ tiktok.com/view/product/ — Sản phẩm TikTok Shop (TikTok tự xử lý native)
       *
       * Mọi section mới thêm vào config.js (apps, links, social...) đều
       * TỰ ĐỘNG BỊ KHÓA mà không cần chỉnh sửa thêm code ở đây.
       * Nếu muốn mở thêm whitelist, chỉ cần thêm dòng CSS tương tự bên dưới.
       * ============================================================
       */
      body.inapp-active * {
        pointer-events: none !important;
      }
      #inapp-warning-banner, #inapp-warning-banner *, #inapp-arrow-indicator, #inapp-arrow-indicator * {
        pointer-events: auto !important;
      }
      /* WHITELIST #1: Sản phẩm TikTok Shop — TikTok webview tự mở native product screen */
      body.inapp-active a[href*="tiktok.com/view/product/"],
      body.inapp-active a[href*="tiktok.com/view/product/"] * {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Kích hoạt class khóa pointer-events
  document.body.classList.add('inapp-active');

  // 2. Tạo màn kính mờ nhẹ toàn màn hình
  const glass = document.createElement('div');
  glass.id = 'inapp-glass-overlay';
  glass.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(8, 20, 14, 0.25);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    z-index: 9999999;
    pointer-events: none;
  `;

  // 3. Tạo Card thông báo nổi ở vị trí cũ (top: 65px)
  const banner = document.createElement('div');
  banner.id = 'inapp-warning-banner';
  banner.style.cssText = `
    position: fixed;
    top: 65px;
    left: 12px;
    right: 12px;
    background: rgba(26, 42, 34, 0.98);
    border: 1px solid rgba(46, 204, 113, 0.35);
    border-radius: 16px;
    padding: 14px 16px;
    z-index: 10000000;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 480px;
    margin: 0 auto;
    box-sizing: border-box;
  `;

  banner.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: 12px; padding-right: 20px; box-sizing: border-box; text-align: left;">
      <div style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg style="width: 18px; height: 18px; stroke: currentColor; stroke-width: 2.5; fill: none;" viewBox="0 0 24 24">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div style="flex-grow: 1;">
        <h4 style="margin: 0 0 3px 0; color: #ffffff; font-size: 14.5px; font-weight: 700; line-height: 1.3; font-family: inherit;">Mở Bằng Trình Duyệt Ngoài</h4>
        <p style="margin: 0; color: #a3b8ac; font-size: 13.5px; line-height: 1.45; font-family: inherit;">
          Vui lòng click <strong>3 dấu chấm (...)</strong> ở góc trên bên phải và chọn <strong>"Mở bằng trình duyệt ngoài"</strong>.
        </p>
      </div>
    </div>
  `;

  // 4. Tạo Mũi tên chéo động chỉ thẳng góc lên nút 3 chấm ở góc phải màn hình
  const arrow = document.createElement('div');
  arrow.id = 'inapp-arrow-indicator';
  arrow.style.cssText = `
    position: fixed;
    top: 8px;
    right: 24px;
    z-index: 10000001;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #2ecc71;
    font-weight: 700;
    font-size: 11px;
    pointer-events: none;
    font-family: system-ui, -apple-system, sans-serif;
    animation: inappBounceDiagonal 1.2s infinite alternate ease-in-out;
  `;
  arrow.innerHTML = `
    <svg style="width: 32px; height: 32px; stroke: currentColor; stroke-width: 3; fill: none; margin-bottom: 2px; animation: inappPulse 1.2s infinite alternate ease-in-out;" viewBox="0 0 24 24">
      <path d="M7 17L17 7M17 7H9M17 7V15" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span style="text-shadow: 0 1px 3px rgba(0,0,0,0.9); background: rgba(26,42,34,0.9); padding: 3px 8px; border-radius: 6px; border: 1px solid rgba(46, 204, 113, 0.3);">Bấm ở đây</span>
  `;

  document.body.appendChild(glass);
  document.body.appendChild(banner);
  document.body.appendChild(arrow);
}

const initApp = () => {
  const bootScreen = document.getElementById('app-boot-screen');
  
  const hideBootScreen = () => {
    if (!bootScreen || bootScreen.classList.contains('is-hidden')) return;
    bootScreen.classList.add('is-hidden');
    bootScreen.addEventListener('transitionend', () => {
      bootScreen.style.display = 'none';
    }, { once: true });
  };

  const maxBootTimeout = setTimeout(hideBootScreen, 1500);

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

  // Apply edge-to-edge layout if enabled
  if (config.edgeToEdge) {
    document.body.classList.add('layout-edge-to-edge');

    // Tạo hai dải giả lập màn hình cong tràn viền (waterfall curved edge glass)
    const edgeLeft = document.createElement('div');
    edgeLeft.className = 'curved-edge-left';
    const edgeRight = document.createElement('div');
    edgeRight.className = 'curved-edge-right';

    // Nếu chạy trên Desktop (màn hình rộng hơn 480px), tự động bọc giao diện vào khung mockup điện thoại tràn viền
    if (window.innerWidth > 480) {
      const container = document.querySelector('.app-container');
      const header = document.querySelector('.sticky-header');
      
      if (container) {
        // Tạo wrapper mockup điện thoại tràn viền
        const phoneDevice = document.createElement('div');
        phoneDevice.className = 'phone-mockup-device';
        
        // Tạo Dynamic Island phía trên cùng
        const dynamicIsland = document.createElement('div');
        dynamicIsland.className = 'phone-dynamic-island';
        
        // Chèn phoneDevice vào DOM tại vị trí của header/container
        const insertTarget = header || container;
        insertTarget.parentNode.insertBefore(phoneDevice, insertTarget);
        
        // Bọc Dynamic Island, Header và Container vào trong khung điện thoại
        phoneDevice.appendChild(dynamicIsland);
        if (header) {
          phoneDevice.appendChild(header);
        }
        phoneDevice.appendChild(container);
        
        // Di chuyển cả nút back-to-top vào bên trong để hiển thị đúng vị trí
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
          phoneDevice.appendChild(backToTopBtn);
        }
        
        // Chèn hai dải cong tràn viền vào trong mockup điện thoại
        phoneDevice.appendChild(edgeLeft);
        phoneDevice.appendChild(edgeRight);
        
        // Thêm class đánh dấu đang chạy mockup trên body để có các tuỳ chỉnh CSS nền mờ bên ngoài
        document.body.classList.add('phone-mockup-active');
      }
    } else {
      // Chèn hai dải cong tràn viền trực tiếp vào body (Mobile thực tế)
      document.body.appendChild(edgeLeft);
      document.body.appendChild(edgeRight);
    }
  }

  // Helper to fallback icon name to SVG to avoid CDN bundle missing issues (e.g. facebook)
  function getDynamicIconHtml(iconName) {
    if (iconName === 'facebook') {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`;
    }
    return `<i data-lucide="${iconName}"></i>`;
  }

  // 0. Helper function to scroll to element with Sticky Header offset (72px)
  function scrollToElement(element) {
    if (!element) return;
    const headerOffset = 72; // 56px sticky header + 16px safe buffer
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  // Custom App Toast System to replace native alert()
  function showAppToast(message, type = 'info') {
    let container = document.querySelector('.app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }
    const item = document.createElement('div');
    item.className = `app-toast-item app-toast-${type}`;
    let iconHtml = '';
    if (type === 'success') {
      iconHtml = '<i data-lucide="check-circle" style="width: 18px; height: 18px;"></i>';
    } else if (type === 'error') {
      iconHtml = '<i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>';
    } else if (type === 'warning') {
      iconHtml = '<i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i>';
    } else {
      iconHtml = '<i data-lucide="info" style="width: 18px; height: 18px;"></i>';
    }
    item.innerHTML = `
      <div class="app-toast-icon">${iconHtml}</div>
      <div class="app-toast-content" style="flex-grow: 1; line-height: 1.4;">${message}</div>
    `;
    container.appendChild(item);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    setTimeout(() => item.classList.add('show'), 10);
    setTimeout(() => {
      item.classList.remove('show');
      item.classList.add('hide');
      setTimeout(() => item.remove(), 400);
    }, 4000);
  }

  // Override default window.alert
  window.alert = function(msg) {
    let type = 'info';
    const cleanMsg = msg.toLowerCase();
    if (cleanMsg.includes('thành công') || cleanMsg.includes('hoàn tất') || cleanMsg.includes('đã gửi') || cleanMsg.includes('đăng ký thành công')) {
      type = 'success';
    } else if (cleanMsg.includes('lỗi') || cleanMsg.includes('thất bại') || cleanMsg.includes('yêu cầu') || cleanMsg.includes('vui lòng') || cleanMsg.includes('thiếu') || cleanMsg.includes('điền đầy đủ')) {
      type = 'warning';
    }
    showAppToast(msg, type);
  };

  // Custom App Confirm Modal System to replace native confirm()
  function showAppConfirm(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100000;
        opacity: 0;
        transition: opacity 0.25s ease;
      `;
      
      const card = document.createElement('div');
      card.style.cssText = `
        background-color: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 24px;
        max-width: 360px;
        width: calc(100% - 32px);
        box-shadow: var(--card-shadow);
        transform: scale(0.9) translateY(10px);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        color: var(--text-primary);
        font-family: var(--font-primary);
        text-align: center;
      `;

      card.innerHTML = `
        <div style="color: var(--color-primary); margin-bottom: 12px; display: flex; justify-content: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 10px; color: var(--text-primary); font-family: var(--font-primary);">Xác nhận</h3>
        <p style="font-size: 13.5px; line-height: 1.5; color: var(--text-secondary); margin-bottom: 20px; font-family: var(--font-primary);">${message}</p>
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button id="app-confirm-cancel" style="flex: 1; padding: 10px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: transparent; color: var(--text-secondary); font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: var(--font-primary);">Hủy</button>
          <button id="app-confirm-ok" style="flex: 1; padding: 10px 16px; border-radius: var(--radius-sm); border: none; background: var(--color-primary); color: white; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: var(--font-primary);">Đồng ý</button>
        </div>
      `;

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      // Trigger animations
      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        card.style.transform = 'scale(1) translateY(0)';
      });

      const cancelBtn = card.querySelector('#app-confirm-cancel');
      const okBtn = card.querySelector('#app-confirm-ok');

      const cleanup = (result) => {
        overlay.style.opacity = '0';
        card.style.transform = 'scale(0.9) translateY(10px)';
        setTimeout(() => {
          overlay.remove();
          resolve(result);
        }, 250);
      };

      cancelBtn.addEventListener('click', () => cleanup(false));
      okBtn.addEventListener('click', () => cleanup(true));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cleanup(false);
      });
    });
  }

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

    if (profile.avatar) {
      avatarImg.src = profile.avatar;
    }

    const onAvatarLoaded = () => {
      avatarImg.classList.add('is-loaded');
      hideBootScreen();
      clearTimeout(maxBootTimeout);
    };

    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      onAvatarLoaded();
    } else {
      avatarImg.addEventListener('load', onAvatarLoaded, { once: true });
      avatarImg.addEventListener('error', onAvatarLoaded, { once: true });
    }
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
    const profileHeader = document.querySelector('.profile-header');

    // Khởi tạo và cập nhật số người online ảo nhấp nháy
    if (!document.getElementById('online-counter-style')) {
      const style = document.createElement('style');
      style.id = 'online-counter-style';
      style.textContent = `
        @keyframes online-blink {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
        .online-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          background-color: #22c55e;
          border-radius: 50%;
          margin: 0 4px 0 8px;
          vertical-align: middle;
          animation: online-blink 2s infinite ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }

    let currentOnline = Math.floor(Math.random() * 8) + 12; // Khởi tạo 12-19
    const updateOnlineUI = () => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 đến +2
      currentOnline += change;
      if (currentOnline < 8) currentOnline = 8;
      if (currentOnline > 25) currentOnline = 25;
      
      const elTop = document.getElementById('online-counter-top');
      const elFooter = document.getElementById('online-counter-footer');
      if (elTop) elTop.textContent = currentOnline;
      if (elFooter) elFooter.textContent = currentOnline;
    };
    setInterval(updateOnlineUI, 5000 + Math.random() * 2000);

    // --- Top Counter ---
    let topCounter = document.getElementById('top-page-counter');
    if (!topCounter && profileHeader) {
      topCounter = document.createElement('p');
      topCounter.id = 'top-page-counter';
      topCounter.style.cssText = `
        font-size: 11.5px; font-weight: 500;
        color: var(--text-muted);
        margin: 8px auto 0 auto;
        display: inline-flex; align-items: center; gap: 4px;
        opacity: 0.75;
      `;
      topCounter.innerHTML = `<i data-lucide="eye" style="width:12px;height:12px;opacity:0.5;"></i><span style="opacity:0.5;">--.--- lượt truy cập<span class="online-dot"></span><span style="color: #22c55e; font-weight: 600;" id="online-counter-top">${currentOnline}</span> đang online</span>`;
      profileHeader.appendChild(topCounter);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- Footer Counter ---
    const footer = document.querySelector('.app-footer');
    let footerCounter = document.getElementById('public-page-counter');
    if (!footerCounter && footer) {
      footerCounter = document.createElement('p');
      footerCounter.id = 'public-page-counter';
      footerCounter.style.cssText = `
        font-size: 12px; color: var(--text-muted);
        margin-top: 8px; display: flex; align-items: center;
        justify-content: center; gap: 4px;
      `;
      footerCounter.innerHTML = `<i data-lucide="eye" style="width:14px;height:14px;opacity:0.5;"></i><span style="opacity:0.5;">--.--- lượt truy cập<span class="online-dot"></span><span style="color: #22c55e; font-weight: 600;" id="online-counter-footer">${currentOnline}</span> đang online</span>`;
      footer.appendChild(footerCounter);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    const updateCounters = (formattedCount) => {
      if (topCounter) {
        topCounter.innerHTML = `<i data-lucide="eye" style="width:13px;height:13px;"></i><span>${formattedCount} lượt truy cập<span class="online-dot"></span><span style="color: #22c55e; font-weight: 600;" id="online-counter-top">${currentOnline}</span> đang online</span>`;
      }
      if (footerCounter) {
        footerCounter.innerHTML = `<i data-lucide="eye" style="width:14px;height:14px;opacity:0.8;"></i><span>${formattedCount} lượt truy cập<span class="online-dot"></span><span style="color: #22c55e; font-weight: 600;" id="online-counter-footer">${currentOnline}</span> đang online</span>`;
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    };

    const hasVisited = sessionStorage.getItem('visited_dongythubay');
    const apiUrl = hasVisited
      ? 'https://api.counterapi.dev/v1/dongythubay/views'
      : 'https://api.counterapi.dev/v1/dongythubay/views/up';

    // Timeout 5 giây, nếu lỗi dùng localStorage fallback
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    fetch(apiUrl, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        const countVal = (data && (typeof data.value !== 'undefined' ? data.value : data.count));
        if (typeof countVal !== 'undefined' && countVal !== null) {
          sessionStorage.setItem('visited_dongythubay', 'true');
          const virtualCount = countVal * 12 + 8400;
          const formattedCount = new Intl.NumberFormat('vi-VN').format(virtualCount);
          localStorage.setItem('cached_view_count', formattedCount);
          updateCounters(formattedCount);
        }
      })
      .catch(() => {
        clearTimeout(timeout);
        // Fallback: dùng cache localStorage
        const cached = localStorage.getItem('cached_view_count') || '8.400+';
        updateCounters(cached);
      });
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
  const mainScrollContainer = (config.edgeToEdge && window.innerWidth > 480)
    ? document.querySelector('.app-container')
    : window;

  if (backToTopBtn && mainScrollContainer) {
    const handleScroll = () => {
      const scrollTop = mainScrollContainer === window ? window.scrollY : mainScrollContainer.scrollTop;
      if (scrollTop > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };
    
    mainScrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
      if (mainScrollContainer === window) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        mainScrollContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

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
    
    // Check localStorage cache - use CONFIG.updatedAt as version buster
    const cacheVersion = (window.CONFIG && window.CONFIG.updatedAt) || 'v1';
    const cacheKey = `unfurl::${cacheVersion}::${url}`;
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

      // Thêm cacheVersion để bypass cache CDN của Microlink
      const bypassUrl = url + (url.includes('?') ? '&' : '?') + 'v=' + cacheVersion;

      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(bypassUrl)}`, {
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
      // Auto-hide affiliate or own-products sections that have no items.
      if ((section.type === 'affiliate-list' || section.type === 'own-products') && (!section.items || section.items.length === 0)) {
        return;
      }

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
        case 'android-apps':
          renderAndroidApps(section, sectionEl);
          break;
        case 'affiliate-list':
           renderAffiliateList(section, sectionEl);
           break;
        case 'own-products':
          const mappedSection = {
            ...section,
            items: (section.items || []).map(item => ({
              name: item.name,
              image: item.image,
              priceNote: item.priceNote || 'Liên hệ',
              discountNote: item.description || item.discountNote || '',
              affiliateUrl: item.contactUrl || item.affiliateUrl || 'https://zalo.me/0982581222',
              isContact: true,
              ctaLabel: item.contactLabel || item.ctaLabel || ''
            }))
          };
          renderAffiliateList(mappedSection, sectionEl);
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
        case 'gift-list':
          renderGiftSection(section, sectionEl);
          break;
        case 'faq':
          renderFAQSection(section, sectionEl);
          break;
        case 'countdown':
          renderCountdown(section, sectionEl);
          break;
        case 'services':
          renderServiceList(section, sectionEl);
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

  // Helper to generate virtual usage count for apps with daily dynamic growth and distinct values
  function getVirtualUsage(title, index, saltUrl) {
    if (!title || title === 'Đang tải...') title = 'app-preview-' + index;
    const daysSinceStart = Math.floor((new Date() - new Date('2026-07-01')) / (1000 * 60 * 60 * 24));
    
    // Hash string to create a very distinct seed
    const seedStr = (title + (saltUrl || '') + index);
    const hash = seedStr.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
    
    const baseCount = (hash % 200) + 120; // 120 - 320 (Hạ thấp số lượng)
    const dailyGrowth = (hash % 2) + 1; // mỗi ngày chỉ tăng 1-2 lượt sử dụng
    const total = baseCount + (daysSinceStart * dailyGrowth);
    return new Intl.NumberFormat('vi-VN').format(total);
  }

  // Helper to generate virtual sales count for products with daily dynamic growth and distinct values
  function getVirtualSales(name, index, saltUrl) {
    if (!name || name === 'Đang tải...') name = 'product-preview-' + index;
    const daysSinceStart = Math.floor((new Date() - new Date('2026-07-01')) / (1000 * 60 * 60 * 24));
    
    // Hash string to create a very distinct seed
    const seedStr = (name + (saltUrl || '') + index);
    const hash = seedStr.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
    
    const baseSales = (hash % 160) + 30; // 30 - 190 (Hạ thấp số lượng)
    const dailyGrowth = (hash % 2) + 1; // mỗi ngày chỉ tăng 1-2 lượt bán
    const total = baseSales + (daysSinceStart * dailyGrowth);
    return new Intl.NumberFormat('vi-VN').format(total);
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

      // HOT badge: hiện ở vị trí index 1 và 4 (tạo cảm giác có chọn lọc, không đều)
      const isHotApp = (index === 1 || index === 4);

      card.innerHTML = `
        <div class="project-image-wrapper">
          <img src="${image}" alt="${title}" class="project-image" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" ${index < 2 ? 'fetchpriority="high"' : ''}>
          <span class="project-tag">${tag}</span>
          ${isHotApp ? '<span class="project-hot-badge">🔥 Hot</span>' : ''}
        </div>
        <div class="project-info">
          <div class="project-text">
            <h3>${title}</h3>
            <p>${description}</p>
          </div>
          <div class="project-usage">
            <i data-lucide="users" style="width: 12px; height: 12px;"></i>
            <span>${getVirtualUsage(title, index, linkUrl)} lượt sử dụng</span>
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

  // 3.5. Android Apps Grid (Google Play Store Apps display)
  function renderAndroidApps(section, container) {
    const grid = document.createElement('div');
    grid.className = 'android-grid';

    const items = section.items || [];
    items.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'android-card';
      card.id = `android-card-${section.id}-${index}`;
      
      let storeUrl = item.playStoreUrl || '';
      let packageName = item.packageName || '';

      // Tự động giải trích xuất packageName từ link nếu thiếu
      if (!packageName && storeUrl) {
        try {
          const urlObj = new URL(storeUrl);
          const idParam = urlObj.searchParams.get('id');
          if (idParam) packageName = idParam;
        } catch (e) {
          console.warn('[Android App] Error parsing package name:', e);
        }
      }

      if (!storeUrl && packageName) {
        storeUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
      }

      const title = item.title || 'Đang tải...';
      const description = item.description || 'Vui lòng đợi giây lát...';
      const icon = item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
      const rating = item.rating || '5.0';
      const downloads = item.downloads || '100+';
      
      // Deep link cho thiết bị Android: dùng market://details?id=...
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid && packageName) {
        card.href = `market://details?id=${packageName}`;
      } else {
        card.href = storeUrl || '#';
      }
      
      card.target = '_blank';
      card.setAttribute('rel', 'noopener noreferrer');

      card.innerHTML = `
        <div class="android-icon-wrapper">
          <img src="${icon}" alt="${title}" class="android-icon-img" loading="lazy">
        </div>
        <div class="android-info">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="android-meta">
            <span class="android-rating">
              <i data-lucide="star" style="width: 12px; height: 12px; fill: #eab308; color:#eab308;"></i> ${rating}
            </span>
            <span class="android-downloads">
              <i data-lucide="download" style="width: 12px; height: 12px;"></i> ${downloads} lượt tải
            </span>
          </div>
        </div>
        <div class="android-cta" title="Tải trên Google Play">
          <i data-lucide="play" style="width: 16px; height: 16px; fill: currentColor;"></i>
        </div>
      `;

      card.addEventListener('click', () => {
        trackClick('android_app', packageName || slugify(title), title, card.href);
      });

      // Link Unfurling Trigger if metadata is missing
      if (storeUrl && (!item.title || !item.image)) {
        unfurlLink(storeUrl).then(meta => {
          if (meta) {
            const imgEl = card.querySelector('.android-icon-img');
            const titleEl = card.querySelector('.android-info h3');
            const descEl = card.querySelector('.android-info p');
            
            if (imgEl && !item.image && meta.image) imgEl.src = meta.image;
            if (titleEl && !item.title && meta.title) {
              titleEl.textContent = meta.title;
              if (imgEl) imgEl.alt = meta.title;
            }
            if (descEl && !item.description && meta.description) {
              descEl.textContent = meta.description;
            }
          }
        });
      }

      grid.appendChild(card);
    });

    container.appendChild(grid);
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // 4. Affiliate List Component (E-commerce Style Grid 2 Columns like TikTok Shop)
  function renderAffiliateList(section, container) {
    const list = document.createElement('div');
    list.className = 'affiliate-container';
    const visibleItems = section.items || [];

    visibleItems.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'affiliate-card';
      card.id = `affiliate-card-${section.id}-${index}`;
      
      const name = item.name || 'Đang tải...';
      const price = item.priceNote || '';
      const discount = item.discountNote || 'Nhấp xem chi tiết ưu đãi';
      const image = item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
      
      const isContact = item.isContact === true;
      const hasSpecificPrice = price && price !== 'Liên hệ' && price.trim() !== '';
      let linkUrl = item.affiliateUrl;
      let platformClass = 'other';
      let defaultCta = 'Mua ngay';
      let targetAttr = '_blank';
      let relAttr = 'rel="noopener noreferrer"';

      if (isContact) {
        platformClass = 'contact-zalo';
        if (hasSpecificPrice) {
          defaultCta = 'Mua ngay';
          linkUrl = `https://zalo.me/0982581222?text=${encodeURIComponent('Tôi muốn mua sản phẩm: ' + name + ' (Giá: ' + price + ')')}`;
        } else {
          defaultCta = 'Liên hệ báo giá';
          linkUrl = `https://zalo.me/0982581222?text=${encodeURIComponent('Tôi cần tư vấn về sản phẩm: ' + name)}`;
        }
      } else {
        const isTikTok = linkUrl && linkUrl.includes('tiktok.com');
        const isShopee = linkUrl && (linkUrl.includes('shopee.vn') || linkUrl.includes('shope.ee'));
        const isLazada = linkUrl && linkUrl.includes('lazada.vn');

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
      }

      const ctaLabel = item.ctaLabel || defaultCta;

      card.href = linkUrl;
      card.target = targetAttr;
      if (relAttr) {
        card.setAttribute('rel', 'noopener noreferrer');
      } else {
        card.removeAttribute('rel');
      }

      // HOT badge: hiện ở sản phẩm đầu tiên mỗi section
      const isHotProduct = (index === 0);

      card.innerHTML = `
        <div class="affiliate-image-wrapper" style="position: relative;">
          <img src="${image}" alt="${name}" class="affiliate-image" loading="lazy">
          ${isHotProduct ? '<span class="affiliate-hot-badge">🔥 Hot</span>' : ''}
        </div>
        <div class="affiliate-info">
          <div class="affiliate-text">
            <h3 class="affiliate-name">${name}</h3>
            ${price && (!isContact || hasSpecificPrice) ? `<div class="affiliate-price">${price}</div>` : ''}
            <div class="affiliate-discount">${discount}</div>
            <div style="font-size: 11px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; margin-top: 6px;">
              <span style="color: #eab308; display: flex; align-items: center; gap: 2px; font-weight: 700;">
                <i data-lucide="star" style="width: 11px; height: 11px; fill: #eab308; color:#eab308;"></i> 4.9
              </span>
              <span style="opacity: 0.4;">|</span>
              <span style="opacity: 0.85; font-weight: 500;">Đã bán ${getVirtualSales(name, index, isContact ? 'contact' : linkUrl)}</span>
            </div>
          </div>
          <div class="affiliate-cta ${platformClass}">
            <span>${ctaLabel}</span>
            <i data-lucide="${isContact ? 'message-circle' : 'shopping-cart'}"></i>
          </div>
        </div>
      `;

      // Track click & Smart TikTok Deep-linking for seamless purchase
      card.addEventListener('click', (e) => {
        const currentName = card.querySelector('.affiliate-name')?.textContent || name;
        trackClick(isContact ? 'contact_product' : 'affiliate', slugify(currentName), currentName, linkUrl);
      });

      // Link Unfurling Trigger if metadata is missing (Skip if contact product or custom name/image provided)
      if (!isContact && linkUrl && (!item.name || !item.image)) {
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
  resetStatsBtn.addEventListener('click', async () => {
    if (await showAppConfirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu thống kê số lượt bấm không?')) {
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

  // 6. Booking Form Component (Collapsible)
  function renderBookingForm(section, container) {
    const card = document.createElement('div');
    card.className = 'booking-card';

    const subtitleText = section.subtitle || 'Vui lòng điền thông tin bên dưới, phòng khám sẽ liên hệ tư vấn sớm nhất.';

    // Helper for clipboard copy
    function copyTextToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(err => fallbackCopyText(text));
      } else {
        return Promise.resolve(fallbackCopyText(text));
      }
    }

    function fallbackCopyText(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(textArea);
      textArea.focus(); textArea.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch(e) {}
      document.body.removeChild(textArea);
      return ok;
    }

    const diseaseOptions = [
      'Dạ dày / HP', 'Sỏi thận / Sỏi mật', 'Cường dương / Yếu sinh lý',
      'Rụng tóc / Bạc tóc', 'Hiếm muộn / Vô sinh', 'Trĩ (Nội, Ngoại)',
      'Xương khớp / Gút', 'Phụ khoa / Nam khoa', 'Khác'
    ];

    card.innerHTML = `
      <div id="booking-toggle-btn" style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:4px 0 8px;">
        <span style="font-size:14px;font-weight:700;color:var(--color-primary);display:flex;align-items:center;gap:6px;">
          <i data-lucide="calendar-plus" style="width:16px;height:16px;"></i>
          Bấm vào đây để điền form đăng ký
        </span>
        <i id="booking-chevron" data-lucide="chevron-down" style="width:18px;height:18px;color:var(--color-primary);transition:transform 0.3s ease;"></i>
      </div>
      <div id="booking-form-wrapper" style="overflow:hidden;max-height:0;transition:max-height 0.4s ease;">
        <p style="font-size:13.5px;color:var(--text-secondary);line-height:1.45;text-align:center;margin-bottom:8px;padding-top:8px;">
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
            <i data-lucide="send" style="width:16px;height:16px;"></i>
            <span>Gửi Đăng Ký Ngay</span>
          </button>
        </form>
      </div>
    `;

    // Toggle logic
    const toggleBtn = card.querySelector('#booking-toggle-btn');
    const formWrapper = card.querySelector('#booking-form-wrapper');
    const chevron = card.querySelector('#booking-chevron');
    let isOpen = false;

    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      formWrapper.style.maxHeight = isOpen ? formWrapper.scrollHeight + 'px' : '0';
      chevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });

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

      trackClick('booking', slugify(disease), `Đăng ký khám: ${disease}`, '#');

      card.querySelector('#booking-form-wrapper').innerHTML = `
        <div class="booking-success-message">
          <div class="booking-success-icon">
            <i data-lucide="check" style="width: 28px; height: 28px;"></i>
          </div>
          <h3 class="booking-success-title">Đã Soạn Tin Nhắn!</h3>
          <p class="booking-success-desc" style="margin-bottom: 8px;">
            Nội dung đăng ký đã được <strong>tự động sao chép</strong>.
          </p>
          <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 18px; line-height: 1.5;">
            Zalo sắp được mở. Hãy <strong>DÁN (PASTE)</strong> tin nhắn vào ô chat để gửi đi.
          </p>
          <a href="https://zalo.me/0982581222" class="booking-submit-btn" style="background-color: #0068ff; color: #ffffff; text-decoration: none; width: 100%; border-radius: var(--radius-sm); font-size: 14.5px; font-weight: 700; margin-top: 0; min-height: 48px;">
            <i data-lucide="message-square" style="width: 18px; height: 18px;"></i>
            <span>Mở Zalo và Dán gửi ngay</span>
          </a>
        </div>
      `;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, disease, message })
      }).catch(err => {
        console.warn('[Booking] API bận hoặc lỗi mạng, khách vẫn tiếp tục qua Zalo:', err);
      });

      setTimeout(() => {
        window.location.href = 'https://zalo.me/0982581222';
      }, 900);
    });

    container.appendChild(card);
  }

  // 6b. Countdown Timer Component
  function renderCountdown(section, container) {
    const endDate = new Date(section.endDate || '2026-07-31T23:59:59');
    const ctaUrl = section.ctaUrl || '#';
    const ctaLabel = section.ctaLabel || 'Đặt lịch ngay';
    const subtitle = section.subtitle || 'Ưu đãi đặc biệt – Hết hạn sau:';

    const banner = document.createElement('div');
    banner.className = 'countdown-banner';
    banner.innerHTML = `
      <div class="countdown-subtitle">${subtitle}</div>
      <div class="countdown-digits" id="countdown-digits-${section.id}">
        <div class="countdown-unit"><span class="cd-num" id="cd-days-${section.id}">00</span><span class="cd-label">Ngày</span></div>
        <span class="cd-sep">:</span>
        <div class="countdown-unit"><span class="cd-num" id="cd-hours-${section.id}">00</span><span class="cd-label">Giờ</span></div>
        <span class="cd-sep">:</span>
        <div class="countdown-unit"><span class="cd-num" id="cd-mins-${section.id}">00</span><span class="cd-label">Phút</span></div>
        <span class="cd-sep">:</span>
        <div class="countdown-unit"><span class="cd-num" id="cd-secs-${section.id}">00</span><span class="cd-label">Giây</span></div>
      </div>
      <a href="${ctaUrl}" class="countdown-cta" id="countdown-cta-${section.id}">${ctaLabel}</a>
    `;

    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      const now = new Date();
      const diff = endDate - now;
      if (diff <= 0) {
        banner.querySelector(`#countdown-digits-${section.id}`).innerHTML = '<span style="font-size:14px;color:var(--text-muted)">Chương trình đã kết thúc</span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      banner.querySelector(`#cd-days-${section.id}`).textContent = pad(d);
      banner.querySelector(`#cd-hours-${section.id}`).textContent = pad(h);
      banner.querySelector(`#cd-mins-${section.id}`).textContent = pad(m);
      banner.querySelector(`#cd-secs-${section.id}`).textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);

    // CTA scroll to booking
    const ctaBtn = banner.querySelector(`#countdown-cta-${section.id}`);
    if (ctaUrl.startsWith('#')) {
      ctaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(ctaUrl.replace('#', ''));
        if (target) scrollToElement(target);
      });
    }

    container.appendChild(banner);
  }

  // 6c. Gift Section Component
  function renderGiftSection(section, container) {
    const items = section.items || [];

    if (items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'section-empty-state';
      empty.textContent = 'Chưa có quà tặng nào';
      container.appendChild(empty);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'gift-grid';

    items.forEach(gift => {
      const card = document.createElement('div');
      card.className = 'gift-card';
      
      const isLink = gift.type === 'download' || gift.type === 'link' || (gift.content && (gift.content.startsWith('http://') || gift.content.startsWith('https://')));
      
      let actionBtnHtml = '';
      if (isLink) {
        actionBtnHtml = `<a class="gift-btn" href="${gift.content}" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">Tải về</a>`;
      } else {
        actionBtnHtml = `<button class="gift-btn" data-content="${encodeURIComponent(gift.content || '')}" title="Sao chép" style="padding: 0; width: 34px; height: 34px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--color-accent-border);"><i data-lucide="copy" style="width: 14px; height: 14px;"></i></button>`;
      }

      let mediaHtml = '';
      const isPdfLink = gift.content && (gift.content.toLowerCase().endsWith('.pdf') || gift.content.toLowerCase().includes('.pdf'));
      
      if (gift.image) {
        mediaHtml = `<div class="gift-thumbnail"><img src="${gift.image}" alt="${gift.title}" class="gift-thumb-img" loading="lazy"></div>`;
      } else if (isPdfLink) {
        mediaHtml = `<div class="gift-thumbnail"><div class="gift-pdf-fallback"><i data-lucide="file-text"></i><span>PDF</span></div></div>`;
      } else {
        mediaHtml = `<div class="gift-icon">${getDynamicIconHtml(gift.icon || 'gift')}</div>`;
      }

      card.innerHTML = `
        ${mediaHtml}
        <div class="gift-body">
          <h4 class="gift-title">${gift.title}</h4>
          <p class="gift-desc">${gift.description}</p>
        </div>
        ${actionBtnHtml}
      `;

      if (!isLink) {
        const btn = card.querySelector('.gift-btn');
        btn.addEventListener('click', () => {
          const text = decodeURIComponent(btn.dataset.content);
          navigator.clipboard.writeText(text)
            .then(() => {
              btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i>';
              btn.style.backgroundColor = 'var(--color-primary)';
              btn.style.color = '#ffffff';
              btn.style.borderColor = 'var(--color-primary)';
              if (typeof lucide !== 'undefined') lucide.createIcons();
              setTimeout(() => { 
                btn.innerHTML = '<i data-lucide="copy" style="width: 14px; height: 14px;"></i>'; 
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                if (typeof lucide !== 'undefined') lucide.createIcons();
              }, 2000);
            })
            .catch(() => {
              const ta = document.createElement('textarea');
              ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
              document.body.appendChild(ta); ta.select();
              document.execCommand('copy');
              document.body.removeChild(ta);
              btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i>';
              btn.style.backgroundColor = 'var(--color-primary)';
              btn.style.color = '#ffffff';
              btn.style.borderColor = 'var(--color-primary)';
              if (typeof lucide !== 'undefined') lucide.createIcons();
              setTimeout(() => { 
                btn.innerHTML = '<i data-lucide="copy" style="width: 14px; height: 14px;"></i>'; 
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
                if (typeof lucide !== 'undefined') lucide.createIcons();
              }, 2000);
            });
          trackClick('gift', gift.id, gift.title, '#');
        });
      } else {
        const link = card.querySelector('.gift-btn');
        link.addEventListener('click', () => {
          trackClick('gift_download', gift.id, gift.title, gift.content);
        });
      }

      grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    container.appendChild(grid);
  }

  // 6e. Service List Component
  function renderServiceList(section, container) {
    const grid = document.createElement('div');
    grid.className = 'service-grid';

    section.items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'service-card';
      
      const title = item.title || '';
      const subtitle = item.subtitle || '';
      const description = item.description || '';
      const image = item.image || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4=';
      const features = item.features || [];
      const iconName = item.icon || 'layers';

      let featuresHtml = '';
      if (features && features.length > 0) {
        featuresHtml = `<ul class="service-features-list">
          ${features.map(f => `<li><i data-lucide="check-circle-2"></i><span>${f}</span></li>`).join('')}
        </ul>`;
      }

      // HOT badge: hiện ở dịch vụ đầu tiên và dịch vụ thứ 4
      const isHotService = (index === 0 || index === 3);

      card.innerHTML = `
        <div class="service-image-wrapper">
          <img src="${image}" alt="${title}" class="service-image" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" ${index < 2 ? 'fetchpriority="high"' : ''}>
          <span class="service-tag">${subtitle}</span>
          ${isHotService ? '<span class="project-hot-badge">🔥 Hot</span>' : ''}
        </div>
        <div class="service-body-info">
          <div class="service-header">
            <div class="service-icon-wrapper">
              ${getDynamicIconHtml(iconName)}
            </div>
            <h3 class="service-title">${title}</h3>
          </div>
          <p class="service-desc">${description}</p>
          ${featuresHtml}
          <button class="service-cta-btn" data-service-title="${title}">
            <span>Báo Giá</span>
            <i data-lucide="arrow-right"></i>
          </button>
        </div>
      `;

      // Click "Báo giá" scroll tới form booking và ghi chú dịch vụ
      const btn = card.querySelector('.service-cta-btn');
      btn.addEventListener('click', () => {
        const bookingSection = document.getElementById('section-appointment-booking');
        if (bookingSection) {
          scrollToElement(bookingSection);
          
          const formWrapper = bookingSection.querySelector('#booking-form-wrapper');
          const chevron = bookingSection.querySelector('#booking-chevron');
          if (formWrapper && (formWrapper.style.maxHeight === '0px' || formWrapper.style.maxHeight === '')) {
            formWrapper.style.maxHeight = formWrapper.scrollHeight + 'px';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
          }

          const messageArea = bookingSection.querySelector('#book-message');
          if (messageArea) {
            messageArea.value = `Tôi muốn nhận báo giá dịch vụ: ${title}\n---\n`;
            messageArea.focus();
          }

          const selectDisease = bookingSection.querySelector('#book-disease');
          if (selectDisease) {
            selectDisease.value = 'Khác';
          }
        }
        trackClick('service_quote', slugify(title), `Yêu cầu báo giá: ${title}`, '#');
      });

      grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    container.appendChild(grid);
  }


  // 6d. FAQ Accordion Component
  function renderFAQSection(section, container) {
    const list = document.createElement('div');
    list.className = 'faq-list';

    const items = section.items || [];
    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'faq-item' + (idx === 0 ? ' open' : '');
      el.innerHTML = `
        <button class="faq-question">
          <span>${item.question}</span>
          <i data-lucide="chevron-down" class="faq-chevron"></i>
        </button>
        <div class="faq-answer">${item.answer}</div>
      `;

      const q = el.querySelector('.faq-question');
      const a = el.querySelector('.faq-answer');

      q.addEventListener('click', () => {
        const isOpen = el.classList.contains('open');
        // Close all - CSS handles max-height via .open class
        list.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('open');
        });
        if (!isOpen) {
          el.classList.add('open');
        }
      });

      list.appendChild(el);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    container.appendChild(list);
  }

  // 7. Patient Reviews (Testimonials) Component with Zoom Lightbox
  let currentReviewItems = [];
  let currentReviewIndex = 0;

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

      // Zoom click handler (open lightbox with index and full items list)
      card.addEventListener('click', () => {
        openLightbox(index, section.items);
      });

      slider.appendChild(card);
    });

    container.appendChild(slider);
  }

  // Lightbox utility function (Premium swipe slider)
  function openLightbox(index, items) {
    currentReviewItems = items;
    currentReviewIndex = index;

    let lightbox = document.getElementById('review-lightbox-modal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'review-lightbox-modal';
      lightbox.className = 'review-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-content-wrapper">
          <div class="lightbox-counter" id="lightbox-counter-el"></div>
          <button class="lightbox-nav-btn lightbox-btn-prev" id="lightbox-prev-el" aria-label="Ảnh trước">
            <i data-lucide="chevron-left"></i>
          </button>
          <img src="" alt="" class="lightbox-img" id="lightbox-img-el">
          <div class="lightbox-caption" id="lightbox-caption-el"></div>
          <button class="lightbox-nav-btn lightbox-btn-next" id="lightbox-next-el" aria-label="Ảnh tiếp theo">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>
      `;
      
      // Close lightbox on click outside the image
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
          lightbox.classList.remove('show');
        }
      });

      document.body.appendChild(lightbox);

      // Bind nav click
      lightbox.querySelector('#lightbox-prev-el').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
      });
      lightbox.querySelector('#lightbox-next-el').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
      });

      // Swipe logic for Mobile
      let touchStartX = 0;
      let touchEndX = 0;
      
      lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 40;
        if (touchStartX - touchEndX > threshold) {
          navigateLightbox(1); // Swipe left -> Next
        } else if (touchEndX - touchStartX > threshold) {
          navigateLightbox(-1); // Swipe right -> Prev
        }
      }, { passive: true });

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'ArrowLeft') {
          navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
          navigateLightbox(1);
        } else if (e.key === 'Escape') {
          lightbox.classList.remove('show');
        }
      });
    }

    updateLightboxContent();

    // Show Lightbox with transition
    lightbox.getBoundingClientRect();
    lightbox.classList.add('show');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function navigateLightbox(direction) {
    if (!currentReviewItems || currentReviewItems.length === 0) return;
    currentReviewIndex += direction;
    if (currentReviewIndex < 0) {
      currentReviewIndex = currentReviewItems.length - 1;
    } else if (currentReviewIndex >= currentReviewItems.length) {
      currentReviewIndex = 0;
    }
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const lightbox = document.getElementById('review-lightbox-modal');
    if (!lightbox) return;

    const item = currentReviewItems[currentReviewIndex];
    const imgEl = lightbox.querySelector('#lightbox-img-el');
    const captionEl = lightbox.querySelector('#lightbox-caption-el');
    const counterEl = lightbox.querySelector('#lightbox-counter-el');

    imgEl.style.transform = 'scale(0.96)';
    imgEl.style.opacity = '0.6';

    setTimeout(() => {
      imgEl.src = item.image;
      imgEl.alt = item.caption || '';
      captionEl.textContent = item.caption || `Đánh giá bệnh nhân #${currentReviewIndex + 1}`;
      counterEl.textContent = `${currentReviewIndex + 1} / ${currentReviewItems.length}`;
      imgEl.style.transform = 'scale(1)';
      imgEl.style.opacity = '1';
    }, 80);
  }

  // 9. Social Proof Toast Generator (ngắn gọn, chung chung, không lộ tên)
  function initSocialToasts() {
    if (window.location.pathname.includes('quanly')) return;

    let toastContainer = document.getElementById('social-toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'social-toast-container';
      toastContainer.className = 'social-toast-container';
      document.body.appendChild(toastContainer);
    }

    // Nội dung ngắn gọn, chung chung - không nêu tên cụ thể
    const actions = [
      { text: 'Vừa có người đặt lịch khám', icon: 'calendar', color: '#22c55e' },
      { text: 'Có đơn hàng vừa được đặt', icon: 'shopping-cart', color: '#22c55e' },
      { text: 'Ai đó vừa đăng ký tư vấn', icon: 'phone', color: '#22c55e' },
      { text: 'Vừa có người dùng thử ứng dụng', icon: 'external-link', color: '#60a5fa' },
      { text: 'Có người xem sản phẩm ngay lúc này', icon: 'eye', color: '#60a5fa' },
      { text: 'Vừa có đăng ký tư vấn bệnh lý', icon: 'activity', color: '#22c55e' },
    ];

    const timeStrs = ['vài giây trước', '1 phút trước', '2 phút trước', '3 phút trước', 'vừa xong'];

    const showToast = () => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const timeStr = timeStrs[Math.floor(Math.random() * timeStrs.length)];

      const toast = document.createElement('div');
      toast.className = 'social-toast';
      toast.innerHTML = `
        <div class="social-toast-avatar">
          ${getDynamicIconHtml(action.icon)}
        </div>
        <div class="social-toast-content">
          <div class="social-toast-text">${action.text}</div>
          <div class="social-toast-time">${timeStr}</div>
        </div>
      `;

      toastContainer.appendChild(toast);

      if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nameAttr: 'data-lucide' });
      }

      setTimeout(() => toast.classList.add('show'), 80);

      // Tự xóa sau 4s
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    };

    // Kích hoạt lần đầu sau 18s, sau đó mỗi 40-70s (thưa hơn nhiều)
    setTimeout(() => {
      showToast();
      const triggerNext = () => {
        const delay = (Math.random() * 30 + 40) * 1000;
        setTimeout(() => { showToast(); triggerNext(); }, delay);
      };
      triggerNext();
    }, 18000);
  }

  initSocialToasts();

  // 10. Native Bottom Navigation Bar for Mobile (5 items: Ưu đãi, Sản phẩm, Đặt lịch, Quà tặng, Gọi điện)
  function initBottomBar() {
    if (window.location.pathname.includes('quanly')) return;

    const bottomBar = document.createElement('div');
    bottomBar.className = 'native-bottom-bar';
    
    const phoneNumber = (window.CONFIG && window.CONFIG.profile && window.CONFIG.profile.phone) || '0982581222';

    bottomBar.innerHTML = `
      <a href="#section-my-apps" class="bottom-bar-item" id="bb-apps">
        <div class="bb-icon-wrapper"><i data-lucide="layout-grid"></i></div>
        <span>Ứng dụng</span>
      </a>
      <a href="#" class="bottom-bar-item" id="bb-products">
        <div class="bb-icon-wrapper"><i data-lucide="shopping-bag"></i></div>
        <span>Sản phẩm</span>
      </a>
      <a href="#section-appointment-booking" class="bottom-bar-item bb-item-center" id="bb-booking">
        <div class="bb-icon-wrapper active-booking"><i data-lucide="calendar"></i></div>
        <span>Đặt lịch</span>
      </a>
      <a href="#section-free-gifts" class="bottom-bar-item" id="bb-gifts">
        <div class="bb-icon-wrapper"><i data-lucide="gift"></i></div>
        <span>Quà tặng</span>
      </a>
      <a href="#section-services-digital" class="bottom-bar-item" id="bb-services">
        <div class="bb-icon-wrapper"><i data-lucide="layers"></i></div>
        <span>Dịch vụ</span>
      </a>
    `;

    // Click "Ứng dụng"
    bottomBar.querySelector('#bb-apps').addEventListener('click', (e) => {
      e.preventDefault();
      const appsSection = document.getElementById('section-my-apps');
      if (appsSection) {
        scrollToElement(appsSection);
      }
      trackClick('bottom_bar', 'apps', 'Ứng dụng bottom bar', '#');
    });

    // Click "Sản phẩm" — cuộn đến section sản phẩm đầu tiên (order thấp nhất)
    bottomBar.querySelector('#bb-products').addEventListener('click', (e) => {
      e.preventDefault();

      // Lấy tất cả section sản phẩm (affiliate-list + own-products), sắp xếp theo order
      const PRODUCT_TYPES = ['affiliate-list', 'own-products'];
      const sortedProductSections = (config.sections || [])
        .filter(sec => sec.enabled !== false && PRODUCT_TYPES.includes(sec.type) && sec.items && sec.items.length > 0)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

      // Tìm phần tử DOM của section đầu tiên
      let topSection = null;
      for (const sec of sortedProductSections) {
        const el = document.getElementById(`section-${sec.id}`);
        if (el) { topSection = el; break; }
      }

      // Fallback: tìm theo selector cũ
      if (!topSection) {
        topSection = document.querySelector('[id*="section-affiliate"]') || document.getElementById('section-affiliates');
      }

      if (topSection) scrollToElement(topSection);
      trackClick('bottom_bar', 'products', 'Sản phẩm bottom bar', '#');
    });

    // Click "Đặt lịch" cuộn xuống form booking và mở form
    const bookingBtn = bottomBar.querySelector('#bb-booking');
    bookingBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookingSection = document.getElementById('section-appointment-booking');
      if (bookingSection) {
        scrollToElement(bookingSection);
        
        const formWrapper = bookingSection.querySelector('#booking-form-wrapper');
        const chevron = bookingSection.querySelector('#booking-chevron');
        if (formWrapper && (formWrapper.style.maxHeight === '0px' || formWrapper.style.maxHeight === '')) {
          formWrapper.style.maxHeight = formWrapper.scrollHeight + 'px';
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        }
      }
      trackClick('bottom_bar', 'booking', 'Đặt lịch bottom bar', '#');
    });

    // Click "Quà tặng"
    bottomBar.querySelector('#bb-gifts').addEventListener('click', (e) => {
      e.preventDefault();
      const giftSection = document.getElementById('section-free-gifts');
      if (giftSection) {
        scrollToElement(giftSection);
      }
      trackClick('bottom_bar', 'gifts', 'Quà tặng bottom bar', '#');
    });

    // Click "Dịch vụ"
    bottomBar.querySelector('#bb-services').addEventListener('click', (e) => {
      e.preventDefault();
      const servicesSection = document.getElementById('section-services-digital');
      if (servicesSection) {
        scrollToElement(servicesSection);
      }
      trackClick('bottom_bar', 'services', 'Dịch vụ bottom bar', '#');
    });

    document.body.appendChild(bottomBar);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Scroll Active Tab Synchronization for Bottom Navigation
    const syncBottomBarActiveTab = () => {
      const scrollContainer = (config.edgeToEdge && window.innerWidth > 480) 
        ? document.querySelector('.app-container') 
        : null;
      
      const scrollPosition = scrollContainer 
        ? scrollContainer.scrollTop + scrollContainer.clientHeight / 3
        : window.scrollY + window.innerHeight / 3;
      
      const sections = [
        { id: 'bb-apps', el: document.getElementById('section-my-apps') },
        { 
          id: 'bb-products', 
          el: document.querySelector('[id*="section-affiliate"]') || document.querySelector('[id*="section-own-products"]')
        },
        { id: 'bb-booking', el: document.getElementById('section-appointment-booking') },
        { id: 'bb-gifts', el: document.getElementById('section-free-gifts') },
        { id: 'bb-services', el: document.getElementById('section-services-digital') }
      ];

      let activeTabId = null;

      for (const section of sections) {
        if (section.el) {
          const top = section.el.offsetTop;
          const height = section.el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            activeTabId = section.id;
            break;
          }
        }
      }

      bottomBar.querySelectorAll('.bottom-bar-item').forEach(item => {
        if (item.id === activeTabId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    const scrollTarget = (config.edgeToEdge && window.innerWidth > 480) 
      ? document.querySelector('.app-container') 
      : window;

    if (scrollTarget) {
      scrollTarget.addEventListener('scroll', syncBottomBarActiveTab, { passive: true });
    }
    setTimeout(syncBottomBarActiveTab, 300);
  }

  // 11. Hamburger Menu Logic for Sticky Header
  const menuToggle = document.getElementById('menu-toggle');
  const headerNav = document.getElementById('header-nav');
  
  if (menuToggle && headerNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      headerNav.classList.toggle('show');
      const icon = menuToggle.querySelector('i') || menuToggle.querySelector('svg');
      if (icon) {
        if (headerNav.classList.contains('show')) {
          menuToggle.innerHTML = '<i data-lucide="x" style="width:20px;height:20px;"></i>';
        } else {
          menuToggle.innerHTML = '<i data-lucide="menu" style="width:20px;height:20px;"></i>';
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });

    // Close menu on click outside
    document.addEventListener('click', () => {
      headerNav.classList.remove('show');
      const icon = menuToggle.querySelector('i') || menuToggle.querySelector('svg');
      if (icon && icon.getAttribute('data-lucide') === 'x') {
        menuToggle.innerHTML = '<i data-lucide="menu" style="width:20px;height:20px;"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });

    // Click links inside menu scroll and close
    headerNav.querySelectorAll('.nav-link-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        headerNav.classList.remove('show');
        const icon = menuToggle.querySelector('i') || menuToggle.querySelector('svg');
        if (icon) {
          menuToggle.innerHTML = '<i data-lucide="menu" style="width:20px;height:20px;"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        if (target === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          let selector = '';
          if (target === 'services') selector = '#section-services-digital';
          else if (target === 'gifts') selector = '#section-free-gifts';
          else if (target === 'faq') selector = '#section-faq';
          else if (target === 'booking') selector = '#section-appointment-booking';

          if (target === 'products') {
            // Tìm section sản phẩm đầu tiên (order thấp nhất) từ config
            const PRODUCT_TYPES = ['affiliate-list', 'own-products'];
            const firstProductSec = (config.sections || [])
              .filter(sec => sec.enabled !== false && PRODUCT_TYPES.includes(sec.type) && sec.items && sec.items.length > 0)
              .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))[0];
            let targetEl = firstProductSec ? document.getElementById(`section-${firstProductSec.id}`) : null;
            if (!targetEl) targetEl = document.querySelector('[id*="section-affiliate"]');
            if (targetEl) scrollToElement(targetEl);
          } else {
            const targetEl = selector ? document.querySelector(selector) : null;
            if (targetEl) {
              scrollToElement(targetEl);
              
              // Auto open booking form if selected
              if (target === 'booking') {
                const formWrapper = targetEl.querySelector('#booking-form-wrapper');
                const chevron = targetEl.querySelector('#booking-chevron');
                if (formWrapper && (formWrapper.style.maxHeight === '0px' || formWrapper.style.maxHeight === '')) {
                  formWrapper.style.maxHeight = formWrapper.scrollHeight + 'px';
                  if (chevron) chevron.style.transform = 'rotate(180deg)';
                }
              }
            }
          }
        }
      });
    });
  }

  initBottomBar();

  // 12. Generic Scroll Navigation Buttons for PC
  function initScrollNavigation() {
    const scrollClasses = ['.project-bento-grid', '.affiliate-container', '.reviews-container', '.service-grid'];
    
    scrollClasses.forEach(className => {
      const containers = document.querySelectorAll(className);
      containers.forEach(container => {
        if (container.parentElement.classList.contains('scroll-container-wrapper')) return;

        // Tạo wrapper bọc quanh container
        const wrapper = document.createElement('div');
        wrapper.className = 'scroll-container-wrapper';
        container.parentNode.insertBefore(wrapper, container);
        wrapper.appendChild(container);

        // Tạo nút Prev và Next
        const prevBtn = document.createElement('button');
        prevBtn.className = 'scroll-nav-btn prev';
        prevBtn.setAttribute('aria-label', 'Cuộn sang trái');
        prevBtn.innerHTML = '<i data-lucide="chevron-left"></i>';

        const nextBtn = document.createElement('button');
        nextBtn.className = 'scroll-nav-btn next';
        nextBtn.setAttribute('aria-label', 'Cuộn sang phải');
        nextBtn.innerHTML = '<i data-lucide="chevron-right"></i>';

        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);

        // Hàm ẩn hiện nút điều hướng thông minh
        const updateButtons = () => {
          const scrollLeft = container.scrollLeft;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          
          if (scrollLeft <= 5) {
            prevBtn.classList.remove('show');
          } else {
            prevBtn.classList.add('show');
          }

          if (scrollLeft >= maxScrollLeft - 5) {
            nextBtn.classList.remove('show');
          } else {
            nextBtn.classList.add('show');
          }
        };

        // Gán sự kiện cuộn
        prevBtn.addEventListener('click', () => {
          container.scrollBy({ left: -320, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
          container.scrollBy({ left: 320, behavior: 'smooth' });
        });

        // Lắng nghe sự kiện scroll trên container
        container.addEventListener('scroll', updateButtons);
        
        // Khởi chạy kiểm tra lần đầu sau khi UI render ổn định
        setTimeout(updateButtons, 300);

        // Theo dõi resize cửa sổ trình duyệt
        window.addEventListener('resize', updateButtons);
      });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Chờ UI render ổn định rồi kích hoạt nút cuộn PC
  setTimeout(initScrollNavigation, 500);

  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isTikTok = /TikTok|musical_ly|com.zhiliaoapp.musically/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB|FB_MESSENGER/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isMessenger = /Messenger/i.test(ua);
  const isZalo = /ZaloApp|ZaloAP/i.test(ua);

  // Các trình duyệt độc lập phổ biến (sử dụng webview hoặc engine riêng nhưng là trình duyệt độc lập đầy đủ)
  const isDuckDuckGo = /DuckDuckGo|DuckDuck/i.test(ua);
  const isFirefox = /Firefox|FxiOS|Focus/i.test(ua);
  const isEdge = /Edg|EdgA|EdgiOS/i.test(ua);
  const isOpera = /OPR|Opera|OPT/i.test(ua);

  // Android Webview: có AppleWebKit, chứa "wv" hoặc "Version/" để nhận dạng Webview hệ thống, nhưng loại trừ các trình duyệt chính thống
  const isAndroidWebView = /Android/i.test(ua) && 
                           /AppleWebKit/i.test(ua) && 
                           (/; wv\)/.test(ua) || /Version\//.test(ua)) && 
                           !/SamsungBrowser|MiuiBrowser|HeyTapBrowser|OppoBrowser|VivoBrowser|HuaweiBrowser/i.test(ua) && 
                           !/OPR/i.test(ua) && 
                           !/DuckDuckGo|DuckDuck/i.test(ua) && 
                           !/Firefox|FxiOS|Focus/i.test(ua) &&
                           !/Edg|EdgA|EdgiOS/i.test(ua);

  // iOS Webview: có AppleWebKit nhưng KHÔNG có Safari (mọi trình duyệt chuẩn trên iOS đều bắt buộc có 'Safari/' ở cuối UA)
  const isIOSWebView = /(iPhone|iPad|iPod)/i.test(ua) && 
                       /AppleWebKit/i.test(ua) && 
                       !/Safari\//.test(ua) && 
                       !/FxiOS/i.test(ua) && 
                       !/CriOS/i.test(ua) && 
                       !/EdgiOS/i.test(ua) && 
                       !/DuckDuckGo/i.test(ua);

  // Chỉ khóa tương tác đối với In-App Browser thực sự, không khóa trình duyệt độc lập
  const isInAppBrowser = (isTikTok || isFacebook || isInstagram || isMessenger || isZalo || isAndroidWebView || isIOSWebView) && 
                         !isDuckDuckGo && 
                         !isFirefox && 
                         !isEdge && 
                         !isOpera;

  if (isInAppBrowser) {
    showInAppBrowserBanner();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

