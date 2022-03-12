import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PageCommunication from '../views/PageCommunication.vue';
import SidebarCommunicationEventsTab from '../components/SidebarCommunicationEventsTab.vue';
import SidebarCommunicationPropsTab from '../components/SidebarCommunicationPropsTab.vue';
import SidebarCommunicationSlotsTab from '../components/SidebarCommunicationSlotsTab.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'PageCommunication',
    component: PageCommunication,
    children: [
      { path: '', component: SidebarCommunicationPropsTab },
      { path: 'events', component: SidebarCommunicationEventsTab },
      { path: 'slots', component: SidebarCommunicationSlotsTab },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
