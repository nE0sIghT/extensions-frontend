<template>
    <b-row class='extensions-card'>
      <b-col>
        <b-card>
          <div class='d-flex align-items-center card-title '>
            <div class='flex-grow-1'>
              <h5 class='mb-0'>{{ title }}</h5>
            </div>
            <div class='small'>
              <b-link :to="to">{{ $t('Show more') }}</b-link>
            </div>
          </div>
          <b-row class='extensions-row'>
            <b-col
              md="6"
              lg="3"
              v-for="extension in extensions"
              :key="extension.id">
                <b-card no-body class='p-2 justify-content-between'>
                  <div class='d-flex h-100'>
                    <b-card-img
                      :src="extension.icon || '/images/plugin.png'"
                      class='mr-auto'
                      left
                      width='32px'
                      height='32px'></b-card-img>

                    <b-card-body class='flex-grow-1 pt-0'>
                      <h6>{{ extension.name }}</h6>
                    </b-card-body>
                  </div>
                  <div class='d-flex flex-grow-0 text-center'>
                      <slot :extension='extension'></slot>
                  </div>
                </b-card>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
</template>

<script>
export default {
    props: {
        title: String,
        to: String,
        extensions: Array,
    }
};
</script>

<style scoped>
    .extensions-row .card {
        height: 100%;
    }
</style>