// Login.vue
<script setup>
import { onMounted } from 'vue'
import { StytchUIClient, Products } from '@stytch/vanilla-js'
require('dotenv').config();

const publicToken = process.env.STYTCH_PUBLIC_TOKEN
const stytch = new StytchUIClient(publicToken)

const config = {
  products: [Products.emailMagicLinks, Products.oauth],
  oauthOptions: {
    providers: [{ type: 'google' }],
  }
}


onMounted(() => {
  stytch.mountLogin({
    elementId: '#stytch-sdk',
    styles,
    config,
  })
})

</script>
<template>
  <div class="container">
    <div id="stytch-sdk"></div>
  </div>
</template>