# Pages Layer

## 📋 개요

Pages 레이어는 **URL 라우트와 1:1로 매핑**되는 페이지 컴포넌트들을 포함합니다.
Features를 조합하여 실제 사용자가 보는 페이지를 구성합니다.

---

## 🎯 네이밍 규칙

### 기본 원칙

- **Router path를 PascalCase로 변환**하여 파일명 지정
- 의미가 명확하다면 더 직관적인 이름 사용 가능
- `.jsx` 확장자 사용 (일관성 유지)
- **중첩 경로는 폴더 구조로 표현**

### 폴더 구조

```bash
src/pages/
    ├── Home.jsx # / (루트는 단순하게)
    │
    └── main/
        ├── index.jsx # /main ⭐
        ├── Player.jsx # /main/player
        ├── Dashboard.jsx # /main/dashboard
        │
        └── game/
            ├── index.jsx # /main/game ⭐
            ├── Tetris.jsx # /main/game/tetris
            ├── Poll.jsx # /main/game/poll
            └── Ghost.jsx # /main/game/ghost
```

## 💡 index.jsx 패턴

각 폴더의 `index.jsx`는 해당 경로의 **루트 페이지**를 의미합니다.

**예시:**

- `pages/main/index.jsx` → `/main`
- `pages/main/Profile.jsx` → `/main/profile`
- `pages/main/game/index.jsx` → `/main/game`

---

## 💡 index.jsx 패턴

각 폴더의 `index.jsx`는 해당 경로의 **루트 페이지**를 의미합니다.

**예시:**

- `pages/main/index.jsx` → `/main`
- `pages/main/Profile.jsx` → `/main/profile`
- `pages/main/game/index.jsx` → `/main/game`

---

## 🔄 라우터 매핑

```javascript
// src/app/router/Router.jsx
import Home from "../../pages/Home";
import Main from "../../pages/main"; // index.jsx 자동 import
import MainPlayer from "../../pages/main/Player";
import MainDashboard from "../../pages/main/Dashboard";

// Game 섹션
import Game from "../../pages/main/game"; // index.jsx
import GameTetris from "../../pages/main/game/Tetris";

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/main" element={<Main />} />
    <Route path="/main/player" element={<MainPlayer />} />
    <Route path="/main/dashboard" element={<MainDashboard />} />

    {/* Game 섹션 */}
    <Route path="/main/game" element={<Game />} />
    <Route path="/main/game/tetris" element={<GameTetris />} />
  </Routes>
);
```

---

## 📌 Pages 레이어 규칙

### ✅ Pages가 해야 할 것

- Features 조합
- 페이지 레벨 레이아웃 구성
- URL 파라미터 처리
- 페이지 전환 효과

### ❌ Pages가 하면 안 되는 것

- 비즈니스 로직 (→ Features로)
- 복잡한 상태 관리 (→ Features로)
- 직접 API 호출 (→ Features로)
- 데이터 처리 로직 (→ Features로)

**원칙**: Pages는 "얇게(thin)" 유지하고, Features를 조합만!

---

## 📝 페이지 예시

### 간단한 페이지

```javascript
// src/pages/main/index.jsx
import { DashBoard } from "../../features/dashboard";
import { Player } from "../../features/youtube-player";

const Main = () => (
  <div className="main-container">
    <DashBoard />
    <Player />
  </div>
);

export default Main;### 하위 페이지

// src/pages/main/Player.jsx
import { YoutubePlayer } from "../../features/youtube-player";

const Player = () => (
  <div className="player-page">
    <YoutubePlayer />
  </div>
);

export default Player;
```

---

## 🎯 요약

1. **폴더 구조 = URL 구조**
2. **index.jsx = 폴더의 루트 페이지**
3. **PascalCase로 파일명 작성**
4. **Pages는 Features를 조합만**
