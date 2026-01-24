<script setup>
import { reactive, computed, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

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
    axios.get(`/api/users/check-id`, { params: { id: form.loginId } })
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
    const res = await axios.post('/api/users/signup', form)
    if (res.status === 201) {
      alert('회원가입이 완료되었습니다.')
      await router.push('/users/login') // 회원가입 후 로그인 페이지로 이동
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
    <div class="all">
      <div id="content">
        <div class="j_title">
          <RouterLink to="/">healthy food for U</RouterLink>
        </div>

        <p />
        <div class="log">
          이미 회원이신가요?
          <RouterLink class="log_link" to="/users/login">로그인하기</RouterLink>
        </div>

        <form @submit.prevent="submitForm">
          <!-- ID -->
          <div>
            <h3 class="join_title">아이디</h3>
            <input @blur="checkId" v-model="form.loginId" type="text" maxlength="20" placeholder="아이디 입력" />
          </div>

          <!-- PW1 -->
          <div>
            <h3 class="join_title">비밀번호</h3>
            <input @blur="checkPw" v-model="form.password" type="password" maxlength="20" placeholder="비밀번호 입력" />
          </div>

          <!-- PW2 -->
          <div>
            <h3 class="join_title">비밀번호 재확인</h3>
            <input @blur="comparePw" v-model="form.confirmPassword" type="password" maxlength="20" placeholder="비밀번호 확인" />
          </div>

          <!-- NAME -->
          <div>
            <h3 class="join_title">이름</h3>
            <input @blur="checkName" v-model="form.userName" type="text" maxlength="20" placeholder="이름 입력" />
          </div>

          <!-- EMAIL -->
          <div>
            <h3 class="join_title">이메일</h3>
            <input @blur="checkEmail" v-model="form.email" type="text" maxlength="100" placeholder="이메일 입력" />
          </div>

          <!-- MOBILE -->
          <div>
            <h3 class="join_title">휴대전화</h3>
            <input @blur="checkMobile" v-model="form.mobile" type="tel" maxlength="16" placeholder="전화번호 입력" />
          </div>

          <!-- JOIN BTN -->
          <div class="btn_area">
            <button class="btn" type="submit" :disabled="!canSignup">가입하기</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* signup.css 가져올 예정 */
</style>
