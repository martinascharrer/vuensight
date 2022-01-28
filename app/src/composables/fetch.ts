import { ref, readonly } from 'vue';

export const useFetch = (fetcher: () => Promise<any>) => {
  const data = ref(null);
  const isLoading = ref(false);
  const isError = ref(false);

  const get = async () => {
    isLoading.value = true;
    data.value = null;
    isError.value = false;
    try {
      data.value = await fetcher();
    } catch (e) {
      isError.value = true;
      console.error(e);
    }
    isLoading.value = false;
  };

  return {
    data: readonly(data),
    isLoading: readonly(isLoading),
    isError: readonly(isError),
    get,
  };
};

export default {
  useFetch,
};
