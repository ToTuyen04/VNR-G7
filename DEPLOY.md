# Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị

1. Đăng ký tài khoản tại [Vercel](https://vercel.com) nếu chưa có
2. Cài đặt Vercel CLI (tùy chọn):
   ```bash
   npm i -g vercel
   ```

## Bước 2: Deploy qua Vercel Website (Khuyến nghị)

### Cách 1: Deploy từ Git Repository (Khuyến nghị nhất)

1. Push code lên GitHub/GitLab/Bitbucket
2. Truy cập [vercel.com/new](https://vercel.com/new)
3. Chọn repository của bạn
4. Vercel sẽ tự động phát hiện Vite framework
5. Xác nhận các cài đặt:
   - **Framework Preset**: Vite
   - **Root Directory**: VNR-G7 (hoặc để trống nếu đã ở trong thư mục)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Cách 2: Deploy bằng Vercel CLI

1. Mở terminal trong thư mục `VNR-G7`
2. Chạy lệnh:
   ```bash
   vercel
   ```
3. Làm theo hướng dẫn:
   - Đăng nhập (nếu chưa)
   - Xác nhận project settings
   - Deploy

## Bước 3: Cấu hình Domain (Tùy chọn)

1. Sau khi deploy thành công, vào Vercel Dashboard
2. Chọn project của bạn
3. Vào tab "Settings" → "Domains"
4. Thêm custom domain nếu cần

## Bước 4: Environment Variables (Nếu có)

Nếu project có environment variables:
1. Vào Vercel Dashboard → Project Settings
2. Chọn tab "Environment Variables"
3. Thêm các biến môi trường cần thiết

## Auto Deploy

Khi deploy từ Git repository, Vercel sẽ tự động:
- Deploy lại mỗi khi push code lên branch main/master
- Tạo preview deployment cho mỗi pull request

## Kiểm tra trước khi deploy

Chạy build local để đảm bảo không có lỗi:
```bash
npm run build
npm run preview
```

## Troubleshooting

### Lỗi build
- Kiểm tra lại dependencies trong package.json
- Chạy `npm install` và `npm run build` local
- Xem logs trên Vercel Dashboard

### Lỗi routing
- File `vercel.json` đã được cấu hình để handle SPA routing
- Tất cả routes sẽ redirect về index.html

## Links hữu ích

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
