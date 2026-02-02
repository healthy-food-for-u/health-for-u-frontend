<script setup>
import { reactive, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/api'

const router = useRouter()

// 회원가입 폼 데이터
const form = reactive({
  loginId: null,
  userName: null,
  password: null,
  confirmPassword: null,
  email: null,
  mobile: null
})

const errors = reactive({
  loginId: null,
  password: null,
  confirmPassword: null,
  userName: null,
  email: null,
  mobile: null
})

function checkId() {
  const pattern = /^[a-zA-Z0-9_-]{5,20}$/
  if (!form.loginId) {
    errors.loginId = '필수 정보입니다.'
  } else if (!pattern.test(form.loginId)) {
    errors.loginId = '5~20자의 영문, 숫자, 특수기호(_,-)만 사용 가능합니다.'
  } else {
    // 서버에 아이디 중복 확인 요청
    api.get(`/auth/users/check-id`, { params: { id: form.loginId } })
        .then(res => {
          if (res.data.exists) errors.loginId = '이미 사용 중인 아이디입니다.'
          else errors.loginId = null
        })
        .catch(() => {
          errors.loginId = '서버 오류로 확인할 수 없습니다.'
        })
  }
}

function checkPw() {
  const pattern = /^[a-zA-Z0-9~!@#$%^&*()_+|<>?:{}]{4,16}$/
  if (!form.password) errors.password = '필수 정보입니다.'
  else if (!pattern.test(form.password))
    errors.password = '4~16자 영문, 숫자, 특수문자를 사용하세요.'
  else errors.password = null
}

function comparePw() {
  if (!form.confirmPassword) errors.confirmPassword = '필수 정보입니다.'
  else if (form.confirmPassword !== form.password) errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
  else errors.confirmPassword = null
}

function checkName() {
  const pattern = /^[a-zA-Z가-힣]+$/
  if (!form.userName) errors.userName = '필수 정보입니다.'
  else if (!pattern.test(form.userName))
    errors.userName = '한글 또는 영문만 사용 가능합니다.'
  else errors.userName = null
}

function checkEmail() {
  const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  if (!form.email) errors.email = '필수 정보입니다.'
  else if (!pattern.test(form.email))
    errors.email = '유효한 이메일 형식이 아닙니다.'
  else errors.email = null
}

function checkMobile() {
  const pattern = /^01[016789][0-9]{7,8}$/
  if (!form.mobile) errors.mobile = '필수 정보입니다.'
  else if (!pattern.test(form.mobile))
    errors.mobile = '형식에 맞지 않는 번호입니다.'
  else errors.mobile = null
}

const canSignup = computed(() => {
  return Object.values(form).every((v) => v)
})

async function submitForm() {
  console.log("보내는 데이터:", JSON.stringify(form))
  if (!canSignup.value) return alert('입력값을 확인해주세요.')

  try {
    const res = await api.post('/auth/signup', form)
    if (res.status === 201) {
      alert('회원가입이 완료되었습니다.')
      await router.push('/login') // 회원가입 후 로그인 페이지로 이동
    }
  } catch (e) {
    console.log("에러 전체 객체:", e);

    if (e.response && e.response.status === 400) {
      const errorData = e.response.data;
      console.log("백엔드 검증 실패 사유:", errorData);

      // 1. 만약 배열로 온다면 첫 번째 에러 메시지를 보여줌
      if (Array.isArray(errorData) && errorData.length > 0) {
        alert(`입력 오류: ${errorData[0].defaultMessage}`);
      }
      // 2. 배열이 아니라 단일 객체로 올 경우 (백엔드 설정에 따라 다름)
      else if (errorData.message) {
        alert(`오류: ${errorData.message}`);
      }
      // 3. 그 외 알 수 없는 형식이면 그냥 실패 문구
      else {
        alert('입력 형식이 맞지 않습니다. 다시 확인해주세요.');
      }
    } else {
      alert('회원가입 중 서버 오류가 발생했습니다.');
    }
  }
}

watch(() => form.password, checkPw)
watch(() => form.confirmPassword, comparePw)
watch(() => form.email, checkEmail)
watch(() => form.mobile, checkMobile)
watch(() => form.userName, checkName)

</script>

<template>
  <div id="wrapper">
    <div class="signup-container">
      <div id="content">
        <div class="j_title">
          <RouterLink to="/">healthy food for U</RouterLink>
        </div>

        <div class="log-info">
          이미 회원이신가요?
          <RouterLink class="log_link" to="/login">로그인하기</RouterLink>
        </div>

        <form @submit.prevent="submitForm" class="join_form">
          <div class="join_row">
            <h3 class="join_title">아이디</h3>
            <div class="input_box">
              <input @blur="checkId" v-model="form.loginId" type="text" class="int" maxlength="20" placeholder="5~20자의 영문, 숫자, 특수기호" />
            </div>
            <span v-if="errors.loginId" class="error_next_box">{{ errors.loginId }}</span>
          </div>

          <div class="join_row">
            <h3 class="join_title">비밀번호</h3>
            <div class="input_box">
              <input @blur="checkPw" v-model="form.password" type="password" class="int" maxlength="20" placeholder="비밀번호 입력" />
            </div>
            <span v-if="errors.password" class="error_next_box">{{ errors.password }}</span>
          </div>

          <div class="join_row">
            <h3 class="join_title">비밀번호 재확인</h3>
            <div class="input_box">
              <input @blur="comparePw" v-model="form.confirmPassword" type="password" class="int" maxlength="20" placeholder="비밀번호 확인" />
            </div>
            <span v-if="errors.confirmPassword" class="error_next_box">{{ errors.confirmPassword }}</span>
          </div>

          <div class="join_row">
            <h3 class="join_title">이름</h3>
            <div class="input_box">
              <input @blur="checkName" v-model="form.userName" type="text" class="int" maxlength="20" placeholder="이름 입력" />
            </div>
            <span v-if="errors.userName" class="error_next_box">{{ errors.userName }}</span>
          </div>

          <div class="join_row">
            <h3 class="join_title">이메일</h3>
            <div class="input_box">
              <input @blur="checkEmail" v-model="form.email" type="text" class="int" maxlength="100" placeholder="이메일 입력 (example@mail.com)" />
            </div>
            <span v-if="errors.email" class="error_next_box">{{ errors.email }}</span>
          </div>

          <div class="join_row">
            <h3 class="join_title">휴대전화</h3>
            <div class="input_box">
              <input @blur="checkMobile" v-model="form.mobile" type="tel" class="int" maxlength="16" placeholder="'-' 제외 숫자만 입력" />
            </div>
            <span v-if="errors.mobile" class="error_next_box">{{ errors.mobile }}</span>
          </div>

          <div class="btn_area">
            <button class="btn_join" type="submit" :disabled="!canSignup">가입하기</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 전체 컨테이너 */
#wrapper {
  background-color: #f5f6f7;
  min-height: 100vh;
  padding: 50px 0;
  display: flex;
  justify-content: center;
}

.signup-container {
  width: 460px;
}

/* 제목/로고 */
.j_title {
  text-align: center;
  margin-bottom: 30px;
}
.j_title a {
  font-size: 40px;
  font-weight: bold;
  color: #f4623a; /* 주황색 로고 */
  text-decoration: none;
  text-transform: lowercase;
}

.log-info {
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.log_link {
  color: #f4623a;
  text-decoration: underline;
  font-weight: bold;
}

/* 입력 행 */
.join_row {
  margin-bottom: 20px;
}

.join_title {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
}

.input_box {
  display: block;
  width: 100%;
  height: 51px;
  border: solid 1px #dadada;
  padding: 10px 14px;
  box-sizing: border-box;
  background: #fff;
  position: relative;
}

.input_box:focus-within {
  border: 1px solid #f4623a; /* 포커스 시 주황색 */
}

.int {
  display: block;
  width: 100%;
  height: 29px;
  border: none;
  background: #fff;
  font-size: 15px;
  outline: none;
}

/* 에러 메시지 */
.error_next_box {
  display: block;
  margin: 9px 0 -2px;
  font-size: 12px;
  line-height: 14px;
  color: #ff0000;
}

/* 가입 버튼 */
.btn_area {
  margin: 30px 0 50px;
}

.btn_join {
  width: 100%;
  padding: 15px 0;
  border: 0;
  cursor: pointer;
  color: #fff;
  background-color: #f4623a; /* 가입 버튼 주황색 */
  font-size: 20px;
  font-weight: 700;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.btn_join:disabled {
  background-color: #ffb5a1; /* 비활성화 시 연한 주황색 */
  cursor: not-allowed;
}

.btn_join:hover:not(:disabled) {
  background-color: #d45131;
}
</style>
