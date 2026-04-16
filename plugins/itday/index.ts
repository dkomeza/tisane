import { definePlugin } from "tisane";
import { Agenda } from "./components/agenda";
import { Prelegenci } from "./components/prelegenci";

const itdayPlugin = definePlugin({
  id: "itday",
  displayName: "IT Future Day AGH",
  version: "1.0.0",
  components: [Agenda, Prelegenci],
  categories: [
    {
      id: "itday-sections",
      label: "ITDay Sections",
      isRootLevel: true,
      componentIds: [Agenda.id, Prelegenci.id],
    },
  ],
  type: "component",
});

export default itdayPlugin;
