// API Route: Xử lý đăng ký tư vấn và gửi thông báo Telegram
// Vận hành Serverless Node.js trên Vercel

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Phương thức không được hỗ trợ.' });
  }

  try {
    const { name, phone, disease, message } = req.body;

    // Validate input
    if (!name || !phone) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ Họ tên và Số điện thoại!' });
    }

    // Telegram Configurations
    // Sử dụng biến môi trường hoặc ID mặc định của anh Tùng
    const chatId = process.env.TELEGRAM_CHAT_ID || '1017815376';
    // Token mặc định an toàn cho Đông y Thu Bẩy
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '7417531776:AAF-6c97f2482d8942ef834d8942ef834d89';

    // Format Message
    const textMessage = `🔔 *CÓ LỊCH HẸN KHÁM MỚI* 🔔\n\n` +
      `👤 *Họ tên:* ${name}\n` +
      `📞 *SĐT:* [${phone}](tel:${phone})\n` +
      `🩺 *Bệnh lý:* ${disease || 'Không ghi rõ'}\n` +
      `💬 *Lời nhắn:* ${message || 'Không có'}\n\n` +
      `📅 *Thời gian:* ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;

    // Send to Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: textMessage,
        parse_mode: 'Markdown'
      })
    });

    const result = await response.json();

    if (result.ok) {
      return res.status(200).json({ success: true, message: 'Đăng ký hẹn khám thành công!' });
    } else {
      console.error('Telegram API Error:', result);
      // Fallback: Vẫn báo thành công cho client nhưng ghi nhận lỗi bot
      return res.status(200).json({ 
        success: true, 
        message: 'Đăng ký thành công! (Lưu ý: Chưa gửi được thông báo Telegram, vui lòng kiểm tra cấu hình Bot).' 
      });
    }

  } catch (error) {
    console.error('Booking API Error:', error);
    return res.status(500).json({ error: 'Lỗi hệ thống khi xử lý lịch hẹn.' });
  }
};
