import Vue from 'vue'
import { V1Api, V1ApiFactory } from '../js/api/client'

declare module 'vue/types/vue' {
  interface Vue {
    $serverApi: V1Api,
    $serverApiFp: ReturnType<typeof V1ApiFactory>,
  }
}
