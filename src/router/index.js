import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter ({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login",
            
        },
        {
            path: '/login',
            component: () => import('../views/AdminLogin.vue'),
            meta: {
                requiresAuthentication: false,
            }
        },
        {
            path: '/ddashboard',
            component: () => import('../views/Dashboard2.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },
        {
            path: '/gdashboard',
            component: () => import('../views/Dashboard.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },
        // {
        //     path: '/students',
        //     component: () => import('../views/Students.vue'),
        //     meta: {
        //         requiresAuthentication: true,
        //     }
        // },
        {
            path: '/examarchive',
            component: () => import('../views/ExamArchive.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },
        {
            path: '/examination',
            component: () => import('../views/Examination.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },
        {
            path: '/consultation',
            component: () => import('../views/Consultation.vue'),
            meta: {
                requiresAuthentication: true,
            } 
        },
        {
            path: '/consultationarchive',
            component: () => import('../views/ConsultationArchive.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },        
        {
            path: '/violation',
            component: () => import('../views/Violation.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },
        {
            path: '/violationarchive',
            component: () => import('../views/ViolationArchive.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },       
        {
            path: '/violationcleared',
            component: () => import('../views/ViolationCleared.vue'),
            meta: {
                requiresAuthentication: true,
            }
        },   
              
    ],
});

// router.beforeEach((to, from, next) => {
//     const token = getToken(); // Get token from sessionStorage

//     if (to.meta.requiresAuthentication && !token) {
//         // If the route requires authentication and there is no token, redirect to login
//         next('/login');
//     } else if (!to.meta.requiresAuthentication && token && to.path === '/login') {
//         // If the route doesn't require authentication and there is a token, redirect to home
//         next('/dashboard');
//     } else {
//         // Allow access to the route
//         next();
//     }
// });

// function getToken() {
//     return sessionStorage.getItem('token');
// }
export default router