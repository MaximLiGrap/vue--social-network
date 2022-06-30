export default [{
    path: '/login',
    name: 'Login',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      notWithoutAuth: true,
      title: 'Авторизация'
    },
    component: () => import('@/pages/Auth/Login.vue')
  },
  {
    path: '/registration',
    name: 'Registration',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Регистрация'
    },
    component: () => import('@/pages/Auth/Registration.vue')
  },
  {
    path: '/registration-success',
    name: 'RegisterSuccess',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Успешная регистрация'
    },
    component: () => import('@/pages/Auth/RegisterSuccess.vue')
  },
  {
    path: '/forgot',
    name: 'Forgot',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Востановление'
    },
    component: () => import('@/pages/Auth/Forgot.vue')
  },
  {
    path: '/forgot-success',
    name: 'ForgotSuccess',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Успешное востановление'
    },
    component: () => import('@/pages/Auth/ForgotSuccess.vue')
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Изменить пароль'
    },
    component: () => import('@/pages/Auth/ChangePassword.vue')
  },
  {
    path: '/change-password-success',
    name: 'ChangePasswordSuccess',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Успешное изменение пароля'
    },
    component: () => import('@/pages/Auth/ChangePasswordSuccess.vue')
  }
]
