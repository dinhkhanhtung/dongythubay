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
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { password, configContent } = req.body;

  // Read and sanitize environment variables to remove potential BOM (\ufeff) or spaces
  const rawAdminPassword = process.env.ADMIN_PASSWORD || '0982581222';
  const rawGithubToken = process.env.GITHUB_TOKEN;
  const rawGithubRepo = process.env.GITHUB_REPO || 'dinhkhanhtung/dongythubay';
  const rawGithubPath = process.env.GITHUB_PATH || 'config.js';

  const ADMIN_PASSWORD = rawAdminPassword.replace(/\uFEFF/g, '').trim();
  const GITHUB_REPO = rawGithubRepo.replace(/\uFEFF/g, '').trim();
  const GITHUB_PATH = rawGithubPath.replace(/\uFEFF/g, '').trim();

  if (!rawGithubToken) {
    return res.status(500).json({ error: 'Chưa cấu hình GITHUB_TOKEN trên Vercel Environment Variables.' });
  }
  const GITHUB_TOKEN = rawGithubToken.replace(/\uFEFF/g, '').trim();

  // 1. Password Verification
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mật khẩu bảo mật không chính xác.' });
  }

  try {
    // 2. Fetch existing config.js SHA from GitHub API
    const getUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    const getRes = await fetch(getUrl, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });

    if (!getRes.ok) {
      const errText = await getRes.text();
      throw new Error(`Không thể kết nối GitHub lấy SHA: ${errText}`);
    }

    const fileData = await getRes.json();
    const fileSha = fileData.sha;

    // 3. Push updated config.js back to GitHub
    const putUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_PATH}`;
    const base64Content = Buffer.from(configContent, 'utf-8').toString('base64');
    
    const putBody = {
      message: 'update: cập nhật dữ liệu qua trang Admin Dashboard (Secure API)',
      content: base64Content,
      sha: fileSha,
      branch: 'main'
    };

    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify(putBody)
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      throw new Error(`Đẩy dữ liệu lên GitHub thất bại: ${errText}`);
    }

    return res.status(200).json({ status: 'ok', message: 'Cập nhật cấu hình thành công!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
