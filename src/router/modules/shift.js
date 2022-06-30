export default [{
    path: '/shift-password',
    name: 'ShiftPassword',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Изменить пароль'
    },
    component: () => import('@/pages/Shift/ShiftPassword.vue')
  },
  {
    path: '/shift-email',
    name: 'ShiftEmail',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Изменить Email'
    },
    component: () => import('@/pages/Shift/ShiftEmail.vue')
  },
  {
    path: '/shift-email-success',
    name: 'ShiftEmailSuccess',
    meta: {
      layout: 'form',
      notRequiresAuth: true,
      title: 'Успешное изменение Email'
    },
    component: () => import('@/pages/Shift/ShiftEmailSuccess.vue')
  }
]
