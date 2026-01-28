import { createRouter, createWebHistory } from 'vue-router';
import HomeView from "@/views/HomeView.vue";
import RecipeDetail from "@/views/recipes/RecipeDetail.vue";
import CategorySelect from "@/views/CategorySelect.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import DiseaseDetail from "@/views/DiseaseDetail.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/auth/login',
            name: 'login',
            component: Login
        },
        {
            path: '/auth/signup',
            name: 'signup',
            component: Signup
        },
        {
            path: '/recipes/:recipeId',
            name: 'recipes',
            component: RecipeDetail
        },
        {
            path: '/diseases',
            name: 'CategorySelect',
            component: CategorySelect
        },
        {
            path: '/diseases/:diseaseId',
            name: 'DiseaseDetail',
            component: DiseaseDetail
        }

    ]
});

export default router;