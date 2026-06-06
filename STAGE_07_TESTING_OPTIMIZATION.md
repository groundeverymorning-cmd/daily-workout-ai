# ✅ STAGE 7: 테스트 & 최적화

## 목표
API 테스트, UI 기능 테스트, 성능 최적화, 버그 수정

---

## Task Checklist

- [ ] API 엔드포인트 테스트 (GET/POST `/api/workouts`)
- [ ] 인증 기능 테스트 (로그인/로그아웃)
- [ ] AI 코멘트 생성 테스트
- [ ] UI 반응성 테스트 (모바일 & 데스크톱)
- [ ] 에러 처리 테스트 (잘못된 입력, API 실패)
- [ ] 성능 최적화 (번들 크기, 이미지 최적화)
- [ ] 보안 검토 (민감 정보 노출 확인)
- [ ] 배포된 서비스 최종 검증

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **QA & 최적화 엔지니어**

### 요청사항:

#### 1. API 테스트 스크립트 작성

```bash
# 1. 회원가입 & 로그인 토큰 획득 (선택적, 테스트 용)
# Supabase Admin 콘솔에서 직접 사용자 생성

# 2. POST 테스트
curl -X POST https://daily-workout-ai.vercel.app/api/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "workout_date": "2026-06-06",
    "running_distance": 5.0,
    "cycling_distance": 10.0,
    "swimming_distance": 200
  }'

# 3. GET 테스트
curl https://daily-workout-ai.vercel.app/api/workouts

# 4. 응답 확인
# - 상태코드: 201 (POST), 200 (GET)
# - ai_comment 필드 존재?
# - 데이터 무결성?
```

#### 2. UI 기능 테스트 체크리스트

```
로그인/회원가입:
  [ ] 이메일 입력 필드 작동?
  [ ] 비밀번호 입력 필드 작동?
  [ ] "로그인" & "회원가입" 버튼 작동?
  [ ] 잘못된 이메일/비밀번호 시 에러 표시?

대시보드:
  [ ] 헤더(로고 + 로그아웃) 표시?
  [ ] 운동 폼 렌더링?
  [ ] 날짜 선택 기능?
  [ ] 숫자 입력 필드 (실수값)?
  [ ] "저장" 버튼 클릭 후 로딩 상태?
  [ ] 저장 후 리스트 갱신?
  [ ] 기록 카드에 운동 내역 표시?
  [ ] AI 코멘트 표시 (또는 로딩)?

로그아웃:
  [ ] 로그아웃 버튼 클릭 → 로그인 페이지?
  [ ] 세션 종료 확인?
```

#### 3. 에러 처리 테스트

```
API 에러:
  [ ] 인증 없이 `/api/workouts` 호출 → 401?
  [ ] 빈 JSON 전송 → 400?
  [ ] 음수 거리 입력 → 에러 메시지?
  [ ] 네트워크 오류 시 UI 에러 표시?

Claude API 에러:
  [ ] API 할당량 초과 시 처리?
  [ ] 생성 실패 시 기록은 저장되고 ai_comment만 NULL?
```

#### 4. 성능 최적화

```typescript
// lib/supabase.ts 최적화
// - 캐싱 설정 (필요시)
// - 불필요한 컬럼 제외 (select 명시)

// app/dashboard/page.tsx 최적화
// - 컴포넌트 분리 (React.memo 사용)
// - 요청 중복 방지 (useEffect 의존성 배열)

// 번들 크기 확인
npm run build
# → .next/static 폴더 크기 확인
```

#### 5. 보안 검토

```
[ ] .env.local이 .gitignore에 포함?
[ ] 민감 정보 (API KEY)가 클라이언트 코드에 노출?
[ ] Supabase RLS 정책 활성화?
[ ] CORS 설정 확인 (필요시)
[ ] SQL Injection 위험? (Supabase SDK 사용하므로 안전)
[ ] XSS 위험? (React 자동 escape 사용)
```

#### 6. 최종 배포 검증

```
로컬 + 배포된 URL 모두 테스트:

로컬 (localhost:3000):
  npm run dev

배포 (https://daily-workout-ai.vercel.app):
  [ ] 전체 기능 작동?
  [ ] 로딩 시간 < 2초?
  [ ] 모바일에서 UI 반응성?
  [ ] 콘솔 에러/경고 없음?
```

---

## 테스트 보고서 템플릿

```markdown
## 테스트 결과 (YYYY-MM-DD)

### 기능 테스트
- [x] 로그인/회원가입
- [x] 운동 기록 저장
- [x] AI 코멘트 생성
- [x] 기록 조회
- [x] 로그아웃

### 에러 처리
- [x] 네트워크 오류
- [x] API 실패
- [x] 유효성 검사

### 성능
- 번들 크기: XX KB
- 첫 로딩: XX ms
- API 응답 시간: XX ms

### 보안
- [x] 민감 정보 노출 없음
- [x] RLS 정책 활성화
- [x] HTTPS 적용

### 결론
✅ 배포 준비 완료 / ❌ 수정 필요
```

---

## 성공 기준

- ✅ API 테스트 전부 통과?
- ✅ UI 기능 테스트 전부 통과?
- ✅ 에러 처리 정상 작동?
- ✅ 성능 최적화 완료?
- ✅ 보안 검토 완료?
- ✅ 배포된 URL에서 전체 기능 작동?

---

## 선택사항: 추가 개선

- [ ] 다크 모드 지원
- [ ] 운동 기록 수정/삭제 기능
- [ ] 주간/월간 통계
- [ ] 알림 기능 (선택적)
- [ ] 다국어 지원

---

## 완료!

모든 단계가 완료되면 프로젝트가 프로덕션 준비 상태입니다. 🎉
