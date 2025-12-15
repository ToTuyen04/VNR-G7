# VNR202 - Nhóm 7 | Đảng Lãnh Đạo Đấu Tranh Giải Phóng Dân Tộc

Interactive learning platform về Cách mạng Tháng Tám 1945 với game Cờ Cá Ngựa multiplayer.

## 🎮 Features

- **Cờ Cá Ngựa Multiplayer**: Trò chơi nhiều người chơi (2-8 người) sử dụng PeerJS (WebRTC)
- **P2P Connection**: Kết nối trực tiếp giữa các người chơi - **Không cần server backend!**
- **Real-time Gameplay**: Chơi game thời gian thực với độ trễ cực thấp
- **Room-based System**: Tạo phòng và chia sẻ Peer ID để bạn bè tham gia
- **100% Free**: Không tốn phí hosting server

## 🚀 Quick Start

### Chỉ cần chạy Frontend (Không cần server!)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Game sẽ chạy tại `http://localhost:5173`

## 🎲 How to Play Cờ Cá Ngựa

**Người tạo phòng:**
1. Nhấn "Tạo phòng mới"
2. Sao chép và chia sẻ **Peer ID** với bạn bè

**Người tham gia:**
1. Dán **Peer ID** vào ô "ID Phòng"
2. Nhấn "Tham gia"

**Bắt đầu chơi:**
1. Chờ 2-8 người chơi tham gia
2. Tất cả người chơi nhấn "Sẵn sàng"
3. Host nhấn "Bắt đầu trò chơi"
4. Lắc xúc xắc và di chuyển quân cờ theo lượt
5. Người đầu tiên đưa cả 4 quân về đích sẽ chiến thắng!

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Multiplayer**: PeerJS (WebRTC P2P)
- **Audio**: Howler.js

## 🌟 Why PeerJS?

- ✅ **No Backend Server Required** - Giảm chi phí và độ phức tạp
- ✅ **Lower Latency** - Kết nối trực tiếp P2P
- ✅ **Free Forever** - Không tốn phí hosting
- ✅ **Easy to Deploy** - Chỉ cần deploy frontend
- ✅ **Scalable** - Không lo về tải server

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
