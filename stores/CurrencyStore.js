import { defineStore } from "pinia";
import useApiCore from "~/composables/useApiCore";

export const useCurrencyStore = defineStore("currency-store", {
  state: () => ({
    currencies: [],
    currentCurrency: null,
    currentCode: process.client
      ? localStorage.getItem("currencyCode") ??
        useRuntimeConfig().public.NUXT_DEFAULT_CURRENCE_CODE ??
        "USD"
      : useRuntimeConfig().public.NUXT_DEFAULT_CURRENCE_CODE,
    errors: [],
    error: [],
  }),
  actions: {
    async loadCurrencies() {
      await useApiCore("v1/currency/list")
        .then((response) => {
          let patch = {
            currencies: [...response.data.value.data],
          };

          const currentCurrency = patch.currencies.find((currency) => {
            return currency.code === this.currentCode;
          });

          if (currentCurrency) {
            const symbol = currentCurrency.symbol;
            patch.currentCurrency = { ...currentCurrency, symbol };
          }

          this.$patch(patch);
        })
        .catch((error) => {
          console.log(error);
          this.errors = error.response.data.errors;
        });
    },
    setCurrency(currency, redirect = true) {
      if (process.client) localStorage.setItem("currencyCode", currency.code);

      if (redirect) this.router.push({ params: { currency: currency.code } });

      if (this.currentCurrency.code !== currency.code) {
        const symbol = currency.symbol;
        this.currentCurrency = { ...currency, symbol };
      }
    },
  },
});
