# health-for-u-frontend

> Vite와 Vue.js를 기반으로 구축된 헬스포유의 사용자 인터페이스입니다.
> 직관적인 디자인과 효율적인 상태 관리를 통해 사용자에게 최적화된 맞춤형 레시피 경험을 제공합니다.

---

## 핵심 기능

- **중앙 집중식 상태 관리 (userStore):** - Pinia를 활용하여 유저 정보를 전역에서 관리합니다.
    - 컴포넌트 간 복잡한 Props 전달 없이 유연하게 유저 컨텍스트를 공유하여 개발 생산성을 높였습니다.
- **interactive NavigationBar:** - 사용자 맞춤형 UI 제공 (유저 이름 표시, 로그인/로그아웃 상태 반영).
    - **즐겨찾기 사이드바**: 별도의 페이지 이동 없이 사이드바를 통해 저장된 레시피 목록을 즉시 확인하고 관리할 수 있습니다.
- **Responsive Design:** 다양한 디바이스 환경을 고려한 반응형 레이아웃 구성.

---

## 기술 스택

- **Core:** Vue 3, Vite
- **State Management:** Pinia 
- **Styling:** 
- **HTTP Client:** Axios
- **Build Tool:** Vite

---

## API 라우팅 설계
프론트엔드는 단일 진입점인 **API Gateway**를 통해서만 백엔드 서비스와 통신합니다.
- `Auth`: `/api/v1/auth/**`
- `Health`: `/api/v1/health/**`

---

## Roadmap & Updates
- [ ] 디자인 시스템 고도화 및 UI/UX 개선
- [ ] 컴포넌트 모듈화 및 코드 리팩토링을 통한 가독성 향상
- [ ] TypeScript 도입을 통한 타입 안정성 확보
- [ ] 주요 사용자 시나리오에 대한 E2E 테스트 코드 작성