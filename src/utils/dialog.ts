// import { VDialog } from "vuetify/components";
import Dialog from "@/components/common/Dialog.vue";
import { registerPlugins } from "@/plugins";

export function renderDialog(componet, props, modalProps) {
  const open = ref(true);
  const instance = ref();
  console.log(instance);
  const dialog = () =>
    h(
      Dialog,
      {
        ...modalProps,
        modelValue: open.value,
        onCancel() {
          console.log("onCancel");
          unmount();
        },
        onConfirm() {
          console.log("onConfirm");
          instance.value?.submit();
        },
      },
      { default: () => h(componet, { ref: instance, props }) }
    );
  const app = createApp(dialog);
  registerPlugins(app);
  const div = document.createElement("div");
  document.body.appendChild(div);
  app.mount(div);

  const unmount = () => {
    open.value = false;
    setTimeout(() => {
      app.unmount();
      document.body.removeChild(div);
    }, 1000);
  };
  return {
    unmount,
    instance
  };
}
