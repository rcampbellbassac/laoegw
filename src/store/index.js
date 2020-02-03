/* eslint no-param-reassign: ["error", { "props": false }] */
import Vue from 'vue';
import Vuex from 'vuex';
import localforage from 'localforage';

localforage.config({
  name: 'LaoEGW',
});

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: {},
    errors: [],
    loading: true,
    installing: false,
  },
  mutations: {
    LOAD: (state, initdata) => {
      state.data = initdata;
    },
    ERROR: (state, error) => {
      state.errors.push(error);
    },
    INSTALLED: (state) => {
      state.installing = false;
      state.loading = false;
    },
  },
  actions: {
    async initdata({ commit }) {
      localforage.getItem('LaoEGW').then((localstoragedata) => {
        if (localstoragedata != null) {
          const load = async () => ('done');
          load()
            .then(commit('LOAD', localstoragedata))
            .then(commit('INSTALLED'));
        } else {
          this.state.installing = true;
          // Content URLs
          // https://s3-us-west-2.amazonaws.com/laoadventist-media/LaoBible.json - LB
          // https://s3-us-west-2.amazonaws.com/laoadventist-media/LaoBibleStudies.json - LBS
          // https://s3-us-west-2.amazonaws.com/laoadventist-media/LaoEGW.json - EGW
          // https://s3-us-west-2.amazonaws.com/laoadventist-media/LaoHealthBooks.json - HB
          // https://s3-us-west-2.amazonaws.com/laoadventist-media/LaoSongs.json - LS
          fetch('https://laoadventist-media.s3-us-west-2.amazonaws.com/LaoEGW.json')
            .then((response) => (response.json()))
            .then(async (responseJSON) => {
              await localforage.setItem('LaoEGW', responseJSON)
                .then(commit('LOAD', responseJSON))
                .then(commit('INSTALLED'));
            })
            .catch((e) => (commit('ERROR', { title: 'Failed to load inital data.', error: e })));
        }
      });
    },
  },
});
