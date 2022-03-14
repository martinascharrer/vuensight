import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PageCommunication from '../views/PageCommunication.vue';
import SidebarCommunicationEventsTab from '../components/SidebarCommunicationEventsTab.vue';
import SidebarCommunicationPropsTab from '../components/SidebarCommunicationPropsTab.vue';
import SidebarCommunicationSlotsTab from '../components/SidebarCommunicationSlotsTab.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'page-communication',
    component: PageCommunication,
    children: [
      { path: '', name: 'page-communication-props', component: SidebarCommunicationPropsTab },
      { path: 'events', name: 'page-communication-events', component: SidebarCommunicationEventsTab },
      { path: 'slots', name: 'page-communication-slots', component: SidebarCommunicationSlotsTab },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
