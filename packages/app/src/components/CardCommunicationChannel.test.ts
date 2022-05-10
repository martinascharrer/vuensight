// eslint-disable-next-line import/no-extraneous-dependencies
import { mount, MountingOptions } from '@vue/test-utils';
import CardCommunicationChannel from '@/components/CardCommunicationChannel.vue';

describe('CardCommunicationChannel.vue', () => {
  it('renders the card with correct name and counter', () => {
    const wrapper = mount(CardCommunicationChannel, {
      props: {
        channel: {
          name: 'foo prop',
        },
        dependents: [
          {
            name: 'Bar',
            fullPath: 'foo/bar.vue',
          },
          {
            name: 'Test',
            fullPath: 'foo/test.vue',
          },
        ],
      },
    } as MountingOptions<any>); // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(wrapper.find('[data-qa="name"]').text()).toBe('foo prop');
    expect(wrapper.find('[data-qa="counter"]').text()).toBe('2');
  });
});
