import Vue from 'vue'
// 按需引入elementUI 组件
import {
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Autocomplete,
  Input,
  Select,
  Option,
  Dialog,
  Tooltip,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  Table,
  TableColumn,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  DatePicker,
  InputNumber,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  MessageBox,
  Message,
  Loading,
  Upload,
  Tag,
  pagination,
  Tabs,
  TabPane,
  TimePicker,
  TimeSelect,
  Notification,
  Switch,
  Tree,
  Progress,
  Carousel,
  CarouselItem
} from 'element-ui'



let variable = {
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Autocomplete,
  Input,
  Select,
  Option,
  Dialog,
  Tooltip,
  Popover,
  Dropdown,
  DropdownMenu,
  DropdownItem,Row,
  Col,
  Table,
  TableColumn,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  DatePicker,
  InputNumber,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Tag,
  Upload,
  Loading,
  pagination,
  Tabs,
  TabPane,
  TimePicker,
  TimeSelect,
  Switch,
  Tree,
  Progress,
  Carousel,
  CarouselItem
}
for (let item in variable) {
  if (variable.hasOwnProperty(item)) {
    Vue.use(variable[item])
    //Vue.component(variable[item].name,variable[item])
  }
}

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

export default Vue
