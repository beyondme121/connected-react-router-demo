import { createNamespacedHelpers } from 'vuex'
let { mapState } = createNamespacedHelpers('user')
export default {
  data() {
    return { menuTree: [] }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created() {
    let authList = this.userInfo.authList
    let mapping = {}
    authList.forEach(item => {
      item.children = []
      mapping[item.id] = item
      if (item.pid == -1) {
        this.menuTree.push(item)
      } else {
        mapping[item.pid] && mapping[item.pid].children.push(item)
      }
    })
  },
  render() {
    const renderChildren = tree => {
      return tree.map(item => {
        return item.children.length ? <el-submenu index={item._id}>
          <div slot="title">{item.name}</div>
          {renderChildren(item.children)}
        </el-submenu> :
          <el-menu-item index={item.path}>{item.name}</el-menu-item>
      })
    }

    return <el-menu background-color="#2a2a2a" text-color="#fff" active-text-color="#fff" router={true}>
      {renderChildren(this.menuTree)}
    </el-menu>
  }
}