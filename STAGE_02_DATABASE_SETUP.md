# 🗄️ STAGE 2: Supabase 데이터베이스 구축

## 목표
`users` 및 `workout_logs` 테이블 생성, RLS 정책 설정, 테스트 데이터 삽입

---

## Task Checklist

- [ ] Supabase SQL Editor에서 `users` 테이블 생성
- [ ] `workout_logs` 테이블 생성 (FK 포함)
- [ ] RLS (Row Level Security) 활성화
- [ ] RLS 정책 작성: SELECT, INSERT, UPDATE (소유자만)
- [ ] 테스트 데이터 삽입
- [ ] Supabase Studio에서 데이터 확인

---

## 프롬프트 (AI 에이전트용)

당신의 역할: **소스 검증자** (데이터 무결성)

### 요청사항:

1. **SQL 스크립트 작성 및 실행** (Supabase SQL Editor)
   
   ```sql
   -- 1. users 테이블 (auth.users와 별개 관리용)
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- 2. workout_logs 테이블
   CREATE TABLE workout_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     workout_date DATE NOT NULL,
     running_distance NUMERIC,
     cycling_distance NUMERIC,
     swimming_distance NUMERIC,
     ai_comment TEXT
   );
   
   -- 3. 인덱스 추가 (성능)
   CREATE INDEX idx_workout_logs_user_id ON workout_logs(user_id);
   CREATE INDEX idx_workout_logs_date ON workout_logs(workout_date DESC);
   ```

2. **RLS (Row Level Security) 정책 설정**
   
   ```sql
   -- RLS 활성화
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
   
   -- users 테이블: 자신의 데이터만 조회
   CREATE POLICY "Users can view their own data"
   ON users FOR SELECT
   USING (auth.uid() = id);
   
   -- workout_logs: 자신의 기록만 조회/삽입/수정
   CREATE POLICY "Users can view their own workouts"
   ON workout_logs FOR SELECT
   USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert their own workouts"
   ON workout_logs FOR INSERT
   WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update their own workouts"
   ON workout_logs FOR UPDATE
   USING (auth.uid() = user_id);
   ```

3. **테스트 데이터 삽입** (선택, 개발용)
   
   ```sql
   -- 테스트 사용자 ID: 00000000-0000-0000-0000-000000000001
   INSERT INTO users (id, email) 
   VALUES ('00000000-0000-0000-0000-000000000001', 'test@example.com');
   
   INSERT INTO workout_logs (user_id, workout_date, running_distance, ai_comment)
   VALUES (
     '00000000-0000-0000-0000-000000000001',
     '2026-06-06',
     5.0,
     '좋은 운동이었어요! 계속 화이팅!'
   );
   ```

4. **데이터 확인**
   - Supabase Studio의 "Table Editor"에서 테이블 확인
   - 외래 키(FK) 관계 확인
   - RLS 정책 활성화 확인

---

## 성공 기준

- ✅ `users` 및 `workout_logs` 테이블이 Supabase에 생성되었는가?
- ✅ 외래 키 관계가 올바르게 설정되었는가?
- ✅ RLS 정책이 4개 모두 활성화되었는가?
- ✅ 테스트 데이터 조회가 가능한가?

---

## 주요 설정 값 (로컬에 메모)

```
Supabase Project URL: https://xxx.supabase.co
Supabase Anon Key: xxx
Supabase Service Role Key: xxx
```

---

## 다음 단계

→ STAGE 3: 인증 시스템 구현
