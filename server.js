const express = require('express');
const cors = require('cors');
// Gọi trực tiếp file xử lý của trường ĐH Nông Lâm Thái Nguyên
const tuafPortal = require('./portals/tuaf'); 

const app = express();
app.use(cors());
app.use(express.json());

// Định tuyến API xử lý Đăng nhập và lấy lịch học
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu!' });
    }

    try {
        // Chuyển tiếp thông tin đăng nhập sang file tuaf.js để xử lý cào dữ liệu
        const result = await tuafPortal.loginAndFetchSchedule(username, password);
        return res.json(result);
    } catch (error) {
        console.error('Lỗi hệ thống backend:', error);
        return res.status(500).json({ success: false, message: 'Lỗi kết nối server cổng trường, vui lòng thử lại sau!' });
    }
});

// Chạy server ở port mặc định của Render (hoặc 8081 khi chạy local)
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server kết nối lịch học đang chạy mượt mà trên cổng ${PORT}`);
});