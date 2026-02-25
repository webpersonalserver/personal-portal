import { ref } from "vue";

const portalLoading = ref(true);
const userInfo = ref({});

function setLoading(loading = false) {
    portalLoading.value = loading;
}

function setUserInfo(info = {}) {
    userInfo.value = info;
}

export {
    portalLoading,
    userInfo,
    setLoading,
    setUserInfo
};
