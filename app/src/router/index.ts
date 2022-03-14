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
      {
        path: '',
        name: 'Props',
        component: SidebarCommunicationPropsTab,
      },
      {
        path: 'events',
        name: 'Events',
        component: SidebarCommunicationEventsTab,
      },
      {
        path: 'slots',
        name: 'Slots',
        component: SidebarCommunicationSlotsTab,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
