import { createRouter, createWebHistory } from 'vue-router'
import { Constants } from '@/js/Contants'
import axios from 'axios'
import Login from '@/views/Login.vue'
import DashboardView from "@/views/DashboardView.vue"
import SelectUserView from '@/views/users/SelectUserView.vue'
import AdministradorView from '@/views/users/administrador/AdministradorView.vue'
import PacienteView from '@/views/users/paciente/PacienteView.vue'
import AdministradorCreate from '@/views/users/administrador/AdministradorCreate.vue'
import AdministradorEdit from '@/views/users/administrador/AdministradorEdit.vue'
import PacienteCreate from '@/views/users/paciente/PacienteCreate.vue'
import PacienteEdit from '@/views/users/paciente/PacienteEdit.vue'
import ExamenView from '@/views/examenes/ExamenView.vue'
import ExamenCreate from '@/views/examenes/ExamenCreate.vue'
import ExamenShow from '@/views/examenes/ExamenShow.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    /* users */
    {
      path: '/users/select',
      name: 'selectUser',
      component: SelectUserView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/administrador',
      name: 'userAdmin',
      component: AdministradorView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/paciente',
      name: 'userPaciente',
      component: PacienteView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users/administrador/create',
      name: 'createUserAdmin',
      component: AdministradorCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/administrador/edit/:slug',
      name: 'EditUserAdmin',
      component: AdministradorEdit,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/paciente/create',
      name: 'createUserPaciente',
      component: PacienteCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/users/paciente/edit/:slug',
      name: 'EditUserPaciente',
      component: PacienteEdit,
      meta: { requiresAuth: true },
    },

    /* analisis */
    {
      path: '/examenes',
      name: 'Examen',
      component: ExamenView,
      meta: { requiresAuth: true },
    },
    {
      path: '/examenes/create',
      name: 'ExamenCreate',
      component: ExamenCreate,
      meta: { requiresAuth: true },
    },
    {
      path: '/examenes/show/:id',
      name: 'ExamenShow',
      component: ExamenShow,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*', // Ruta comodín
      name: 'NotFound',
      component: NotFound
    }

  ]
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      // Verificar el token con el backend
      const response = await axios.get(`${Constants.serverPath}/api/auth/verify`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        next();
      } else {
        next({ name: 'login' }); 
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      next({ name: 'login' }); 
    }
  } else {
    next();
  }
});


export default router;
