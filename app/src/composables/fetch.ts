import { ref } from 'vue';

export const useFetch = (fetcher: () => Promise<any>) => {
  const data = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const getData = async () => {
    isLoading.value = true;
    data.value = null;
    error.value = null;
    try {
      data.value = await fetcher();
    } catch (err) {
      error.value = err;
    }
    isLoading.value = false;
  };

  return {
    data, isLoading, error, getData,
  };
};

export default {
  useFetch,
};
