module.exports = (req, res) => {
  const ua = req.headers['user-agent'] || '';
  
  const isTikTok = /TikTok|musical_ly|com.zhiliaoapp.musically/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB|FB_MESSENGER/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isMessenger = /Messenger/i.test(ua);
  const isGenericWebView = /(iPhone|iPod|iPad|Android).*AppleWebKit(?!.*Safari)/i.test(ua) || ua.includes('Version/');
  const isInAppBrowser = isTikTok || isFacebook || isInstagram || isMessenger || isGenericWebView;
  
  const isAndroid = /Android/i.test(ua);

  if (isInAppBrowser && isAndroid) {
    // Ép Webview của các ứng dụng mạng xã hội tải file nhị phân
    // Hành động này buộc Webview phải đóng và ném request sang Chrome ngoài của hệ thống Android
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="open-chrome.bin"');
    res.status(200).send('redirect');
  } else {
    // Khi đã chạy trên Chrome ngoài (hoặc thiết bị iOS/PC) -> Redirect trực tiếp về trang chủ Linktree
    res.writeHead(302, { Location: '/' });
    res.end();
  }
};
