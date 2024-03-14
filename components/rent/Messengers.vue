<script setup>
const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
const localeRoute = useLocalePath();
const frontURL = runtimeConfig + localeRoute();

const props = defineProps({
  whatsapp: String,
  telegram: String,
  lang: String,
});
const mobile = () => {
  const cleaned = ("" + props.whatsapp).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/);
  return match[1] + " " + match[2] + "-" + match[3] + "-" + match[4];
};
</script>

<template>
  <div class="text-sm flex justify-center items-center">
    {{ $t("rent.dress_booking_question_to_manager") }}:
    <NuxtLink
      v-if="props.whatsapp"
      :to="`https://wa.me/${props.whatsapp}/?text=${frontURL}%0A${$t(
        'rent.dress_booking_i_have_question'
      )}`"
      target="_blank"
      class="hover"
    >
      <NuxtImg width="20" class="ml-2" src="/icons8-whatsapp.svg" />
    </NuxtLink>

    <NuxtLink
      v-if="props.telegram"
      :to="`https://t.me/${props.telegram}`"
      target="_blank"
      class="hover"
    >
      <NuxtImg width="22" class="ml-2" src="/icons8-telegram.svg" />
    </NuxtLink>
    <NuxtLink :to="`tel:+${props.whatsapp}`" class="hover ml-2"
      >+{{ mobile() }}</NuxtLink
    >
  </div>
</template>
