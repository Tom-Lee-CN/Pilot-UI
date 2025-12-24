import PtDropdown from './dropdown.vue';
import PtDropdownItem from './dropdown-item.vue';

PtDropdown.install = (app) => {
  app.component(PtDropdown.name, PtDropdown);
};

PtDropdownItem.install = (app) => {
  app.component(PtDropdownItem.name, PtDropdownItem);
};

export { PtDropdown, PtDropdownItem };
